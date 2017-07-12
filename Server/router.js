const express = require('express');
const getRequests = require('./getRequests');
const postRequests = require('./postRequests');
const patchRequests = require('./patchRequests');
const checkAuth = require('./checkAuth');

const router = express.Router();

router.get('/countries', getRequests.getOneResource);
router.get('/malnutrition_data', getRequests.getOneResource);
router.get('/countries/malnutrition_data/:name', getRequests.getCountryMalnutritionData);
router.get('/yearly/malnutrition_data/:year', getRequests.getYearlyMalnutritionData);

router.post('/countries', checkAuth, postRequests.postNewCountry);
router.post('/malnutrition_data', checkAuth, postRequests.postNewMalnutritionData);

router.patch('/countries/:name', checkAuth, patchRequests.patchCountry);
router.patch('/malnutrition_data/:country_name/:year', checkAuth, patchRequests.patchMalnutritionData);


module.exports = router;
