const categoryDetails = {
  "branding-logos": { en: "Branding & Logos", zh: "品牌及徽标", index: "01", intro: "从品牌策略、命名与标识出发，建立完整、清晰且可持续的视觉识别系统。", art: "identity" },
  "events-exhibitions": { en: "Events & Exhibitions", zh: "活动和展览", index: "02", intro: "将主题、空间与现场体验组织成一套具有传播力的视觉语言。", art: "events" },
  "posters-graphics": { en: "Posters & Graphics", zh: "海报和图形", index: "03", intro: "以图像、字体与结构回应信息，让平面设计保留鲜明而准确的表达。", art: "posters" },
  "editorial-music": { en: "Editorial & Music", zh: "书籍和音乐装帧", index: "04", intro: "通过编辑设计与装帧节奏，为文字、影像和声音建立可触摸的叙事。", art: "editorial" },
  "packaging-products": { en: "Packaging & Products", zh: "包装和产品", index: "05", intro: "连接品牌、材料与使用情境，让包装成为产品体验的一部分。", art: "packaging" },
  "commercial-web": { en: "Commercial & Web", zh: "商业和网站", index: "06", intro: "面向传播与屏幕场景，构建兼具品牌一致性和使用效率的商业体验。", art: "digital" },
} as const;

type CategorySlug = keyof typeof categoryDetails;

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = categoryDetails[slug as CategorySlug];

  if (!category) {
    return (
      <main className="category-page category-not-found">
        <a href="/#works">← BACK TO WORKS</a>
        <h1>CATEGORY<br />NOT FOUND</h1>
      </main>
    );
  }

  return (
    <main className="category-page">
      <nav className="category-nav">
        <a href="/" aria-label="返回首页"><img src="/brand-logo-cn.svg" alt="" /></a>
        <a href="/#works">← ALL WORKS</a>
      </nav>

      <header className={`category-hero category-art-${category.art}`}>
        <span>{category.index} / 06</span>
        <div>
          <p>{category.zh}</p>
          <h1>{category.en}</h1>
        </div>
      </header>

      <section className="category-intro">
        <p>SELECTED CATEGORY</p>
        <h2>{category.intro}</h2>
      </section>

      <section className="category-coming-soon">
        <span>PROJECT ARCHIVE</span>
        <p>项目内容将在下一轮细化中加入。</p>
      </section>
    </main>
  );
}
