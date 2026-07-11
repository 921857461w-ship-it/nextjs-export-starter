type Props = {
  title: string;
  lead?: string;
  /** 工程索引号，仅真实序列/编号语义时使用（如 sheet no.），默认无 */
  index?: string;
  align?: "start" | "center";
};

// 统一的 section 标题组。装饰线随版式切换：
// 居中（目录站语法）→ 主色短横；左对齐（编辑式）→ 尺寸标注线。
export function SectionHeading({ title, lead, index, align = "start" }: Props) {
  const centered = align === "center";
  return (
    <header
      className={`mb-10 max-w-2xl md:mb-14 ${centered ? "mx-auto text-center" : ""}`}
    >
      <h2 className="type-display-sm">
        {index && (
          <span className="type-figure mr-3 align-baseline text-[0.6em] text-primary">
            {index}
          </span>
        )}
        {title}
      </h2>
      {lead && <p className="mt-4 text-lg text-muted">{lead}</p>}
      {centered ? (
        <div className="mx-auto mt-5 h-[3px] w-12 bg-primary" />
      ) : (
        <div className="dim-rule mt-6 w-24" />
      )}
    </header>
  );
}
