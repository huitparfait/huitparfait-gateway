'use strict';

const config = require('../src/config/config');
const jwt = require('../src/utils/jwt');
const prompt = require('prompt');
const request = require('superagent');
const { promisify } = require('util');

const asyncPrompt = promisify(prompt.get);

prompt.message = '';
prompt.colors = false;
prompt.start();

const API_URL = config.get('API_URL');
const johnBearerHeader = jwt.getJwtBearerHeader({ sub: '15c336ea-091b-425a-a99b-190179623ad4' });

request
  .get(`${API_URL}/api/users/me/predictions/next-days`)
  .set('Authorization', johnBearerHeader)
  .then(async (res) => {

    const now = new Date().toISOString();
    const games = Object
      .values(res.body)
      .reduce((a, b) => [...a, ...b], [])
      .filter(({ startsAt }) => startsAt < now);

    for (const g of games) {

      const gameData = await asyncPrompt([
        promptNumber('goalsTeamA', `${g.gameName} : ${g.nameTeamA}`, g.goalsTeamA),
        promptNumber('goalsTeamB', `${g.gameName} : ${g.nameTeamB}`, g.goalsTeamB),
        promptBoolean('riskHappened', `${g.gameName} : ${g.riskTitle} ?`, g.riskHappened),
      ]);

      const { confirmUpdate } = await asyncPrompt([
        promptBoolean('confirmUpdate', `Update ${g.gameName} with ${JSON.stringify(gameData)}`, true),
      ]);

      if (confirmUpdate) {
        const { body: updatedGame } = await updateGame(g.gameId, gameData);
        console.log(updatedGame);
        console.log('');
      }
    }

    const { confirmUpdatePredictionPoints } = await asyncPrompt([
      promptBoolean('confirmUpdatePredictionPoints', `Update prediction points`, true),
    ]);
    if (confirmUpdatePredictionPoints) {
      const { body: updatedList } = await updatePredictionPoints();
      console.log(`${updatedList.length} predictions updated!`);
      console.log('');
    }
  })
  .catch(console.error);

function promptNumber (name, description, defaultValue) {
  return {
    name,
    description,
    type: 'integer',
    message: 'Must be a number',
    'default': defaultValue != null ? String(defaultValue) : '',
    required: true,
  };
}

function promptBoolean (name, description, defaultValue) {
  return {
    name,
    description,
    type: 'boolean',
    message: 'Must be true or false',
    'default': defaultValue != null ? String(defaultValue) : '',
    required: true,
  };
}

function updateGame (gameId, gameData) {
  const adminBearerHeader = jwt.getJwtBearerHeader({ isAdmin: true });
  return request
    .put(`${API_URL}/api/games/${gameId}/scores`)
    .set('Authorization', adminBearerHeader)
    .send(gameData);
}

function updatePredictionPoints () {
  const adminBearerHeader = jwt.getJwtBearerHeader({ isAdmin: true });
  return request
    .post(`${API_URL}/api/prediction-points/compute`)
    .set('Authorization', adminBearerHeader);
}
