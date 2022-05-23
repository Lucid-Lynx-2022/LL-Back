const express = require('express');
const config = require('./config');
const app = express();
const cors = require('cors');

const PublicsRouter = require('./api/publics');

require('mongoose').connect(config.database.db_uri,
    {
        useNewUrlParser:true, 
        useUnifiedTopology:true,
        autoIndex:true
    },(err) =>{
        if(err){
            console.log("ERROR EN LA CONEXION");
        }else {
            console.log("CONECTADO A LA DB");
        }
    })

app.use(cors());
app.use(express.json());
app.use('/publics', PublicsRouter);

app.listen(config.port, config.host, function () {
    console.log(`(if local) App listening on http://localhost:${config.port}`);
  });
