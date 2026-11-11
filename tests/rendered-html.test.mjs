import assert from "node:assert/strict";
import test from "node:test";

const { default: worker } = await import("../dist/server/index.js");
async function render(path) {
  return worker.fetch(new Request(`http://localhost${path}`, {headers: {accept: "text/html"}}), {
    ASSETS: {fetch: async () => new Response("Not found", {status: 404})},
  }, {waitUntil() {}, passThroughOnException() {}});
}

test("homepage renders portfolio content and all category links", async () => {
  const response = await render("/");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html/);
  const html = await response.text();
  assert.match(html, /XJ Portfolio/);
  for (const id of ["home", "works", "about", "contact"]) {
    assert.ok(html.includes(`id="${id}"`), `Missing ${id} section`);
  }
  for (const slug of ["branding-logos", "events-exhibitions", "posters-graphics", "editorial-music", "packaging-products", "commercial-web"]) {
    assert.ok(html.includes(`/works/${slug}`), `Missing ${slug} link`);
  }
  assert.match(html, /MOUNT EVEREST/);
  assert.match(html, /We’re almost there/);
  const studioMeta = html.match(/<p class="studio-meta" lang="en">([\s\S]*?)<\/p><a href="#works" class="round-link"/)?.[1];
  assert.equal(studioMeta?.replace(/<[^>]*>/g, ""), "Since 2014, Visual Design Studio Founded By leVel, Based in FuZhou. Scroll To Explore More...");
  assert.match(html, /class="featured-projects"[\s\S]*?class="works-heading"><h2>[\s\S]*?<span class="variable-proximity-label">（Selected Works）<\/span>/);
  const about = html.match(/<section class="about" id="about">([\s\S]*?)<\/section>/)?.[1] ?? "";
  assert.match(about, /class="about-poster"[\s\S]*?about-poster-placeholder\.svg[\s\S]*?class="about-slogan shell" lang="en">Complete Incomplete<\/h2>[\s\S]*?class="about-image"/);
  assert.doesNotMatch(about, /ABOUT \/ 关于|DESIGN EXPERIENCE|BIOGRAPHY|CAPABILITIES|SELECTED COLLABORATIONS/);
  const contact = html.match(/<footer class="contact" id="contact">([\s\S]*?)<\/footer>/)?.[1] ?? "";
  assert.match(contact, /href="mailto:levelfoto@gmail\.com">levelfoto@gmail\.com<\/a>/);
  assert.match(contact, /<button[^>]*class="sling-button__pad"[^>]*aria-label="一键联系"/);
  assert.doesNotMatch(contact, /AVAILABLE FOR SELECTED PROJECTS|03 — CONTACT|让我们创造/);
  assert.doesNotMatch(html, /aria-label="作品分类入口"/);
  const panels = Array.from(html.matchAll(/<article class="category-panel">([\s\S]*?)<\/article>/g), match => match[1]);
  assert.equal(panels.length, 12);
  assert.deepEqual(panels.map(panel => panel.match(/class="category-panel-title">([^<]+)/)?.[1]), [
    "Branding", "Logos", "Events", "Exhibitions", "Posters", "Graphics",
    "Books", "Music", "Packaging", "Products", "Commercial", "Web",
  ]);
  for (const panel of panels) {
    assert.match(panel, /aria-pressed="false"/);
    assert.match(panel, /class="category-panel-count">18<\/span>/);
    assert.match(panel, /class="category-enter" href="\/works\/[^"]+"[^>]*>→<\/a>/);
  }
});

for (const [slug, label] of [
  ["branding-logos", "Branding &amp; Logos"],
  ["events-exhibitions", "Events &amp; Exhibitions"],
  ["posters-graphics", "Posters &amp; Graphics"],
  ["editorial-music", "Editorial &amp; Music"],
  ["packaging-products", "Packaging &amp; Products"],
  ["commercial-web", "Commercial &amp; Web"],
]) {
  test(`category ${slug} renders its title and archive placeholder`, async () => {
    const response = await render(`/works/${slug}`);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.ok(html.includes(`<h1>${label}</h1>`));
    assert.match(html, /PROJECT ARCHIVE/);
  });
}

for (const slug of ["missing-category", "constructor", "__proto__"]) {
  test(`unknown category ${slug} shows the existing fallback`, async () => {
    const response = await render(`/works/${slug}`);
    const html = await response.text();
    assert.match(html, /CATEGORY<br\s*\/?>(?:<!-- -->)?NOT FOUND/);
    assert.doesNotMatch(html, /PROJECT ARCHIVE/);
  });
}
