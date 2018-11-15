import React from 'react'
import '../node_modules/materialize-css/dist/css/materialize.min.css';
import M from '../node_modules/materialize-css/dist/js/materialize.min';
import Prematch from './Modules/Prematch';
import Setup from './Modules/Setup';
import Postmatch from './Modules/Postmatch';
import Match from './Modules/Match';
import AllianceSelection from "./Modules/AllianceSelection";
const electron = window.require('electron');
const path = electron.remote.app.getPath('appData');
const fs = window.require('fs');
const { ipcRenderer } = electron;
const mongo = window.require('mongodb');
const { MongoClient } = mongo;

export default class Controls extends React.Component {
  constructor(props) {
    super(props);
    if (!fs.existsSync(`${ path }/BunnyBots/`)) {
      fs.mkdirSync(`${ path }/BunnyBots/`);
      fs.mkdirSync(`${ path }/BunnyBots/data`);
    }
    this.state = {
      inputs: null,
      edit: null
    };
    this.rankings = {};
    document.addEventListener('DOMContentLoaded', () => {
      M.Modal.init(document.querySelectorAll('.modal'));
      M.FormSelect.init(document.querySelectorAll('select'));
      if (!fs.existsSync(`${ path }/BunnyBots/credentials.json`)) {
        M.Modal.getInstance(document.getElementById('login')).open();
      } else {
        this.login();
      }
    });
  }

  handleClick(component) {
    switch (component) {
      case 'prematch1':
        this.setState({
          inputs: <Prematch control={ true } teams={ this.rankings } click={ () => Controls.send('prematch1') } />
        });
        break;
      case 'prematch2':
        this.setState({
          inputs: <Setup control={ true } start={ () => Controls.send('prematch2', 'start') } stop={ () => Controls.send('prematch2', 'stop') } reset={ () => Controls.send('prematch2', 'reset') } />
        });
        break;
      case 'match':
        this.setState({
          inputs: <Match control={ true } start={ () => Controls.send('match', 'start') } stop={ () => Controls.send('match', 'stop') } reset={ () => Controls.send('match', 'reset') } />
        });
        break;
      case 'postmatch':
        this.setState({
          inputs: <Postmatch control={ true } click={ () => Controls.send('postmatch', null, { rankings: this.rankings, _id: this._id, log: this.log }, this) } />
        });
        break;
      case 'rankings':
        this.setState({ inputs: null });
        Controls.send(component);
        break;
      case 'allianceSelection':
        this.setState({
          inputs: <AllianceSelection control={ true } teams={ this.rankings } submit={ () => Controls.send('allianceSelection', { alliance: document.getElementById('allianceSelect').value, team: document.getElementById('teamSelect').value }) } sendCaptain={ () => Controls.send('allianceSelection', { captain: [document.getElementById('seed1').value, document.getElementById('seed2').value, document.getElementById('seed3').value, document.getElementById('seed4').value] }) } toggle={ (bool) =>  Controls.send('allianceSelection', { toggle: bool }) } />
        });
        break;
    }
  }

  static modifyTeams() {
    M.Modal.getInstance(document.getElementById('modify')).open();
  }

  static send(s, data = null, stuff, cont = null) {
    if (s === 'prematch1') {
      this.teams = {
        red: {
          one: document.getElementById('red1').value.split('*%%%*'),
          two: document.getElementById('red2').value.split('*%%%*'),
          three: document.getElementById('red3').value.split('*%%%*')
        },
        blue: {
          one: document.getElementById('blue1').value.split('*%%%*'),
          two: document.getElementById('blue2').value.split('*%%%*'),
          three: document.getElementById('blue3').value.split('*%%%*')
        }
      };
      data = this.teams;
    }
    if (s === 'postmatch') {
      let credentials = JSON.parse(fs.readFileSync(`${ path }/BunnyBots/credentials.json`));
      let user = credentials.user;
      let pass = credentials.pass;
      let state = credentials.state;
      data = this.teams;
      data.red.score = document.getElementById('red').value;
      data.blue.score = document.getElementById('blue').value;
      cont.setState({
        edit: (
          <textarea id="modified" style={ { border: 'none', height: '40vh', fontFamily: 'inconsolata' } }>
              { JSON.stringify(stuff.rankings, null, '  ') }
            </textarea>
        )
      });
      MongoClient.connect(`mongodb://${ user }:${ pass }@ds215822.mlab.com:15822/bunnybots`, { useNewUrlParser: true }, (err, db) => {
        if (err) {
          throw err;
        }
        let scores = {
          red: parseInt(data.red.score) > parseInt(data.blue.score) ? parseInt(data.red.score) + 0.5 * parseInt(data.blue.score) : parseInt(data.red.score),
          blue: parseInt(data.blue.score) > parseInt(data.red.score) ? parseInt(data.blue.score) + 0.5 * parseInt(data.red.score) : parseInt(data.blue.score)
        };
        for (let alliance in this.teams) {
          if (this.teams.hasOwnProperty(alliance)) {
            for (let team in this.teams[alliance]) {
              if (this.teams[alliance].hasOwnProperty(team)) {
                if (team !== 'score') {
                  stuff.rankings[this.teams[alliance][team][0]].rp += scores[alliance];
                }
              }
            }
          }
        }
        stuff.log[(Object.keys(stuff.log).length + 1)] = this.teams;
        db.db('bunnybots').collection(state).updateOne({ _id: stuff._id.rankings }, { $set: stuff.rankings }, () => db.close());
        db.db('bunnybots').collection(state).updateOne({ _id: stuff._id.log }, { $set: stuff.log }, () => db.close());
      });
    }
    ipcRenderer.send(s, data);
  }

