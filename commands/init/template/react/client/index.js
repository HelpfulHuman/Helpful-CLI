import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux';

import createRoutes from './Contexts';
import createStore from './Services/Store';

const store = createStore();
const history = syncHistoryWithStore(browserHistory, store);

render(
  <Provider store={store}>
    <Router history={history}>
      {createRoutes(store)}
    </Router>
  </Provider>
  , document.getElementById('app')
);