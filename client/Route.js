import React, { Component } from 'react';
import {render} from 'react-dom';
import {HashRouter as Router, Route, hashHistory} from 'react-router-dom';
import Landingpage from './components/Landingpage/landingpage';
import DisplayAnswer from './components/Landingpage/displayAnswers.js';
import ReactLandingpage from './components/ReactLandingpage/reactLandingpage';
import IndividualQuestion from './components/ReactLandingpage/individualquestion.js';
import Editor from './components/ReactLandingpage/texteditor.js';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import registerServiceWorker from './registerServiceWorker';

injectTapEventPlugin();

render(
  <MuiThemeProvider>
    <Router  history={hashHistory}>
     <div >
     {/*}<Route path="/" component={Landingpage} />*/}
     <Route exact path='/' component={ReactLandingpage} />
     <Route path='/displayAnswer/:question' component={DisplayAnswer} />
     </div>
    </Router>
  </MuiThemeProvider>,
  document.getElementById('root')
);
registerServiceWorker();
