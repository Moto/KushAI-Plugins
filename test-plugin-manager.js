// test-plugin-manager.js
// Test script for the plugin manager

const PluginManager = require('../plugin-manager.js');
const path = require('path');

async function testPluginManager() {
  const pluginManager = new PluginManager();
  
  // Load a sample plugin (assuming it exists in the plugins directory)
  const samplePluginPath = path.join(__dirname, 'plugins', 'sample-plugin');
  const sampleLoaded = await pluginManager.loadPlugin(samplePluginPath);
  
  if (!sampleLoaded) {
    console.log('Sample plugin not found, skipping...');
  }
  
  // Load the utility plugin
  const utilityPluginPath = path.join(__dirname, 'plugins', 'utility-plugin');
  const utilityLoaded = await pluginManager.loadPlugin(utilityPluginPath);
  
  if (!utilityLoaded) {
    console.log('Utility plugin not found, skipping...');
  }
  
  // Load the productivity plugin
  const productivityPluginPath = path.join(__dirname, 'plugins', 'productivity-plugin');
  const productivityLoaded = await pluginManager.loadPlugin(productivityPluginPath);
  
  if (!productivityLoaded) {
    console.log('Productivity plugin not found, skipping...');
  }
  
  // Show loaded plugins
  console.log('Loaded plugins:');
  const plugins = pluginManager.listPlugins();
  plugins.forEach(plugin => {
    console.log(`- ${plugin.name} (${plugin.id}) v${plugin.version}`);
  });
  
  // Show available commands
  console.log('\nAvailable commands:');
  const commands = pluginManager.getCommands();
  commands.forEach(command => {
    const info = pluginManager.getCommandInfo(command);
    console.log(`- /${command}: ${info.description}`);
  });
  
  // Test some commands if plugins were loaded
  if (commands.length > 0) {
    console.log('\nTesting commands:');
    if (commands.includes('sample')) {
      console.log('Sample command result:', pluginManager.executeCommand('sample'));
    }
    if (commands.includes('random')) {
      console.log('Random number:', pluginManager.executeCommand('random'));
    }
    if (commands.includes('time')) {
      console.log('Current time:', pluginManager.executeCommand('time'));
    }
    if (commands.includes('reverse')) {
      console.log('Reversed text:', pluginManager.executeCommand('reverse', ['hello', 'world']));
    }
  } else {
    console.log('\nNo commands available to test.');
  }
}

// Run the test
testPluginManager().catch(console.error);