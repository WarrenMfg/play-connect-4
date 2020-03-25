import React from 'react';
import Row from './Row.jsx';

class Board extends React.Component {
  constructor(props) {
    super(props);
  }

  // componentDidUpdate(prevProps, prevState) {
  //   if (prevProps.board !== this.props.board) {
  //     this.props.checkForWinner();
  //   }
  // }

  render() {
    return (
      <div className="Board" onClick={this.props.isGameWon ? null : this.props.handlePlay}>
        {this.props.board.map((row, i) =>
          <Row
          rowArray={row}
          row={i}
          key={i} />)}
      </div>
    );
  }
}

export default Board;