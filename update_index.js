const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Replace Images
html = html.replace('class="hero-bg-img"', 'class="hero-bg-img" data-setting-img="img_hero_bg"');
html = html.replace('src="./Ich/Nazik.jpg"', 'src="./Ich/Nazik.jpg" data-setting-img="img_intro_portrait"');
html = html.replace('src="./Arbeit/craft.png" alt="CRAFT', 'src="./Arbeit/craft.png" data-setting-img="img_framer_craft" alt="CRAFT');
html = html.replace('src="./Salon/DSC03348.JPG" alt="STUDIO', 'src="./Salon/DSC03348.JPG" data-setting-img="img_framer_studio" alt="STUDIO');
html = html.replace('src="./Arbeit/825310074_1396808228712906_4132944310838981144_n.jpg" alt="ARTISTRY', 'src="./Arbeit/825310074_1396808228712906_4132944310838981144_n.jpg" data-setting-img="img_framer_artistry" alt="ARTISTRY');
html = html.replace('src="./Arbeit/results.png" alt="RESULTS', 'src="./Arbeit/results.png" data-setting-img="img_framer_results" alt="RESULTS');

// Replace Prices
html = html.replace('data-service="Damen Kurz" data-price="55 €">55 €<', 'data-service="Damen Kurz" data-price="55 €" data-setting-price="price_damen_kurz">55 €<');
html = html.replace('data-service="Damen Mittel" data-price="ab 57 €">ab 57 €<', 'data-service="Damen Mittel" data-price="ab 57 €" data-setting-price="price_damen_mittel">ab 57 €<');
html = html.replace('data-service="Damen Lang" data-price="ab 60 €">ab 60 €<', 'data-service="Damen Lang" data-price="ab 60 €" data-setting-price="price_damen_lang">ab 60 €<');
html = html.replace('data-service="Trockenschnitt Damen" data-price="ab 40 €">ab 40 €<', 'data-service="Trockenschnitt Damen" data-price="ab 40 €" data-setting-price="price_damen_trocken">ab 40 €<');
html = html.replace('data-service="Waschen & Stylen" data-price="ab 40 €">ab 40 €<', 'data-service="Waschen & Stylen" data-price="ab 40 €" data-setting-price="price_damen_styling">ab 40 €<');

html = html.replace('data-service="Ansatzfärbung" data-price="ab 50 €">ab 50 €<', 'data-service="Ansatzfärbung" data-price="ab 50 €" data-setting-price="price_farbe_ansatz">ab 50 €<');
html = html.replace('data-service="Tönung / Glossing" data-price="ab 50 €">ab 50 €<', 'data-service="Tönung / Glossing" data-price="ab 50 €" data-setting-price="price_farbe_glossing">ab 50 €<');
html = html.replace('data-service="Komplettfärbung" data-price="ab 55 €">ab 55 €<', 'data-service="Komplettfärbung" data-price="ab 55 €" data-setting-price="price_farbe_komplett">ab 55 €<');
html = html.replace('data-service="Strähnen inkl. Glossing" data-price="ab 150 €">ab 150 €<', 'data-service="Strähnen inkl. Glossing" data-price="ab 150 €" data-setting-price="price_farbe_straehnen">ab 150 €<');
html = html.replace('data-service="Balayage / AirTouch" data-price="ab 150 €">ab 150 €<', 'data-service="Balayage / AirTouch" data-price="ab 150 €" data-setting-price="price_farbe_balayage">ab 150 €<');

html = html.replace('data-service="Herren Haarschnitt trocken" data-price="28 €">28 €<', 'data-service="Herren Haarschnitt trocken" data-price="28 €" data-setting-price="price_herren_trocken">28 €<');
html = html.replace('data-service="Herren Waschen / Schneiden / Styling" data-price="35 €">35 €<', 'data-service="Herren Waschen / Schneiden / Styling" data-price="35 €" data-setting-price="price_herren_waschen_schneiden">35 €<');

html = html.replace('data-service="Intensive Pflege" data-price="25 €">25 €<', 'data-service="Intensive Pflege" data-price="25 €" data-setting-price="price_extra_pflege">25 €<');
html = html.replace('data-service="Kopfhautmassage" data-price="15 €">15 €<', 'data-service="Kopfhautmassage" data-price="15 €" data-setting-price="price_extra_kopfhaut">15 €<');
html = html.replace('data-service="Kinderhaarschnitt" data-price="20 €">20 €<', 'data-service="Kinderhaarschnitt" data-price="20 €" data-setting-price="price_extra_kinder">20 €<');
html = html.replace('data-service="Augenbrauen zupfen / färben" data-price="10 €">10 €<', 'data-service="Augenbrauen zupfen / färben" data-price="10 €" data-setting-price="price_extra_augenbrauen">10 €<');
html = html.replace('data-service="Wimpern färben" data-price="15 €">15 €<', 'data-service="Wimpern färben" data-price="15 €" data-setting-price="price_extra_wimpern">15 €<');

// Inject fetch script at the end of body
if (!html.includes('applyLiveSettings')) {
  const scriptInjection = `
  <script>
    async function applyLiveSettings() {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        
        // Update images
        document.querySelectorAll('[data-setting-img]').forEach(el => {
          const key = el.getAttribute('data-setting-img');
          if (data[key] && data[key].value) {
            el.src = data[key].value;
          }
        });

        // Update prices
        document.querySelectorAll('[data-setting-price]').forEach(el => {
          const key = el.getAttribute('data-setting-price');
          if (data[key] && data[key].value) {
            el.textContent = data[key].value;
            el.setAttribute('data-price', data[key].value);
          }
        });
      } catch (e) {
        console.error('Failed to load settings', e);
      }
    }
    applyLiveSettings();
  </script>
</body>
`;
  html = html.replace('</body>', scriptInjection);
}

fs.writeFileSync('index.html', html);
console.log('index.html updated successfully.');
