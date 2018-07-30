const express = require('express');
const apiRouter = express.Router();
// const msg = require("./sms.js");
const rs = require('random-strings');

module.exports = function (db) {

  // initial loading of all reservation records
  apiRouter.get('/reservations', (req, res) => {
    // query string
    const qItems = 'reservations.id, email, group_size, name, phone, placement_time, res_code, order_id, status';
    const q = `SELECT ${qItems} FROM reservations JOIN customers ON customer_id = customers.id ORDER BY placement_time ASC`;

    db.query(q)
      .then(result => {
        res.status(200).json(result);
      })
      .then(err => {
        // res.status(500).send({ error: 'Error while retrieving all reservation data' });
        // console.log(err.stack);
      })
  })

  apiRouter.post('/reservations/:res_id', (req, res) => {
    res.send('Cancel a reservation.');
  })
  apiRouter.patch('/reservations', (req, res) => {
    res.send('Patch me up!');
  })
  apiRouter.get('/reservations/:res_id/orders', (req, res) => {
    res.send('All orders associated with a reservation');
  })
  apiRouter.patch('/reservations/:res_id/orders/:order_id', (req, res) => {
    res.send('Update the order');
  })
  apiRouter.get('/categories/:cat_id/menu_items', (req, res) => {
    res.send('Return a list of all menu items associated with a category');
  })
  apiRouter.post('/orders/:order_id', (req, res) => {
    db.menu_items_orders.insert({
      menu_item_id: req.body.id,
      order_id: req.params.order_id
    })
      .then((menuItemOrder) => {
        console.log(menuItemOrder);
        res.json(menuItemOrder);
      })
  });
  apiRouter.get('/menu_items', (req, res) => {
    db.menu_items.find()
      .then((menu_items) => {
        res.status(200).json(menu_items);
      })
  })

  ///////////route for sms functionality/////////
  apiRouter.get('/customers/:cust_id', (req, res) => {
    db.customers.find(req.params.cust_id)
    .then((cust) => {
      res.status(200).json(cust);
    })
  })

  // console.log('test');

  // get the massiveJS instance saved in app object
  // console.log(db);
  return apiRouter;

};
