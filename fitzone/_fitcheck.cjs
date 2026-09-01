const pg = require("pg");
const c = new pg.Client({
  connectionString: "postgresql://postgres:password@localhost:5432/fitzone",
});
(async () => {
  await c.connect();
  const tables = await c.query(
    "select tablename from pg_tables where schemaname='public' order by tablename"
  );
  console.log("TABLES:", tables.rows.map((r) => r.tablename).join(", "));
  for (const t of ["User", "Service", "MembershipPackage", "Trainer", "TrainerAvailability", "Program", "GalleryCategory", "GalleryItem", "Transformation", "Testimonial", "Booking", "Inquiry", "SiteSetting", "EquipmentCategory", "Equipment"]) {
    const r = await c.query('select count(*)::int as n from "' + t + '"');
    console.log(t + ": " + r.rows[0].n);
  }
  const users = await c.query('select "email", "role" from "User"');
  console.log("USERS:", JSON.stringify(users.rows));
  const tr = await c.query('select "slug" from "Trainer" limit 3');
  console.log("TRAINER SLUGS:", JSON.stringify(tr.rows.map((r) => r.slug)));
  const eq = await c.query('select "slug" from "Equipment" limit 3');
  console.log("EQUIPMENT SLUGS:", JSON.stringify(eq.rows.map((r) => r.slug)));
  const b = await c.query('select "reference", "id" from "Booking" limit 3');
  console.log("BOOKINGS:", JSON.stringify(b.rows));
  await c.end();
})().catch(function(e) {
  console.log("FAIL:", e.message);
  process.exit(1);
});