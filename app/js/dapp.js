import App from './components/App';
import ELeaks from 'Embark/contracts/ELeaks';
import EmbarkJS from 'Embark/EmbarkJS';
import React from 'react';
import {render} from 'react-dom';

window.EmbarkJS = EmbarkJS;
window.ELeaks = ELeaks;

render(<App />, document.getElementById('root'));
