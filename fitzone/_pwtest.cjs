const bcrypt = require("bcryptjs");
const pg = require("pg");
const c = new pg.Client({
  connectionString: "postgresql://postgres:password@localhost:5432/fitzone",
});
(async () => {
  await c.connect();
  const r = await c.query(
    'select "email", "passwordHash" from "User" where "email"=\'admin@fitzone.com\''
  );
  const u = r.rows[0];
  console.log("User:", u.email);
  const hash = u.passwordHash;
  console.log("Hash prefix:", (hash || "").substring(0, 7));
  for (const pw of ["admin123", "admin", "password", "Admin@123", "fit@2024"]) {
    const ok = await bcrypt.compare(pw, hash);
    console.log(`  password '${pw}': ${ok ? "MATCH" : "no"}`);
  }
  await c.end();
})().catch((e) => {
  console.log("FAIL:", e.message);
  process.exit(1);
});