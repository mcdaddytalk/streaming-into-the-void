const fs = require('fs');
const request = require('request-promise-native');
const Config = require('../config.json');

module.exports = refreshAccessToken = async() => {
  // update access token!
  try {
    const response = await request.post('https://id.twitch.tv/oauth2/token', { form: {
      client_id: Config.twitch_secrets.client_id,
      client_secret: Config.twitch_secrets.client_secret,
      grant_type: 'client_credentials'
    }});
    Config.token = JSON.parse(response);
    fs.writeFile('./config.json', JSON.stringify(Config), (err) => {
      if(err) console.log('Could not save new token', err);
      console.log('Refreshed access token\n', response);
    })
  } catch(e) {
    console.log('Couldn\'t update access token', e.error);
  }
}