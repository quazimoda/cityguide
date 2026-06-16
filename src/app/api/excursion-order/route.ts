import { NextResponse } from 'next/server';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

function asString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

export async function POST(request: Request) {
  let payload: OrderPayload;

  try {
    payload = (await request.json()) as OrderPayload;
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON payload.' }, { status: 400 });
  }

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
    return NextResponse.json({ success: false, error: 'Please complete all required fields.' }, { status: 400 });
  }

  if (!emailPattern.test(email)) {
    return NextResponse.json({ success: false, error: 'Enter a valid email address.' }, { status: 400 });
  }

  if (!Number.isFinite(people) || people < 1) {
    return NextResponse.json({ success: false, error: 'Enter at least 1 person.' }, { status: 400 });
  }

  if (message.length > 2000) {
    return NextResponse.json({ success: false, error: 'Message must be 2000 characters or fewer.' }, { status: 400 });
  }

  // TODO: Connect this accepted request to the project's future email/CRM workflow.
  // This endpoint intentionally does not add payment, persistence, analytics, or provider secrets.
  return NextResponse.json({
    success: true,
    submittedAt: new Date().toISOString(),
    request: {
      offerName,
      price,
      duration,
      sourcePageUrl,
      sourceArticleSlug: asString(payload.sourceArticleSlug),
      sourceLabel: asString(payload.sourceLabel),
    },
  });
}
