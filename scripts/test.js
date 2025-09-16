const fs = require('fs');
const path = require('path');

// Test script to verify the structure of the public directory
console.log('Testing public directory structure...');

// Check if plugins.json exists
const pluginsJsonPath = path.join(__dirname, '..', 'public', 'plugins.json');
if (fs.existsSync(pluginsJsonPath)) {
  const pluginsData = JSON.parse(fs.readFileSync(pluginsJsonPath, 'utf8'));
  console.log('✓ plugins.json exists');
  console.log(`✓ Found ${pluginsData.plugins.length} plugins in index`);
} else {
  console.log('✗ plugins.json does not exist');
}

// Check if plugins directory exists
const pluginsDirPath = path.join(__dirname, '..', 'public', 'plugins');
if (fs.existsSync(pluginsDirPath)) {
  console.log('✓ plugins directory exists');
  
  // List files in plugins directory
  const pluginFiles = fs.readdirSync(pluginsDirPath).filter(file => file.endsWith('.json'));
  console.log(`✓ Found ${pluginFiles.length} plugin manifests`);
  
  // Check each plugin manifest
  pluginFiles.forEach(file => {
    if (file.endsWith('.json')) {
      try {
        const pluginData = JSON.parse(fs.readFileSync(path.join(pluginsDirPath, file), 'utf8'));
        console.log(`✓ Plugin manifest ${file} is valid`);
      } catch (e) {
        console.log(`✗ Plugin manifest ${file} is invalid: ${e.message}`);
      }
    }
  });
} else {
  console.log('✗ plugins directory does not exist');
}

console.log('Test completed!');