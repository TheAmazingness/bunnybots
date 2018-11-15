import React from 'react'
import '../../node_modules/materialize-css/dist/css/materialize.min.css';
import Timr from 'timrjs';

export default class Match extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      time: '00:15'
    }
  }

  componentDidMount() {
    this.teleop = Timr(136).ticker(({ formattedTime, percentDone }) => {
      if (percentDone === 100) {
        new Audio('https://cgscomwww.catlin.edu/pengt/robotics/bunnysound/buzzer.wav').play();
      } else if (percentDone === 78) {
        new Audio('https://cgscomwww.catlin.edu/pengt/robotics/bunnysound/endgame.ogg').play();
      }
      this.setState({ time: formattedTime });
    });
    this.auto = Timr(15).ticker(({ formattedTime, percentDone }) => {
      this.setState({ time: formattedTime });
      if (percentDone === 100) {
        this.teleop.start();
        new Audio('https://cgscomwww.catlin.edu/pengt/robotics/bunnysound/three-bells.wav').play();
      }
    });
  }

  handleStart() {
    this.props.start();
  }

  handleStop() {
    this.props.stop();
  }

  handleReset() {
    this.props.reset();
  }

  render() {
    if (this.props.control) {
      return (
        <div>
          <h3>Match Timer</h3>
          <br />
          <br />
          <button className="btn waves-effect waves-light" onClick={ () => this.handleStart() }>Start Timer</button>
          <br />
          <br />
          <button className="btn waves-effect waves-light red" onClick={ () => this.handleStop() }>Stop Timer</button>
          <br />
          <br />
          <button className="btn waves-effect waves-light" onClick={ () => this.handleReset() }>Reset Timer</button>
        </div>
      );
    } else if (this.props.display) {
      return (
        <div className="valign-wrapper" style={ { height: '25vh' } }>
          <br />
          <div className="center-align valign-wrapper" style={ { width: '90%', background: '#444', color: 'white', margin: 'auto', borderRadius: '10px', maxHeight: '20vh' } }>
            <br />
            <div className="center-align" style={ { width: '100%' } }>
              <h1 style={ { fontSize: '55pt' } }>{ this.state.time }</h1>
            </div>
            <br />
          </div>
        </div>
      );
    }
  }
}