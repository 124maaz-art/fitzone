const http = require("http");

const PORT = 3000;

function request(opts, body) {
  return new Promise((resolve, reject) => {
    const req = http.request(opts, (res) => {
      let data = "";
      res.on("data", (d) => (data += d));
      res.on("end", () =>
        resolve({ status: res.statusCode, headers: res.headers, body: data, url: opts.path })
      );
    });
    req.on("error", reject);
    if (body) req.write(body);
    req.end();
  });
}

async function getCsrf(cookie) {
  const r = await request({
    hostname: "localhost",
    port: PORT,
    path: "/api/auth/csrf",
    method: "GET",
    headers: cookie
      ? { Cookie: cookie, Connection: "close" }
      : { Connection: "close" },
  });
  return { token: JSON.parse(r.body).csrfToken, cookie: (r.headers["set-cookie"] || [])[0] };
}

(async () => {
  // step 1: get csrf
  const csrf1 = await getCsrf(null);
  console.log("1. CSRF token obtained:", !!csrf1.token);
  console.log("   cookie:", (csrf1.cookie || "").substring(0, 40) + "...");

  // step 2: signin callback with credentials
  const csrf2 = await getCsrf(csrf1.cookie);
  const form =
    "csrfToken=" + encodeURIComponent(csrf2.token) +
    "&email=" + encodeURIComponent("admin@fitzone.com") +
    "&password=" + encodeURIComponent("Admin@123") +
    "&callbackUrl=" + encodeURIComponent("http://localhost:3000/admin/dashboard");

  const r2 = await request({
    hostname: "localhost",
    port: PORT,
    path: "/api/auth/callback/credentials",
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": Buffer.byteLength(form),
      Cookie: csrf1.cookie,
      Connection: "close",
    },
  }, form);

  console.log("2. Signin POST status:", r2.status);
  const loc = r2.headers.location;
  console.log("   Location:", loc);
  const cookies = Array.isArray(r2.headers["set-cookie"]) ? r2.headers["set-cookie"] : (r2.headers["set-cookie"] ? [r2.headers["set-cookie"]] : []);
  const sessionCookie = cookies.find((c) => c.startsWith("authjs.session-token"));
  console.log("   session-cookie set:", !!sessionCookie, "| csrf cookies:", cookies.filter((c) => c.startsWith("authjs.csrf-token")).length);

  // step 3: follow to admin dashboard to confirm session valid
  if (loc) {
    const r3 = await request({
      hostname: "localhost",
      port: PORT,
      path: loc.replace("http://localhost:3000", ""),
      method: "GET",
      headers: {
        Cookie: [csrf1.cookie, csrf2.cookie, ...cookies].filter(Boolean).join("; "),
        Connection: "close",
      },
    });
    console.log("3. Follow login redirect -> status:", r3.status, "url:", r3.url);
    if (r3.status === 307) {
      console.log("   Redirected to:", r3.headers.location, "(means NOT authenticated - possible FAIL)");
    } else if (r3.status === 200) {
      console.log("   Reachable, got 200. Check if it's the login page or dashboard: contains 'Admin Dashboard':", r3.body.includes("Bookings") || r3.body.includes("Dashboard") || r3.body.includes("admin"));
    } else {
      console.log("   Unexpected status:", r3.status);
    }
  }
})().catch((e) => {
  console.log("LOGIN TEST ERROR:", e);
});