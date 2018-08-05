import App from './components/App';
import EmbarkJS from 'Embark/EmbarkJS';
import React from 'react';
import ReportManager from 'Embark/contracts/ReportManager';
import {render} from 'react-dom';

window.EmbarkJS = EmbarkJS;
window.ReportManager = ReportManager;

render(<App />, document.getElementById('root'));
