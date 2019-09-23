import React from 'react';

import '../css/CheatButton.css';

class CheatButton extends React.Component {
    state = {
        buttonMsg: '?',
        onHoverMsg: 'ver imagen completo'
    }

    handleButtonClick = () => {
      this.props.toggle();
      let message = this.state.buttonMsg === '?' ? '¿' : '?';
      this.setState({
        buttonMsg: message
      })
    }

    render() {
        return (
            <div 
              className="cheat-button"
              onClick={this.handleButtonClick}
              title={this.state.onHoverMsg}
            >
              {this.state.buttonMsg}
            </div>
        )
    }
}

export default CheatButton;