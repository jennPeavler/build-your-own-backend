const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

const deleteCountry = (req, res) => {
  const { name } = req.params;

  database('countries').where('name', name).select()
  .then((country) => {
    !country.length ? res.status(404).send('No country by that name')
    : database('countries').where('name', name).del()
    .then(() => {
      res.status(204).send(`${name} data was deleted from the records`);
    });
  })
  .catch(error => res.status(500).send(error));
};

const deleteMalnutritionData = (req, res) => {
  const { country_name, year } = req.params;

  database('malnutrition_data').where({ country_name, year }).select()
  .then((dataPoint) => {
    !dataPoint.length ? res.status(404).send(`No data was found for ${country_name} in ${year}`)
    : database('malnutrition_data').where({ country_name, year }).del()
    .then(() => {
      res.status(204).send(`The data point found for ${country_name} in ${year} was deleted`);
    });
  })
  .catch(error => res.status(500).send(error));
};

module.exports = {
  deleteCountry,
  deleteMalnutritionData,
};
