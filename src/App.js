import React from 'react';
import GameArea from 'react-cursor-position';

import Game from './components/Game.js';

import './css/App.css';

class App extends React.Component {
    render() {
        return (
            <GameArea className="App">
              <Game />
            </GameArea>
        );
    }
}

export default App;