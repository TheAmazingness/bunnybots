import React from 'react'
import '../../node_modules/materialize-css/dist/css/materialize.min.css';

export default class Prematch extends React.Component {
  constructor(props) {
    super(props);
  }

  handleClick() {
    this.props.click();
  }

  render() {
    if (this.props.control) {
      let jsx = Object.keys(this.props.teams).map((team) =>
        <option value={ `${ team }*%%%*${ this.props.teams[team].name }` } key={ team }>{ team } - { this.props.teams[team].name }</option>
      );
      return (
        <div className="row">
          <div className="col s12">
            <h3>Enter Teams:</h3>
          </div>
          <div className="col s6">
            <h6>Red Alliance:</h6>
            <select className="browser-default" id="red1">
              <option value="undefined" disabled selected>Red 1</option>
              { jsx }
            </select>
            <br />
            <select className="browser-default" id="red2">
              <option value="undefined" disabled selected>Red 2</option>
              { jsx }
            </select>
            <br />
            <select className="browser-default" id="red3">
              <option value="undefined" disabled selected>Red 3</option>
              { jsx }
            </select>
          </div>
          <div className="col s6">
            <h6>Blue Alliance:</h6>
            <select className="browser-default" id="blue1">
              <option value="undefined" disabled selected>Blue 1</option>
              { jsx }
            </select>
            <br />
            <select className="browser-default" id="blue2">
              <option value="undefined" disabled selected>Blue 2</option>
              { jsx }
            </select>
            <br />
            <select className="browser-default" id="blue3">
              <option value="undefined" disabled selected>Blue 3</option>
              { jsx }
            </select>
          </div>
          <div className="col s12">
            <br />
            <br />
            <button className="btn waves-effect waves-light" onClick={ () => this.handleClick() }>Submit</button>
          </div>
        </div>
      );
    } else if (this.props.display) {
      let style = {
        textAlign: 'center',
        margin: 'auto'
      };
      return (
        <div className="row center-align">
          <br />
          <div className="col s6">
            <div className="valign-wrapper row" style={ { color: '#ff6f6f', background: '#444', borderRadius: '10px', height: '20vh', margin: 'auto' } }>
              <div className="col s4">
                <h4 style={ style }>{ `${ this.props.teams.red.one[0] }: ${ this.props.teams.red.one[1] }` }</h4>
              </div>
              <div className="col s4">
                <h4 style={ style }>{ `${ this.props.teams.red.two[0] }: ${ this.props.teams.red.two[1] }` }</h4>
              </div>
              <div className="col s4">
                <h4 style={ style }>{ `${ this.props.teams.red.three[0] }: ${ this.props.teams.red.three[1] }` }</h4>
              </div>
            </div>
          </div>
          <div className="col s6">
            <div className="valign-wrapper row" style={ { color: '#8787ff', background: '#444', borderRadius: '10px', height: '20vh', margin: 'auto' } }>
              <div className="col s4">
                <h4 style={ style }>{ `${ this.props.teams.blue.one[0] }: ${ this.props.teams.blue.one[1] }` }</h4>
              </div>
              <div className="col s4">
                <h4 style={ style }>{ `${ this.props.teams.blue.two[0] }: ${ this.props.teams.blue.two[1] }` }</h4>
              </div>
              <div className="col s4">
                <h4 style={ style }>{ `${ this.props.teams.blue.three[0] }: ${ this.props.teams.blue.three[1] }` }</h4>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}