const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

const getOneResource = (req, res) => {
  const path = req.route.path.substring(1);
  const { region } = req.query;
  if (region) {
    database(`${path}`).where({ region }).select()
    .then((data) => {
      data.length ? res.status(200).json(data) : res.status(404).send('Data was not found');
    })
    .catch(error => res.status(500).send(error));
  } else {
    database(`${path}`).select()
    .then((data) => {
      data.length ? res.status(200).json(data) : res.status(404).send('No data exists in this table');
    })
    .catch(error => res.status(500).send(error));
  }
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

module.exports = {
  getOneResource,
  getCountryMalnutritionData,
  getYearlyMalnutritionData,
};
