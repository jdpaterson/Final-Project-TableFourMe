// count how many clients are connected
const countClients = ws => Object.keys(ws.sockets.connected).length;

const sendDataToAll = (io, socket, emitTo, dataToSend, admins) => {
  // BROADCAST RESERVATION DATA TO EVERYBODY
  // WE DON'T WANT FLASH MESSAGE TO POP UP ON ALL PAGES
  dataToSend.flashMessage = false;
  // REMOVE res_code IF AN ADMIN SUBMITTED A RESERVATION
  // OTHERWISE, THIS WILL CHANGE THE FORM BUTTONS ON BOTH ADMIN & CUSTOMER PAGES
  if (Object.keys(admins).includes(socket.id)) {
    dataToSend.reservation.res_code = '';
  }
  io.emit(emitTo, dataToSend);
};

const sendToMeAndAdmin = (socket, emitTo, dataToSend, admins) => {
  // 1. BROADCAST RESERVATION DATA TO ORIGINAL CUSTOMER AND ALL ADMINS
  // SEND RESERVATION DATA BACK TO THE ORIGINAL SENDER
  dataToSend.flashMessage = true; // ENABLE FLASH MESSAGE
  socket.emit(emitTo, dataToSend);

  // IF THERE IS AN ERROR, ONLY BROADCAST BACK TO THE ORIGINAL SENDER
  if (dataToSend.err) {
    return true;
  }

  // 2. SEND THE SAME DATASET TO ALL ADMINS BUT AFTER CHANGING RES_CODE TO ''
  // OTHERWISE, SUBMIT BUTTON DISAPPEARS AND UPDATE AND CANCEL BUTTONS SHOW UP (NOT GOOD)
  if (dataToSend.reservation) {
    dataToSend.reservation.res_code = '';
  }

  dataToSend.flashMessage = false; // ALSO DISABLE FLASH MESSAGE FOR ADMINS
  Object.keys(admins).forEach(adminId => {
    socket.broadcast.to(adminId).emit(emitTo, dataToSend);
  });
};

// SET UP BROADCAST LOGIC
const broadcastResos = (io, socket, emitTo, dataToSend, admins, sendToAll) => {
  // REFERENCE:
  // https://stackoverflow.com/questions/10058226/send-response-to-all-clients-except-sender
  if (sendToAll) {
    sendDataToAll(io, socket, emitTo, dataToSend, admins);
  } else {
    sendToMeAndAdmin(socket, emitTo, dataToSend, admins);
  }
};

module.exports = { countClients, broadcastResos };