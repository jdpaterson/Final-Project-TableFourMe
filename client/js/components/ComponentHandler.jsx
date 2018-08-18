import React from 'react';
import io from 'socket.io-client';
import MainComponent from './MainComponent.jsx';

export default function (props) {
  const isAdmin = props.match.url === '/admin' ? true : false;
  const res_code = props.match.params.res_code === undefined ? null : props.match.params.res_code;
  const socket = (process.env.NODE_ENV === 'development') ?
    io.connect('http://localhost:3001') : io.connect();

  // NEED TO GENERATE THE RES_CODE AS SOON AS USER LOGS IN
  // STORE IT IN STATE

  return (
    <MainComponent
      urls={props.match}
      isAdmin={isAdmin}
      res_code={res_code}
      socket={socket}
    />
  )
}
