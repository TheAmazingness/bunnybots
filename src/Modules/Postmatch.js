import React from 'react'
import '../../node_modules/materialize-css/dist/css/materialize.min.css';

export default class Postmatch extends React.Component {
  handleClick() {
    this.props.click();
    new Audio('https://cgscomwww.catlin.edu/pengt/robotics/bunnysound/Woosh.wav').play();
  }

  render() {
    if (this.props.control) {
      return (
        <div className="row">
          <div className="col s12">
            <h3>Final Score:</h3>
          </div>
          <div className="input-field col s6">
            <input id="red" type="number" className="validate"/>
              <label htmlFor="red">Red Score</label>
          </div>
          <div className="input-field col s6">
            <input id="blue" type="number" className="validate"/>
            <label htmlFor="blue">Blue Score</label>
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
              <div className="col s2 offset-s1">
                <h4 style={ style }>{ this.props.info.red.one[0] }</h4>
                <br />
                <h4 style={ style }>{ this.props.info.red.two[0] }</h4>
              </div>
              <div className="col s2">
                <h4 style={ style }>{ this.props.info.red.three[0] }</h4>
              </div>
              <div className="col s7">
                <h4>Red Score:</h4>
                <h1 style={ { fontWeight: 'bold', fontSize: '60pt', margin: 0 } }>{ this.props.info.red.score }</h1>
              </div>
            </div>
          </div>
          <div className="col s6">
            <div className="valign-wrapper row" style={ { color: '#8787ff', background: '#444', borderRadius: '10px', height: '20vh', margin: 'auto' } }>
              <div className="col s2 offset-s1">
                <h4 style={ style }>{ this.props.info.blue.one[0] }</h4>
                <br />
                <h4 style={ style }>{ this.props.info.blue.two[0] }</h4>
              </div>
              <div className="col s2">
                <h4 style={ style }>{ this.props.info.blue.three[0] }</h4>
              </div>
              <div className="col s7">
                <h4>Blue Score:</h4>
                <h1 style={ { fontWeight: 'bold', fontSize: '60pt', margin: 0 } }>{ this.props.info.blue.score }</h1>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}