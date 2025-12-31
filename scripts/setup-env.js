const fs = require('fs');
const path = require('path');

const jsonFile = 'gentle-post-482910-j5-0c68329bf742.json';
const envFile = '.env';

try {
  const jsonContent = fs.readFileSync(path.resolve(__dirname, '..', jsonFile), 'utf8');
  // Minify JSON to single line
  const minified = JSON.stringify(JSON.parse(jsonContent));
  
  // Format for .env
  const envVar = `GOOGLE_SERVICE_ACCOUNT_JSON='${minified}'`;
  
  let envContent = '';
  if (fs.existsSync(path.resolve(__dirname, '..', envFile))) {
    envContent = fs.readFileSync(path.resolve(__dirname, '..', envFile), 'utf8');
  } else {
    // Create from example if missing
    envContent = fs.readFileSync(path.resolve(__dirname, '..', '.env.example'), 'utf8');
  }

  // Replace or Append
  if (envContent.includes('GOOGLE_SERVICE_ACCOUNT_JSON=')) {
    envContent = envContent.replace(/GOOGLE_SERVICE_ACCOUNT_JSON=.*/g, envVar);
  } else {
    envContent += `\n${envVar}`;
  }

  // Also ensure GOOGLE_SHEET_ID is present (placeholder if not)
  if (!envContent.includes('GOOGLE_SHEET_ID=')) {
     envContent += '\nGOOGLE_SHEET_ID="REPLACE_WITH_YOUR_SHEET_ID"';
  }

  fs.writeFileSync(path.resolve(__dirname, '..', envFile), envContent);
  console.log('Successfully updated .env with credentials.');

} catch (err) {
  console.error('Error configuring .env:', err);
  process.exit(1);
}
