const { App } = require('@slack/bolt');
const helloWorld = require('./scripts/helloWorld');

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: false,
  appToken: process.env.SLACK_APP_TOKEN,
  // Socket Mode doesn't listen on a port, but in case you want your app to respond to OAuth,
  // you still need to listen on some port!
  port: process.env.PORT || 3000
});

(async () => {
  // Start your app
  await app.start();

  console.log('⚡️ Bolt app is running!');

  helloWorld(app);
})();