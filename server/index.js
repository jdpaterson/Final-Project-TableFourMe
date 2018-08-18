require('dotenv').config();

const path = require('path');
const bodyParser = require('body-parser');
const setSocketServer = require('../libs/serv-sock-setters.js');
//PORT for Express Server, Sockets will use the same server and port
const PORT = process.env.PORT || 3001;
const ENV = process.env.NODE_ENV || 'development';

const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io').listen(server);

const massive = require('massive');
const connectionString = process.env.DATABASE_URL;

// SPECIFY WHERE ALL STATIC FILES ARE
app.use(express.static(path.join(__dirname + '/../build')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


massive(connectionString)
  .then(db => {
    console.log('Connection to PSQL established.');
    // SOCKET SERVER FUNCTIONS
    setSocketServer(io, db);
    const apiRoutes = require('../routes/api/index')(db);
    app.use('/api', apiRoutes);
    // EXPRESS IS FOR API ROUTES ONLY. FOR ALL OTHER ROUTES SHOULD SEND index.html BACK TO CLIENT
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname + '/../build/index.html'));
    });
    server.listen(PORT, () => {
      console.log(`Express server listening on port ${PORT} in ${ENV} mode.`);
    });

  })
  .catch(err => {
    console.log(err.stack);
  });
