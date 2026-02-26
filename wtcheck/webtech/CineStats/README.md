## CineStats – Box Office Mojo (All-Time) Clone

Stack: HTML5, CSS3, vanilla JS (frontend) + Node.js, Express.js, Lowdb JSON (backend)

### Features
- Modern responsive UI (glassmorphism, animated gradients, dark/light mode)
- Pages: Home, All Movies (search/sort/pagination), Movie Details (Chart.js), Top 10, About, Contact, Admin
- REST APIs: movies CRUD, contact submit, admin login (JWT)
- Security: bcrypt hashing, validation (Joi), helmet, CORS
- Static hosting via Express

### Quick Start
1) Install Node.js 18+
2) In project folder, create `.env` from `env.sample`:

```
PORT=4000
DB_PATH=./cinestats.json
JWT_SECRET=change_me_super_secret
SEED_ADMIN_USER=admin
SEED_ADMIN_PASS=admin123
```

3) Install deps and seed database:

```
npm install
npm run seed
npm run dev
```

Open `http://localhost:4000` in your browser.

### Admin
- Visit `/admin.html`
- Login with credentials from `.env`
- Manage movies (add/update/delete)

### Notes
- Demo posters referenced under `/assets/posters/`. Add your own images or update `data/movies.json`.
- Contact messages are stored in SQLite. Listing endpoint can be added to display in admin UI.

### Import real movies and images (TMDB)
To import real top-revenue movies with real posters and overviews, get a TMDB API key:

1) Create an account and API key at `https://www.themoviedb.org/settings/api`
2) Add to your `.env`:
```
TMDB_API_KEY=your_tmdb_key_here
TMDB_PAGES=5
```
3) Run the importer:
```
npm run import:tmdb
```
This pulls the top ~100 revenue films with posters and descriptions, tagging Bollywood when language is hi/region IN.


