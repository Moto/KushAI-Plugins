// test-plugin-manager.js
// Test script for the plugin manager

const PluginManager = require('./plugin-manager.js');
const path = require('path');

async function testPluginManager() {
  // Use the correct plugins directory
  const pluginsDir = path.join(__dirname, 'plugins');
  const pluginManager = new PluginManager(pluginsDir);
  
  console.log(`Plugins directory: ${pluginsDir}`);
  
  // Load all plugins from the plugins directory in the correct order
  console.log('\nLoading all plugins...');
  const fs = require('fs');
  
  if (fs.existsSync(pluginsDir)) {
    // Load plugins without dependencies first
    const pluginDirs = fs.readdirSync(pluginsDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    
    console.log(`Found plugin directories: ${pluginDirs.join(', ')}`);
    
    // First, load plugins without dependencies
    for (const pluginDir of pluginDirs) {
      const pluginPath = path.join(pluginsDir, pluginDir);
      const manifestPath = path.join(pluginPath, 'plugin.json');
      
      // Check if manifest exists
      if (fs.existsSync(manifestPath)) {
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
        // If no dependencies, load it now
        if (!manifest.dependencies || Object.keys(manifest.dependencies).length === 0) {
          console.log(`Loading plugin without dependencies: ${pluginPath}`);
          await pluginManager.loadPlugin(pluginPath);
        }
      }
    }
    
    // Then, load plugins with dependencies
    for (const pluginDir of pluginDirs) {
      const pluginPath = path.join(pluginsDir, pluginDir);
      const manifestPath = path.join(pluginPath, 'plugin.json');
      
      // Check if manifest exists
      if (fs.existsSync(manifestPath)) {
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
        // If has dependencies, load it now (dependencies should be loaded already)
        if (manifest.dependencies && Object.keys(manifest.dependencies).length > 0) {
          console.log(`Loading plugin with dependencies: ${pluginPath}`);
          await pluginManager.loadPlugin(pluginPath);
        }
      }
    }
  } else {
    console.log('Plugins directory does not exist');
  }
  
  // Show loaded plugins
  console.log('\nLoaded plugins:');
  const loadedPlugins = pluginManager.listPlugins();
  loadedPlugins.forEach(plugin => {
    console.log(`- ${plugin.name} (${plugin.id}) v${plugin.version}`);
    // Show dependencies if any
    const pluginInfo = pluginManager.getPluginInfo(plugin.id);
    if (pluginInfo && Object.keys(pluginInfo.dependencies).length > 0) {
      console.log(`  Dependencies: ${Object.entries(pluginInfo.dependencies).map(([dep, ver]) => `${dep} v${ver}`).join(', ')}`);
    }
  });
  
  // Show all installed plugins (including those not loaded)
  console.log('\nAll installed plugins:');
  const installedPlugins = pluginManager.listInstalledPlugins();
  installedPlugins.forEach(plugin => {
    console.log(`- ${plugin.name} (${plugin.id}) v${plugin.version} - ${plugin.loaded ? 'Loaded' : 'Not loaded'}`);
    if (Object.keys(plugin.dependencies).length > 0) {
      console.log(`  Dependencies: ${Object.entries(plugin.dependencies).map(([dep, ver]) => `${dep} v${ver}`).join(', ')}`);
    }
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
    if (commands.includes('dependent')) {
      console.log('Dependent command result:', pluginManager.executeCommand('dependent'));
    }
  } else {
    console.log('\nNo commands available to test.');
  }
}

// Run the test
testPluginManager().catch(console.error);