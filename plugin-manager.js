// plugin-manager.js
// Plugin manager for KushAI

class PluginManager {
  constructor() {
    this.plugins = new Map();
    this.commands = new Map();
  }

  // Load a plugin from a file path
  async loadPlugin(pluginPath) {
    try {
      // Resolve the plugin path
      const path = require('path');
      const fullPath = path.resolve(pluginPath);
      
      // Load the plugin manifest
      const manifestPath = path.join(fullPath, 'plugin.json');
      const fs = require('fs');
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      
      // Validate the manifest
      if (!this.validateManifest(manifest)) {
        throw new Error(`Invalid manifest for plugin ${manifest.id}`);
      }
      
      // Load the plugin module
      const pluginModule = require(path.join(fullPath, manifest.main));
      
      // Initialize the plugin
      if (typeof pluginModule === 'function') {
        pluginModule(this);
        this.plugins.set(manifest.id, {
          manifest,
          module: pluginModule,
          path: fullPath
        });
        console.log(`Loaded plugin: ${manifest.name} (${manifest.id})`);
        return true;
      } else {
        throw new Error(`Plugin ${manifest.id} does not export a function`);
      }
    } catch (error) {
      console.error(`Failed to load plugin from ${pluginPath}:`, error.message);
      return false;
    }
  }

  // Validate a plugin manifest
  validateManifest(manifest) {
    const requiredFields = ['id', 'name', 'version', 'description', 'author', 'license', 'main'];
    for (const field of requiredFields) {
      if (!manifest[field]) {
        console.error(`Missing required field in plugin manifest: ${field}`);
        return false;
      }
    }
    return true;
  }

  // Add a command to the manager
  addCommand(name, description, handler) {
    if (this.commands.has(name)) {
      console.warn(`Command ${name} already exists. Overwriting.`);
    }
    this.commands.set(name, { description, handler });
  }

  // Execute a command
  executeCommand(commandName, args = []) {
    const command = this.commands.get(commandName);
    if (command) {
      try {
        return command.handler(args);
      } catch (error) {
        console.error(`Error executing command ${commandName}:`, error.message);
        return `Error: ${error.message}`;
      }
    } else {
      return `Unknown command: ${commandName}`;
    }
  }

  // Get all registered commands
  getCommands() {
    return Array.from(this.commands.keys());
  }

  // Get command information
  getCommandInfo(commandName) {
    const command = this.commands.get(commandName);
    if (command) {
      return {
        name: commandName,
        description: command.description
      };
    }
    return null;
  }

  // List all loaded plugins
  listPlugins() {
    return Array.from(this.plugins.values()).map(plugin => ({
      id: plugin.manifest.id,
      name: plugin.manifest.name,
      version: plugin.manifest.version,
      description: plugin.manifest.description
    }));
  }

  // Get plugin information
  getPluginInfo(pluginId) {
    const plugin = this.plugins.get(pluginId);
    if (plugin) {
      return {
        id: plugin.manifest.id,
        name: plugin.manifest.name,
        version: plugin.manifest.version,
        description: plugin.manifest.description,
        author: plugin.manifest.author,
        license: plugin.manifest.license
      };
    }
    return null;
  }
}

module.exports = PluginManager;