import { NextResponse } from "next/server";

export const runtime = "nodejs";

type InquiryBody = {
  site_id?: string;
  name?: string;
  email?: string;
  country?: string;
  quantity?: string;
  message?: string;
  website?: string;
  product_context?: { id?: string; name?: string } | null;
};

/**
 * Inquiry backend (no extra npm deps — uses fetch).
 *
 * Priority:
 * 1. Resend email  — set RESEND_API_KEY + INQUIRY_TO_EMAIL (+ optional INQUIRY_FROM_EMAIL)
 * 2. Webhook       — set INQUIRY_WEBHOOK_URL (Make / 企微中转 / Zapier …)
 * 3. Dev fallback  — log to server console
 *
 * You can enable both Resend and webhook at once.
 */
export async function POST(req: Request) {
  let body: InquiryBody;
  try {
    body = (await req.json()) as InquiryBody;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  if (body.website) {
    return NextResponse.json({ ok: true });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const message = String(body.message ?? "").trim();
  const country = String(body.country ?? "").trim() || null;
  const quantity = String(body.quantity ?? "").trim() || null;

  if (!name || !email || !message) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }

  const payload = {
    site_id: body.site_id ?? "nextjs-export-starter",
    name,
    email,
    country,
    quantity,
    message,
    product_context: body.product_context ?? null,
    received_at: new Date().toISOString(),
  };

  const resendKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.INQUIRY_TO_EMAIL;
  const fromEmail =
    process.env.INQUIRY_FROM_EMAIL || "Inquiry Form <onboarding@resend.dev>";
  const webhook = process.env.INQUIRY_WEBHOOK_URL;

  let delivered = false;
  const errors: string[] = [];

  if (resendKey && toEmail) {
    const productLine = payload.product_context?.name
      ? `\nProduct: ${payload.product_context.name}${
          payload.product_context.id ? ` (${payload.product_context.id})` : ""
        }`
      : "";
    const text = [
      `New inquiry on ${payload.site_id}`,
      `Time: ${payload.received_at}`,
      ``,
      `Name: ${name}`,
      `Email: ${email}`,
      `Country: ${country ?? "—"}`,
      `Quantity: ${quantity ?? "—"}`,
      productLine,
      ``,
      `Message:`,
      message,
    ]
      .filter((line) => line !== undefined)
      .join("\n");

    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [toEmail],
          reply_to: email,
          subject: `[Inquiry] ${name}${country ? ` · ${country}` : ""}`,
          text,
        }),
      });
      if (!res.ok) {
        const detail = await res.text();
        console.error("[inquiries] resend failed", res.status, detail);
        errors.push("resend_failed");
      } else {
        delivered = true;
      }
    } catch (err) {
      console.error("[inquiries] resend error", err);
      errors.push("resend_error");
    }
  }

  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        console.error("[inquiries] webhook failed", res.status, await res.text());
        errors.push("webhook_failed");
      } else {
        delivered = true;
      }
    } catch (err) {
      console.error("[inquiries] webhook error", err);
      errors.push("webhook_error");
    }
  }

  if (!resendKey && !webhook) {
    console.log("[inquiries] received (no RESEND_API_KEY / INQUIRY_WEBHOOK_URL)", JSON.stringify(payload, null, 2));
    delivered = true;
  }

  if (!delivered) {
    return NextResponse.json(
      { ok: false, error: errors[0] ?? "delivery_failed" },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
