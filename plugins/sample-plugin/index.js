// Sample plugin script
function samplePlugin(kushai) {
  // Add a simple command
  kushai.addCommand('sample', 'A sample command from the plugin', (args) => {
    return 'Hello from the sample plugin!';
  });
}

module.exports = samplePlugin;