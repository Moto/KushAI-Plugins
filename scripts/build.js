const fs = require('fs');
const path = require('path');
const { generatePluginsIndex } = require('./generate-index.js');

// Create public directory if it doesn't exist
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

// Generate and copy plugins index to public directory
generatePluginsIndex();
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

// Copy marketplace.html to public directory
const marketplaceFile = path.join(__dirname, '..', 'public', 'marketplace.html');
const publicMarketplaceFile = path.join(publicDir, 'marketplace.html');
if (fs.existsSync(marketplaceFile)) {
  fs.copyFileSync(marketplaceFile, publicMarketplaceFile);
  console.log('Copied marketplace.html to public directory');
}

// Copy ratings.json to public directory
const ratingsFile = path.join(__dirname, '..', 'public', 'ratings.json');
const publicRatingsFile = path.join(publicDir, 'ratings.json');
if (fs.existsSync(ratingsFile)) {
  fs.copyFileSync(ratingsFile, publicRatingsFile);
  console.log('Copied ratings.json to public directory');
}

// Copy analytics.json to public directory
const analyticsFile = path.join(__dirname, '..', 'public', 'analytics.json');
const publicAnalyticsFile = path.join(publicDir, 'analytics.json');
if (fs.existsSync(analyticsFile)) {
  fs.copyFileSync(analyticsFile, publicAnalyticsFile);
  console.log('Copied analytics.json to public directory');
}

// Copy developer.html to public directory
const developerFile = path.join(__dirname, '..', 'public', 'developer.html');
const publicDeveloperFile = path.join(publicDir, 'developer.html');
if (fs.existsSync(developerFile)) {
  fs.copyFileSync(developerFile, publicDeveloperFile);
  console.log('Copied developer.html to public directory');
}

console.log('Build completed successfully!');