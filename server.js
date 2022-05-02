const express = require('express');
const config = require('./config');


const app = express();

const PublicsRouter = require('./api/publics');

app.use(express.json());
app.use('/publics', PublicsRouter);

app.listen(config.port, config.host, function () {
    console.log(`(if local) App listening on http://${config.host}:${config.port}`);
  });