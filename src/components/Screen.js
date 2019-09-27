import React from 'react';

// useful link to help debug current blocker
// https://spin.atomicobject.com/2018/08/20/objects-not-valid-react-child/

import '../css/Screen.css';
// initial styles should be created in Game.js
class Screen extends React.Component {
    state = {
      height: 10,
      width: window.innerWidth > 800 ? 12 : 40,
      left: window.innerWidth > 800 ? 38 : 10,
      top: 17.7
    }
    
    componentDidMount() {
       let h = this.state.height;
       let w = this.state.width;
       let l = this.state.left;
       let t = this.state.top;
       let sStore = [];
       for (let i = 0; i < 6; i++) {
          sStore.push({
             height: h.toString() + 'vh',
             width: w.toString() + 'vw',
             left: l.toString() + 'vw',
             top: t.toString() + 'vh'
          });
          l = sStore.length % 2 === 0 ? this.state.left : l + w + .1;
          t = sStore.length % 2 === 0 ? t + h + .1 : t;
       }
       this.props.getDropStyles(sStore);
    }

    render() {
        const s = this.props.s;
        return (
            <div className="screen">
               <div className="solution-pad">
                <div className="solution-row">
                   <div className="tile-drop one" style={s[0]}></div>
                   <div className="tile-drop two" style={s[1]}></div>
                </div>
                <div className="solution-row">
                   <div className="tile-drop three" style={s[2]}></div>
                   <div className="tile-drop four" style={s[3]}></div>
                </div>
                <div className="solution-row">
                   <div className="tile-drop five" style={s[4]}></div>
                   <div className="tile-drop six" style={s[5]}></div>
                </div>
               </div>
            </div>
        )
    }
}

export default Screen;