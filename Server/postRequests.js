const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

const postNewCountry = (req, res) => {
  const { name, iso_code, region, income_group } = req.body;
  database('countries').insert({ name, iso_code, region, income_group }, 'id')
  .then((countryIndex) => {
    countryIndex.length ? res.status(201).send('Country recorded in table')
    : res.status(422).send('Unable to record country into table, check if data entered into every column and every column exist in table');
  })
  .catch(error => res.status(500).send(error));
};

const postNewMalnutritionData = (req, res) => {
  const { country_name,
          year,
          under_5_population,
          sample_size,
          severe_wasting,
          wasting,
          overweight,
          stunting,
          underweight } = req.body;

  database('malnutrition_data').insert(
    { country_name,
      year,
      under_5_population,
      sample_size,
      severe_wasting,
      wasting,
      overweight,
      stunting,
      underweight }, 'id')
  .then((dataIndex) => {
    dataIndex.length ? res.status(201).send('Malnutrition data recorded in database')
    : res.status(422).send('Unable to record malnutrition data into database, check if the data column exists');
  })
  .catch(error => res.status(500).send(error));
};

module.exports = {
  postNewCountry,
  postNewMalnutritionData,
};
