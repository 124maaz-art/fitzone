const http = require("http");

const PORT = 3000;
const PAGES = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
  { name: "Packages", path: "/packages" },
  { name: "Trainers", path: "/trainers" },
  { name: "Gallery", path: "/gallery" },
  { name: "Contact", path: "/contact" },
  { name: "Booking", path: "/booking" },
  { name: "Programs", path: "/programs" },
  { name: "Equipment", path: "/equipment" },
  { name: "Transformations", path: "/transformations" },
  { name: "Testimonials", path: "/testimonials" },
  { name: "Admin Login", path: "/admin/login" },
  { name: "Admin Dashboard", path: "/admin/dashboard" },
  { name: "Admin Services", path: "/admin/services" },
  { name: "Admin Packages", path: "/admin/packages" },
  { name: "Admin Trainers", path: "/admin/trainers" },
  { name: "Admin Programs", path: "/admin/programs" },
  { name: "Admin Gallery", path: "/admin/gallery" },
  { name: "Admin Categories", path: "/admin/categories" },
  { name: "Admin Equipment", path: "/admin/equipment" },
  { name: "Admin Transformations", path: "/admin/transformations" },
  { name: "Admin Testimonials", path: "/admin/testimonials" },
  { name: "Admin Bookings", path: "/admin/bookings" },
  { name: "Admin Inquiries", path: "/admin/inquiries" },
  { name: "Admin Settings", path: "/admin/settings" },
  { name: "Trainer Detail ali-raza", path: "/trainers/ali-raza" },
  { name: "Equipment Detail squat-rack", path: "/equipment/squat-rack" },
];

function fetchPage(path) {
  return new Promise((resolve) => {
    const req = http.request(
      {
        hostname: "localhost",
        port: PORT,
        path: path,
        method: "GET",
        headers: { Connection: "close" },
      },
      (res) => {
        let body = "";
        res.on("data", (d) => (body += d));
        res.on("end", () => resolve({ status: res.statusCode, body, path }));
      }
    );
    req.on("error", (e) => resolve({ status: 0, error: e.message, path }));
    req.setTimeout(30000, () => {
      req.destroy();
      resolve({ status: 0, error: "TIMEOUT", path });
    });
    req.end();
  });
}

(async () => {
  const results = [];
  for (const p of PAGES) {
    const r = await fetchPage(p.path);
    const hasError =
      r.status === 0 ||
      r.status >= 500 ||
      (r.body && r.body.includes("Internal Server Error")) ||
      (r.body && r.body.includes("Application error"));
    const tag = hasError ? "FAIL" : "OK";
    const extra = hasError
      ? r.error
        ? r.error
        : (r.body || "").substring(0, 200)
      : "";
    results.push({ name: p.name, path: p.path, status: r.status, tag, extra });
    console.log("[" + tag + "] " + p.name + " (" + p.path + ") -> " + r.status);
    if (hasError && extra) console.log("    " + extra.substring(0, 300));
  }
  const fails = results.filter((r) => r.tag === "FAIL");
  console.log("\n" + results.length + " pages tested, " + fails.length + " FAILED");
  if (fails.length > 0) {
    console.log("FAILURES:");
    fails.forEach((f) => console.log("  " + f.path + " -> " + f.status + ": " + (f.extra || "").substring(0, 200)));
  }
})();
