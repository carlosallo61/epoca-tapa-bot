const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();

  const EDICION_ACTUAL = 1415; // Cambiar esto por una lógica dinámica si querés
  const url = `https://www.diarioepoca.com/edicion/${EDICION_ACTUAL}/`;

  try {
    await page.goto(url, { waitUntil: "networkidle2", timeout: 0 });

    const imageUrl = await page.evaluate(() => {
      const img = document.querySelector("source[srcset*='bucket']");
      return img ? img.srcset : null;
    });

    if (imageUrl) {
      const viewSource = await page.goto(imageUrl);
      const buffer = await viewSource.buffer();
      fs.writeFileSync(path.join(__dirname, "tapa_epoca.webp"), buffer);
      console.log("✅ Imagen descargada con éxito:", imageUrl);
    } else {
      console.log("❌ No se encontró imagen en la página.");
    }
  } catch (err) {
    console.error("⚠️ Error al intentar descargar la imagen:", err);
  }

  await browser.close();
})();