  login() {
    let user, pass, state;
    if (!fs.existsSync(`${ path }/BunnyBots/credentials.json`)) {
      user = document.getElementById('user').value;
      pass = document.getElementById('pass').value;
      state = document.getElementById('state').value;
    } else {
      let credentials = JSON.parse(fs.readFileSync(`${ path }/BunnyBots/credentials.json`));
      user = credentials.user;
      pass = credentials.pass;
      state = credentials.state;
    }
    MongoClient.connect(`mongodb://${ user }:${ pass }@ds215822.mlab.com:15822/bunnybots`, { useNewUrlParser: true }, (err, db) => {
      if (err) {
        throw err;
      }
      if (!fs.existsSync(`${ path }/BunnyBots/credentials.json`)) {
        fs.writeFileSync(`${ path }/BunnyBots/credentials.json`, JSON.stringify({ 'user': user, 'pass': pass, 'state': state }));
      }
      db.db('bunnybots').collection(state).find({}).toArray((err, result) => {
        if (err) {
          throw err;
        }
        this._id = { rankings: result[0]._id, log: result[1]._id };
        delete result[0]._id;
        delete result[1]._id;
        this.rankings = result[0];
        this.log = result[1];
        this.setState({
          edit: (
            <textarea id="modified" style={ { border: 'none', height: '40vh', fontFamily: 'inconsolata' } }>
              { JSON.stringify(result[0], null, '  ') }
            </textarea>
          )
        });
        db.close();
      });
    });
  }

  edit() {
    let credentials = JSON.parse(fs.readFileSync(`${ path }/BunnyBots/credentials.json`));
    let user = credentials.user;
    let pass = credentials.pass;
    let state = credentials.state;
    MongoClient.connect(`mongodb://${ user }:${ pass }@ds215822.mlab.com:15822/bunnybots`, { useNewUrlParser: true }, (err, db) => {
      if (err) {
        throw err;
      }
      this.rankings = JSON.parse(document.getElementById('modified').value);
      db.db('bunnybots').collection(state).updateOne({ _id: this._id.rankings }, { $set: this.rankings }, () => db.close());
    });
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col s12 center-align">
            <h1>BunnyBots Scorekeeping</h1>
          </div>
        </div>
        <div className="row">
          <div className="col s6">
            <div className="row">
              <div className="col s12">
                <button className="btn waves-effect waves-light" onClick={ () => this.handleClick('prematch1') }>Pre-Match Preview</button>
                <br />
                <br />
              </div>
              <div className="col s12">
                <button className="btn waves-effect waves-light" onClick={ () => this.handleClick('prematch2') }>Pre-Match Setup</button>
                <br />
                <br />
              </div>
              <div className="col s12">
                <button className="btn waves-effect waves-light" onClick={ () => this.handleClick('match') }>Match</button>
                <br />
                <br />
              </div>
              <div className="col s12">
                <button className="btn waves-effect waves-light" onClick={ () => this.handleClick('postmatch') }>Post-Match</button>
                <br />
                <br />
              </div>
              <div className="col s12">
                <button className="btn waves-effect waves-light" onClick={ () => this.handleClick('rankings') }>Rankings</button>
                <br />
                <br />
              </div>
              <div className="col s12">
                <button className="btn waves-effect waves-light" onClick={ () => this.handleClick('allianceSelection') }>Alliance Selection</button>
                <br />
                <br />
              </div>
              <div className="col s12">
                <button className="btn waves-effect waves-light" onClick={ () => Controls.modifyTeams() }>Modify Teams</button>
                <br />
                <br />
              </div>
            </div>
          </div>
          <div className="col s6">
            { this.state.inputs }
          </div>
        </div>
        <div id="login" className="modal">
          <div className="modal-content">
            <h4>Log In</h4>
            <div className="row">
              <div className="input-field col s12">
                <input id="user" type="text" className="validate" />
                <label htmlFor="user">Username</label>
              </div>
              <div className="input-field col s12">
                <input id="pass" type="password" className="validate" />
                <label htmlFor="pass">Password</label>
              </div>
              <div className="input-field col s12">
                <select id="state">
                  <option disabled selected>State</option>
                  <option value="or">Oregon</option>
                  <option value="md">Maryland</option>
                </select>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <a href="javascript:void(0)" className="modal-close waves-effect waves-green btn-flat" onClick={ () => this.login() }>Login</a>
          </div>
        </div>
        <div id="modify" className="modal">
          <div className="modal-content">
            <h4>Modify Teams</h4>
            { this.state.edit }
          </div>
          <div className="modal-footer">
            <a href="javascript:void(0)" className="modal-close waves-effect waves-green btn-flat" onClick={ () => this.edit() }>Done</a>
          </div>
        </div>
      </div>
    );
  }
}