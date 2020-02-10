const fs = require('fs');

const regex = /[-]{0,1}[\d]*[.]{0,1}[\d]+/g;

fs.readFile('result.json', 'utf-8', (err, response) => {
  if (err) throw err;

  const data = JSON.parse(response);

  const getAverage = (array) => {
    let sum = 0;
    const { length } = array;

    array.forEach(item => {
      const intValue = Number(item.match(regex).join(''));
      sum += intValue;
    });

    return sum / length;
  };

  let combined = [...data.surety].map(item => item.surety);
  combined = [...combined, ...data.noSurety.map(item => item.prize)];

  console.log('Avereage surety: ', getAverage([...data.surety].map(item => item.surety)));
  console.log('Average prize of room with surety: ', getAverage([...data.surety].map(item => item.prize)));
  console.log('Average prize wuthout surety: ', getAverage([...data.noSurety].map(item => item.prize)));
  console.log('Combined avreage prize: ', getAverage(combined));
});