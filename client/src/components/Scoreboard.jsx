import React from 'react';
import Score from './Score.jsx';

class Scoreboard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="Scoreboard">
        {this.props.scores
          .map(score => score)
          .sort((a, b) => a.score - b.score)
          .reverse()
          .map((score, i) => <Score score={score} key={i} />)}
      </div>
    );
  }
}

export default Scoreboard;