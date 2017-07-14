const environment = process.env.NODE_ENV || 'test';
const configuration = require('../../../knexfile')[environment];
const database = require('knex')(configuration);

const countryData = [
  { id: 1, name: 'SMELAND', iso_code: 'SME', region: 'jungleland', income_group: 'no-money' },
  { id: 2, name: 'YUVALAND', iso_code: 'YUV', region: 'coconut-trees', income_group: 'rich' },
  { id: 3, name: 'DEXLAND', iso_code: 'DEX', region: 'bushes', income_group: 'bones' },
];

const countriesData = (knex) => {
  return countryData.map((country) => {
    const { id, name, iso_code, region, income_group } = country;
    return knex('countries').insert({
      id,
      name,
      iso_code,
      region,
      income_group,
    });
  });
};

const malnutritionData = [
  { id: 1, country_name: 'SMELAND', year: '1980', under_5_population: '3000', sample_size: '300', severe_wasting: '30', wasting: '3', overweight: '10', stunting: '20', underweight: '30' },
  { id: 2, country_name: 'YUVALAND', year: '1984', under_5_population: '9000', sample_size: '900', severe_wasting: '90', wasting: '9', overweight: '90', stunting: '90', underweight: '90' },
  { id: 3, country_name: 'DEXLAND', year: '2017', under_5_population: '6000', sample_size: '600', severe_wasting: '60', wasting: '6', overweight: '60', stunting: '60', underweight: '60' },
];

const malnutritionsData = (knex) => {
  return malnutritionData.map((dataPoint) => {
    const { id,
            country_name,
            year,
            under_5_population,
            sample_size,
            severe_wasting,
            wasting,
            overweight,
            stunting,
            underweight } = dataPoint;
    return knex('malnutrition_data').insert({
      id,
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
    .then(() => knex('malnutrition_data').del())
    .then(() => {
      const countries = countriesData(knex);
      const malnutrition = malnutritionsData(knex);
      return Promise.all([...countries, ...malnutrition]);
    });
};
