const fs = require('fs');
const puppeteer = require('puppeteer');

( async () => {

  // Setup vars --------------------------------------
  const resultObject = {
    surety: [],
    noSurety: []
  };

  const pageURL = 'https://www.otodom.pl/wynajem/mieszkanie/wroclaw/?search%5Bfilter_enum_rooms_num%5D%5B0%5D=1&search%5Bfilter_enum_rooms_num%5D%5B1%5D=2&search%5Bregion_id%5D=1&search%5Bsubregion_id%5D=381&search%5Bcity_id%5D=39';
  const options = {
    rent: true, // False means 'buy'
    buildingType: 'Mieszkanie', // Mieszkanie || Dom || Działka || Lokal Użytkowy || Budynek użytkowy
    location: 'Wrocław',
    price: { // Price is in PLN
      from: 0,
      to: 2000
    },
  };

  const puppeteerSelectors = {
    rent: '#adTypeAlias',
    buildingType: '#categoryAliasSingle',
    location: '#idCityQuarterTip',
    submit: '#searchSubmitWrapper > input'
  };
  let mainTilesArray = [];

  // end of setup vars -------------------------------------


  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();

  await page.setViewport({width: 1920, height: 1080});
  await page.goto(pageURL);

  const flatTiles = await page.evaluate(() => {

    const tiles = document.querySelectorAll('article.offer-item');
    let justTilesArr = [];

    tiles.forEach(tile => {
      justTilesArr = [...justTilesArr, tile.getAttribute('data-url') ];
    });

    return Promise.resolve(justTilesArr);

  });

  await console.log(mainTilesArray = [...flatTiles]);

  // Loop throught each tile

  for (const link of mainTilesArray) {
    await page.goto(link);

    const getProps = await page.evaluate(() => {
      const title = document.querySelector('#root > article > header > div.css-1jiadof > div > div > h1').innerHTML;
      const prize = document.querySelector('#root > article > header > div.css-s3teq > div.css-b87h9q > div.css-1vr19r7').innerHTML.split('<!-- -->')[0];

      const description = document.querySelectorAll('#root > article > div.css-8inkwz > div.css-1jyf3vz > section.section-overview > div > ul > li');
      const descriptionListItems = [...description].map( element => {
        if (element.innerHTML.includes('Kaucja')) {
          return element.querySelector('strong').innerHTML
        }

        return false;
      } );

        const surety = [...descriptionListItems].filter(item => item);

      
      return {
        title: title,
        prize: prize,
        surety: surety ? String(surety) : false
      };
    });

    const props = getProps;
    props.linkPage = link;

    if (!props.surety) {
      await resultObject.noSurety.push(props)
    } else {
      await resultObject.surety.push(props)
    }

    await console.log(resultObject);
  }

  

  // await fs.writeFile('result.json', JSON.stringify(resultObject), (err) => {
  //   if (err) throw err;
  //   console.log('The file has been saved!');
  // });

} )();

// article.offer-item
// #root > article > div.css-8inkwz > div.css-1jyf3vz > section.section-overview > div > ul > li