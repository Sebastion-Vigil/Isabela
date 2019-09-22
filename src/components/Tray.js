import React from 'react';

import '../css/Tray.css';

class Tray extends React.Component {
  render() {
    return (
      <div className="tray">
        <div className="tray-row">
          <div className="octet"></div>
          <div className="octet"></div>
          <div className="octet"></div>
          <div className="octet"></div>
          <div className="octet"></div>
          <div className="octet"></div>
          <div className="octet"></div>
          <div className="octet"></div>
        </div>
        <div className="tray-row">
          <div className="octet"></div>
          <div className="octet"></div>
          <div className="octet"></div>
          <div className="octet"></div>
          <div className="octet"></div>
          <div className="octet"></div>
          <div className="octet"></div>
          <div className="octet"></div>
        </div>
        <div className="tray-row">
          <div className="octet"></div>
          <div className="octet"></div>
          <div className="octet"></div>
          <div className="octet"></div>
          <div className="octet"></div>
          <div className="octet"></div>
          <div className="octet"></div>
          <div className="octet"></div>
        </div>
      </div>
    );
  }
}

export default Tray;
