export const categories = [
  { label: "Branding & Logos", type: "品牌及徽标", slug: "branding-logos", art: "identity", note: "IDENTITY / SYSTEM / SYMBOL", index: "01", intro: "从品牌策略、命名与标识出发，建立完整、清晰且可持续的视觉识别系统。" },
  { label: "Events & Exhibitions", type: "活动和展览", slug: "events-exhibitions", art: "events", note: "SPACE / CULTURE / EXPERIENCE", index: "02", intro: "将主题、空间与现场体验组织成一套具有传播力的视觉语言。" },
  { label: "Posters & Graphics", type: "海报和图形", slug: "posters-graphics", art: "posters", note: "IMAGE / TYPE / MESSAGE", index: "03", intro: "以图像、字体与结构回应信息，让平面设计保留鲜明而准确的表达。" },
  { label: "Editorial & Music", type: "书籍和音乐装帧", slug: "editorial-music", art: "editorial", note: "BOOK / ALBUM / NARRATIVE", index: "04", intro: "通过编辑设计与装帧节奏，为文字、影像和声音建立可触摸的叙事。" },
  { label: "Packaging & Products", type: "包装和产品", slug: "packaging-products", art: "packaging", note: "OBJECT / MATERIAL / SHELF", index: "05", intro: "连接品牌、材料与使用情境，让包装成为产品体验的一部分。" },
  { label: "Commercial & Web", type: "商业和网站", slug: "commercial-web", art: "digital", note: "CAMPAIGN / SCREEN / WEB", index: "06", intro: "面向传播与屏幕场景，构建兼具品牌一致性和使用效率的商业体验。" },
];

export function getCategory(slug: string) {
  return categories.find(category => category.slug === slug);
}
