# Gidan Wereda Digital Governance & Service Portal — React Frontend

This is the complete React frontend foundation based on the project requirements supplied in the project document:
- Public portal and information services
- News & announcements
- Leadership
- Result verification
- Staff availability
- Citizen e-services
- Application tracking
- Responsive UI
- Reusable header/footer/components

## Important architecture note
React does **not** use PHP `include` files for reusable UI. Reusable React components are used instead:
- `src/components/Header.jsx`
- `src/components/Footer.jsx`
- `src/components/Layout.jsx`
- `src/components/PageHero.jsx`
- `src/components/StatusBadge.jsx`

Because your existing project specification uses PHP 8.x + MySQL 8.0 and MVC, a small `php-includes/` bridge is also included for deployment inside a PHP application. The React UI itself remains React.

## Run locally
1. Install Node.js LTS.
2. Open this folder in VS Code.
3. Terminal:
   npm install
4. Start:
   npm run dev
5. Open:
   http://localhost:5173

## Production
npm run build

The production files will be generated in `dist/`.

## Backend integration
Replace the demo state/data in `src/data/siteData.js` and the form handlers with REST API calls to your PHP backend, for example:
- GET `/api/news`
- GET `/api/leaders`
- GET `/api/staff`
- POST `/api/applications`
- GET `/api/applications/{trackingId}`
- GET `/api/results/{registrationNo}`

The supplied project specification identifies PHP 8.x, MySQL 8.0, MVC, PDO parameterized queries, role-based access control and secure authentication as the backend architecture.
