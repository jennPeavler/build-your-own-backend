const express = require('express');
const app = express();
const path = require('path');
const router = require('./router');
const bodyParser = require('body-parser');
const api = require('./api');
const port = (process.env.PORT || 3000);


app.use(bodyParser.json());

app.use('/assets', express.static(path.join(__dirname, '../client/assets/')));

app.use('/api/v1', router);

app.listen(port, () => {
  console.log('BYOB server listening on port ' + `${port}!`);
})

module.exports = app;
