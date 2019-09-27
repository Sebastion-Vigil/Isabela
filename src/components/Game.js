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
      selectedTile: 0,
      renderedTiles: [], // randomly put 'em (styles) in an array to map out in render()
      tileImages: [isa1, isa2, isa3, isa4, isa5, isa6],
    };
  }

  toggleHelpButton = () => {
    const toggled = !this.state.cheat;
    console.log("state from toggle: ", this.state);
    console.log("cursor props: ", this.props);
    this.setState({
      cheat: toggled,
    });
  };

  randomTileGenerator = () => {
    const ww = window.innerWidth; // these are px
    const tileW = ww > 800 ? 11 : 37.2; // tile width
    const tileH = 8.5; // tile height
    const xSpace = 2; // horizontal space between tiles
    const ySpace = 2.3; // vertical space between tiles
    let l = ww > 800 ? 37.9 : 10.1;
    let t = 67;
    const randomIs = [0, 1, 2, 3, 4, 5];
    const randomizedTileStyles = [];
    const imgs = this.state.tileImages;
    while (randomIs.length > 1) {
      let rIndex = this.randTileIndex(0, randomIs.length - 1);
      let s = {
        width: tileW.toString() + "vw",
        height: tileH.toString() + "vh",
        left: l.toString() + "vw",
        top: t.toString() + "vh",
        backgroundImage: "url(" + imgs[randomIs[rIndex]] + ")",
        backgroundSize: "100% 100%",
      };
      randomizedTileStyles.push(s);
      if (randomizedTileStyles.length % 2 === 0 && ww > 800) {
        l = 37.9;
      } else if (randomizedTileStyles.length % 2 === 0 && ww <= 800) {
        l = 10.1;
      } else {
        l = l + tileW + xSpace;
      }
      // l = randomizedTileStyles.length % 2 === 0 ? l : l + tileW + xSpace;
      t = randomizedTileStyles.length % 2 === 0 ? t + tileH + ySpace : t;
      randomIs.splice(rIndex, 1);
    } // come back and adjust final style later
    const finalStyle = {
      width: tileW.toString() + "vw",
      height: tileH.toString() + "vh",
      left: ww > 800 ? "50.9vw" : "49.3vw",
      top: "88.6vh",
      backgroundImage: "url(" + imgs[randomIs[0]] + ")",
      backgroundSize: "100% 100%",
    };
    randomizedTileStyles.push(finalStyle);
    this.setState({
      styleStore: randomizedTileStyles,
    });
  };

  randTileIndex = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  componentDidMount() {
    window.addEventListener("contextmenu", function(e) { e.preventDefault(); })
    this.randomTileGenerator();
    this.setState({
      tileTimer: setInterval(() => {
        const rIs = this.state.randomIs;
        let i = this.randTileIndex(0, rIs.length - 1);
        let rendered = this.state.renderedTiles;
        if (rendered.length === 5) {
          clearInterval(this.state.tileTimer);
        }
        rendered.push(this.state.styleStore[rIs[i]]);
        if (rIs.length > 1) {
          rIs.splice(i, 1);
        }
        i = rIs.length > 1 ? this.randTileIndex(0, rIs.length - 1) : rIs[0];
        this.setState({
          renderedTiles: rendered,
          storeIndex: i,
          randomIs: rIs,
        });
      }, 300),
    });
  }

  handleDragStart = style => {
    const borderedStyle = JSON.parse(JSON.stringify(style));
    borderedStyle.border = "2px solid red";
    console.log("cursor info: ", this.props);
    this.setState({
      dragTimer: setInterval(() => {
        const tileWidth = 5.5; // (half tile width)
        const tileHeight = 4.225; // (half tile height)
        const s = JSON.parse(JSON.stringify(borderedStyle));
        const rendered = JSON.parse(JSON.stringify(this.state.renderedTiles));
        const img = s.backgroundImage;
        const tileIndex = rendered.findIndex(x => x.backgroundImage === img);
        const cursorInfo = this.props;
        let x = ((100 * cursorInfo.position.x) / window.innerWidth - tileWidth);
        let y = ((100 * cursorInfo.position.y) / window.innerHeight - tileHeight);
        if (x < 0) {
          x = 0;
        }
        if (x > 88.5) {
          x = 88.5;
        }
        if (y < 0) {
          y = 0;
        }
        if (y > 88.5) {
          y = 88.5;
        }
        x = x.toString() + 'vw';
        y = y.toString() + 'vh';
        s.left = x;
        s.top = y;
        rendered[tileIndex] = s;
        this.setState({
          renderedTiles: rendered,
          selectedTile: tileIndex
        });
      }, 1),
    });
  };

  handleDragEnd = style => {
    clearInterval(this.state.dragTimer);
    const dragEndStyle = JSON.parse(JSON.stringify(style));
    const img = dragEndStyle.backgroundImage;
    const rendered = JSON.parse(JSON.stringify(this.state.renderedTiles));
    const tileIndex = rendered.findIndex(x => x.backgroundImage === img);
    dragEndStyle.border = "";
    rendered[tileIndex] = dragEndStyle;
    this.setState({
      renderedTiles: rendered,
    });
  };

  preventTileStick = () => {
    clearInterval(this.state.dragTimer);
    const tileIndex = this.state.selectedTile;
    if (tileIndex === undefined) return;
    const rendered = JSON.parse(JSON.stringify(this.state.renderedTiles));
    const style = JSON.parse(JSON.stringify(rendered[tileIndex]));
    style.border = "";
    rendered[tileIndex] = style;
    this.setState({
      renderedTiles: rendered,
      selectedTile: undefined
    })
  }

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

//  flirtingWithProps = () => {
//     const miAmor = this.props;
//     console.log('detectedEnvironment: ', miAmor.detectedEnvironment);
//     console.log('elementDimensions: ', miAmor.elementDimensions);
//     console.log('isActive: ', miAmor.isActive);
//     console.log('isPositionOutside: ', miAmor.isPositionOutside);
//     console.log('position: ', miAmor.position);
//     console.log('In all her beauty: ', miAmor);
//   };