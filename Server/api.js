const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

const getOneResource = (req, res) => {
  const path = req.route.path.substring(1);
  database(`${path}`).select()
  .then((data) => {
    data.length ? res.status(200).json(data) : res.status(404).send('Data was not found');
  })
  .catch(error => res.status(500).send(error));
};

const getCountryMalnutritionData = (req, res) => {
  let { name } = req.params;
  name = name.toUpperCase();

  database('malnutrition_data').where('country_name', name).select()
  .then((data) => {
    data.length ? res.status(200).json(data) : res.status(404).send('No malnutrition data found for that country');
  })
  .catch(error => res.status(500).send(error));
};

const getYearlyMalnutritionData = (req, res) => {
  const { year } = req.params;

  database('malnutrition_data').where('year', year).select()
  .then((data) => {
    data.length ? res.status(200).json(data) : res.status(404).send('No malnutrition data found for that year');
  })
  .catch(error => res.status(500).send(error));
};

const postNewCountry = (req, res) => {
  const { name, iso_code, region, income_group } = req.body;
  database('countries').insert({ name, iso_code, region, income_group }, 'id')
  .then((countryIndex) => {
    countryIndex.length ? res.status(201).send('Country recorded in database')
    : res.status(422).send('Unable to record country into database, check if the data column exists');
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
          stunting,
          underweight } = req.body;

  database('malnutrition_data').insert(
    { country_name,
      year,
      under_5_population,
      sample_size,
      severe_wasting,
      wasting,
      stunting,
      underweight }, 'id')
  .then((dataIndex) => {
    dataIndex.length ? res.status(201).send('Malnutrition data recorded in database')
    : res.status(422).send('Unable to record malnutrition data into database, check if the data column exists');
  })
  .catch(error => res.status(500).send(error));
};

module.exports = {
  getOneResource,
  getCountryMalnutritionData,
  getYearlyMalnutritionData,
  postNewCountry,
  postNewMalnutritionData,
};
