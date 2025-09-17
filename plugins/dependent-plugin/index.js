// Dependent plugin script
function dependentPlugin(kushai) {
  // Add a command that uses functionality from the utility plugin
  kushai.addCommand('dependent', 'A command that depends on the utility plugin', (args) => {
    // In a real implementation, we would interact with the utility plugin here
    return 'This command depends on the utility plugin';
  });
}

module.exports = dependentPlugin;