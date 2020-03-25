import React from 'react';

class Circle extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    // props: row, column, player
    return (
      <span
        className={`Circle ${this.props.play === 1 ? "Circle-playerOne" : this.props.play === 2 ? "Circle-playerTwo" : ""}`}
        data-row={this.props.row}
        data-column={this.props.column}
        data-play={this.props.play} // is this needed?
      >&nbsp;</span>
    );
  }
}

export default Circle;