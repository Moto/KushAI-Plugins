const fs = require('fs');
const path = require('path');

// Create public directory if it doesn't exist
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

// Copy plugins index to public directory
const pluginsIndex = path.join(__dirname, '..', 'plugins', 'index.json');
const publicPluginsIndex = path.join(publicDir, 'plugins.json');

if (fs.existsSync(pluginsIndex)) {
  fs.copyFileSync(pluginsIndex, publicPluginsIndex);
  console.log('Copied plugins index to public directory');
} else {
  // Create a default plugins.json file
  const defaultPlugins = { plugins: [] };
  fs.writeFileSync(publicPluginsIndex, JSON.stringify(defaultPlugins, null, 2));
  console.log('Created default plugins.json in public directory');
}

// Create plugins directory in public if it doesn't exist
const publicPluginsDir = path.join(publicDir, 'plugins');
if (!fs.existsSync(publicPluginsDir)) {
  fs.mkdirSync(publicPluginsDir);
}

// Copy individual plugin manifests to public directory
const pluginsDir = path.join(__dirname, '..', 'plugins');
const pluginDirs = fs.readdirSync(pluginsDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

pluginDirs.forEach(pluginDir => {
  const pluginManifest = path.join(pluginsDir, pluginDir, 'plugin.json');
  const publicPluginManifest = path.join(publicPluginsDir, `${pluginDir}.json`);
  
  if (fs.existsSync(pluginManifest)) {
    fs.copyFileSync(pluginManifest, publicPluginManifest);
    console.log(`Copied ${pluginDir} manifest to public directory`);
  }
});

console.log('Build completed successfully!');