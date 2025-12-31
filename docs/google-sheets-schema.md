# Google Sheets Schema (Platform 1)

Create a Google Spreadsheet and add sheets with these names and columns.

---

## 1) Users
Columns:
A `user_id`
B `name`
C `email`
D `username`
E `password_hash`
F `role`  (admin | sales | client)
G `status` (active | inactive)

---

## 2) Clients
Columns:
A `client_id`
B `companyName`
C `industry`
D `contactNumber`
E `whatsapp`
F `email`
G `location`
H `createdAt`

---

## 3) Industry_Pricing
Columns:
A `industry_name`
B `price_per_lead`

Example:
- Real Estate | 2.00
- Automotive | 1.80
- Healthcare | 2.50

---

## 4) Area_Pricing
Columns:
A `area_name`
B `multiplier`

Example:
- Dubai | 1.20
- Abu Dhabi | 1.30
- Sharjah | 1.00

---

## 5) Invoices
Columns:
A `invoice_id`
B `client_id`
C `amount`
D `status` (paid | unpaid | pending)
E `createdAt`

---

## 6) Payments
Columns:
A `payment_id`
B `client_id`
C `invoice_id`
D `status` (paid | pending | failed)
E `amount`

---

## 7) Audit_Log
Columns:
A `event_id`
B `event_type`
C `reference`
D `details`
E `createdAt`
