import React from 'react';
import ReactDOM from 'react-dom';

// eslint-disable-next-line
import setupCustomValidators from './customValidators';
import * as serviceWorker from './serviceWorker';

import Shell from './apps/piramis-shell';
//styles
import 'jsoneditor-react/es/editor.min.css';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './layout/layout.css';

ReactDOM.render(<Shell />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
