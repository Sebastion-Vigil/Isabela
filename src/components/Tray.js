import React from 'react';

import '../css/Tray.css';

class Tray extends React.Component {
  render() {
    return (
      <div className="tray">
        <div className="tray-row">
          <div className="octet left">Te</div>
          <div className="octet right">amo</div>
        </div>
        <div className="tray-row">
          <div className="octet left">con</div>
          <div className="octet right">todo</div>
        </div>
        <div className="tray-row">
          <div className="octet left">mi</div>
          <div className="octet right">corazón</div>
        </div>
      </div>
    );
  }
}

export default Tray;
