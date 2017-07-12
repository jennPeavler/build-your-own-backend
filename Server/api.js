const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

const getOneResource = (req, res) => {
  const path = req.route.path.substring(1);
  // if (req.query) {
  //   console.log('hit req query');
  //   const filter = Object.keys(req.query);
  //   database(`${path}`).where({ [filter]: req.query[filter] }).select()
  //   .then((data) => {
  //     data.length ? res.status(200).json(data) : res.status(404).send('Data was not found');
  //   })
  //   .catch(error => res.status(500).send(error));
  // } else {
  database(`${path}`).select()
  .then((data) => {
    data.length ? res.status(200).json(data) : res.status(404).send('No data exists in this table');
  })
  .catch(error => res.status(500).send(error));
  // }
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

const patchCountry = (req, res) => {
  const { name } = req.params;
  const updates = Object.keys(req.body);

  if (!req.body.name) {
    updates.forEach((update) => {
      database('countries').where('name', name)
      .update({ [update]: req.body[update] })
      .then((data) => {
        data ? res.status(201).send('Data updated') : res.status(422).send('unable to update data');
      })
      .catch(error => res.status(500).send(error));
    });
  } else {
    database('countries').where('name', name)
    .update({ name: req.body.name })
    .then(() => {
      const index = updates.indexOf('name');

      updates.splice(index, 1);
      updates.forEach((update) => {
        database('countries').where('name', req.body.name)
        .update({ [update]: req.body[update] })
        .then((data) => {
          data ? res.status(201).send('Data updated') : res.status(422).send('unable to update data');
        });
      });
    })
    .catch(error => res.status(500).send(error));
  }
};

const patchMalnutritionData = (req, res) => {
  const { country_name, year } = req.params;
  const updates = Object.keys(req.body);
  if (!req.body.country_name && !req.body.year) {
    updates.forEach((update) => {
      database('malnutrition_data').where({ country_name, year })
      .update({ [update]: req.body[update] })
      .then((data) => {
        data ? res.status(201).send('Data updated') : res.status(422).send('unable to update data');
      })
      .catch(error => res.status(500).send(error));
    });
  } else if (req.body.country_name && !req.body.year) {
    database('malnutrition_data').where({ country_name, year })
    .update({ country_name: req.body.country_name })
    .then(() => {
      const index = updates.indexOf('country_name');

      updates.splice(index, 1);
      updates.forEach((update) => {
        database('malnutrition_data').where({ country_name: req.body.country_name, year })
        .update({ [update]: req.body[update] })
        .then((data) => {
          data ? res.status(201).send('Data updated') : res.status(422).send('unable to update data');
        });
      });
    })
    .catch(error => res.status(500).send(error));
  } else if (!req.body.country_name && req.body.year) {
    database('malnutrition_data').where({ country_name, year })
    .update({ year: req.body.year })
    .then(() => {
      const index = updates.indexOf('year');

      updates.splice(index, 1);
      updates.forEach((update) => {
        database('malnutrition_data').where({ country_name, year: req.body.year })
        .update({ [update]: req.body[update] })
        .then((data) => {
          data ? res.status(201).send('Data updated') : res.status(422).send('unable to update data');
        });
      });
    })
    .catch(error => res.status(500).send(error));
  } else {
    database('malnutrition_data').where({ country_name, year })
    .update({ country_name: req.body.country_name, year: req.body.year })
    .then(() => {
      let index = updates.indexOf('year');
      updates.splice(index, 1);
      index = updates.indexOf('country_Name');
      updates.splice(index, 1);

      updates.forEach((update) => {
        database('malnutrition_data').where({ country_name: req.body.country_name, year: req.body.year })
        .update({ [update]: req.body[update] })
        .then((data) => {
          data ? res.status(201).send('Data updated') : res.status(422).send('unable to update data');
        });
      });
    });
  }
};

module.exports = {
  getOneResource,
  getCountryMalnutritionData,
  getYearlyMalnutritionData,
  postNewCountry,
  postNewMalnutritionData,
  patchCountry,
  patchMalnutritionData,
};
