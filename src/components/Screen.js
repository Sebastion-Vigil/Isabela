import React from 'react';

// useful link to help debug current blocker
// https://spin.atomicobject.com/2018/08/20/objects-not-valid-react-child/

import '../css/Screen.css';

class Screen extends React.Component {
    render() {
        return (
            <div className="screen">
               <div className="solution-pad">
                <div className="solution-row">
                   <div className="tile-drop left"></div>
                   <div className="tile-drop right"></div>
                </div>
                <div className="solution-row">
                   <div className="tile-drop left"></div>
                   <div className="tile-drop right"></div>
                </div>
                <div className="solution-row">
                   <div className="tile-drop left"></div>
                   <div className="tile-drop right"></div>
                </div>
               </div>
            </div>
        )
    }
}

export default Screen;