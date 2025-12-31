# Google Sheets API Setup Guide

Follow these steps to generate the required credentials for the application.

## 1. Create a Google Cloud Project
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Click the specific project dropdown in the top bar and select **"New Project"**.
3. Give it a name (e.g., "JustSearch Platform") and click **Create**.

## 2. Enable Google Sheets API
1. In the left sidebar, go to **APIs & Services > Library**.
2. Search for **"Google Sheets API"**.
3. Click on it and click **Enable**.

## 3. Create a Service Account
1. Go to **APIs & Services > Credentials**.
2. Click **+ CREATE CREDENTIALS** and select **Service Account**.
3. **Name**: Enter a name (e.g., "sheets-logger").
4. Click **Create and Continue**.
5. **Role**: Select **Editor** (or Project > Editor) to allow read/write access.
6. Click **Done**.

## 4. Generate JSON Key
1. In the **Service Accounts** list, click on the email of the service account you just created.
2. Go to the **Keys** tab.
3. Click **Add Key > Create new key**.
4. Select **JSON** and click **Create**.
5. A JSON file will automatically download to your computer.

## 5. Configure Application
1. Open the downloaded JSON file with a text editor.
2. Copy the **entire content** of the file.
3. Open your project's `.env.local` file (create it if missing).
4. Paste the content into the `GOOGLE_SERVICE_ACCOUNT_JSON` variable.
   *Note: Since the JSON spans multiple lines, you must wrap it in single quotes `'` and ensure it is on one line, OR use a minified version.*
   
   **Easier Alternative for Local Dev:**
   Save the file as `service_account.json` in your project root (add it to `.gitignore`) and reference its path if your code supports it, but strictly following the `.env` variable is safer for deployment.
   
   **For `.env`:**
   ```env
   GOOGLE_SHEET_ID=your_sheet_id_from_browser_url
   GOOGLE_SERVICE_ACCOUNT_JSON='{"type": "service_account", ...}'
   ```

## 6. Share the Sheet
1. Open your Google Sheet in the browser.
2. Click the **Share** button (top right).
3. In the "Add people and groups" field, paste the **Service Account Email** (found in the JSON file under `client_email`, e.g., `sheets-logger@project-id.iam.gserviceaccount.com`).
4. Set permission to **Editor**.
5. Click **Send** (uncheck "Notify people" if desired).

## 7. Get Sheet ID
1. Look at your Google Sheet URL:
   `https://docs.google.com/spreadsheets/d/1aBcD_...UsuallyLongString.../edit`
2. The long string between `/d/` and `/edit` is your `GOOGLE_SHEET_ID`.
3. Add this to your `.env` file.
