import App from './components/App';
import EmbarkJS from 'Embark/EmbarkJS';
import EtherPress from 'Embark/contracts/EtherPress';
import React from 'react';
import {render} from 'react-dom';

window.EmbarkJS = EmbarkJS;
window.EtherPress = EtherPress;

render(<App />, document.getElementById('root'));
