import React from 'react';

import '../css/CheatButton.css';

class CheatButton extends React.Component {
    state = {
        buttonMsg: '?',
        onHoverMsg: 'solución'
    }

    handleButtonClick = () => {
      this.props.toggle();
      let message = this.state.buttonMsg === '?' ? '¿' : '?';
      this.setState({
        buttonMsg: message
      })
    }

    responsiveStyle = () => {
      return window.innerWidth > 800 ? 
      { left: '30vw', top: '80.5vh'} :
      { left: '3vw', top: '80.5vh'};
    }

    render() {
        const s = this.responsiveStyle();
        return (
            <div 
              className="cheat-button"
              style={s}
              onClick={this.handleButtonClick}
              title={this.state.onHoverMsg}
            >
              {this.state.buttonMsg}
            </div>
        )
    }
}

export default CheatButton;