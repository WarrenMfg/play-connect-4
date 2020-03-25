import React from 'react';
import Board from './Board.jsx';
import Scoreboard from './Scoreboard.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      board: [
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null]
      ],
      isGameWon: false,
      winner: null,
      turn: 1,
      insertId: null,
      currentScore: 0,
      scores: [120, 114, 99] // these nums should not be rendered
    };
    this.handlePlay = this.handlePlay.bind(this);
    this.handleRestart = this.handleRestart.bind(this);
  }

  componentDidMount() {
    // fetch scores here
    fetch('/api/onload')
      .then(data => data.json())
      .then(scores => {
        this.setState({scores: scores});
      })
      .catch(err => console.log('componentDidMount fetch failed:', err));
    // setState with scores
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.turn !== this.state.turn) {
      this.checkForWinner();
    }
  }

  checkForWinner() {
    let row = this.checkRows(); // receives 1 or 2 or false
    let column = this.checkColumns();
    let forwardD = this.checkForwardD();
    let backwardD = this.checkBackwardD();

    // check for winner
    if (row || column || forwardD || backwardD) {
      let newScore = {
        score: this.state.currentScore + 1,
        insertId: this.state.insertId
      };

      // if id assigned
      if (this.state.insertId) {
        fetch('/api/update-score', {
          method: 'PUT',
          body: JSON.stringify(newScore),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(data => data.json())
        .then(data => {
          this.setState({
            isGameWon: true,
            winner: row || column || forwardD || backwardD,
            currentScore: data[data.length - 1].score,
            scores: data
          });
        })
        .catch(err => console.log('error updating score'));

      } else { // no id assigned

        fetch('/api/add-score', {
          method: 'POST',
          body: JSON.stringify(newScore),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(data => data.json())
        .then(data => {
          this.setState({
            isGameWon: true,
            winner: row || column || forwardD || backwardD,
            insertId: data[data.length - 1].id,
            currentScore: data[data.length - 1].score,
            scores: data
          });
        })
        .catch(err => console.log('error adding score', err));
      }

    } else if (this.state.turn === 2) {
      setTimeout(() => this.playerTwosTurn(), Math.floor(Math.random() * 1250));
    }
  }

  checkRows() {
    let playerOne = 0;
    let playerTwo = 0;
    let board = this.state.board;
    for (let i = 0; i < board.length; i++) {
      let row = board[i];
      for (let j = 0; j < row.length; j++) {
        // check playerOne
        if (row[j] === 1) {
          playerOne++;
          if (playerOne === 4) {
            return 1;
          }
        } else {
          playerOne = 0;
        }

        // check playerTwo
        if (row[j] === 2) {
          playerTwo++;
          if (playerTwo === 4) {
            return 2;
          }
        } else {
          playerTwo = 0;
        }
      }
    }
    return false;
  }

  checkColumns() {
    let playerOne = 0;
    let playerTwo = 0;
    let board = this.state.board;
    let rowLength = this.state.board[0].length;

    for (let i = 0; i < rowLength; i++) {
      for (let j = 0; j < board.length; j++) {
        // check playerOne
        if (board[j][i] === 1) {
          playerOne++;
          if (playerOne === 4) {
            return 1;
          }
        } else {
          playerOne = 0;
        }

        // check playerTwo
        if (board[j][i] === 2) {
          playerTwo++;
          if (playerTwo === 4) {
            return 2;
          }
        } else {
          playerTwo = 0;
        }
      }
    }
    return false;
  }

  checkForwardD() {
    let board = this.state.board;

    for (let i = board.length - 1; i >= 0; i--) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j]) {
          let isD = this.isPlayForwardD(board[i][j], (i - 1), (j + 1)); // player, row - 1, col + 1
          if (isD) {
            return isD;
          }
        }
      }
    }
    return false;
  }

  isPlayForwardD(player, row, column) {
    let count = 1; // bc already counting play from checkForwardD
    let board = this.state.board;

    for (let i = row; i >= 0; i--) {
      if (board[i][column] === player) {
        count++;
        if (count === 4) {
          return player;
        }
      } else {
        return false;
      }
      column++; // check next forwardD
    }
    return false; // i < 0
  }

  checkBackwardD() {
    let board = this.state.board;

    for (let i = board.length - 1; i >= 0; i--) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j]) {
          let isD = this.isPlayBackwardD(board[i][j], (i - 1), (j - 1)); // player, row - 1, col - 1
          if (isD) {
            return isD;
          }
        }
      }
    }
    return false;
  }

  isPlayBackwardD(player, row, column) {
    let count = 1; // bc already counting play from checkBackwardD
    let board = this.state.board;

    for (let i = row; i >= 0; i--) {
      if (board[i][column] === player) {
        count++;
        if (count === 4) {
          return player;
        }
      } else {
        return false;
      }
      column--; // check next forwardD
    }
    return false; // i < 0
  }

  handlePlay(e, playerTwo) {
    if ('row' in e.target.dataset && 'column' in e.target.dataset) { // if click is a circle

      let board = this.state.board;
      let column = playerTwo ?
        parseInt(playerTwo.target.dataset.column, 10) :
        parseInt(e.target.dataset.column, 10);

      if (board[0][column] === null) { // if column is not filled up yet
        // figure out which row to place play
        for (let row = 0; row < board.length; row++) {
          if (board[row][column]) {
            this.setState(prevState => {
              prevState.board[row - 1][column] = playerTwo ? 2 : 1;
              return {board: prevState.board, turn: prevState.turn === 1 ? 2 : 1};
            });
            return;
          }
        }
        this.setState(prevState => {
          prevState.board[prevState.board.length - 1][column] = playerTwo ? 2 : 1;
          return {board: prevState.board, turn: prevState.turn === 1 ? 2 : 1};
        });

      } else if (this.state.turn === 2) {
        this.playerTwosTurn(); // to handle column's random number landing on full col
      }
    }
  }

  playerTwosTurn() {
    let playerTwo = {
      target: {
        dataset: {
          column: Math.floor(Math.random() * this.state.board.length),
          row: Math.floor(Math.random() * this.state.board[0].length)
        }
      }
    };

    this.handlePlay(playerTwo, playerTwo);
  }

  handleRestart() {
    this.setState({
      board: [
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null]
      ],
      isGameWon: false,
      winner: null,
      turn: 1
    })
  }

  render() {
    return (
      <div className="App">
        <div className="App-game">
        <h1>Connect Four</h1>
        <h2>The vertical four-in-a-row checkers game</h2>
        <h3>You are Player 1 (red)</h3>
        <Board
          board={this.state.board}
          handlePlay={this.state.turn === 1 ? this.handlePlay : null}
          isGameWon={this.state.isGameWon}
        />
        {this.state.isGameWon ?
          <h1 className="App-winner">PLAYER {this.state.winner} WINS!!!</h1> :
          <h1>{this.state.turn === 1 ? "Player 1's turn" : "Player 2's turn"}</h1>}
        <button
          className="App-restart"
          onClick={this.handleRestart}
        >Restart</button>
        </div>
        <div className="App-scoreboard">
          <h1>Scoreboard</h1>
          <h2>All-time Top Scores</h2>
          <h3>Try to make it to the top!</h3>
          <Scoreboard scores={this.state.scores} />
        </div>

      </div>
    );
  }
}

export default App;