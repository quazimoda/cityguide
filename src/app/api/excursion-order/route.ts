import { NextResponse } from 'next/server';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const requiredEnvVars = [
  'GOOGLE_FORM_ACTION_URL',
  'GOOGLE_FORM_ENTRY_NAME',
  'GOOGLE_FORM_ENTRY_EMAIL',
  'GOOGLE_FORM_ENTRY_PHONE',
  'GOOGLE_FORM_ENTRY_PREFERRED_DATE',
  'GOOGLE_FORM_ENTRY_PREFERRED_TIME',
  'GOOGLE_FORM_ENTRY_PEOPLE',
  'GOOGLE_FORM_ENTRY_MESSAGE',
  'GOOGLE_FORM_ENTRY_OFFER_NAME',
  'GOOGLE_FORM_ENTRY_PRICE',
  'GOOGLE_FORM_ENTRY_DURATION',
  'GOOGLE_FORM_ENTRY_SOURCE_PAGE_URL',
  'GOOGLE_FORM_ENTRY_SOURCE_ARTICLE_SLUG',
  'GOOGLE_FORM_ENTRY_SOURCE_LABEL',
  'GOOGLE_FORM_ENTRY_SUBMITTED_AT',
] as const;

type EnvVarName = (typeof requiredEnvVars)[number];

type OrderPayload = {
  name?: unknown;
  email?: unknown;
  preferredDate?: unknown;
  people?: unknown;
  message?: unknown;
  offerName?: unknown;
  price?: unknown;
  duration?: unknown;
  sourcePageUrl?: unknown;
  sourceArticleSlug?: unknown;
  sourceLabel?: unknown;
  phone?: unknown;
  preferredTime?: unknown;
  socialHandle?: unknown;
};

type ValidatedOrder = {
  name: string;
  email: string;
  preferredDate: string;
  people: number;
  message: string;
  offerName: string;
  price: string;
  duration: string;
  sourcePageUrl: string;
  sourceArticleSlug: string;
  sourceLabel: string;
  phone: string;
  preferredTime: string;
};

function asString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function getGoogleFormConfig() {
  const config = {} as Record<EnvVarName, string>;
  const missing = requiredEnvVars.filter((name) => {
    const value = process.env[name];
    if (value) config[name] = value;
    return !value;
  });

  if (missing.length > 0) {
    console.error('Excursion order backend is missing Google Form environment variables:', missing.join(', '));
    return null;
  }

  return config;
}

function validatePayload(payload: OrderPayload): { data: ValidatedOrder } | { error: string } {
  const name = asString(payload.name);
  const email = asString(payload.email);
  const preferredDate = asString(payload.preferredDate);
  const people = Number(payload.people);
  const message = asString(payload.message);
  const offerName = asString(payload.offerName);
  const price = asString(payload.price);
  const duration = asString(payload.duration);
  const sourcePageUrl = asString(payload.sourcePageUrl);

  if (!name || !email || !preferredDate || !message || !offerName || !price || !duration || !sourcePageUrl) {
    return { error: 'Please complete all required fields.' };
  }

  if (!emailPattern.test(email)) {
    return { error: 'Enter a valid email address.' };
  }

  if (!Number.isFinite(people) || people < 1) {
    return { error: 'Enter at least 1 person.' };
  }

  if (message.length > 2000) {
    return { error: 'Message must be 2000 characters or fewer.' };
  }

  return {
    data: {
      name,
      email,
      preferredDate,
      people,
      message,
      offerName,
      price,
      duration,
      sourcePageUrl,
      sourceArticleSlug: asString(payload.sourceArticleSlug),
      sourceLabel: asString(payload.sourceLabel),
      phone: asString(payload.phone),
      preferredTime: asString(payload.preferredTime),
    },
  };
}

function buildGoogleFormData(config: Record<EnvVarName, string>, validated: ValidatedOrder, submittedAt: string) {
  const formData = new URLSearchParams();

  formData.set(config.GOOGLE_FORM_ENTRY_NAME, validated.name);
  formData.set(config.GOOGLE_FORM_ENTRY_EMAIL, validated.email);
  formData.set(config.GOOGLE_FORM_ENTRY_PHONE, validated.phone);
  formData.set(config.GOOGLE_FORM_ENTRY_PREFERRED_DATE, validated.preferredDate);
  formData.set(config.GOOGLE_FORM_ENTRY_PREFERRED_TIME, validated.preferredTime);
  formData.set(config.GOOGLE_FORM_ENTRY_PEOPLE, String(validated.people));
  formData.set(config.GOOGLE_FORM_ENTRY_MESSAGE, validated.message);
  formData.set(config.GOOGLE_FORM_ENTRY_OFFER_NAME, validated.offerName);
  formData.set(config.GOOGLE_FORM_ENTRY_PRICE, validated.price);
  formData.set(config.GOOGLE_FORM_ENTRY_DURATION, validated.duration);
  formData.set(config.GOOGLE_FORM_ENTRY_SOURCE_PAGE_URL, validated.sourcePageUrl);
  formData.set(config.GOOGLE_FORM_ENTRY_SOURCE_ARTICLE_SLUG, validated.sourceArticleSlug);
  formData.set(config.GOOGLE_FORM_ENTRY_SOURCE_LABEL, validated.sourceLabel);
  formData.set(config.GOOGLE_FORM_ENTRY_SUBMITTED_AT, submittedAt);

  return formData;
}

export async function POST(request: Request) {
  const config = getGoogleFormConfig();
  if (!config) {
    return NextResponse.json({ ok: false, error: 'Order request backend is not configured.' }, { status: 500 });
  }

  let payload: OrderPayload;

  try {
    payload = (await request.json()) as OrderPayload;
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON payload.' }, { status: 400 });
  }

  const validated = validatePayload(payload);
  if ('error' in validated) {
    return NextResponse.json({ ok: false, error: validated.error }, { status: 400 });
  }

  const submittedAt = new Date().toISOString();
  const formData = buildGoogleFormData(config, validated.data, submittedAt);

  try {
    const response = await fetch(config.GOOGLE_FORM_ACTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    if (response.status < 200 || response.status >= 400) {
      console.error('Google Form submission failed for excursion order:', response.status, response.statusText);
      return NextResponse.json({ ok: false, error: 'Unable to submit order request.' }, { status: 502 });
    }
  } catch (error) {
    console.error('Google Form submission threw for excursion order:', error);
    return NextResponse.json({ ok: false, error: 'Unable to submit order request.' }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
