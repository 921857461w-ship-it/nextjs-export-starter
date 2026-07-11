import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    // 高熵工业照片 AVIF 明显小于 WebP；LCP 预算的关键杠杆
    formats: ["image/avif", "image/webp"],
    qualities: [50, 60, 75],
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
