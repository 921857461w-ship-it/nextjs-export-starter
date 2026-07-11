import type { ComponentType } from "react";
import { Hero, heroSchema } from "./Hero";
import { StatsBar, statsBarSchema } from "./StatsBar";
import { ProductGrid, productGridSchema } from "./ProductGrid";
import { CategoryNav, categoryNavSchema } from "./CategoryNav";
import { CertWall, certWallSchema } from "./CertWall";
import { FactoryGallery, factoryGallerySchema } from "./FactoryGallery";
import { ProcessTimeline, processTimelineSchema } from "./ProcessTimeline";
import { AdvantageGrid, advantageGridSchema } from "./AdvantageGrid";
import { TestimonialStrip, testimonialStripSchema } from "./TestimonialStrip";
import { Faq, faqSchema } from "./Faq";
import { CtaBand, ctaBandSchema } from "./CtaBand";
import { InquiryForm } from "./InquiryForm";
import { inquiryFormSchema } from "./inquiry-form-schema";
import { ContactBlock, contactBlockSchema } from "./ContactBlock";
import { Footer, footerSchema } from "./Footer";
import { AboutText, aboutTextSchema } from "./AboutText";

export { ProductDetailPage, productDetailSchema } from "./ProductDetailPage";

// blueprint.sections[page][].type → 组件 + props schema。
// 页面组装：blueprint + content_pack → 页面树（section 实例 + props）→ 渲染。
/* eslint-disable @typescript-eslint/no-explicit-any */
export const SECTION_COMPONENTS: Record<
  string,
  { component: ComponentType<any>; schema: any }
> = {
  hero: { component: Hero, schema: heroSchema },
  stats_bar: { component: StatsBar, schema: statsBarSchema },
  product_grid: { component: ProductGrid, schema: productGridSchema },
  category_nav: { component: CategoryNav, schema: categoryNavSchema },
  cert_wall: { component: CertWall, schema: certWallSchema },
  factory_gallery: { component: FactoryGallery, schema: factoryGallerySchema },
  process_timeline: { component: ProcessTimeline, schema: processTimelineSchema },
  advantage_grid: { component: AdvantageGrid, schema: advantageGridSchema },
  testimonial_strip: { component: TestimonialStrip, schema: testimonialStripSchema },
  faq: { component: Faq, schema: faqSchema },
  cta_band: { component: CtaBand, schema: ctaBandSchema },
  inquiry_form: { component: InquiryForm, schema: inquiryFormSchema },
  contact_block: { component: ContactBlock, schema: contactBlockSchema },
  footer: { component: Footer, schema: footerSchema },
  about_text: { component: AboutText, schema: aboutTextSchema },
};
