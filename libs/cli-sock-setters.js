import * as formHelp from '../client/libs/form-helper-func.js';
import swal from 'sweetalert';

function setSocket(socket, react) {
  socket.on('connect', () => {
    console.log('Connected to websocket');
    let { res_code } = react.props;

    // LOAD ALL RESERVATIONS - DO NOT CHANGE
    socket.on('loadReservations', reservations => {
      let formData = {};
      let currentReservation = [];
      if (res_code) {
        currentReservation = reservations.filter(reservation => res_code === reservation.res_code);
      }
      formData = (currentReservation.length === 0) ? react.state.formData : currentReservation[0];
      react.setState({
        formData,
        reservations,
        tableLoading: false
      });
    });

    // LOAD NEW RESERVATION - DO NOT CHANGE
    socket.on('loadNewReservation', data => {
      const { customer, reservation, err, flashMessage } = data;
      // TWILLIO MESSAGE FOR INVALID PHONE NUMBER IS NOT CLEAR ENOUGH.
      // ADD YOUR OWN WARNING MESSAGE
      if (err && err.code === 21211) {
        err.message = 'Your phone number is invalid!';
        react.setState({ err });
        return true;
      }
      
      if (flashMessage) {
        swal("Reservation Created!", "You will recieve a text message shortly with more info!", "success");
      }

      //Make sure that this gets called from MainComponent
      react.setState(oldState => {
        // we need customer data in reservations. please DON'T remove customer
        const reservations = [...oldState.reservations, { ...customer, ...reservation }];

        return {
          currentCustomer: customer,
          currentReservation: reservation,
          reservations,
          res_code: reservation.res_code
        }
      });

    });

    // UPDATE RESERVATION DATA - DO NOT CHANGE
    socket.on('loadChangedReservation', data => {
      const { customer, reservation, flashMessage } = data;

      if (flashMessage) {
        swal("Updated!", "Your reservation has been changed!", "info");
      }

      const newResList = react.state.reservations.map(currentReso => {
        if (currentReso.id === reservation.id) {
          // please do NOT remove customer. reservations need customer detail.
          currentReso = { ...customer, ...reservation };
        }
        return currentReso;
      });


      react.setState({
        currentCustomer: customer,
        currentReservation: reservation,
        reservations: newResList
      });
    });

    // UPDATE RESERVATION STATUS BY ADMIN - DO NOT CHANGE
    socket.on('changeReservationStatus', data => {
      const newResList = react.state.reservations.map(reservation => {
        if (reservation.id === data.reservation.id) {
          reservation = data.reservation;
        }
        return reservation;
      });

      react.setState({ reservations: newResList });
    });

    // CANCEL RESERVATION - DO NOT CHANGE
    socket.on('removeCancelledReservation', newData => {
      const reservations = react.state.reservations.filter(reso => reso.id !== newData.id);
      react.setState({
        currentCustomer: formHelp.blankCustomer(),
        currentReservation: formHelp.blankReservation(),
        reservations,
        res_code: null
      });
    });

    socket.on('loadReservation', data => {
      react.setState({ currentReservation: data });
    })

    socket.on('loadReservationWOrder', data => {
      react.setState({ currentReservation: data });
    })

    socket.on('itemOrdersWMenuItemByResCode', data => {
      react.setState({ menuItemOrders: data });
    })

    socket.on('loadCustomer', data => {
      react.setState({ currentCustomer: data });
    })

    socket.on('ItemOrdersWMenuItemInfo', menuItemOrders => {
      react.setState({ menuItemOrders });
    });

    socket.on('newOrderAdded', data => {
      react.setState(prevState => {
        return {
          menuItemOrders: [...prevState.menuItemOrders, data]
        };
      })
    })

    socket.on('returnedMenu', menu => {
      react.setState({
        menu: menu
      })
    })

    socket.on('deletedOrderItem', delItem => {
      const menuItemOrders = react.state.menuItemOrders.filter(item => {
        return item.id !== delItem[0].id;
      })
      react.setState({ menuItemOrders });
    })

    socket.on('orderPlaced', data => {
      const { newOrder, customer, flashMessage } = data;

      if (flashMessage) {
        swal("Success!", "Your order has been placed!", "success");
      }

      react.setState((prevState, props) => {
        const reservation = prevState.currentReservation;
        reservation.order = newOrder[0];
        const newResList = prevState.reservations.map(prevReso => {
          if (prevReso.id === reservation.id) {
            return { ...reservation, ...customer[0] };
          }
          return prevReso;
        });

        return {
          currentReservation: reservation,
          reservations: newResList
        }
      })

    })

    socket.on("orderCancelled", data => {
      const { newOrder, customer, flashMessage } = data;

      if (flashMessage) {
        swal("Success!", "Your order has been cancelled!", "success");
      }

      react.setState((prevState, props) => {
        const reservation = prevState.currentReservation;
        reservation.order = newOrder[0];
        const newResList = prevState.reservations.map(prevReso => {
          if (prevReso.id === reservation.id) {
            return { ...reservation, ...customer[0] };
          }
          return prevReso;
        });

        return {
          currentReservation: reservation,
          reservations: newResList
        }
      })
    })

  })


  return socket;
}

module.exports = { setSocket }
