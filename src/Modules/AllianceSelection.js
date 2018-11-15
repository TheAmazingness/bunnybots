import React from 'react';
import '../../node_modules/materialize-css/dist/css/materialize.min.css';
import M from '../../node_modules/materialize-css/dist/js/materialize.min';
const fs = window.require('fs');
const electron = window.require('electron');
const path = electron.remote.app.getPath('appData');
const mongo = window.require('mongodb');
const { MongoClient } = mongo;

export default class AllianceSelection extends React.Component {
  constructor(props) {
    super(props);
    this.isToggle = false;
    this.state = {
      allTeams: undefined
    };
  }

  handleClick() {
    this.props.submit();
  }

  static setCaptain() {
    M.Modal.init(document.querySelectorAll('.modal'));
    M.Modal.getInstance(document.getElementById('playoffs')).open();
  }

  toggle() {
    this.isToggle = !this.isToggle;
    this.props.toggle(this.isToggle);
  }

  sendCaptain() {
    this.props.sendCaptain();
  }

  // update() {
  //   if (this.allTeams === undefined) {
  //   } else {
  //     for (let i = 0; i < this.allTeams.length; i++) {
  //       for (let j = 0; j < Object.keys(this.props.teams).length; j++) {
  //         for (let k = 0; k < this.props.teams[j].length; k++) {
  //           if (this.allTeams[i] === this.props.teams[j][k][0]) {
  //             this.allTeams.splice(i, 1);
  //           }
  //         }
  //       }
  //       for (let j = 0; j < this.props.captain.length; j++) {
  //         if (this.allTeams[i] === this.props.captain[j][0]) {
  //           this.allTeams.splice(i, 1);
  //         }
  //       }
  //     }
  //     this.setState({
  //       allTeams: this.allTeams.map((team) => <div key={ team } className="col s3"><br /><h4>{ team }</h4></div>)
  //     });
  //   }
  // }

