import React from "react";
// https://stackoverflow.com/questions/40510560/setinterval-with-setstate-in-react

import Screen from "./Screen.js";
import CheatScreen from "./CheatScreen.js";
import CheatButton from "./CheatButton.js";
import Tray from "./Tray.js";
import Tile from "./Tile.js";

import "../css/Game.css";

// images -> try to clean up put all in '.' & try 2 import
import isa1 from "../images/isa1.png";
import isa2 from "../images/isa2.png";
import isa3 from "../images/isa3.png";
import isa4 from "../images/isa4.png";
import isa5 from "../images/isa5.png";
import isa6 from "../images/isa6.png";

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tileTimer: undefined,
      dragTimer: undefined,
      left: 6.5,
      top: 71.5,
      cheat: false,
      screens: [<Screen />, <CheatScreen />],
      styleStore: [], // preload with tile styles in componentWillMount()
      randomIs: [0, 1, 2, 3, 4, 5],
      renderedTiles: [], // randomly put 'em (styles) in an array to map out in render()
      tileImages: [isa1, isa2, isa3, isa4, isa5, isa6]
    };
  }

  toggleHelpButton = () => {
    const toggled = !this.state.cheat;
    console.log("state from toggle: ", this.state);
    console.log("cursor props: ", this.props);
    this.setState({
      cheat: toggled
    });
  };

  randomTileGenerator = () => {
    const width = 10.5; // tile width
    const height = 8.5; // tile height
    const xSpace = 1.45; // horizontal space between tiles
    const ySpace = 2.3; // vertical space between tiles
    let l = 38.51;
    let t = 67;
    const randomIs = [0, 1, 2, 3, 4, 5];
    const randomizedTileStyles = [];
    const imgs = this.state.tileImages;
    while (randomIs.length > 1) {
      let rIndex = this.randTileIndex(0, randomIs.length - 1);
      let s = {
        left: l.toString() + "vw",
        top: t.toString() + "vh",
        backgroundImage: "url(" + imgs[randomIs[rIndex]] + ")",
        backgroundSize: "100% 100%"
      };
      randomizedTileStyles.push(s);
      l = randomizedTileStyles.length % 2 === 0 ? 38.4 : l + width + xSpace;
      t = randomizedTileStyles.length % 2 === 0 ? t + height + ySpace : t;
      randomIs.splice(rIndex, 1);
    } // come back and adjust final style later
    const finalStyle = {
      left: "50.41vw",
      top: "89.7vh",
      backgroundImage: "url(" + imgs[randomIs[0]] + ")",
      backgroundSize: "100% 100%"
    };
    randomizedTileStyles.push(finalStyle);
    this.setState({
      styleStore: randomizedTileStyles
    });
  };

  randTileIndex = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  componentWillMount() {
    this.randomTileGenerator();
  }

  componentDidMount() {
    console.log("cursor props from componentDidMount(): ", this.props);
    this.setState({
      tileTimer: setInterval(() => {
        console.log("in the loop!");
        const rIs = this.state.randomIs;
        let i = this.randTileIndex(0, rIs.length - 1);
        let rendered = this.state.renderedTiles;
        if (rendered.length === 5) {
          console.log("no more timer!!");
          clearInterval(this.state.tileTimer);
        }
        if (rendered.length === 5) {
          console.log("but we're still gonna complete the rest of the code!");
        }
        rendered.push(this.state.styleStore[rIs[i]]);
        if (rIs.length > 1) {
          rIs.splice(i, 1);
        }
        i = rIs.length > 1 ? this.randTileIndex(0, rIs.length - 1) : rIs[0];
        this.setState({
          renderedTiles: rendered,
          storeIndex: i,
          randomIs: rIs
        });
      }, 300)
    });
  }

  handleDragStart = style => {
    const borderedStyle = JSON.parse(JSON.stringify(style));
    borderedStyle.border = "2px solid red";
    this.setState({
      dragTimer: setInterval(() => {
        const s = JSON.parse(JSON.stringify(borderedStyle));
        const rendered = JSON.parse(JSON.stringify(this.state.renderedTiles));
        const img = s.backgroundImage;
        const tileIndex = rendered.findIndex(x => x.backgroundImage === img);
        const cursorInfo = this.props;
        const x =
          ((100 * cursorInfo.position.x) / window.innerWidth).toString() + "vw";
        const y =
          ((100 * cursorInfo.position.y) / window.innerHeight).toString() +
          "vh";
        s.left = x;
        s.top = y;
        rendered[tileIndex] = s;
        this.setState({
          renderedTiles: rendered
        });
      }, 0)
    });
  };

  handleDragEnd = style => {
    console.log("drag stopped!");
    clearInterval(this.state.dragTimer);
    const dragEndStyle = JSON.parse(JSON.stringify(style));
    const img = dragEndStyle.backgroundImage;
    const rendered = JSON.parse(JSON.stringify(this.state.renderedTiles));
    const tileIndex = rendered.findIndex(x => x.backgroundImage === img);
    dragEndStyle.border = "";
    rendered[tileIndex] = dragEndStyle;
    this.setState({
      renderedTiles: rendered
    });
  };

  render() {
    const screen = this.state.cheat
      ? this.state.screens[1]
      : this.state.screens[0];
    return (
      <div className="game">
        {this.state.renderedTiles.map((s, i) => {
          return (
            <Tile
              key={i}
              style={s}
              rendered={this.state.renderedTiles}
              gameProps={this.props}
              startDrag={() => this.handleDragStart(s)}
              endDrag={() => this.handleDragEnd(s)}
            />
          );
        })}
        {screen}
        <CheatButton toggle={this.toggleHelpButton} />
        <Tray />
      </div>
    );
  }
}

export default Game;

// Game.js needs to programmatically generate the 24 tiles
// so first we need to store the 24 image urls somewhere
// tile dimensions:
// height: 8.5%
// width: 10.5%
// first tile x/y coordinates:
// x(left): 6.5%
// y(top): 71.5%
// space (between tiles): to be determined
// so for top row the next tile would need to:
// increase x by width + space
// and to drop down a row it would need to:
// increase y by height + space
// pretty sure this needs to be on a lifecycle method
// since the tiles do need to show up with the rest of
// the app lol
// now that I think about it wouldn't it be cool to use a timer
// to make the tiles appear slowly in front of the user?

// flirtingWithProps = () => {
//     const miAmor = this.props;
//     console.log('detectedEnvironment: ', miAmor.detectedEnvironment);
//     console.log('elementDimensions: ', miAmor.elementDimensions);
//     console.log('isActive: ', miAmor.isActive);
//     console.log('isPositionOutside: ', miAmor.isPositionOutside);
//     console.log('position: ', miAmor.position);
//     console.log('In all her beauty: ', miAmor);
//   };

// handleDragStart = (style) => {
//   const dragStartStyle = JSON.parse(JSON.stringify(style));
//   const img = dragStartStyle.backgroundImage;
//   const rendered = JSON.parse(JSON.stringify(this.state.renderedTiles));
//   const tileIndex = rendered.findIndex(x => x.backgroundImage === img);
//   dragStartStyle.border = "2px solid red";
//   rendered[tileIndex] = dragStartStyle;
//   this.setState({
//     renderedTiles: rendered
//   });
// }
