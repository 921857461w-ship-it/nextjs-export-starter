import { z } from "zod";

// 与 InquiryForm.tsx 分离：client 模块导出的非组件值无法跨 RSC 边界使用
export const inquiryFormSchema = z.object({
  heading: z.string().optional(),
  lead: z.string().optional(),
  // 产品详情页提交时自动携带产品上下文
  productContext: z.object({ id: z.string(), name: z.string() }).optional(),
});
export type InquiryFormProps = z.infer<typeof inquiryFormSchema>;
