import React from 'react'
// https://stackoverflow.com/questions/40510560/setinterval-with-setstate-in-react

import Screen from './Screen.js'
import CheatScreen from './CheatScreen.js'
import CheatButton from './CheatButton.js'
import Tray from './Tray.js'
import Tile from './Tile.js'

import '../css/Game.css'

// images -> try to clean up put all in '.' & try 2 import
import isa1 from '../images/isa1.png'
import isa2 from '../images/isa2.png'
import isa3 from '../images/isa3.png'
import isa4 from '../images/isa4.png'
import isa5 from '../images/isa5.png'
import isa6 from '../images/isa6.png'

class Game extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      gameFinished: false,
      winLose: undefined,
      tileTimer: undefined,
      dragTimer: undefined,
      tilesDropped: 0,
      droppedCorrectly: 0,
      left: window.innerWidth > 800 ? 37.9 : 10.1,
      top: 67,
      cheat: false,
      dropPadStyles: [],
      dropIndex: undefined,
      dropPadParams: {
        height: 10,
        width: window.innerWidth > 800 ? 12 : 40,
        left: window.innerWidth > 800 ? 38 : 10,
        top: 17.7
      },
      styleStore: [], // preload with tile styles in componentWillMount()
      randomIs: [0, 1, 2, 3, 4, 5],
      renderedTiles: [], // randomly put 'em (styles) in an array to map out in render()
      currentTilePos: [window.innerWidth > 800 ? 37.9 : 10.1, 67], // x, y position of tile being dragged
      tileImages: [isa1, isa2, isa3, isa4, isa5, isa6]
    }
    this.baseState = JSON.parse(JSON.stringify(this.state))
  }

  initializeGame = () => {
    let h = this.state.dropPadParams.height
    let w = this.state.dropPadParams.width
    let l = this.state.dropPadParams.left
    let t = this.state.dropPadParams.top
    let sStore = []
    for (let i = 0; i < 6; i++) {
      // these are the droppad styles
      sStore.push({
        height: h.toString() + 'vh',
        width: w.toString() + 'vw',
        left: l.toString() + 'vw',
        top: t.toString() + 'vh',
        border: '.003em dashed pink'
      })
      l = sStore.length % 2 === 0 ? this.state.dropPadParams.left : l + w + 0.1
      t = sStore.length % 2 === 0 ? t + h + 0.1 : t
    }
    window.addEventListener('contextmenu', function (e) {
      e.preventDefault()
    })
    this.randomTileGenerator()
    this.setState({
      dropPadStyles: sStore,
      tileTimer: setInterval(() => {
        const rIs = this.state.randomIs
        let i = this.randTileIndex(0, rIs.length - 1)
        let rendered = this.state.renderedTiles
        if (rendered.length === 5) {
          clearInterval(this.state.tileTimer)
        }
        rendered.push(this.state.styleStore[rIs[i]])
        if (rIs.length > 1) {
          rIs.splice(i, 1)
        }
        i = rIs.length > 1 ? this.randTileIndex(0, rIs.length - 1) : rIs[0]
        this.setState({
          renderedTiles: rendered,
          storeIndex: i,
          randomIs: rIs
        })
      }, 300)
    })
  }

  resetGame = () => {
    this.setState(this.baseState)
  }

  componentDidMount () {
    this.initializeGame()
  }

  componentDidUpdate () {
    if (this.state.tilesDropped === 6 && !this.state.gameFinished) {
      const msg = this.state.droppedCorrectly === 6 ? "You won!" : "You lose! Try again!"
      alert(msg)
      setTimeout(() => {
        this.resetGame()
        this.initializeGame()
      }, 1500)
     this.setState({
       gameFinished: true
     })
    }
  }

  toggleHelpButton = () => {
    const toggled = !this.state.cheat
    console.log('winWidth: ', window.innerWidth)
    console.log('winHeight: ', window.innerHeight)
    console.log('state from toggle: ', this.state)
    console.log('cursor props: ', this.props)
    console.log('baseState: ', this.baseState)
    this.setState({
      cheat: toggled
    })
  }

  randomTileGenerator = () => {
    const ww = window.innerWidth // these are px
    const tileW = ww > 800 ? 11 : 37.2 // tile width
    const tileH = 8.5 // tile height
    const xSpace = 2 // horizontal space between tiles
    const ySpace = 2.3 // vertical space between tiles
    let l = this.state.left
    let t = this.state.top
    const randomIs = [0, 1, 2, 3, 4, 5]
    const randomizedTileStyles = []
    const imgs = this.state.tileImages
    while (randomIs.length > 1) {
      let rIndex = this.randTileIndex(0, randomIs.length - 1)
      let s = {
        width: tileW.toString() + 'vw',
        height: tileH.toString() + 'vh',
        left: l.toString() + 'vw',
        top: t.toString() + 'vh',
        backgroundImage: 'url(' + imgs[randomIs[rIndex]] + ')',
        backgroundSize: '100% 100%'
      }
      randomizedTileStyles.push(s)
      if (randomizedTileStyles.length % 2 === 0 && ww > 800) {
        l = 37.9
      } else if (randomizedTileStyles.length % 2 === 0 && ww <= 800) {
        l = 10.1
      } else {
        l = l + tileW + xSpace
      }
      // l = randomizedTileStyles.length % 2 === 0 ? l : l + tileW + xSpace;
      t = randomizedTileStyles.length % 2 === 0 ? t + tileH + ySpace : t
      randomIs.splice(rIndex, 1)
    } // come back and adjust final style later
    const finalStyle = {
      width: tileW.toString() + 'vw',
      height: tileH.toString() + 'vh',
      left: ww > 800 ? '50.9vw' : '49.3vw',
      top: '88.6vh',
      backgroundImage: 'url(' + imgs[randomIs[0]] + ')',
      backgroundSize: '100% 100%'
    }
    randomizedTileStyles.push(finalStyle)
    this.setState({
      styleStore: randomizedTileStyles
    })
  }

  randTileIndex = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  handleDragStart = style => {
    const borderedStyle = JSON.parse(JSON.stringify(style))
    borderedStyle.border = '2px solid red'
    this.setState({
      dragTimer: setInterval(() => {
        const ww = window.innerWidth // these are px
        const wh = window.innerHeight
        const tileW = ww > 800 ? 11 : 37.2 // tile width
        const tileH = 8.5
        const s = JSON.parse(JSON.stringify(borderedStyle))
        const rendered = JSON.parse(JSON.stringify(this.state.renderedTiles))
        const img = s.backgroundImage
        const tileIndex = rendered.findIndex(x => x.backgroundImage === img)
        const cursorInfo = this.props
        const tilePos = JSON.parse(JSON.stringify(this.state.currentTilePos)) // ([x, y])
        s.left = tilePos[0]
        s.top = tilePos[1]
        let x = (100 * cursorInfo.position.x) / ww - tileW / 2
        let y = (100 * cursorInfo.position.y) / wh - tileH / 2
        if (ww > 800) {
          if (x < 0) {
            x = 0
          }
          if (x > 80) {
            x = 80
          }
          if (y < 5) {
            y = 5
          }
          if (y > 88.5) {
            y = 88.5
          }
        } else {
          if (ww < 800) {
            if (x < 0) {
              x = 0
            }
            if (x > 58) {
              x = 58
            }
            if (y < 5) {
              y = 5
            }
            if (y > 88.6) {
              y = 88.6
            }
          }
        }
        tilePos[0] = x
        tilePos[1] = y
        const prevDropI = this.state.dropIndex
        const dropI = this.detectTileDrop(tilePos)
        const dropStyles = JSON.parse(JSON.stringify(this.state.dropPadStyles))
        if (!isNaN(dropI)) {
          const tileOver = dropStyles[dropI]
          tileOver.border = '.1em solid magenta'
          dropStyles[dropI] = tileOver
        }
        if (!isNaN(prevDropI) && prevDropI !== dropI) {
          const tileLeave = dropStyles[prevDropI]
          if (tileLeave.border !== '.050em solid silver') {
            tileLeave.border = '.004em dashed pink'
          }
          dropStyles[prevDropI] = tileLeave
        }
        s.left = x.toString() + 'vw'
        s.top = y.toString() + 'vh'
        rendered[tileIndex] = s
        this.setState({
          renderedTiles: rendered,
          currentTilePos: tilePos,
          dropIndex: dropI,
          dropPadStyles: dropStyles
        })
      }, 25)
    })
  }

  handleDragEnd = style => {
    clearInterval(this.state.dragTimer)
    const dragEndStyle = JSON.parse(JSON.stringify(style))
    const img = dragEndStyle.backgroundImage
    let isa = img.split('media/')[1]
    isa = isa.split('.')[0]
    isa = Number(isa.split('isa')[1])
    const rendered = JSON.parse(JSON.stringify(this.state.renderedTiles))
    const tileIndex = rendered.findIndex(x => x.backgroundImage === img)
    rendered[tileIndex] = dragEndStyle
    const tilePos = this.state.currentTilePos
    const dropI = this.detectTileDrop(tilePos)
    const dropStyles = JSON.parse(JSON.stringify(this.state.dropPadStyles))
    let tilesDrppd = this.state.tilesDropped
    let drppdCorrectly = this.state.droppedCorrectly
    if (!isNaN(dropI)) {
      const tileOver = dropStyles[dropI]
      if (!tileOver.backgroundImage) {
        tileOver.border = '.050em solid silver'
        tileOver.backgroundImage = img
        tileOver.backgroundSize = '100% 100%'
        dragEndStyle.visibility = 'hidden'
        tilesDrppd += 1
      } // check if tile dropped on correct dropPad
      if (isa === dropI + 1) {
        drppdCorrectly += 1
      }
      dropStyles[dropI] = tileOver
    }
    this.setState({
      renderedTiles: rendered,
      dropPadStyles: dropStyles,
      tilesDropped: tilesDrppd,
      droppedCorrectly: drppdCorrectly
    })
  }

  detectTileDrop = arrXY => {
    // pass changed tilePos[] before dragTimer setState()
    // return index of pad with tile inside it -> will use in handleDragStart()
    let dropI = undefined
    const x = arrXY[0] // left (x)
    const y = arrXY[1] // top (y)
    const padW = this.state.dropPadParams.width
    const padH = this.state.dropPadParams.height
    const tileW = window.innerWidth > 800 ? 11 : 37.2
    const tileH = 8.5
    const normalDropPad = [
      // (x, y)
      [38, 17.7],
      [50.1, 17.7],
      [38, 27.8],
      [50.1, 27.8],
      [38, 37.9],
      [50.1, 37.9]
    ]
    const mobileDropPad = [
      [10, 17.7],
      [50.1, 17.7],
      [10, 27.8],
      [50.1, 27.8],
      [10, 37.9],
      [50.1, 37.9]
    ]
    const dropPad = window.innerWidth > 800 ? normalDropPad : mobileDropPad
    let i = 0
    while (i < dropPad.length) {
      let Px = dropPad[i][0]
      let Py = dropPad[i][1]
      if (
        x >= Px &&
        x + tileW <= Px + padW &&
        y >= Py &&
        y + tileH <= Py + padH
      ) {
        dropI = i
        break
      }
      i += 1
    }
    return dropI
  }

  render () {
    const screen = this.state.cheat ? (
      <CheatScreen />
    ) : (
      <Screen styles={this.state.dropPadStyles} />
    )
    return (
      <div className='game'>
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
          )
        })}
        {screen}
        <CheatButton toggle={this.toggleHelpButton} />
        <Tray />
      </div>
    )
  }
}

export default Game
