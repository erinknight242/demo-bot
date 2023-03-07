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
  console.log("IIFE - before try");
  try {
    response = await client.send(
      new GetSecretValueCommand({
        SecretId: secret_name,
        VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
      })
    );
  } catch (error) {
    console.log('*** In the catch');
    console.log(error);
    // For a list of exceptions thrown, see
    // https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
    throw error;
  }
  
  secret = JSON.parse(response.SecretString);
  console.log(secret);
  startApp();
})();


function startApp() {
  console.log('starting app');
  
  app = new App({
    token: secret.SLACK_BOT_TOKEN,
    signingSecret: secret.SLACK_SIGNING_SECRET,
    socketMode: false,
    appToken: ''
  });
  
  (async () => {
    // Start your app
    console.log('await app')
    await app.start(process.env.PORT || 3000);
  
    console.log('⚡️ Bolt app is running!');
  
    helloWorld(app);
  })();
}
