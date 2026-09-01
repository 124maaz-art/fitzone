const http = require("http");
const PORT = 3000;
function fetch(path) {
  return new Promise((resolve) => {
    http
      .request({ hostname: "localhost", port: PORT, path, method: "GET", headers: { Connection: "close" } }, (res) => {
        let d = "";
        res.on("data", (x) => (d += x));
        res.on("end", () => resolve({ status: res.statusCode, body: d }));
      })
      .on("error", (e) => resolve({ status: 0, error: e.message }))
      .end();
  });
}
(async () => {
  const r = await fetch("/gallery");
  console.log("Gallery status:", r.status);
  // find next/image srcs
  const imgRe = /src="([^"]*)"|_next\/image[^"]*url=([^&"]*)/g;
  let m, found = [];
  while ((m = imgRe.exec(r.body || "")) !== null) {
    found.push(m[1] || m[2]);
  }
  console.log("Image srcs found:", found.length);
  found.slice(0, 20).forEach((s) => console.log("  ", decodeURIComponent(s).substring(0, 120)));
  // does the body reference motopress?
  if (r.body && r.body.includes("motopress")) {
    console.log("Body contains motopress image URL: YES");
  } else {
    console.log("Body contains motopress image URL: NO");
  }
  // check fallback usage
  if (r.body && r.body.includes("fallback")) {
    const fm = r.body.match(/fallback[^"]*/);
    console.log("fallback found:", fm ? fm[0] : "");
  }
})().catch((e) => console.log("ERR", e));