import { NextResponse } from 'next/server';

const requiredEnvVars = [
  'GOOGLE_FORM_ACTION_URL',
  'GOOGLE_FORM_ENTRY_NAME',
  'GOOGLE_FORM_ENTRY_PHONE',
  'GOOGLE_FORM_ENTRY_PREFERRED_TIME',
  'GOOGLE_FORM_ENTRY_MESSAGE',
  'GOOGLE_FORM_ENTRY_OFFER_NAME',
  'GOOGLE_FORM_ENTRY_PRICE',
  'GOOGLE_FORM_ENTRY_DURATION',
  'GOOGLE_FORM_ENTRY_SOURCE_PAGE_URL',
  'GOOGLE_FORM_ENTRY_SOURCE_ARTICLE_SLUG',
  'GOOGLE_FORM_ENTRY_SOURCE_LABEL',
] as const;

const optionalEnvVars = ['GOOGLE_FORM_ENTRY_SUBMITTED_AT', 'GOOGLE_FORM_ENTRY_DISCOUNT_PERCENT'] as const;

type RequiredEnvVarName = (typeof requiredEnvVars)[number];
type OptionalEnvVarName = (typeof optionalEnvVars)[number];
type GoogleFormConfig = Record<RequiredEnvVarName, string> & Partial<Record<OptionalEnvVarName, string>>;

type OrderPayload = {
  name?: unknown;
  message?: unknown;
  offerName?: unknown;
  price?: unknown;
  duration?: unknown;
  sourcePageUrl?: unknown;
  sourceArticleSlug?: unknown;
  sourceLabel?: unknown;
  phone?: unknown;
  preferredTime?: unknown;
  discountPercent?: unknown;
};

type ValidatedOrder = {
  name: string;
  phone: string;
  preferredTime: string;
  message: string;
  offerName: string;
  price: string;
  duration: string;
  sourcePageUrl: string;
  sourceArticleSlug: string;
  sourceLabel: string;
  discountPercent: number;
};

function asString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeDiscountPercent(value: unknown) {
  const numericValue = typeof value === 'number' ? value : Number(asString(value));

  if (!Number.isFinite(numericValue) || numericValue < 0 || numericValue > 20) {
    return 0;
  }

  return Math.floor(numericValue);
}

function getGoogleFormConfig() {
  const config = {} as GoogleFormConfig;
  const missing = requiredEnvVars.filter((name) => {
    const value = process.env[name];
    if (value) config[name] = value;
    return !value;
  });

  for (const name of optionalEnvVars) {
    const value = process.env[name];
    if (value) config[name] = value;
  }

  if (missing.length > 0) {
    console.error('Excursion order backend is missing Google Form environment variables:', missing.join(', '));
    return null;
  }

  return config;
}

function validatePayload(payload: OrderPayload): { data: ValidatedOrder } | { error: string } {
  const name = asString(payload.name);
  const phone = asString(payload.phone);
  const preferredTime = asString(payload.preferredTime);
  const message = asString(payload.message);

  if (!name || !phone || !preferredTime || !message) {
    return { error: 'Please complete all required fields.' };
  }

  if (message.length > 2000) {
    return { error: 'Message must be 2000 characters or fewer.' };
  }

  return {
    data: {
      name,
      phone,
      preferredTime,
      message,
      offerName: asString(payload.offerName),
      price: asString(payload.price),
      duration: asString(payload.duration),
      sourcePageUrl: asString(payload.sourcePageUrl),
      sourceArticleSlug: asString(payload.sourceArticleSlug),
      sourceLabel: asString(payload.sourceLabel),
      discountPercent: normalizeDiscountPercent(payload.discountPercent),
    },
  };
}

function buildGoogleFormData(config: GoogleFormConfig, validated: ValidatedOrder, submittedAt: string) {
  const formData = new URLSearchParams();

  formData.set(config.GOOGLE_FORM_ENTRY_NAME, validated.name);
  formData.set(config.GOOGLE_FORM_ENTRY_PHONE, validated.phone);
  formData.set(config.GOOGLE_FORM_ENTRY_PREFERRED_TIME, validated.preferredTime);
  formData.set(config.GOOGLE_FORM_ENTRY_MESSAGE, validated.message);
  formData.set(config.GOOGLE_FORM_ENTRY_OFFER_NAME, validated.offerName);
  formData.set(config.GOOGLE_FORM_ENTRY_PRICE, validated.price);
  formData.set(config.GOOGLE_FORM_ENTRY_DURATION, validated.duration);
  formData.set(config.GOOGLE_FORM_ENTRY_SOURCE_PAGE_URL, validated.sourcePageUrl);
  formData.set(config.GOOGLE_FORM_ENTRY_SOURCE_ARTICLE_SLUG, validated.sourceArticleSlug);
  formData.set(config.GOOGLE_FORM_ENTRY_SOURCE_LABEL, validated.sourceLabel);

  if (config.GOOGLE_FORM_ENTRY_DISCOUNT_PERCENT) {
    formData.set(config.GOOGLE_FORM_ENTRY_DISCOUNT_PERCENT, String(validated.discountPercent));
  }

  if (config.GOOGLE_FORM_ENTRY_SUBMITTED_AT) {
    formData.set(config.GOOGLE_FORM_ENTRY_SUBMITTED_AT, submittedAt);
  }

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
