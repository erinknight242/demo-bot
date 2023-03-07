const { App } = require('@slack/bolt');
const helloWorld = require('./scripts/helloWorld');
const {
  SecretsManagerClient,
  GetSecretValueCommand,
} = require("@aws-sdk/client-secrets-manager");

const secret_name = "AWS-bot-demo";

const client = new SecretsManagerClient({
  region: "us-east-2",
});

let response;
let secret;
let app;

(async () => {
  try {
    response = await client.send(
      new GetSecretValueCommand({
        SecretId: secret_name,
        VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
      })
    );
  } catch (error) {
    // For a list of exceptions thrown, see
    // https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
    throw error;
  }
  
  secret = JSON.parse(response.SecretString);
  startApp();
})();


function startApp() {
  app = new App({
    token: secret.SLACK_BOT_TOKEN,
    signingSecret: secret.SLACK_SIGNING_SECRET,
    socketMode: false,
    appToken: '',
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
}
