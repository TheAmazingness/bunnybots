import React from 'react';
import '../node_modules/materialize-css/dist/css/materialize.min.css';
import Prematch from './Modules/Prematch';
import Setup from './Modules/Setup';
import Postmatch from './Modules/Postmatch';
import Match from './Modules/Match';
import AllianceSelection from './Modules/AllianceSelection';
const electron = window.require('electron');
const { ipcRenderer } = electron;

export default class Display extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      state: null,
      hide: false
    };
    this.setup = React.createRef();
    this.match = React.createRef();
    ipcRenderer.on('prematch1', (event, message) => this.setState({ state: <Prematch display={ true } teams={ message } />, hide: false }));
    ipcRenderer.on('prematch2', (event, message) => {
      this.setState({ state: <Setup display={ true } ref={ (component) => this.setup = component } />, hide: false });
      switch (message) {
        case 'start':
          this.setup.timer.start();
          if (this.setup.timer.percentDone() === 0) {
            new Audio('https://cgscomwww.catlin.edu/pengt/robotics/bunnysound/charge1.wav').play();
          }
          break;
        case 'stop':
          this.setup.timer.pause();
          break;
        case 'reset':
          this.setup.timer.stop();
          this.setup.setState({ time: this.setup.timer.getFt() });
          break;
      }
    });
    ipcRenderer.on('match', (event, message) => {
      this.setState({ state: <Match display={ true } ref={ (component) => this.match = component } />, hide: false });
      switch (message) {
        case 'start':
          if (this.match.auto.percentDone() === 100) {
            this.match.teleop.start();
          } else {
            this.match.auto.start();
          }
          if (this.match.auto.percentDone() === 0) {
            new Audio('https://cgscomwww.catlin.edu/pengt/robotics/bunnysound/charge1.wav').play();
          }
          break;
        case 'stop':
          try {
            this.match.auto.pause();
            this.match.teleop.pause();
          } catch (e) {}
          break;
        case 'reset':
          try {
            this.match.auto.stop();
            this.match.teleop.stop();
          } catch (e) {}
          this.match.setState({ time: this.match.auto.getFt() });
          break;
      }
    });
    let captains = [];
    let allianceTeams = {};
    let toggle = false;
    ipcRenderer.on('postmatch', (event, message) => this.setState({ state: <Postmatch display={ true } info={ message } />, hide: false }));
    ipcRenderer.on('rankings', () => this.setState({ state: <iframe title="rank" src="https://bunnybots.herokuapp.com/" style={ { border: 0, width: '100%', height: '100vh' } } />, hide: true }));
    ipcRenderer.on('allianceSelection', (event, message) => {
      if (message.captain !== undefined) {
        for (let i = 0; i < message.captain.length; i++) {
          message.captain[i] = message.captain[i].split('*%%%*');
        }
        captains = message.captain;
      }
      if (!!message.alliance && !!message.team) {
        if (allianceTeams[message.alliance] === undefined) {
          allianceTeams[message.alliance] = [];
        }
        let messageSplit = message.team.split('*%%%*');
        allianceTeams[message.alliance].push(messageSplit);
      }
      toggle = message.toggle === undefined ? false : message.toggle;
      this.setState({ state: <AllianceSelection display={ true } captain={ captains } teams={ allianceTeams } toggling={ toggle } />, hide: true });
    });
  }

  render() {
    let style = {
      height: '75vh',
      width: '100vw',
      margin: 0,
      background: 'grey'
    };
    if (this.state.hide) {
      style = {
        display: 'none'
      };
    }
    return (
      <div style={ { height: '100vh', overflow: 'hidden' } }>
        <div style={ style } />
        <div>
          { this.state.state }
        </div>
      </div>
    );
  }
}