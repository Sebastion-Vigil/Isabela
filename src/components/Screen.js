import React from 'react';

// useful link to help debug current blocker
// https://spin.atomicobject.com/2018/08/20/objects-not-valid-react-child/

import '../css/Screen.css';

class Screen extends React.Component {
    render(props) {
        return (
            <div className="screen">
                {this.propsInfo}
            </div>
        )
    }
}

export default Screen;