  render() {
    if (this.props.control) {
      let jsx = Object.keys(this.props.teams).map((team) =>
        <option value={ `${ team }*%%%*${ this.props.teams[team].name }` } key={ team }>{ team } - { this.props.teams[team].name }</option>
      );
      return (
        <div>
          <h3>Alliance Selection</h3>
          <br />
          <br />
          <select className="browser-default" id="allianceSelect">
            <option value="undefined" disabled selected>Select Alliance</option>
            <option value="0">Alliance 1</option>
            <option value="1">Alliance 2</option>
            <option value="2">Alliance 3</option>
            <option value="3">Alliance 4</option>
          </select>
          <br />
          <select className="browser-default" id="teamSelect">
            <option value="undefined" disabled selected>Select Team</option>
            { jsx }
          </select>
          <br />
          <button className="btn waves-effect waves-light" onClick={ () => this.handleClick() }>Submit</button>
          <br />
          <br />
          <button className="btn waves-effect waves-light" onClick={ () => AllianceSelection.setCaptain() }>Set Alliance Captains</button>
          <br />
          <br />
          <button className="btn waves-effect waves-light" onClick={ () => this.toggle() }>Toggle</button>
          <div id="playoffs" className="modal">
            <div className="modal-content">
              <select className="browser-default" id="seed1">
                <option value="undefined" disabled selected>First Seed</option>
                { jsx }
              </select>
              <br />
              <select className="browser-default" id="seed2">
                <option value="undefined" disabled selected>Second Seed</option>
                { jsx }
              </select>
              <br />
              <select className="browser-default" id="seed3">
                <option value="undefined" disabled selected>Third Seed</option>
                { jsx }
              </select>
              <br />
              <select className="browser-default" id="seed4">
                <option value="undefined" disabled selected>Fourth Seed</option>
                { jsx }
              </select>
            </div>
            <div className="modal-footer">
              <a href="javascript:void(0)" className="modal-close waves-effect waves-green btn-flat" onClick={ () => this.sendCaptain() }>Submit</a>
            </div>
          </div>
        </div>
      );
    } else if (this.props.display) {
      if (this.props.toggling) {
        let credentials = JSON.parse(fs.readFileSync(`${ path }/BunnyBots/credentials.json`));
        MongoClient.connect(`mongodb://${ credentials.user }:${ credentials.pass }@ds215822.mlab.com:15822/bunnybots`, { useNewUrlParser: true }, (err, db) => {
          if (err) {
            throw err;
          }
          db.db('bunnybots').collection(credentials.state).find({}).toArray((err, result) => {
            delete result[0]._id;
            this.allTeams = Object.keys(result[0]);
            this.teamsCopy = this.allTeams;
            this.rp = [];
            for (let i = 0; i < this.allTeams.length; i++) {
              this.rp.push(result[0][this.allTeams[i]].rp);
            }
            this.rp.sort((a, b) => { return b - a });
            this.sortedTeams = [];
            for (let i = 0; i < Object.keys(this.props.teams).length; i++) {
              for (let j = 0; j < this.props.teams[i].length; j++) {
                if (this.allTeams.indexOf(this.props.teams[i][j][0]) >= 0) {
                  this.allTeams.splice(this.allTeams.indexOf(this.props.teams[i][j][0]), 1);
                }
              }
            }
            for (let i = 0; i < this.props.captain.length; i++) {
              if (this.allTeams.indexOf(this.props.captain[i][0]) >= 0) {
                this.allTeams.splice(this.allTeams.indexOf(this.props.captain[i][0]), 1);
              }
            }
            for (let i = 0; i < this.rp.length; i++) {
              for (let j = 0; j < this.teamsCopy.length; j++) {
                if (this.rp[i] === result[0][this.teamsCopy[j]].rp) {
                  this.sortedTeams.push([this.teamsCopy[j],result[0][this.teamsCopy[j]].rp]);
                  this.teamsCopy.splice(j, 1);
                  break;
                }
              }
            }
            this.setState({
              allTeams: this.sortedTeams.map((team) => <div key={ team[0] + Math.random() } className="col s2"><br /><h4>{ team[0] } - { team[1] }</h4></div>)
            });
            db.close();
          });
        });
        return (
          <div className="center-align">
            <h1>Teams</h1>
            <div className="row">
              { this.state.allTeams }
            </div>
          </div>
        );
      } else {
        return (
          <div style={ { border: 0, width: '100%', height: '100vh', background: '#444', color: 'white', textAlign: 'center' } } className="row">
            <div className="col s6" style={ { height: '50vh', border: '5px solid black' } }>
              <h1 style={ { fontWeight: 'bold' } }>{ this.props.captain[0][0] }</h1>
              <h5>{ this.props.captain[0][1] }</h5>
              <div className="row">
                { this.props.teams[0] !== undefined ? this.props.teams[0].map((team) => <div className="col s4"><br /><h4>{ team[0] }</h4><h6>{ team[1] }</h6></div>) : '' }
              </div>
            </div>
            <div className="col s6" style={ { height: '50vh', border: '5px solid black' } }>
              <h1 style={ { fontWeight: 'bold' } }>{ this.props.captain[1][0] }</h1>
              <h5>{ this.props.captain[1][1] }</h5>
              <div className="row">
                { this.props.teams[1] !== undefined ? this.props.teams[1].map((team) => <div className="col s4"><br /><h4>{ team[0] }</h4><h6>{ team[1] }</h6></div>) : '' }
              </div>
            </div>
            <div className="col s6" style={ { height: '50vh', border: '5px solid black' } }>
              <h1 style={ { fontWeight: 'bold' } }>{ this.props.captain[2][0] }</h1>
              <h5>{ this.props.captain[2][1] }</h5>
              <div className="row">
                { this.props.teams[2] !== undefined ? this.props.teams[2].map((team) => <div className="col s4"><br /><h4>{ team[0] }</h4><h6>{ team[1] }</h6></div>) : '' }
              </div>
            </div>
            <div className="col s6" style={ { height: '50vh', border: '5px solid black' } }>
              <h1 style={ { fontWeight: 'bold' } }>{ this.props.captain[3][0] }</h1>
              <h5>{ this.props.captain[3][1] }</h5>
              <div className="row">
                { this.props.teams[3] !== undefined ? this.props.teams[3].map((team) => <div className="col s4"><br /><h4>{ team[0] }</h4><h6>{ team[1] }</h6></div>) : '' }
              </div>
            </div>
          </div>
        );
      }
    }
  }
}