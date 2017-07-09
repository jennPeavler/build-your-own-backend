const data = require('../../../Data/dataCleaner');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../../knexfile')[environment];
const database = require('knex')(configuration);

const countryData = data.countryData;
const malnutritionData = data.malnutritionData;

const countriesData = (knex) => {
  return countryData.map((country) => {
    const { name, iso_code, region, income_group } = country;
    return knex('countries').insert({
      name,
      iso_code,
      region,
      income_group,
    });
  });
};

const malnutritionsData = (knex) => {
  return malnutritionData.map((dataPoint) => {
    const { country_name,
            year,
            under_5_population,
            sample_size,
            severe_wasting,
            wasting,
            overweight,
            stunting,
            underweight } = dataPoint;
    return knex('yearly_malnutrition_data').insert({
      country_name,
      year,
      under_5_population,
      sample_size,
      severe_wasting,
      wasting,
      overweight,
      stunting,
      underweight,
    });
  });
};

exports.seed = (knex, Promise) => {
  return knex('countries').del()
    .then(() => {
      const countries = countriesData(knex);
      const malnutrition = malnutritionsData(knex);
      return Promise.all([...countries, ...malnutrition]);
    });
};
