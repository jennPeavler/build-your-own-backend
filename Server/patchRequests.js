const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

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
  patchCountry,
  patchMalnutritionData,
};
