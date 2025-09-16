const fs = require('fs');
const path = require('path');

// Function to generate the plugins index
function generatePluginsIndex() {
  const pluginsDir = path.join(__dirname, '..', 'plugins');
  const pluginDirs = fs.readdirSync(pluginsDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
  
  const plugins = [];
  
  pluginDirs.forEach(pluginDir => {
    const pluginManifestPath = path.join(pluginsDir, pluginDir, 'plugin.json');
    
    if (fs.existsSync(pluginManifestPath)) {
      try {
        const pluginManifest = JSON.parse(fs.readFileSync(pluginManifestPath, 'utf8'));
        
        // Extract only the metadata we want in the index
        const pluginIndexEntry = {
          id: pluginManifest.id,
          name: pluginManifest.name,
          version: pluginManifest.version,
          description: pluginManifest.description,
          author: pluginManifest.author,
          license: pluginManifest.license,
          keywords: pluginManifest.keywords || []
        };
        
        plugins.push(pluginIndexEntry);
      } catch (e) {
        console.error(`Error reading plugin manifest for ${pluginDir}: ${e.message}`);
      }
    }
  });
  
  // Write the plugins index
  const pluginsIndexPath = path.join(pluginsDir, 'index.json');
  fs.writeFileSync(pluginsIndexPath, JSON.stringify({ plugins }, null, 2));
  
  console.log(`Generated plugins index with ${plugins.length} plugins`);
  return plugins;
}

// Run the function if this script is executed directly
if (require.main === module) {
  generatePluginsIndex();
}

module.exports = { generatePluginsIndex };