import { z } from "zod";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const contactBlockSchema = z.object({
  heading: z.string().optional(),
  whatsapp: z.string(),
  email: z.string(),
  phone: z.string().optional(),
  address: z.string(),
  mapImage: z.string().optional(), // 地图用静态图（性能），不用 iframe
});
export type ContactBlockProps = z.infer<typeof contactBlockSchema>;

// 联系区：多通道按钮 + 静态地图。WhatsApp 是外贸热通道 → 唯一的 accent 大件。
export function ContactBlock({
  heading,
  whatsapp,
  email,
  phone,
  address,
  mapImage,
}: ContactBlockProps) {
  const t = useTranslations("contact");
  const waNumber = whatsapp.replace(/[^\d]/g, "");

  const rows: Array<{ icon: string; label: string; value: string; href: string }> = [
    {
      icon: "whatsapp",
      label: "WhatsApp",
      value: `+${waNumber}`,
      href: `https://wa.me/${waNumber}`,
    },
    { icon: "mail", label: t("email"), value: email, href: `mailto:${email}` },
    ...(phone
      ? [{ icon: "phone", label: t("phone"), value: phone, href: `tel:${phone.replace(/\s/g, "")}` }]
      : []),
  ];

  return (
    <section data-section="contact_block" className="section-pad bg-bg">
      <div className="container-site grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div>
          {heading && <SectionHeading title={heading} />}

          <ul className="border-t border-line">
            {rows.map((r) => (
              <li key={r.icon} className="border-b border-line">
                <a
                  href={r.href}
                  className="group flex items-center gap-5 py-5"
                  {...(r.href.startsWith("http")
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  <Icon
                    name={r.icon}
                    className={`size-6 shrink-0 ${r.icon === "whatsapp" ? "text-accent" : "text-primary"}`}
                  />
                  <div className="min-w-0">
                    <p className="type-label text-muted">{r.label}</p>
                    <p className="truncate font-semibold text-ink group-hover:text-primary">
                      {r.value}
                    </p>
                  </div>
                </a>
              </li>
            ))}
            <li className="flex items-start gap-5 border-b border-line py-5">
              <Icon name="pin" className="mt-0.5 size-6 shrink-0 text-primary" />
              <div>
                <p className="type-label text-muted">{t("address")}</p>
                <address className="font-semibold not-italic text-ink">{address}</address>
              </div>
            </li>
          </ul>
        </div>

        {mapImage && (
          <figure className="relative min-h-72 overflow-hidden border border-line bg-surface lg:min-h-0">
            <Image
              src={mapImage}
              alt={t("mapAlt")}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </figure>
        )}
      </div>
    </section>
  );
}
