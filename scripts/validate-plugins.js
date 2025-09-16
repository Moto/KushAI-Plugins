const fs = require('fs');
const path = require('path');

// Function to validate a plugin manifest
function validatePluginManifest(manifest, pluginId) {
  const errors = [];
  
  // Check required fields
  const requiredFields = ['id', 'name', 'version', 'description', 'author', 'license', 'main'];
  requiredFields.forEach(field => {
    if (!manifest[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  });
  
  // Check that the ID matches the directory name
  if (manifest.id !== pluginId) {
    errors.push(`Plugin ID in manifest (${manifest.id}) does not match directory name (${pluginId})`);
  }
  
  // Check version format (basic semver check)
  if (manifest.version && !/^\d+\.\d+\.\d+$/.test(manifest.version)) {
    errors.push(`Version format is invalid: ${manifest.version}`);
  }
  
  // Check that main file exists
  if (manifest.main) {
    const mainFilePath = path.join(__dirname, '..', 'plugins', pluginId, manifest.main);
    if (!fs.existsSync(mainFilePath)) {
      errors.push(`Main file does not exist: ${manifest.main}`);
    }
  }
  
  return errors;
}

// Function to validate all plugins
function validateAllPlugins() {
  const pluginsDir = path.join(__dirname, '..', 'plugins');
  const pluginDirs = fs.readdirSync(pluginsDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
  
  let allErrors = [];
  
  pluginDirs.forEach(pluginDir => {
    const pluginManifestPath = path.join(pluginsDir, pluginDir, 'plugin.json');
    
    if (!fs.existsSync(pluginManifestPath)) {
      allErrors.push(`Plugin ${pluginDir} is missing plugin.json`);
      return;
    }
    
    try {
      const pluginManifest = JSON.parse(fs.readFileSync(pluginManifestPath, 'utf8'));
      const errors = validatePluginManifest(pluginManifest, pluginDir);
      
      if (errors.length > 0) {
        allErrors.push(`Validation errors for plugin ${pluginDir}:`);
        errors.forEach(error => allErrors.push(`  - ${error}`));
      }
    } catch (e) {
      allErrors.push(`Invalid JSON in plugin.json for plugin ${pluginDir}: ${e.message}`);
    }
  });
  
  return allErrors;
}

// Run validation if this script is executed directly
if (require.main === module) {
  const errors = validateAllPlugins();
  
  if (errors.length > 0) {
    console.log('Plugin validation failed:');
    errors.forEach(error => console.log(error));
    process.exit(1);
  } else {
    console.log('All plugins passed validation!');
  }
}

module.exports = { validatePluginManifest, validateAllPlugins };