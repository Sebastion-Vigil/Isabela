import React from 'react';
import GameArea from 'react-cursor-position';

import PropsWindow from './components/PropsWindow.js';
import Game from './components/Game.js';

import './css/App.css';

class App extends React.Component {
    render() {
        return (
            <GameArea className="App">
              <PropsWindow />
              <Game />
            </GameArea>
        );
    }
}

export default App;