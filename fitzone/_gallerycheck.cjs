const pg = require("pg");
const c = new pg.Client({ connectionString: "postgresql://postgres:password@localhost:5432/fitzone" });
(async () => {
  await c.connect();
  const items = await c.query('select "id","title","image","active","categoryId","createdAt" from "GalleryItem"');
  console.log("GalleryItem rows:", items.rows.length);
  items.rows.forEach((r) => console.log("  ", JSON.stringify(r)));
  const cats = await c.query('select "id","name","slug" from "GalleryCategory"');
  console.log("GalleryCategory rows:");
  cats.rows.forEach((r) => console.log("  ", JSON.stringify(r)));
  await c.end();
})().catch((e) => { console.log("FAIL:", e.message); process.exit(1); });