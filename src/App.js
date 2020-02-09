import React from "react";
import Sky from "react-sky";

import GameArea from "react-cursor-position";
import Game from "./components/Game.js";

import "./css/App.css";

import flower from "./images/icons/flower.png";
import flower2 from "./images/icons/flower2.png";
import flower3 from "./images/icons/flower3.png";
import flower4 from "./images/icons/flower4.png";
import flower5 from "./images/icons/flower5.png";
import flower6 from "./images/icons/flower6.png";
import flower7 from "./images/icons/flower7.png";
import flower8 from "./images/icons/flower8.png";
import flower9 from "./images/icons/flower9.png";
import heart1 from "./images/icons/heart1.png";
import heart2 from "./images/icons/heart2.png";
import heart3 from "./images/icons/heart3.png";
import heart4 from "./images/icons/heart4.png";
import heart5 from "./images/icons/heart5.png";
import heart6 from "./images/icons/heart6.png";
import heart7 from "./images/icons/heart7.png";
import heart8 from "./images/icons/heart8.png";
import heart9 from "./images/icons/heart9.png";



class App extends React.Component {
  render() {
    return (
      <div className="game-wrapper">
        <Sky
          images={{
            0: flower,
            1: flower2,
            2: flower3,
            3: flower4,
            4: flower5,
            5: flower6,
            6: flower7,
            7: flower8,
            8: flower9
          }}
          how={100}
          time={20}
          size={"75px"}
          background={"pink"}
        />
        <GameArea className="App">
          <Game/>
        </GameArea>
        <div className="sky-tray-wrapper">
          <Sky
            className="sky-tray"
            images={{
              0: heart1,
              1: heart2,
              2: heart3,
              3: heart4,
              4: heart5,
              5: heart6,
              6: heart7,
              7: heart8,
              8: heart9
            }}
            how={250}
            time={20}
            size={"25px"}
            background={"magenta"}
          />
        </div>
      </div>
    );
  }
}

export default App;
