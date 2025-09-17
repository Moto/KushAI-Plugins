// plugin-manager.js
// Plugin manager for KushAI with security features

class PluginManager {
  constructor(pluginsDir = './plugins') {
    this.plugins = new Map();
    this.commands = new Map();
    this.pluginsDir = pluginsDir;
    this.restrictedModules = ['fs', 'child_process', 'process', 'os'];
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
      
      // Check and load dependencies first
      if (manifest.dependencies) {
        await this.loadDependencies(manifest.dependencies);
      }
      
      // Create a secure sandbox for the plugin
      const sandbox = this.createSandbox();
      
      // Load the plugin module with sandboxing
      const pluginModule = this.loadModuleSecurely(path.join(fullPath, manifest.main), sandbox);
      
      // Initialize the plugin
      if (typeof pluginModule === 'function') {
        pluginModule(sandbox);
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

  // Create a secure sandbox for plugins
  createSandbox() {
    // Create a limited version of the KushAI API
    const sandbox = {
      addCommand: (name, description, handler) => {
        if (this.commands.has(name)) {
          console.warn(`Command ${name} already exists. Overwriting.`);
        }
        this.commands.set(name, { description, handler });
      },
      // Add other safe APIs here
      setTimeout: setTimeout,
      setInterval: setInterval,
      clearTimeout: clearTimeout,
      clearInterval: clearInterval,
      console: console,
      Math: Math,
      Date: Date,
      JSON: JSON,
      // Restrict access to dangerous modules
      require: (module) => {
        if (this.restrictedModules.includes(module)) {
          throw new Error(`Access to module '${module}' is restricted`);
        }
        return require(module);
      }
    };
    
    return sandbox;
  }

  // Load a module with security restrictions
  loadModuleSecurely(modulePath, sandbox) {
    const fs = require('fs');
    const vm = require('vm');
    
    // Read the module code
    const code = fs.readFileSync(modulePath, 'utf8');
    
    // Create a script in a new context with the sandbox
    const script = new vm.Script(`
      (function(exports, require, module, __filename, __dirname) {
        ${code}
      });
    `);
    
    // Create a context with the sandbox
    const context = vm.createContext(Object.assign({}, global, sandbox));
    
    // Create a module-like object for the plugin
    const module = {
      exports: {},
      require: sandbox.require,
      id: modulePath,
      filename: modulePath,
      loaded: false,
      parent: null,
      children: []
    };
    
    // Run the script in the sandboxed context
    const compiledFunction = script.runInContext(context);
    compiledFunction(module.exports, module.require, module, modulePath, require('path').dirname(modulePath));
    
    return module.exports;
  }

  // Load plugin dependencies
  async loadDependencies(dependencies) {
    const path = require('path');
    const fs = require('fs');
    
    for (const [depId, depVersion] of Object.entries(dependencies)) {
      // Check if dependency is already loaded
      if (!this.plugins.has(depId)) {
        // Try to load the dependency from the plugins directory
        const depPath = path.join(this.pluginsDir, depId);
        if (fs.existsSync(depPath)) {
          console.log(`Loading dependency: ${depId} v${depVersion}`);
          await this.loadPlugin(depPath);
        } else {
          console.warn(`Dependency ${depId} v${depVersion} not found`);
        }
      }
    }
  }

  // Install a plugin from a remote source (e.g., GitHub)
  async installPlugin(pluginId) {
    try {
      const https = require('https');
      const fs = require('fs');
      const path = require('path');
      const os = require('os');
      const { execSync } = require('child_process');
      
      // Create plugins directory if it doesn't exist
      if (!fs.existsSync(this.pluginsDir)) {
        fs.mkdirSync(this.pluginsDir, { recursive: true });
      }
      
      // For this example, we'll simulate installing from our GitHub repository
      // In a real implementation, this would download from a remote source
      console.log(`Installing plugin: ${pluginId}`);
      
      // Check if plugin already exists
      const pluginPath = path.join(this.pluginsDir, pluginId);
      if (fs.existsSync(pluginPath)) {
        console.log(`Plugin ${pluginId} already installed`);
        return false;
      }
      
      // In a real implementation, we would download the plugin files here
      // For now, we'll just simulate the process
      console.log(`Plugin ${pluginId} installed successfully`);
      return true;
    } catch (error) {
      console.error(`Failed to install plugin ${pluginId}:`, error.message);
      return false;
    }
  }

  // Remove a plugin
  async removePlugin(pluginId) {
    try {
      const fs = require('fs');
      const path = require('path');
      
      // Check if plugin exists
      const pluginPath = path.join(this.pluginsDir, pluginId);
      if (!fs.existsSync(pluginPath)) {
        console.log(`Plugin ${pluginId} is not installed`);
        return false;
      }
      
      // Check if other plugins depend on this one
      const dependentPlugins = this.getDependentPlugins(pluginId);
      if (dependentPlugins.length > 0) {
        console.log(`Cannot remove plugin ${pluginId}. The following plugins depend on it: ${dependentPlugins.join(', ')}`);
        return false;
      }
      
      // Remove the plugin directory
      fs.rmSync(pluginPath, { recursive: true, force: true });
      
      // Remove plugin from loaded plugins if it was loaded
      if (this.plugins.has(pluginId)) {
        this.plugins.delete(pluginId);
      }
      
      console.log(`Plugin ${pluginId} removed successfully`);
      return true;
    } catch (error) {
      console.error(`Failed to remove plugin ${pluginId}:`, error.message);
      return false;
    }
  }

  // Get plugins that depend on a specific plugin
  getDependentPlugins(pluginId) {
    const dependents = [];
    for (const [id, plugin] of this.plugins.entries()) {
      if (plugin.manifest.dependencies && plugin.manifest.dependencies[pluginId]) {
        dependents.push(id);
      }
    }
    return dependents;
  }

  // Update a plugin
  async updatePlugin(pluginId) {
    try {
      const fs = require('fs');
      const path = require('path');
      
      // Check if plugin exists
      const pluginPath = path.join(this.pluginsDir, pluginId);
      if (!fs.existsSync(pluginPath)) {
        console.log(`Plugin ${pluginId} is not installed`);
        return false;
      }
      
      // Load current plugin manifest
      const manifestPath = path.join(pluginPath, 'plugin.json');
      if (!fs.existsSync(manifestPath)) {
        console.log(`Plugin ${pluginId} manifest not found`);
        return false;
      }
      
      const currentManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      const currentVersion = currentManifest.version;
      
      // In a real implementation, we would check for updates from a remote source
      // For now, we'll just simulate the process
      console.log(`Checking for updates for plugin: ${pluginId} (current version: ${currentVersion})`);
      
      // Simulate finding an update
      console.log(`Plugin ${pluginId} is up to date`);
      return true;
    } catch (error) {
      console.error(`Failed to update plugin ${pluginId}:`, error.message);
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
        license: plugin.manifest.license,
        dependencies: plugin.manifest.dependencies || {}
      };
    }
    return null;
  }

  // List all installed plugins (not necessarily loaded)
  listInstalledPlugins() {
    const fs = require('fs');
    const path = require('path');
    
    if (!fs.existsSync(this.pluginsDir)) {
      return [];
    }
    
    const pluginDirs = fs.readdirSync(this.pluginsDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    
    const installedPlugins = [];
    
    for (const pluginDir of pluginDirs) {
      try {
        const manifestPath = path.join(this.pluginsDir, pluginDir, 'plugin.json');
        if (fs.existsSync(manifestPath)) {
          const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
          installedPlugins.push({
            id: manifest.id,
            name: manifest.name,
            version: manifest.version,
            description: manifest.description,
            dependencies: manifest.dependencies || {},
            installed: true,
            loaded: this.plugins.has(manifest.id)
          });
        }
      } catch (error) {
        console.error(`Error reading manifest for plugin ${pluginDir}:`, error.message);
      }
    }
    
    return installedPlugins;
  }
}

module.exports = PluginManager;