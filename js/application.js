import introView from './screens/intro';
import greetingView from './screens/greeting';
import rulesView from './screens/rules';
import gameStart from './game';
import statsView from './screens/stats';

const mainContainer = document.getElementById('main');
const renderTemplate = (element, container = mainContainer) => {
  container.innerHTML = '';
  container.appendChild(element);
};

export default class Application {
  static showIntro() {
    renderTemplate(introView());
  }

  static showGreating() {
    renderTemplate(greetingView());
  }

  static showRules() {
    renderTemplate(rulesView());
  }

  static showGame(username) {
    renderTemplate(gameStart(username));
  }

  static showStats(state) {
    renderTemplate(statsView(state));
  }
}