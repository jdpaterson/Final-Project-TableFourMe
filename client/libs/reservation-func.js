// check if the reservation table is displaying the current customer's reservation
const reservationExist = (reservations, res_code) => {
  // return an array of booleans (whether each table row's res_code === the current customer's reservation code)
  const booleanArray = reservations.map(reservation => reservation.res_code === res_code);
  // check if there is any "true" in the array. if so, this means customer's trying to UPDATE data rather than adding new data
  return booleanArray.some(el => el === true);
};

// return the current customer's reservation
const returnResoArray = (reservations, newReservation) => {
  const { res_code } = newReservation;

  if (reservationExist(reservations, res_code)) {
    // CASE 1: replace old reservation with the updated info
    return reservations.map(reservation => {
      if (reservation.res_code === res_code) {
        reservation = newReservation;
      }
      return reservation;
    });
  } else {
    // CASE 2: simply new reservation data into the reservations array
    return [...reservations, newReservation];
  }
};

module.exports = { returnResoArray };