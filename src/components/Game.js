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
      left: window.innerWidth > 800 ? 37.9 : 10.1,
      top: 67,
      cheat: false,
      dropPadStyles: [],
      dropIndex: undefined,
      dropPadParams: {
        height: 10,
        width: window.innerWidth > 800 ? 12 : 40,
        left: window.innerWidth > 800 ? 38 : 10,
        top: 17.7,
      },
      styleStore: [], // preload with tile styles in componentWillMount()
      randomIs: [0, 1, 2, 3, 4, 5],
      renderedTiles: [], // randomly put 'em (styles) in an array to map out in render()
      currentTilePos: [window.innerWidth > 800 ? 37.9 : 10.1, 67], // x, y position of tile being dragged
      tileDown: false, // is tile set in a pad?
      tileImages: [isa1, isa2, isa3, isa4, isa5, isa6],
    };
  }

  toggleHelpButton = () => {
    const toggled = !this.state.cheat;
    console.log("winWidth: ", window.innerWidth);
    console.log("winHeight: ", window.innerHeight);
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
    let l = this.state.left;
    let t = this.state.top;
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

  handleDragStart = style => {
    const borderedStyle = JSON.parse(JSON.stringify(style));
    borderedStyle.border = "2px solid red";
    this.setState({
      dragTimer: setInterval(() => {
        const ww = window.innerWidth; // these are px
        const wh = window.innerHeight;
        const tileW = ww > 800 ? 11 : 37.2; // tile width
        const tileH = 8.5;
        const s = JSON.parse(JSON.stringify(borderedStyle));
        const rendered = JSON.parse(JSON.stringify(this.state.renderedTiles));
        const img = s.backgroundImage;
        const tileIndex = rendered.findIndex(x => x.backgroundImage === img);
        const cursorInfo = this.props;
        const tilePos = JSON.parse(JSON.stringify(this.state.currentTilePos)); // ([x, y])
        s.left = tilePos[0]; // prev left/top of tile -> muy importante
        s.top = tilePos[1];  // give s prev tile top/left params
        // okay so I've been trying to make x/yDiff x/y - left/top--> in the previous
        // version I used half tile width & half tile height to map x/y to center of tile
        // and it worked. need to rethink this...
        const yCent = (100 * cursorInfo.position.y / wh - parseFloat(s.top)) / parseFloat(tileH);
        const xCent = (100 * cursorInfo.position.x / ww - parseFloat(s.left)) / parseFloat(tileW);
        const xDivisor = 1 / xCent;
        const yDivisor = 1 / yCent;
        let x = 100 * cursorInfo.position.x / ww - tileW / 2;
        let y = 100 * cursorInfo.position.y / wh - tileH / 2;
        const xDiff = parseFloat(tileW / xDivisor);
        const yDiff = parseFloat(tileH / yDivisor);
        console.log("xCent, yCent: ", xCent, yCent);
        console.log("x, y: ", x, y);
        console.log("xDiff, yDiff: ", xDiff, yDiff);
        if (ww > 800) {
          if (x < 0) {
            x = 0;
          }
          if (x > 80) {
            x = 80;
          }
          if (y < 5) {
            y = 5;
          }
          if (y > 88.5) {
            y = 88.5;
          }
        } else {
          if (ww < 800) {
            if (x < 0) {
              x = 0;
            }
            if (x > 58) {
              x = 58;
            }
            if (y < 5) {
              y = 5;
            }
            if (y > 88.6) {
              y = 88.6;
            }
          }
        }
        tilePos[0] = x; 
        tilePos[1] = y;
        // dropI = this.detectTileDrop(tilePos);
        s.left = x.toString() + "vw";
        s.top = y.toString() + "vh";
        rendered[tileIndex] = s;
        this.setState({
          renderedTiles: rendered,
          currentTilePos: tilePos
          // dropIndex: dropI
        });
      }, 25),
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

  detectTileDrop = (arrXY) => { // pass changed tilePos[] before dragTimer setState()
    // return index of pad with tile inside it -> will use in handleDragStart()
    let dropI = this.state.dropIndex;
    const x = arrXY[0];
    const y = arrXY[1];
    const tileHalfWD = window.innerWidth > 800 ? 5.5 : 18.6; 
    const tileHalfHT = 4.25;
    const padHalfWD = this.state.dropPadParams.width / 2;
    const padHalfHT = this.state.dropPadParams.height / 2;
    const normalDropPad = [
      [38, 17.7],
      [50.1, 17.7],
      [38, 27.8],
      [50.1, 27.8],
      [38, 37.9],
      [50.1, 37.9]
    ];
    const mobileDropPad = [
      [10, 17.7],
      [50.1, 17.7],
      [10, 27.8],
      [50.1, 27.8],
      [10, 37.9],
      [50.1, 37.9]
    ];  
    // tengo una idea...
   const dropPad = window.innerWidth > 800 ? normalDropPad : mobileDropPad;
   const boundsLen = window.innerWidth > 800 ? normalDropPad.length : mobileDropPad.length; // lens may not stay same in future
   let xyI = 0; // index into outer arr
   while (xyI < boundsLen) {
     let xBound = dropPad[xyI][0];
     let yBound = dropPad[xyI][1];
    //  console.log("xBound, yBound: ", xBound, yBound);
     let xEdge = xBound + padHalfWD * 2;
     let yEdge = yBound + padHalfHT * 2;
    //  console.log("x, y from detectTileDrop(): ", x, y);
     if ((x - tileHalfWD >= xBound && x + tileHalfWD <= xEdge) && (y - tileHalfHT >= yBound && y + tileHalfHT <= yEdge)) {
       dropI = xyI;
       console.log("Inside pad!");
       console.log("dropI: ", dropI);
       break;
     }
     xyI += 1;
   }
   return dropI;
  };

  componentDidMount() {
    let h = this.state.dropPadParams.height;
    let w = this.state.dropPadParams.width;
    let l = this.state.dropPadParams.left;
    let t = this.state.dropPadParams.top;
    let sStore = [];
    for (let i = 0; i < 6; i++) {
      sStore.push({
        height: h.toString() + "vh",
        width: w.toString() + "vw",
        left: l.toString() + "vw",
        top: t.toString() + "vh",
        border: ".003em dashed pink",
      });
      l = sStore.length % 2 === 0 ? this.state.dropPadParams.left : l + w + 0.1;
      t = sStore.length % 2 === 0 ? t + h + 0.1 : t;
    }
    window.addEventListener("contextmenu", function(e) {
      e.preventDefault();
    });
    this.randomTileGenerator();
    this.setState({
      dropPadStyles: sStore,
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

  render() {
    const screen = this.state.cheat ? (
      <CheatScreen />
    ) : (
      <Screen styles={this.state.dropPadStyles} />
    );
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

// from detectTileDrop():
// let dropAreaI = undefined;
//     for (let i = 0; i < 6; i++) {
//       if (x >= left && x <= left + tileW && (y >= top && y <= top + tileH)) {
//         dropAreaI = i;
//         break;
//       }
//       left = (i + 1) % 2 === 0 ? leftReset : left + tileW + space;
//       top = (i + 1) % 2 === 0 ? top + tileH + space : 17.7;
//     }
//     return dropAreaI;
