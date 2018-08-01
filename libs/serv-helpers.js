const twilio = require('twilio');
const smsMsg = require('../routes/api/sms.js');
const rs = require('random-strings');

// LOAD ALL RESERVATIONS
function getAllReservations(db) {
  const qItems = 'reservations.id, email, group_size, name, phone, placement_time, res_code, order_id, status';
  const q = `SELECT ${qItems} FROM reservations JOIN customers ON customer_id = customers.id WHERE status = 'waiting' ORDER BY placement_time ASC`;
  console.log(q);
  return db.query(q)
    .then(data => {      
      return data;
    })
    .catch(err => { console.log(err); })
}
// LOAD ALL RESERVATIONS - END

// SUBMIT NEW RESERVATION
// save customer data
const saveCustomer = (db, customerData) => {
  return new Promise((resolve, reject) => {
    db.customers.save(customerData)
      .then(result => { resolve(result); })
      .catch(err => { reject(err); })
  });
};

// save reservation data
const saveReservation = (db, reservationData) => {
  return new Promise((resolve, reject) => {
    db.reservations.save(reservationData)
      .then(result => { resolve(result); })
      .catch(err => { reject(err); })
  })
};

const submitNewReservation = async (db, formData) => {
  // deconstruct form data
  const { name, phone, group_size, email } = formData;
  // save new customer data
  const customer = await saveCustomer(db, { name, phone, email });

  // save new reservation
  const reservationData = {
    placement_time: new Date(),
    status: 'waiting',
    customer_id: customer.id,
    res_code: rs.alphaNumUpper(6),
    group_size
  }
  const reservation = await saveReservation(db, reservationData);
  reservation.host = formData.host;

  // text the reservation data
  smsMsg.resoTextMsg(phone, reservation);
  return { ...customer, ...reservation };
}
// SUBMIT NEW RESERVATION - END

// UPDATE EXISTING RESERVATION
// find reservation data
const findReservation = (db, param) => {
  const paramKey = Object.keys(param)[0];
  return new Promise((resolve, reject) => {
    db.reservations.find({ [paramKey]: param.res_code })
      .then(result => { resolve(result); })
      .catch(err => { reject(err); })
  });
};
const updateReservation = async (db, formData) => {
  // deconstruct form data
  const { name, phone, group_size, email, res_code } = formData;
  // find the reservation record
  const reservationRecord = await findReservation(db, { res_code });

  // update customer data
  const { id, customer_id } = reservationRecord[0];
  const customerData = { id: customer_id, name, phone, email };
  const customer = await saveCustomer(db, customerData);

  // update reservation data
  const reservationData = { id, group_size };
  const reservation = await saveReservation(db, reservationData);

  return { ...customer, ...reservation };
}
// UPDATE EXISTING RESERVATION - END

// CANCEL RESERVATION
// remove existing reservation data
const cancelReservation = async (db, formData) => {
  const { res_code } = formData;
  // find reservation
  const reservationRecord = await findReservation(db, { res_code });
  const { id } = reservationRecord[0];
  // change the status to 'cancelled'
  const reservationData = { id, status: 'cancelled' };
  const reservation = await saveReservation(db, reservationData);

  return reservation;
}
// CANCEL RESERVATION - END




function getAllMenuItemOrders(db) {
  return db.menu_items_orders.find()
    .then(data => {
      return data;
    })
    .catch(err => {
      console.log(err)
    })
}

function getItemOrdersWMenuItemInfo(db) {
  let qStr =
    `SELECT menu_items_orders.id, img_url, menu_item_id, order_id, name, description, price, category_id
    FROM menu_items_orders
    INNER JOIN menu_items
    ON menu_items_orders.menu_item_id = menu_items.id`;

  return db.query(qStr)
    .then(data => {
      return data;
    })
    .catch(err => {
      console.log(err);
    })
}

function addItemToOrder(db, menuItemOrder) {
  db.menu_items_orders.insert({
    menu_item_id: menuItemOrder.menuItemId,
    order_id: menuItemOrder.order_id
  })
    .then((data) => {
      return data;
    })
    .catch(err => {
      console.log(err);
    })
}

module.exports = {
  getAllReservations,
  submitNewReservation,
  updateReservation,
  cancelReservation,
  getAllMenuItemOrders,
  getItemOrdersWMenuItemInfo
}
