import puppeteer from 'puppeteer';
import fs from 'fs/promises';

const createFileName = () => {
  const cd = new Date();
  return `${cd.getDate()}-${cd.getMonth()+1}-${cd.getFullYear()}--${cd.getHours()}`;
}

(async() =>{
  const browser = await puppeteer.launch({headless:false});
  const page = await browser.newPage();
  await page.goto('https://www.electricitymap.org/map');
  await page.reload({waitUntil: 'domcontentloaded'});

  page.on('response', async response => {
    if(response.url().includes('/v3/state')){
      const resp = await response.json();

      await fs.writeFile(`api-response/${createFileName()}.json`, JSON.stringify(resp), 'utf-8')
      await browser.close();
    }
  })
})();
