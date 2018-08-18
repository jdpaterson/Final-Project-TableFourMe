const serv = require('./serv-helpers.js');
const { countClients, broadcastResos } = require('./socket-helpers.js');

// create empty objects to store socket client id and url
// from which requests were made. save admin data in a separate object
const clients = {}, admins = {};

module.exports = function setSocketServer(io, db) {
  // HANDLE SOCKET CONNECTION
  return io.on('connection', socket => {
    console.log(`${countClients(io)} CLIENT(S) CONNECTED`);

    // HANDLE SOCKET DISCONNECTION
    socket.on('disconnect', () => {
      console.log(`${countClients(io)} CLIENT(S) CONNECTED`);
    });

    // KEEP TRACK OF WEBSOCKET CLIENT ID AND FROM WHICH WHERE THEY CAME FROM
    // deconstruct socket object and save id and (referer without origin)
    const { id, request: { headers: { host } } } = socket;

    // if client is admin, save id and to "admin"
    if (host.search('admin') !== -1) {
      admins[id] = { id };
    } else {
      // otherwise save it to "clients"
      clients[id] = { id };
    }

    // LOAD INITIAL RESERVATIONS
    socket.on('getReservations', () => {
      serv.getAllReservations(db)
        .then(data => { io.emit('loadReservations', data); })
        .catch(err => console.log(err));
    })

    socket.on('getReservationByResCode', data => {
      serv.getReservationByResCode(db, data)
        .then(data => { io.emit('loadReservation', data); })
        .catch(err => { console.log(err) });
    })

    socket.on('getReservationByResCodeWithOrder', data => {
      serv.getReservationByResCodeWithOrder(db, data)
        .then(data => {
          io.emit('loadReservationWOrder', data)
        })
    })

    socket.on('getCustomerByResCode', data => {
      serv.getReservationByResCode(db, data)
        .then(reso => serv.getCustomerByReservation(db, reso))
        .then(custo => { io.emit('loadCustomer', custo); })
        .catch(err => { console.log(err) });
    })

    /// GET MENU
    socket.on('getMenu', () => {
      serv.getMenu(db)
        .then(menu => {
          //Specify which socket if necessary
          io.emit('returnedMenu', menu);
        })
        .catch(err => { console.log(err) });
    })

    // SUBMIT NEW RESERVATION
    socket.on('submitReservation', formData => {
      serv.submitNewReservation(db, formData)
        .then(data => {
          // CHECK WHO SUBMITTED A FORM
          const fromAdmin = Object.keys(admins).includes(socket.id);
          // IF CUSTOMER SUBMITS A FORM,
          // BROADCAST NEW RESERVATION TO THE SENDER AND ALL ADMINS (LAST PARAM => FALSE)
          // IF ADMIN SUBMITS A FORM, BROADCAST NEW RESERVATION TO EVERYBODY (LAST PARAM => TRUE)
          broadcastResos(io, socket, 'loadNewReservation', data, admins, fromAdmin);
        })
        .catch(err => { console.log(err) });
    })

    // UPDATE EXISTING RESERVATION
    socket.on('updateReservation', formData => {
      serv.updateReservation(db, formData)
        .then(data => {
          broadcastResos(io, socket, 'loadChangedReservation', data, admins, false);
        })
        .catch(err => console.log(err));
    });

    // CANCEL RESERVATION
    socket.on('cancelReservation', formData => {
      serv.cancelReservation(db, formData)
        .then(data => {
          broadcastResos(io, socket, 'removeCancelledReservation', data, admins, false);
        });
    })

    // UPDATE RESERVATION STATUS BY ADMIN
    socket.on('updateReservationStatus', status => {
      serv.updateReservationStatus(db, status)
        .then(data => { io.emit('changeReservationStatus', data); })
        .catch(err => console.log(err));
    })

    socket.on('getAllMenuItemOrders', status => {
      serv.getAllMenuItemOrders(db)
        .then(data => { io.emit('AllMenuItemOrders', data); })
        .catch(err => console.log(err));
    })

    socket.on('getItemOrdersWMenuItemInfo', status => {
      serv.getItemOrdersWMenuItemInfo(db)
        .then(data => { io.to(socket.id).emit('ItemOrdersWMenuItemInfo', data) })
        .catch(err => console.log(err));
    })

    socket.on('getItemOrdersWMenuItemByResCode', status => {
      serv.getItemOrdersWMenuItemByResCode(db, status)
        .then(data => { io.to(socket.id).emit('itemOrdersWMenuItemByResCode', data) })
        .catch(err => console.log(err));
    })

    socket.on('removeOrderItem', orderItem => {
      serv.removeOrderItem(db, orderItem)
        .then(deletedOrderItem => {
          io.emit('deletedOrderItem', deletedOrderItem);
        })
    })

    socket.on('addItemToOrder', status => {
      serv.addItemOrderWMenuItem(db, status)
        .then(data => { io.to(socket.id).emit('newOrderAdded', data); })
        .catch(err => console.log(err));
    })

    socket.on('placeOrder', order => {
      serv.updateOrderStatus(db, order)
        .then(data => {
          broadcastResos(io, socket, 'orderPlaced', data, admins, false);
        })
        .catch(err => { console.log(err) })
    })


    socket.on("cancelOrder", order => {
      serv.cancelOrder(db, order)
        .then(data => {
          broadcastResos(io, socket, 'orderCancelled', data, admins, false);
        })
        .catch(err => { console.log(err) })
    })


  })
};
