import JobQueue from './job-queue.js';
import BotApiPromisified from './telegram-api-promisified.js';
import StateHolder from './state-holder.js';
import Scenario from './scenario.js';
import ScenarioWrapper from './scenario-wrapper.js';
import Validator from './scenario-wrapper.js';
import Bot from './bot.js';

export {Bot, Scenario, ScenarioWrapper, Validator, BotApiPromisified, StateHolder, JobQueue};

//import 'babel/polyfill';
import {Bot, Scenario} from 'telegram-scenario-bot';

const scenarioApi = {
  username() {
    var from = this.from,
        user_name = from.first_name || from.username;
    return user_name;
  },

  doCalculate() {
    var text = this.text,
        session = this.session;

    // ... some logic ...

    // We may store to session. Session clear when enter to root scenario
    session.acc = (session.acc || '') + text;
  },

  getCalcResult() {
    return this.session.acc;
  }
};

var script = /*... load yaml*/
var bot_scenario = new Scenario(scenarioApi, script),
    b = new Bot('124479481:AAEJSLQDxlmxowLsrAvNeUwlFtw3T2VOpck');

b.scenario(bot_scenario);
b.start();
