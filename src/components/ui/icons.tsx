import type { ComponentProps } from "react";

// 工程线稿图标集（固定枚举，AI 只能从这里选名字，不能造图标）
// 统一 24 viewBox / 1.5 stroke / currentColor，方角收笔贴合设计语言

const P = {
  strokeWidth: 1.5,
  stroke: "currentColor",
  fill: "none",
  strokeLinecap: "square" as const,
  strokeLinejoin: "miter" as const,
};

type IconProps = ComponentProps<"svg">;

function Svg({ children, ...rest }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" {...P} {...rest}>
      {children}
    </svg>
  );
}

export const ICONS = {
  quality: (p: IconProps) => (
    <Svg {...p}>
      <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z" />
      <path d="M8.5 12l2.5 2.5 4.5-4.5" />
    </Svg>
  ),
  factory: (p: IconProps) => (
    <Svg {...p}>
      <path d="M3 21V9l6 4V9l6 4V4h6v17H3z" />
      <path d="M7 17h2M12 17h2M17 17h2" />
    </Svg>
  ),
  export: (p: IconProps) => (
    <Svg {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c-5 5.5-5 12.5 0 18M12 3c5 5.5 5 12.5 0 18" />
    </Svg>
  ),
  material: (p: IconProps) => (
    <Svg {...p}>
      <path d="M4 8l8-4 8 4-8 4-8-4z" />
      <path d="M4 8v8l8 4 8-4V8" />
      <path d="M12 12v8" />
    </Svg>
  ),
  inspection: (p: IconProps) => (
    <Svg {...p}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M15.5 15.5L21 21" />
      <path d="M7.5 10.5h6M10.5 7.5v6" />
    </Svg>
  ),
  speed: (p: IconProps) => (
    <Svg {...p}>
      <path d="M4 19a9 9 0 1116 0" />
      <path d="M12 13l4.5-4.5" />
      <circle cx="12" cy="13" r="1.5" fill="currentColor" stroke="none" />
    </Svg>
  ),
  oem: (p: IconProps) => (
    <Svg {...p}>
      <path d="M9 3h6v4.5l3.9 6.75-3 5.25H8.1l-3-5.25L9 7.5V3z" />
      <circle cx="12" cy="14" r="2.5" />
    </Svg>
  ),
  support: (p: IconProps) => (
    <Svg {...p}>
      <path d="M4 13a8 8 0 0116 0" />
      <rect x="3" y="13" width="4" height="6" />
      <rect x="17" y="13" width="4" height="6" />
      <path d="M19 19a3 3 0 01-3 3h-3" />
    </Svg>
  ),
  warranty: (p: IconProps) => (
    <Svg {...p}>
      <circle cx="12" cy="10" r="6" />
      <path d="M9.5 10l1.8 1.8 3.2-3.2" />
      <path d="M8.5 15L7 21l5-2 5 2-1.5-6" />
    </Svg>
  ),
  package: (p: IconProps) => (
    <Svg {...p}>
      <path d="M3 7.5L12 3l9 4.5v9L12 21l-9-4.5v-9z" />
      <path d="M3 7.5l9 4.5 9-4.5M12 12v9M7.5 5.25l9 4.5" />
    </Svg>
  ),
  cert: (p: IconProps) => (
    <Svg {...p}>
      <rect x="4" y="3" width="16" height="14" />
      <path d="M8 7h8M8 10h5" />
      <circle cx="15.5" cy="14.5" r="2" />
      <path d="M14.5 16.5l-1 4 2-1 2 1-1-4" />
    </Svg>
  ),
  video: (p: IconProps) => (
    <Svg {...p}>
      <rect x="3" y="5" width="18" height="14" />
      <path d="M10 9.5l5 2.5-5 2.5v-5z" />
    </Svg>
  ),
  whatsapp: (p: IconProps) => (
    <Svg {...p}>
      <path d="M12 3a8.5 8.5 0 00-7.3 12.8L3.5 20.5l4.8-1.2A8.5 8.5 0 1012 3z" />
      <path d="M9 8.5c0 4 2.5 6.5 6.5 6.5l.5-2-2-1-1 1c-1.2-.6-2.4-1.8-3-3l1-1-1-2-1 1.5z" />
    </Svg>
  ),
  mail: (p: IconProps) => (
    <Svg {...p}>
      <rect x="3" y="5" width="18" height="14" />
      <path d="M3 7l9 6 9-6" />
    </Svg>
  ),
  pin: (p: IconProps) => (
    <Svg {...p}>
      <path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0113 0c0 5-6.5 11-6.5 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </Svg>
  ),
  phone: (p: IconProps) => (
    <Svg {...p}>
      <path d="M5 4h4l1.5 4.5-2 1.5a12 12 0 005.5 5.5l1.5-2L20 15v4a1.5 1.5 0 01-1.7 1.5C10.5 19.6 4.4 13.5 3.5 5.7A1.5 1.5 0 015 4z" />
    </Svg>
  ),
} satisfies Record<string, (p: IconProps) => React.JSX.Element>;

export type IconName = keyof typeof ICONS;

export function Icon({ name, ...rest }: { name: string } & IconProps) {
  const Cmp = ICONS[name as IconName] ?? ICONS.quality;
  return <Cmp {...rest} />;
}
