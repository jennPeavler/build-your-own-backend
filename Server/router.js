const express = require('express');
const api = require('./api');
const checkAuth = require('./checkAuth');

const router = express.Router();

router.get('/countries', api.getOneResource);
router.get('/malnutrition_data', api.getOneResource);
router.get('/countries/malnutrition_data/:name', api.getCountryMalnutritionData);
router.get('/yearly/malnutrition_data/:year', api.getYearlyMalnutritionData);

router.post('/countries', checkAuth, api.postNewCountry);
router.post('/malnutrition_data', checkAuth, api.postNewMalnutritionData);

router.patch('/countries/:name', checkAuth, api.patchCountry);
router.patch('/malnutrition_data/:country_name/:year', checkAuth, api.patchMalnutritionData);


module.exports = router;
