# Hayy – neighborhood clean-up app

Plain HTML, CSS and JavaScript. No build step.

Run: open `index.html` in a browser, or serve the folder (`python3 -m http.server`).

Files
- `index.html`  page structure
- `styles.css`  all styling (colors are CSS variables at the top; dark mode included)
- `app.js`      all logic: map, report form, worker actions, points, fraud checks, admin

Outside Claude the app runs in local mode: data lives in memory and resets on reload.
To store data for real, replace the `put`, `upd`, `del` functions and the `subscribe`
calls in `app.js` with calls to your own backend (for example a Java Spring Boot REST API
or Supabase).
