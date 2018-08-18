const namifyStr = str => str.toLowerCase().trim().replace(/^\w/, letter => letter.toUpperCase());

const getOnlyNumbers = str => str.replace(/\D/g, '');

const blankError = () => {
  return {
    code: '',
    message: ''
  };
};

const blankReservation = () => {
  return {
    placement_time: '',
    order_id: '',
    status: '',
    group_size: '',
    customer_id: '',
    res_code: ''
  };
};

const blankCustomer = () => {
  return {
    name: '',
    phone: '',
    email: ''
  };
};

const resoData = state => {
  const { customer, reservation } = state;
  return {
    name: namifyStr(customer.name),
    phone: getOnlyNumbers(customer.phone),
    group_size: reservation.group_size,
    email: customer.email,
    res_code: reservation.res_code
  };
};

module.exports = { blankError, blankReservation, blankCustomer, resoData };
