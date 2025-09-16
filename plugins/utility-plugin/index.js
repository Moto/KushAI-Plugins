// Utility plugin script
function utilityPlugin(kushai) {
  // Add a command to generate a random number
  kushai.addCommand('random', 'Generate a random number between 1 and 100', (args) => {
    return Math.floor(Math.random() * 100) + 1;
  });

  // Add a command to get the current time
  kushai.addCommand('time', 'Get the current time', (args) => {
    return new Date().toLocaleTimeString();
  });

  // Add a command to reverse a string
  kushai.addCommand('reverse', 'Reverse a string', (args) => {
    if (args.length === 0) {
      return "Please provide a string to reverse";
    }
    return args.join(' ').split('').reverse().join('');
  });
}

module.exports = utilityPlugin;