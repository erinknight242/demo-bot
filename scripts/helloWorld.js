module.exports = (app) => {
  // Listens to incoming messages that contain "hello"
  app.message(/hello/i, async ({ message, say }) => {
    // say() sends a message to the channel where the event was triggered
    await say(`Hey there <@${message.user}>!`);
  });

  app.message(/love you/i, async({ message, say}) => {
    await say('I love you, too!');
  });
}