import React from 'react';
import Circle from './Circle.jsx';

class Row extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="Row">
        {this.props.rowArray.map((play, i) =>
          <Circle
            row={this.props.row}
            column={i}
            play={play}
            key={i} />)}
      </div>
    );
  }
}

export default Row;