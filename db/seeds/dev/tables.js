const data = require('../../../Data/dataCleaner');

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

exports.seed = (knex, Promise) => {
  return knex('countries').del()
    .then(() => {
      const countries = countriesData(knex);
      return Promise.all([...countries]);
    });
};
