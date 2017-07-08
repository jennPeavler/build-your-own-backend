const fs = require('fs');
const csv = require('csvtojson');

const convertCsvToTextFile = (path, data) => {
  fs.writeFile(path, JSON.stringify(data, null, 2), (err) => {
    if (err) {
      console.error('Error:', err.message);
    } else {
      console.log(`Successful Write to ${path}`);
    }
  });
};

csv().fromFile('./RawData/child_malnutrition.csv')
  .on('end_parsed', (jsonArrObj) => {
    return convertCsvToTextFile('./CleanData/child_malnutrition.txt', jsonArrObj);
  })
  .on('error', (err) => {
    console.log('Error while converting child_malnutrition.csv to txt file');
    console.log(err);
  })
  .on('done', () => {
    console.log('child_malnutrition.csv converted to text file');
  });
