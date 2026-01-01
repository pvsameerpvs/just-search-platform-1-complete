# Google Sheets Database Setup

To run the application, you need to set up a Google Sheet with the following Tabs (Sheets) and Headers.

## 1. Tab Name: `Users`
Used for authentication.
**Columns:**
- `A`: `user_id` (e.g., U-12345678)
- `B`: `name` (e.g., Admin User)
- `C`: `email` (e.g., admin@justsearch.ae)
- `D`: `username` (e.g., admin)
- `E`: `password_hash` (bcrypt hash string)
- `F`: `role` (e.g., admin, sales, client)
- `G`: `status` (e.g., active)

## 2. Tab Name: `Clients`
Stores client information.
**Columns:**
- `A`: `client_id`
- `B`: `companyName`
- `C`: `industry`
- `D`: `contactNumber`
- `E`: `whatsapp`
- `F`: `email`
- `G`: `location`
- `H`: `createdAt`
- `I`: `industries`
- `J`: `areas`
- `K`: `leadQty`
- `L`: `channels`
- `M`: `discountPercent`

## 3. Tab Name: `Invoices`
Stores simple invoice records.
**Columns:**
- `A`: `invoice_id`
- `B`: `client_id`
- `C`: `amount`
- `D`: `status` (e.g., paid, unpaid)
- `E`: `createdAt`

## 4. Tab Name: `Audit_Log`
Logs system actions.
**Columns:**
- `A`: `log_id`
- `B`: `action`
- `C`: `companyName`
- `D`: `email`
- `E`: `timestamp`

## 5. Tab Name: `IndustryPricing`
Pricing configuration for industries.
**Columns:**
- `A`: `Name` (e.g., Real Estate, Healthcare)
- `B`: `Price` (Price per lead, e.g., 50)

## 6. Tab Name: `AreaPricing`
Multiplier configuration for areas.
**Columns:**
- `A`: `Name` (e.g., Dubai, Abu Dhabi)
- `B`: `Price` (Multiplier, e.g., 1.5, 1.0)
