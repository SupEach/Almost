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
