import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Controls from './Controls';
import Display from './Display';

export default class ViewManager extends React.Component {
  static Views() {
    return {
      controls: <Controls />,
      display: <Display />
    }
  }

  static View(props) {
    let name = props.location.search.substr(1);
    let view = ViewManager.Views()[name];
    if (view == null) {
      throw new Error(`View '${ name }' is undefined`);
    }
    return view;
  }

  render() {
    return (
      <Router>
        <div>
          <Route path="/" component={ ViewManager.View } />
        </div>
      </Router>
    );
  }
}