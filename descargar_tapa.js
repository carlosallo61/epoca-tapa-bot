const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

(async () => {
  try {
    const { data } = await axios.get('https://www.diariolaepoca.com/');
    const $ = cheerio.load(data);

    // Ajustá este selector según el sitio. Ejemplo:
    const imgUrl = $('img[src*="tapa"]').attr('src');

    if (!imgUrl) {
      console.error('❌ No se encontró imagen en la página.');
      process.exit(1);
    }

    const fullUrl = imgUrl.startsWith('http') ? imgUrl : `https://www.diariolaepoca.com${imgUrl}`;
    const response = await axios.get(fullUrl, { responseType: 'arraybuffer' });

    const filePath = path.resolve(__dirname, 'tapa_epoca.webp');
    fs.writeFileSync(filePath, response.data);
    console.log(`✅ Imagen descargada correctamente: ${filePath}`);
  } catch (error) {
    console.error('❌ Error al descargar la imagen:', error.message);
    process.exit(1);
  }
})();
