const xlsxj = require('xlsx-to-json');
const malnutritionJsonArray = require('./CleanData/child-malnutrition.json');

xlsxj({
  input: './Data/RawData/child-malnutrition.xlsx',
  output: './Data/CleanData/child-malnutrition.json',
}, (err, result) => {
  if (err) {
    console.error(err);
  } else {
    console.log('Successfuly converted child-malnutrition.xlsx to json file');
  }
});

const headers = malnutritionJsonArray.shift();

const countryData = malnutritionJsonArray.reduce((countriesArr, dataPoint) => {
  const duplicate = countriesArr.some((o) => {
    return o.name === dataPoint['Country and areas'];
  });

  if (!duplicate) {
    const countryObj = {};
    countryObj.name = dataPoint['Country and areas'];
    countryObj.iso_code = dataPoint['ISO code'];
    countryObj.region = dataPoint[''];
    countryObj.income_group = dataPoint['World Bank'];
    countriesArr.push(countryObj);
  }
  return countriesArr;
}, []);

const malnutritionData = malnutritionJsonArray.reduce((malnutritionArr, dataPoint) => {
  const malnutritionObj = {};
  malnutritionObj.country_name = dataPoint['Country and areas'];
  malnutritionObj.year = dataPoint['Year*'];
  malnutritionObj.under_5_population = dataPoint['Under 5 population (000s)'];
  malnutritionObj.sample_size = dataPoint['Survey sample size (N)'];
  malnutritionObj.severe_wasting = dataPoint['Severe wasting'];
  malnutritionObj.wasting = dataPoint.Wasting;
  malnutritionObj.overweight = dataPoint.Overweight;
  malnutritionObj.stunting = dataPoint.Stunting;
  malnutritionObj.underweight = dataPoint.Underweight;
  malnutritionArr.push(malnutritionObj);
  return malnutritionArr;
}, []);

module.exports = { countryData, malnutritionData };
