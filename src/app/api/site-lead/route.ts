import { NextResponse } from 'next/server';

const requiredEnvVars = [
  'GOOGLE_FORM_ACTION_URL',
  'GOOGLE_FORM_ENTRY_NAME',
  'GOOGLE_FORM_ENTRY_EMAIL',
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

const optionalEnvVars = [
  'GOOGLE_FORM_ENTRY_SUBMISSION_TYPE',
  'GOOGLE_FORM_ENTRY_SUBMITTED_AT',
  'GOOGLE_FORM_ENTRY_DISCOUNT_PERCENT',
] as const;

type RequiredEnvVarName = (typeof requiredEnvVars)[number];
type OptionalEnvVarName = (typeof optionalEnvVars)[number];
type GoogleFormConfig = Record<RequiredEnvVarName, string> & Partial<Record<OptionalEnvVarName, string>>;
type SiteLeadType = 'contact' | 'subscribe';

type SiteLeadPayload = {
  type?: unknown;
  name?: unknown;
  email?: unknown;
  message?: unknown;
  sourcePageUrl?: unknown;
};

type ValidatedSiteLead = {
  type: SiteLeadType;
  name: string;
  email: string;
  message: string;
  offerName: string;
  sourcePageUrl: string;
  sourceArticleSlug: string;
  sourceLabel: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function asString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
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
    console.error('Site lead backend is missing Google Form environment variables:', missing.join(', '));
    return null;
  }

  return config;
}

function validatePayload(payload: SiteLeadPayload): { data: ValidatedSiteLead } | { error: string } {
  const type = asString(payload.type);
  const name = asString(payload.name);
  const email = asString(payload.email).toLowerCase();
  const message = asString(payload.message);
  const sourcePageUrl = asString(payload.sourcePageUrl);

  if (type !== 'contact' && type !== 'subscribe') {
    return { error: 'Submission type must be contact or subscribe.' };
  }

  if (!email) {
    return { error: 'Email is required.' };
  }

  if (!emailPattern.test(email)) {
    return { error: 'Please enter a valid email address.' };
  }

  if (type === 'contact' && (!name || !message)) {
    return { error: 'Please complete all required fields.' };
  }

  if (message.length > 2000) {
    return { error: 'Message must be 2000 characters or fewer.' };
  }

  if (type === 'subscribe') {
    return {
      data: {
        type,
        name: 'Newsletter subscriber',
        email,
        message: 'Newsletter subscription request',
        offerName: 'Newsletter subscription',
        sourcePageUrl,
        sourceArticleSlug: 'subscribe',
        sourceLabel: 'Subscribe form',
      },
    };
  }

  return {
    data: {
      type,
      name,
      email,
      message,
      offerName: 'Contact message',
      sourcePageUrl,
      sourceArticleSlug: 'contact',
      sourceLabel: 'Contact page',
    },
  };
}

function buildGoogleFormData(config: GoogleFormConfig, validated: ValidatedSiteLead, submittedAt: string) {
  const formData = new URLSearchParams();

  if (config.GOOGLE_FORM_ENTRY_SUBMISSION_TYPE) {
    formData.set(config.GOOGLE_FORM_ENTRY_SUBMISSION_TYPE, validated.type);
  }

  formData.set(config.GOOGLE_FORM_ENTRY_NAME, validated.name);
  formData.set(config.GOOGLE_FORM_ENTRY_EMAIL, validated.email);
  formData.set(config.GOOGLE_FORM_ENTRY_PHONE, 'not provided');
  formData.set(config.GOOGLE_FORM_ENTRY_PREFERRED_TIME, 'not applicable');
  formData.set(config.GOOGLE_FORM_ENTRY_MESSAGE, validated.message);
  formData.set(config.GOOGLE_FORM_ENTRY_OFFER_NAME, validated.offerName);
  formData.set(config.GOOGLE_FORM_ENTRY_PRICE, '');
  formData.set(config.GOOGLE_FORM_ENTRY_DURATION, '');
  formData.set(config.GOOGLE_FORM_ENTRY_SOURCE_PAGE_URL, validated.sourcePageUrl);
  formData.set(config.GOOGLE_FORM_ENTRY_SOURCE_ARTICLE_SLUG, validated.sourceArticleSlug);
  formData.set(config.GOOGLE_FORM_ENTRY_SOURCE_LABEL, validated.sourceLabel);

  if (config.GOOGLE_FORM_ENTRY_DISCOUNT_PERCENT) {
    formData.set(config.GOOGLE_FORM_ENTRY_DISCOUNT_PERCENT, '');
  }

  if (config.GOOGLE_FORM_ENTRY_SUBMITTED_AT) {
    formData.set(config.GOOGLE_FORM_ENTRY_SUBMITTED_AT, submittedAt);
  }

  return formData;
}

export async function POST(request: Request) {
  const config = getGoogleFormConfig();
  if (!config) {
    return NextResponse.json({ ok: false, error: 'Lead request backend is not configured.' }, { status: 500 });
  }

  let payload: SiteLeadPayload;

  try {
    payload = (await request.json()) as SiteLeadPayload;
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
      console.error('Google Form submission failed for site lead:', response.status, response.statusText);
      return NextResponse.json({ ok: false, error: 'Unable to submit request.' }, { status: 502 });
    }
  } catch (error) {
    console.error('Google Form submission threw for site lead:', error);
    return NextResponse.json({ ok: false, error: 'Unable to submit request.' }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
