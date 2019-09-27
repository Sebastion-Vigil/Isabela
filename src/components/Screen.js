import React from 'react';

// useful link to help debug current blocker
// https://spin.atomicobject.com/2018/08/20/objects-not-valid-react-child/

import '../css/Screen.css';
// initial styles should be created in Game.js
class Screen extends React.Component {
   render() {
      return (
         <div className="screen">
            <div className="solution-pad">
               <div className="solution-row">
                  <div className="tile-drop one" style={this.props.styles[0]}></div>
                  <div className="tile-drop two" style={this.props.styles[1]}></div>
               </div>
               <div className="solution-row">
                  <div className="tile-drop three" style={this.props.styles[2]}></div>
                  <div className="tile-drop four" style={this.props.styles[3]}></div>
               </div>
               <div className="solution-row">
                  <div className="tile-drop five" style={this.props.styles[4]}></div>
                  <div className="tile-drop six" style={this.props.styles[5]}></div>
               </div>
            </div>
         </div>
      )
   }
}

export default Screen;