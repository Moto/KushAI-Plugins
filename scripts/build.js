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

console.log('Build completed successfully!');