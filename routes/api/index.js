const express = require('express');
const apiRouter = express.Router();
const serv = require('../../libs/serv-helpers');

module.exports = function (db) {

  apiRouter.get('/reservations', (req, res) => {
    serv.getAllReservations(db)
    .then(data => {
        res.status(200).json(data);
    })
  })

  apiRouter.get('/menu_items_orders', (req, res) => {
    serv.getAllMenuItemOrders(db)
    .then(data => {
      res.json(data);
    })
  })

  apiRouter.get('/menu_items_orders/menu_items', (req, res) =>{
    serv.getItemOrdersWMenuItemInfo(db)
    .then(data => {
      res.json(data);
    })
  })

  apiRouter.post('/orders/:order_id', (req, res) => {

    const menuItemOrder = {
      menu_item_id: req.body.id,
      order_id: req.params.order_id
    }

    return serv.addItemToOrder(menuItemOrder)
      .then(menuItemOrder => {
         res.json(menuItemOrder);
       })
      .catch(err => {
        console.log(err);
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
  apiRouter.get('/orders/:order_id/menu_items', (req, res) => {
    return serv.getAllMenuItemOrders(db);
  })

  // NOTE: should be extracted into separate route
  apiRouter.post('/orders/:order_id', (req, res) => {
    db.menu_items_orders.insert({
      menu_item_id: req.body.id,
      order_id: req.params.order_id
    })
      // .then((menuItemOrder) => {
      //res.json(menuItemOrder);
      //})
      .then((newReference) => {
        return db.menu_items.findOne(newReference.menu_item_id);
      })
      .then((menu_item) => {
        // returns the new menu item
        res.status(200).json(menu_item);
      });
  });

  apiRouter.get('/menu_items', (req, res) => {
    db.menu_items.find()
      .then((menu_items) => {
        res.status(200).json(menu_items);
      })
      .catch(err => {
        console.log('NEW ERROR! ', err);
      })
  });
  apiRouter.get('/menu_items/:item_id', (req, res) => {
    db.menu_items.findOne(req.params.item_id)
      .then((menu_item) => {
        res.status(200).json(menu_item);
      });
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

//FROM OLD /reservations query
/*const qItems = 'reservations.id, email, group_size, name, phone, placement_time, res_code, order_id, status';
const q = `SELECT ${qItems} FROM reservations JOIN customers ON customer_id = customers.id ORDER BY placement_time ASC`;

db.query(q)
  .then(result => {
    res.status(200).json(result);
  })
  .then(err => {
    // res.status(500).send({ error: 'Error while retrieving all reservation data' });
    // console.log(err.stack);
  })*/
