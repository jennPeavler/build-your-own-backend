const express = require('express');
const api = require('./api');

const router = express.Router();

router.get('/countries', api.getOneResource);
router.get('/malnutrition_data', api.getOneResource);
router.get('/countries/malnutrition_data/:name', api.getCountryMalnutritionData);
router.get('/yearly/malnutrition_data/:year', api.getYearlyMalnutritionData);

router.post('/countries', api.postNewCountry);
router.post('/malnutrition_data', api.postNewMalnutritionData);

router.patch('/countries/:name', api.patchCountry);
router.patch('/malnutrition_data/:country_name/:year', api.patchMalnutritionData);


module.exports = router;
