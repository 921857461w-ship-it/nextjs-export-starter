"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { buttonClass } from "@/components/ui/Button";
import type { InquiryFormProps } from "./inquiry-form-schema";

export type { InquiryFormProps };

type Status = "idle" | "sending" | "ok" | "error";

const ENDPOINT = process.env.NEXT_PUBLIC_INQUIRY_ENDPOINT ?? "/api/inquiries";
const SITE_ID = process.env.NEXT_PUBLIC_SITE_ID ?? "nextjs-export-starter";

const FIELD =
  "w-full rounded-sm border border-line bg-bg px-3.5 py-2.5 text-ink placeholder:text-muted/70 focus:border-primary";

/** Only client component in the starter — keep the rest RSC for JS budget. */
export function InquiryForm({ heading, lead, productContext }: InquiryFormProps) {
  const t = useTranslations("form");
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus("sending");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          site_id: SITE_ID,
          ...data,
          product_context: productContext ?? null,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("ok");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <section data-section="inquiry_form" id="inquiry" className="section-pad bg-surface">
      <div className="container-site grid grid-cols-1 gap-x-16 lg:grid-cols-[minmax(16rem,1fr)_2fr]">
        <SectionHeading
          title={heading ?? t("defaultHeading")}
          lead={lead ?? t("defaultLead")}
        />

        <form onSubmit={onSubmit} noValidate={false}>
          {productContext && (
            <p className="mb-6 inline-flex items-baseline gap-2 border border-line bg-bg px-3 py-2 text-sm">
              <span className="type-label text-muted">{t("regarding")}</span>
              <span className="font-semibold text-ink">{productContext.name}</span>
            </p>
          )}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="inq-name" className="type-label mb-1.5 block text-muted">
                {t("name")} *
              </label>
              <input id="inq-name" name="name" required autoComplete="name" className={FIELD} />
            </div>
            <div>
              <label htmlFor="inq-email" className="type-label mb-1.5 block text-muted">
                {t("email")} *
              </label>
              <input
                id="inq-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className={FIELD}
              />
            </div>
            <div>
              <label htmlFor="inq-country" className="type-label mb-1.5 block text-muted">
                {t("country")}
              </label>
              <input id="inq-country" name="country" autoComplete="country-name" className={FIELD} />
            </div>
            <div>
              <label htmlFor="inq-quantity" className="type-label mb-1.5 block text-muted">
                {t("quantity")}
              </label>
              <input
                id="inq-quantity"
                name="quantity"
                placeholder={t("quantityHint")}
                className={FIELD}
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="inq-message" className="type-label mb-1.5 block text-muted">
                {t("message")} *
              </label>
              <textarea id="inq-message" name="message" required rows={5} className={FIELD} />
            </div>
          </div>

          <div aria-hidden="true" className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
            <label>
              website
              <input name="website" type="text" tabIndex={-1} autoComplete="off" />
            </label>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-5">
            <button
              type="submit"
              disabled={status === "sending"}
              className={`${buttonClass("primary")} disabled:opacity-60`}
            >
              {status === "sending" ? t("sending") : t("submit")}
            </button>
            <p role="status" aria-live="polite" className="text-sm">
              {status === "ok" && <span className="font-semibold text-primary">{t("ok")}</span>}
              {status === "error" && (
                <span className="font-semibold text-[oklch(0.52_0.19_25)]">{t("error")}</span>
              )}
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
