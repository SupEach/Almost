import Link from "next/link";
import { getCategory } from "../../content/categories";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = getCategory(slug);

  if (!category) {
    return (
      <main className="category-page category-not-found">
        <Link href="/#works">← BACK TO WORKS</Link>
        <h1>CATEGORY<br />NOT FOUND</h1>
      </main>
    );
  }

  return (
    <main className="category-page">
      <nav className="category-nav">
        <Link href="/" aria-label="返回首页"><img src="/brand-logo-cn.svg" alt="" /></Link>
        <Link href="/#works">← ALL WORKS</Link>
      </nav>

      <header className={`category-hero category-art-${category.art}`}>
        <span>{category.index} / 06</span>
        <div>
          <p>{category.type}</p>
          <h1>{category.label}</h1>
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
