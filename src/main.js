import './style.css';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import welcomeHtml from './components/welcome.html?raw';
import gameHtml from './components/game.html?raw';

import { game } from './game.js';

import { injectSpeedInsights } from '@vercel/speed-insights';

document.querySelector('#app').innerHTML = welcomeHtml;
injectSpeedInsights();

document.addEventListener('click', (e) => {
  const startBtn = e.target.closest('#start-btn');
  const backBtn = e.target.closest('#back-btn');

  if (startBtn) {
    document.querySelector('#app').innerHTML = gameHtml;
    game();
  } else if (backBtn) {
    document.querySelector('#app').innerHTML = welcomeHtml;
  }
});
