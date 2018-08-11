import App from './components/App';
import EmbarkJS from 'Embark/EmbarkJS';
import React from 'react';
import EtherPress from 'Embark/contracts/EtherPress';
import {render} from 'react-dom';

window.EmbarkJS = EmbarkJS;
window.EtherPress = EtherPress;

render(<App />, document.getElementById('root'));
