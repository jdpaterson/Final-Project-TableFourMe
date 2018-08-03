require('dotenv').config();
const bodyParser = require('body-parser');
const serv = require('../libs/serv-helpers.js');

//PORT for Express Server, Sockets will use the same server and port
const PORT = process.env.PORT || 3001;
const ENV = process.env.NODE_ENV || 'development';

const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const massive = require('massive');
const connectionString = process.env.DATABASE_URL;
const countClients = ws => Object.keys(ws.sockets.connected).length;

app.use(express.static(__dirname + '/build'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

massive(connectionString)
  .then(db => {
    console.log('Connection to PSQL established.');
    const apiRoutes = require('../routes/api/index')(db);
    app.use('/api', apiRoutes);

    // create empty objects to store socket client id and url
    // from which requests were made. save admin data in a separate object
    const clients = {}, admin = {};

    // HANDLE CONNECTION
    io.on('connection', socket => {
      console.log(`${countClients(io)} CLIENT(S) CONNECTED`);

      // deconstruct socket object and save id and path (referer without origin)
      const { id, request: { headers: { origin, referer } } } = socket;
      const path = referer.replace(origin, '');
      // if client is admin, save id and path to "admin"
      if (path === '/admin') {
        admin[id] = { id, path };
      } else {
        // otherwise save it to "clients"
        clients[id] = { id, path };
      }

      // console.log('admin', admin);
      // console.log(clients);

      // HANDLE DISCONNECTION
      socket.on('disconnect', () => {
        console.log(`${countClients(io)} CLIENT(S) CONNECTED`);
      });

      // LOAD INITIAL RESERVATIONS
      socket.on('getReservations', () => {
        serv.getAllReservations(db)
          .then(data => { io.emit('loadReservations', data); })
      })

      // SUBMIT NEW RESERVATION
      socket.on('submitReservation', formData => {
        // console.log('path', socket.);
        serv.submitNewReservation(db, formData)
          .then(data => {
            // if sender is admin, broadcast message to all clients including the sender
            if (Object.keys(admin).includes(socket.id)) {
              io.emit('loadNewReservation', data);
            } else {
              // otherwise, broadcast message to the original sender and admin(s)
              socket.emit('loadNewReservation', data);
              Object.keys(admin).forEach(adminId => {
                socket.broadcast.to(adminId).emit('loadNewReservation', data);
              })
            }
          });
      })

      // UPDATE EXISTING RESERVATION
      socket.on('updateReservation', formData => {
        serv.updateReservation(db, formData)
          .then(data => {
            // if sender is admin, broadcast message to all clients including the sender
            if (Object.keys(admin).includes(socket.id)) {
              io.emit('loadChangedReservation', data);
            } else {
              // otherwise, broadcast message to the original sender and admin(s)
              socket.emit('loadChangedReservation', data);
              Object.keys(admin).forEach(adminId => {
                socket.broadcast.to(adminId).emit('loadChangedReservation', data);
              })
            }
          });
      });

      // CANCEL RESERVATION
      socket.on('cancelReservation', formData => {
        serv.cancelReservation(db, formData)
          .then(data => {
            // if sender is admin, broadcast message to all clients including the sender
            if (Object.keys(admin).includes(socket.id)) {
              io.emit('removeCancelledReservation', data);
            } else {
              // otherwise, broadcast message to the original sender and admin(s)
              socket.emit('removeCancelledReservation', data);
              Object.keys(admin).forEach(adminId => {
                socket.broadcast.to(adminId).emit('removeCancelledReservation', data);
              })
            }
          });
      })

      // UPDATE RESERVATION STATUS
      socket.on('updateReservationStatus', status => {
        serv.updateReservationStatus(db, status)
          .then(data => { io.emit('changeReservationStatus', data); });
      })


      socket.on('getAllMenuItemOrders', status => {
        serv.getAllMenuItemOrders(db)
          .then(data => {
            io.emit('AllMenuItemOrders', data);
          })
      })
      socket.on('getItemOrdersWMenuItemInfo', status => {
        serv.getItemOrdersWMenuItemInfo(db)
          .then(data => {
            io.emit('ItemOrdersWMenuItemInfo', data);
          })
      })
      socket.on('addItemToOrder', status => {
        serv.addItemOrderWMenuItem(db, status)
          .then(data => {
            io.emit('newOrderAdded', data);
          })
      })
    })
  })
  .catch(err => {
    console.log(err.stack);
  });

server.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT} in ${ENV} mode.`);
});
