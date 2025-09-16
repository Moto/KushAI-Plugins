# Plugin Submission Guide

This guide explains how to submit your plugin to the KushAI Plugins Marketplace.

## Prerequisites

Before submitting your plugin, ensure that:

1. Your plugin follows the [Plugin Development Guide](plugin-development.md)
2. Your plugin includes all required files (`plugin.json`, `index.js`, `README.md`)
3. Your plugin has been tested and works correctly
4. Your plugin adheres to our [Code of Conduct](code-of-conduct.md) and [Submission Guidelines](submission-guidelines.md)

## Submission Process

To submit your plugin to the KushAI Plugins Marketplace, follow these steps:

### 1. Fork the Repository

Fork the [KushAI-Plugins repository](https://github.com/Moto/KushAI-Plugins) on GitHub.

### 2. Create a Branch

Create a new branch in your fork for your plugin submission.

### 3. Add Your Plugin

1. Create a new directory in the `plugins` folder with your plugin's ID as the directory name
2. Add your plugin files to that directory:
   - `plugin.json` - Plugin manifest
   - `index.js` - Main plugin script
   - `README.md` - Plugin documentation
   - Any additional files your plugin requires

### 4. Update the Plugins Index

Add your plugin's metadata to the `plugins/index.json` file:

```json
{
  "plugins": [
    // ... existing plugins ...
    {
      "id": "your-plugin-id",
      "name": "Your Plugin Name",
      "version": "1.0.0",
      "description": "Brief description of your plugin",
      "author": "Your Name",
      "license": "MIT",
      "keywords": [
        "keyword1",
        "keyword2"
      ]
    }
  ]
}
```

### 5. Test Your Changes

Run the build script to ensure your plugin is correctly integrated:

```bash
node scripts/build.js
```

### 6. Commit Your Changes

Commit your changes with a descriptive commit message:

```bash
git add .
git commit -m "Add Your Plugin Name"
```

### 7. Push and Create Pull Request

Push your changes to your fork and create a pull request to the main repository.

## Review Process

After submitting your pull request, the KushAI team will review your plugin. The review process includes:

1. **Automated Checks**: 
   - Plugin structure validation
   - Security scanning
   - Code quality analysis

2. **Manual Review**:
   - Functionality testing
   - Documentation review
   - Compliance with guidelines

3. **Approval**: 
   - If approved, your plugin will be merged into the main repository
   - If changes are requested, you'll receive feedback on what needs to be updated

## Updating Your Plugin

To update your plugin:

1. Fork the repository (if you haven't already)
2. Create a new branch for the update
3. Make your changes
4. Update the version number in your `plugin.json`
5. Update the plugin metadata in `plugins/index.json`
6. Submit a new pull request

## Support

If you have questions about the submission process, you can:

1. Open an issue in the [KushAI-Plugins repository](https://github.com/Moto/KushAI-Plugins/issues)
2. Contact the KushAI team through our [official channels](../README.md#support)