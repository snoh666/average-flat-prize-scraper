const fs = require('fs');

const getClearSurety = string => {
  console.log(Number(string));
};

fs.readFile('result.json', 'utf-8', (err, response) => {
  if (err) throw err;

  const data = JSON.parse(response);

  console.log(data.surety.length + data.noSurety.length);

  const getAverageSurety = (array) => {
    const sum = 0;
    const { length } = array;

    array.forEach(item => {
      console.log(getClearSurety(item.surety));
    });
  };

  getAverageSurety(data.surety);
});