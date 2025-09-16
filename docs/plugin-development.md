# KushAI Plugin Development Guide

This guide will help you create plugins for the KushAI assistant.

## Plugin Structure

A KushAI plugin consists of the following files:

1. `plugin.json` - Plugin manifest file
2. `index.js` - Main plugin script
3. `README.md` - Plugin documentation

## Plugin Manifest (plugin.json)

The plugin manifest file contains metadata about your plugin:

```json
{
  "id": "unique-plugin-id",
  "name": "Plugin Name",
  "version": "1.0.0",
  "description": "A brief description of what your plugin does",
  "author": "Your Name",
  "license": "MIT",
  "main": "index.js",
  "keywords": [
    "keyword1",
    "keyword2"
  ]
}
```

### Manifest Fields

- `id` (required): A unique identifier for your plugin (lowercase, hyphens allowed)
- `name` (required): Human-readable name of your plugin
- `version` (required): Plugin version in semver format
- `description` (required): Brief description of plugin functionality
- `author` (required): Plugin author name
- `license` (required): License type (e.g., MIT, Apache-2.0)
- `main` (required): Entry point for your plugin script
- `keywords` (optional): Array of keywords for categorization

## Plugin Script (index.js)

The main plugin script should export a function that takes the KushAI instance as a parameter:

```javascript
function myPlugin(kushai) {
  // Add commands, event listeners, etc.
}

module.exports = myPlugin;
```

### Adding Commands

You can add commands to KushAI using the `addCommand` method:

```javascript
kushai.addCommand('command-name', 'Command description', (args) => {
  // Command implementation
  return 'Command result';
});
```

### Command Parameters

- `name`: The command name (without the leading slash)
- `description`: Brief description of what the command does
- `handler`: Function that takes an array of arguments and returns the command result

## Best Practices

1. **Error Handling**: Always handle potential errors in your plugin code
2. **Documentation**: Provide clear documentation in your README.md
3. **Testing**: Test your plugin thoroughly before publishing
4. **Security**: Avoid executing arbitrary code or accessing sensitive data
5. **Performance**: Optimize your plugin for fast execution

## Publishing Your Plugin

To publish your plugin to the KushAI marketplace:

1. Fork the [KushAI-Plugins repository](https://github.com/Moto/KushAI-Plugins)
2. Create a new directory in the `plugins` folder with your plugin's ID
3. Add your plugin files to that directory
4. Update the `plugins/index.json` file with your plugin's metadata
5. Submit a pull request

## Example Plugins

For reference, check out these example plugins:
- [Sample Plugin](../plugins/sample-plugin)
- [Utility Plugin](../plugins/utility-plugin)
- [Productivity Plugin](../plugins/productivity-plugin)