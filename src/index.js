import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root') );

// Webpack Hot Module Replacement
if (module.hot) {
	module.hot.accept();
}

// Service Worker for caching offline contents
registerServiceWorker();
