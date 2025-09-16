// kushai-with-plugins.js
// Example of how to integrate the plugin manager into the main KushAI application

const PluginManager = require('./plugin-manager.js');
const path = require('path');

class KushAI {
  constructor() {
    this.pluginManager = new PluginManager();
    this.isRunning = false;
  }

  // Initialize KushAI with plugins
  async initialize() {
    console.log('Initializing KushAI with plugin support...');
    
    // Load all plugins from the plugins directory
    const pluginsDir = path.join(__dirname, 'plugins');
    const fs = require('fs');
    
    if (fs.existsSync(pluginsDir)) {
      const pluginDirs = fs.readdirSync(pluginsDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
      
      for (const pluginDir of pluginDirs) {
        const pluginPath = path.join(pluginsDir, pluginDir);
        await this.pluginManager.loadPlugin(pluginPath);
      }
    }
    
    console.log('KushAI initialized with plugins!');
  }

  // Process a user command
  processCommand(input) {
    // Remove the leading slash if present
    const commandText = input.startsWith('/') ? input.slice(1) : input;
    
    // Split the command into name and arguments
    const parts = commandText.split(' ');
    const commandName = parts[0];
    const args = parts.slice(1);
    
    // Execute the command
    return this.pluginManager.executeCommand(commandName, args);
  }

  // Get help information
  getHelp() {
    const commands = this.pluginManager.getCommands();
    if (commands.length === 0) {
      return "No commands available. Please install some plugins.";
    }
    
    let helpText = "Available commands:\n";
    commands.forEach(command => {
      const info = this.pluginManager.getCommandInfo(command);
      helpText += `/${command} - ${info.description}\n`;
    });
    
    return helpText;
  }

  // List all loaded plugins
  listPlugins() {
    const plugins = this.pluginManager.listPlugins();
    if (plugins.length === 0) {
      return "No plugins loaded.";
    }
    
    let pluginList = "Loaded plugins:\n";
    plugins.forEach(plugin => {
      pluginList += `${plugin.name} (${plugin.id}) v${plugin.version} - ${plugin.description}\n`;
    });
    
    return pluginList;
  }

  // Start the KushAI application
  async start() {
    await this.initialize();
    this.isRunning = true;
    console.log("KushAI is running! Type 'help' for available commands or 'exit' to quit.");
    
    // Simulate a simple command loop
    this.commandLoop();
  }

  // Simple command loop (in a real app, this would be replaced with actual UI/input handling)
  commandLoop() {
    if (!this.isRunning) return;
    
    // In a real application, you would have actual input handling here
    // For this example, we'll just demonstrate a few commands
    
    console.log("\n--- Example Commands ---");
    console.log("Input: /help");
    console.log("Output:", this.getHelp());
    
    console.log("\nInput: /sample");
    console.log("Output:", this.processCommand('/sample'));
    
    console.log("\nInput: /random");
    console.log("Output:", this.processCommand('/random'));
    
    console.log("\nInput: /time");
    console.log("Output:", this.processCommand('/time'));
    
    console.log("\nInput: /reverse Hello World");
    console.log("Output:", this.processCommand('/reverse Hello World'));
    
    console.log("\nInput: /list-plugins");
    console.log("Output:", this.listPlugins());
    
    console.log("\nKushAI demo completed.");
    this.isRunning = false;
  }
}

// Run the example if this script is executed directly
if (require.main === module) {
  const kushai = new KushAI();
  kushai.start().catch(console.error);
}

module.exports = KushAI;