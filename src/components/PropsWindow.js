import React from 'react';

import '../css/PropsWindow.css';

const PropsWindow = (props) => {
    const {
      detectedEnvironment: {
        isMouseDetected = false,
        isTouchDetected = false
      } = {},
      elementDimensions: {
        width = 0,
        height = 0
      } = {},
      isActive = false,
      isPositionOutside = false,
      position: {
        x = 0,
        y = 0
      } = {}
    } = props;
  
    return (
      <div className="props-window">
        {`x: ${x}`}<br />
        {`y: ${y}`}<br />
        {`width: ${width}`}<br />
        {`height: ${height}`}<br />
        {`isActive: ${isActive}`}<br />
        {`isPositionOutside: ${isPositionOutside ? 'true' : 'false'}`}<br />
        {`isMouseDetected: ${isMouseDetected ? 'true' : 'false'}`}<br />
        {`isTouchDetected: ${isTouchDetected ? 'true' : 'false'}`}
      </div>
    );
  };

export default PropsWindow;