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
  assert.match(html, /href="\/works"[^>]*>Works<\/a>/);
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
  const worksTitle = html.match(/class="works-heading">[\s\S]*?<h2\b([^>]*)>([\s\S]*?)<\/h2>/);
  assert.match(worksTitle?.[1] ?? "", /aria-label="Selected Works"/);
  assert.equal(worksTitle?.[2].replace(/<[^>]*>/g, "").replace(/\u00a0|&#xA0;|&nbsp;/g, " "), "Selected Works");
  const about = html.match(/<section class="about" id="about">([\s\S]*?)<\/section>/)?.[1] ?? "";
  assert.match(about, /class="about-poster"[\s\S]*?about-poster-placeholder\.svg[\s\S]*?class="about-slogan shell" lang="en">Complete Incomplete<\/h2>[\s\S]*?class="about-image"/);
  assert.doesNotMatch(about, /ABOUT \/ 关于|DESIGN EXPERIENCE|BIOGRAPHY|CAPABILITIES|SELECTED COLLABORATIONS/);
  const partners = html.match(/<div class="partners">([\s\S]*?)<footer class="contact"/)?.[1] ?? "";
  assert.match(partners, /role="region" aria-label="合作品牌 Logo"/);
  const partnerList = partners.match(/<ul class="logoloop__list" role="list">([\s\S]*?)<\/ul>/)?.[1] ?? "";
  assert.deepEqual(Array.from(partnerList.matchAll(/alt="([^"]+)"/g), match => match[1]), ["React", "Next.js", "TypeScript", "Tailwind CSS"]);
  const contact = html.match(/<footer class="contact" id="contact">([\s\S]*?)<\/footer>/)?.[1] ?? "";
  assert.match(contact, /href="mailto:studioalmostworks@gmail\.com"[^>]*aria-label="studioalmostworks@gmail\.com"/);
  assert.deepEqual(Array.from(contact.matchAll(/<span data-piece="" class="falling-text__piece[^"]*">([^<]*)<\/span>/g), match => match[1]), ["studio", "almost", "works", "@", "gmail", ".", "com"]);
  assert.match(contact, /<button[^>]*class="sling-button__pad"[^>]*aria-label="一键联系"/);
  assert.doesNotMatch(contact, /mail-tooltip|contact-email-hint/);
  assert.match(contact, /class="sling-button__label"[^>]*>DRAG ME →<\/span>/);
  assert.match(contact, /class="contact-brand-icon" src="\/brand-logo-icon\.svg"/);
  assert.match(contact, /class="contact-copyright">© [\s\S]*?STUDIO ALMOST/);
  assert.match(contact, /class="contact-wordmark" src="\/brand-logo-full-orange\.svg"/);
  assert.match(contact, /<dialog[^>]*aria-labelledby="contact-dialog-message"><p id="contact-dialog-message">有项目？看看我最近有没有空。<\/p>/);
  assert.match(contact, /<form[^>]*method="dialog"[^>]*><button type="submit" value="confirm">没错<\/button><button type="submit" value="cancel">点错了<\/button>/);
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

test("works overview starts on an unselected All entry between the twelve categories", async () => {
  const response = await render("/works");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /href="\/works" aria-current="page"/);
  assert.match(html, /href="\/#about"/);
  assert.match(html, /href="\/#contact"/);
  assert.match(html, /id="works-gallery-title" aria-label="All works"/);
  assert.match(html, /<h1[^>]*aria-label="Works\."/);
  assert.doesNotMatch(html, /class="text-pressure-title"/);
  assert.deepEqual(Array.from(html.matchAll(/role="option"[^>]*>([^<]+)<\/div>/g), match => match[1]), [
    "Branding", "Logos", "Events", "Exhibitions", "Posters", "Graphics",
    "All", "Books", "Music", "Packaging", "Products", "Commercial", "Web",
  ]);
  assert.doesNotMatch(html, /PROJECT ARCHIVE|CATEGORY NOT FOUND|PROJECTS|aria-selected="true"/);
  assert.match(html, /class="contact-copyright">© [\s\S]*?STUDIO ALMOST<span>ALL RIGHTS RESERVED\.<\/span>/);
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
