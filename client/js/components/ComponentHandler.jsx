import React from 'react';
import io from 'socket.io-client';
import MainComponent from './MainComponent.jsx';

export default function (props) {
  const isAdmin = props.match.url === '/admin' ? true : false;
  const res_code = props.match.params.res_code === undefined ? null : props.match.params.res_code;
  const socket = io('http://localhost:3001');

  return (
    <MainComponent
      isAdmin={isAdmin}
      res_code={res_code}
      socket={socket}
    />
  )
}
