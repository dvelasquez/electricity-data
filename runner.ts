import puppeteer from 'puppeteer';
import fs from 'fs';

const pscd = process.env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD;
const puppeteerOptions = pscd ? {
  executablePath: process.env.PUPPETEER_EXEC_PATH,
  headless: false,
  args: [
    `--no-sandbox`,
  ]
} : {headless: false};

const createFileName = () => {
  const cd = new Date();
  return `${cd.getDate()}-${cd.getMonth() + 1}-${cd.getFullYear()}--${cd.getHours()}`;
}

(async () => {
  const browser = await puppeteer.launch(puppeteerOptions);
  const page = await browser.newPage();
  await page.goto('https://www.electricitymap.org/map');
  await page.reload({waitUntil: 'domcontentloaded'});

  page.on('response', async response => {
    if (response.url().includes('/v3/state')) {
      const resp = await response.json();

      await fs.promises.writeFile(`api-response/${createFileName()}.json`, JSON.stringify(resp), 'utf-8')
      await browser.close();
      process.exit(0);
    }
  })
})();
