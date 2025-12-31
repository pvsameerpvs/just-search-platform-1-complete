const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

// Load env validation
const envPath = path.resolve(__dirname, '../.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    let value = match[2].trim();
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    } else if (value.startsWith("'") && value.endsWith("'")) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
});

const SHEET_ID = env.GOOGLE_SHEET_ID;
const SERVICE_ACCOUNT = env.GOOGLE_SERVICE_ACCOUNT_JSON;

console.log("Sheet ID:", SHEET_ID);

async function testConnection() {
  try {
    const credentials = JSON.parse(SERVICE_ACCOUNT);
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    
    const sheets = google.sheets({ version: "v4", auth });
    
    console.log("Attempting to read 'IndustryPricing!A1:B2'...");
    
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: "IndustryPricing!A1:B2",
    });
    
    console.log("Success! Data found:");
    console.log(res.data.values);
  } catch (error) {
    console.error("\nConnection Failed!");
    if (error.code === 403) {
      console.error("ERROR: Permission Denied (403).");
      console.error("CAUSE: The Google Sheet is not shared with the service account.");
      console.error(`ACTION: Share the sheet with: ${JSON.parse(SERVICE_ACCOUNT).client_email}`);
    } else if (error.code === 400 || (error.result && error.result.error && error.result.error.message.includes("Unable to parse range"))) {
      console.error("ERROR: Tab or Range not found.");
      console.error("CAUSE: The tab 'IndustryPricing' likely does not exist.");
      console.error("ACTION: Create a tab named 'IndustryPricing' in your sheet.");
    } else if (error.code === 404) {
       console.error("ERROR: Sheet Not Found (404).");
       console.error("CAUSE: The Sheet ID is incorrect.");
    } else {
      console.error("ERROR Details:", error.message);
    }
  }
}

testConnection();
