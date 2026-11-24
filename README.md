# The Plantation

Redesign of theplantation.co.za: the umbrella site for The Plantation (weddings, corporate events, forest suites), The Boma and 39 on Church, with six enquiry paths that save to a database and an admin (`/admin`) where the venue updates its wedding specials.

- **Domain:** theplantation.co.za
- **Compose project name:** `theplantation`
- **Host port (VPS Nginx forwards here):** `8103`

## How it fits together

```
Browser
   |
VPS Nginx  (HTTPS, domain; lives on the server, not in this project)
   |
frontend container  (Nginx: serves the built React site)
   |-- /api/*  -->  backend container  (Express API)
                        |
                    database container  (MySQL, data kept in a Docker volume)
```

Only the frontend is reachable from the server itself (on `127.0.0.1:8103`). The API and the database
can only be reached from inside this site's own Docker network. Every website on the VPS is its own stack like
this one, with its own database, so sites cannot affect each other.

## Technologies

| Part | Built with |
| --- | --- |
| Frontend | React (JavaScript), Vite, Tailwind CSS, Motion for React, React Router, Axios, Lucide React |
| Backend | Node.js, Express, Sequelize, express-validator, Helmet, express-rate-limit |
| Database | MySQL 8.4 |
| Hosting | Docker Compose, Nginx |

## Folders

```
tools/photos.py          exports the venue photos (assets-source/ -> frontend/public/photos)
assets-source/           original photos from the current sites (not deployed)
frontend/   the website people see
  src/content      all the words, facts, contact details and photo choices
  src/pages        one file per page
  src/components   reusable pieces (ui/ = buttons, fields, cards ...)
  src/layouts      shared page frames (header, footer)
  src/services     api.js: the one place that talks to the backend
  src/styles       index.css: colours, fonts and easing (the design tokens)
  nginx/           how the site and /api are served in production
backend/    the API and business logic
  src/routes -> controllers -> services -> models   one request, top to bottom
  src/migrations   every change to the database structure, in order
  src/seeders      starting data
docker-compose.yml       the production stack
docker-compose.dev.yml   extra settings for local development only
.env.example             list of settings; copy to .env
scripts/smoke-test.sh    builds the stack and checks it works
```

## Settings (.env)

```bash
cp .env.example .env
```

Open `.env` and set the name, port and passwords. Generate each password with:

```bash
openssl rand -base64 32
```

`.env` holds real passwords. It is ignored by git and must never be committed or sent to anyone.

**Port 8103 is an assumption** (8101 portfolio, 8102 Fireside). Confirm it is free on the VPS before deploying.

**Enquiry email is optional.** Every enquiry is saved to the database first. With `SMTP_HOST` empty nothing is emailed,
and enquiries are read with the command under "Read enquiries" below. To email them, fill in `SMTP_*`, `MAIL_FROM` and
`MAIL_TO`. `MAIL_TO_BOMA` is set to The Boma's own inbox (theboma@rmproperties.co.za), so Boma enquiries go there.
`MAIL_TO_CHURCH` can do the same for 39 on Church (empty = it goes to `MAIL_TO`).

**Admin settings are required.** Set `JWT_SECRET` (generate it with `openssl rand -base64 48`), and set
`ADMIN_EMAIL` / `ADMIN_PASSWORD` (12+ characters) for the venue's login. See "The admin" below.

## Run it

Build and start (also the command for the first launch on the VPS):

```bash
docker compose up -d --build
```

Check that all three containers are `healthy`:

```bash
docker compose ps
```

Stop the site (the database is kept):

```bash
docker compose down
```

> Never add `-v` to `down` unless you mean to delete the database. `docker compose down -v` erases all saved data.

Full check of the production build:

```bash
./scripts/smoke-test.sh
```

## Logs

```bash
docker compose logs -f backend
```

Swap `backend` for `frontend` or `database`, or leave the name off to see all three.

## Database migrations

Migrations run automatically every time the backend container starts. To run or inspect them by hand:

```bash
docker compose exec backend npm run migrate
```

```bash
docker compose exec backend npm run migrate:status
```

Undo the most recent migration:

```bash
docker compose exec backend npm run migrate:undo
```

The only seeder creates the venue's admin login. See "The admin" below.

## The API

The API is not public on its own port. It is reached through the site: `https://theplantation.co.za/api/...`

Health check, from the VPS:

```bash
curl http://127.0.0.1:8103/api/health
```

Expected: `{"success":true,"message":"API is operational","database":"connected"}`

| Method | Path | What it does |
| --- | --- | --- |
| GET | `/api/health` | API and database status |
| POST | `/api/enquiries` | Saves an enquiry (types: `wedding`, `corporate`, `accommodation`, `boma`, `church`, `general`) and emails it if SMTP is set. Validated per type, honeypot-protected, 10 per hour per visitor. |
| GET | `/api/specials` | The wedding specials visitors see: switched on and not past their "show until" date, in the admin's order. |
| POST | `/api/auth/login` | Admin sign-in (email + password). Sets an httpOnly session cookie for 7 days. 10 attempts per 15 minutes. |
| POST | `/api/auth/logout` | Signs out (clears the cookie). |
| GET | `/api/auth/me` | The signed-in admin, or 401. |
| GET | `/api/admin/specials` | Every special, including hidden and expired ones. Admin only. |
| POST | `/api/admin/specials` | Adds a special. Admin only. |
| PUT | `/api/admin/specials/:id` | Edits a special (any of: kicker, name, body, note, photo, isPublished, availableUntil). Admin only. |
| PUT | `/api/admin/specials/order` | Saves the order: `{ "ids": [3, 1, 2, 4] }`, every special once. Admin only. |
| DELETE | `/api/admin/specials/:id` | Deletes a special. Admin only. |

The wedding form's "Package of interest" list is the specials plus "A custom package" and "Not sure yet";
the API accepts any special's name there, hidden or not.

## The admin

`https://theplantation.co.za/admin` is where the venue adds, edits, reorders, hides and deletes its wedding
specials. Each special has a label, name, description, optional small print, a photo from the site's photo library
and an optional "show until" date, after which it hides itself (South African date). The four specials on the old
site are loaded by a migration, so the Weddings page is complete on day one.

Create the venue's login (or reset its password) from `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env`:

```bash
docker compose exec backend npx sequelize-cli db:seed --seed 20261124090000-admin.js
```

Running it again with a new `ADMIN_PASSWORD` resets the password. After that, `ADMIN_PASSWORD` can be removed from
`.env`. To add a second person, change `ADMIN_EMAIL` and `ADMIN_PASSWORD`, run it again, then put them back.

New photos for specials have to be added to the site's photo library (`tools/photos.py`) and redeployed; the admin
doesn't upload files.

On the GitHub Pages preview there is no API, so `/admin` says it is only available on the live site and the
Weddings page shows the four built-in specials.

### Read enquiries

Latest 50, newest first:

```bash
docker compose exec -T database sh -c 'exec mysql -u root -p"$MYSQL_ROOT_PASSWORD" "$MYSQL_DATABASE" -e "SELECT id, created_at, type, name, email, phone, start_date, end_date, guests, details, message FROM enquiries ORDER BY id DESC LIMIT 50\\G"'
```

## Back up the database

```bash
mkdir -p backups && docker compose exec -T database sh -c 'exec mysqldump --single-transaction --no-tablespaces -u root -p"$MYSQL_ROOT_PASSWORD" "$MYSQL_DATABASE"' | gzip > "backups/$(date +%F-%H%M).sql.gz"
```

Restore a backup (replaces the current data):

```bash
gunzip -c backups/FILE.sql.gz | docker compose exec -T database sh -c 'exec mysql -u root -p"$MYSQL_ROOT_PASSWORD" "$MYSQL_DATABASE"'
```

Take a backup before every update. Keep copies somewhere other than the VPS.

## Deploying with GitHub Actions

Push to `main` and `.github/workflows/ci-cd.yml` does the rest:

1. **verify:** builds both apps and runs `scripts/smoke-test.sh` against the real Docker stack.
2. **image:** pushes `ghcr.io/<owner>/<repo>-frontend` and `-backend`, tagged `sha-<commit>`.
3. **deploy:** over SSH it runs `deploy/deploy.sh`, which backs up the database and uploads, pulls the images,
   restarts, waits for all three containers to be healthy, and rolls back to the previous images by itself if
   they aren't.

Pull requests only run step 1.

One-time setup:

1. **Repository secrets:** `DEPLOY_HOST`, `DEPLOY_USER` (in the docker group), `DEPLOY_SSH_KEY`, `DEPLOY_PATH`
   (e.g. `/srv/theplantation`), and `DEPLOY_PORT` if it isn't 22. Optional variable: `SITE_URL`.
2. **On the VPS:** create `DEPLOY_PATH` containing a filled-in `.env` (new passwords, a free `FRONTEND_PORT`).
3. **Log the VPS in to GHCR once**, with a token that has only `read:packages`:

```bash
echo "<token>" | docker login ghcr.io -u <github-username> --password-stdin
```

4. **Switch deploying on:** add the repository variable `DEPLOY_ENABLED` = `true`. Until it's set, the deploy job is
   skipped, so pushes stay green while the server isn't ready.

Roll back by hand to an earlier commit's images:

```bash
./deploy/deploy.sh ghcr.io/<owner>/<repo>-frontend:sha-<old> ghcr.io/<owner>/<repo>-backend:sha-<old>
```

## Update and redeploy

Without GitHub, on a server that builds from the source:

1. Back up the database (above).
2. Get the new version of the project onto the VPS (replace the project files, keeping `.env`).
3. Rebuild and restart. New migrations are applied on start:

```bash
docker compose up -d --build
```

4. Confirm everything is healthy:

```bash
docker compose ps
```

5. Clear out old image layers:

```bash
docker image prune -f
```

## Local development

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build database backend
```

```bash
cd frontend && npm install && npm run dev
```

The site runs on the address Vite prints, with live reload. `/api` is forwarded to the backend container.

## VPS Nginx (the server's own reverse proxy)

This project does not touch the VPS-level Nginx. Add a server block like this on the VPS by hand, then reload Nginx.
The certificate paths assume Let's Encrypt; adjust them to how SSL is managed on the server.

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name theplantation.co.za www.theplantation.co.za;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    http2 on;   # Nginx older than 1.25.1: remove this line and use "listen 443 ssl http2;"
    server_name theplantation.co.za www.theplantation.co.za;

    ssl_certificate     /etc/letsencrypt/live/theplantation.co.za/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/theplantation.co.za/privkey.pem;

    # Keep in step with client_max_body_size in frontend/nginx/default.conf
    client_max_body_size 10m;

    location / {
        proxy_pass http://127.0.0.1:8103;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Only if this site uses WebSockets:
        # proxy_set_header Upgrade $http_upgrade;
        # proxy_set_header Connection "upgrade";
    }
}
```

## Technical decisions, in plain language

- **One idea runs the whole site: "From first light to fairy light".** Each experience is placed at its hour of the day
  on the estate (07:00 the suites, 10:00 corporate, 15:30 the chapel, 18:30 the kitchen, 20:30 The Boma), and colour is
  used as light: Porcelain Ivory for morning, Sage for afternoon, Forest for dusk, Deep Evergreen for night. Champagne
  is used only as the "fairy light": hairlines, small dots, and the twinkling lights in night sections.
- **Typography:** page titles (every `h1`) are set in Megant, self-hosted from `frontend/src/assets/fonts/megant.woff2`;
  section headings stay in Cormorant Garamond and all text is Montserrat. **The supplied Megant file is the
  "Personal Use Only" version: buy a commercial web licence before the site goes live.** It has one weight, no
  italic and no accented letters, so h1s never use bold, italic or accents.
- **Section headings** (`components/ScrollFadeLines.jsx`, used by every `SplitHeading` that is not a page title; the
  Home "The estate" heading is also centred): read in line by line as you scroll:
  each line fades up out of a soft blur, tied to the scroll position (Easy Ease), all in by the upper third of the screen
  (or at the bottom of the page, for a heading that can never get that high). Page titles keep the fairy dust.
- **Intro and music** (`components/LogoIntro.jsx` + `components/MusicPlayer.jsx`): the logo write-on holds on the finished
  lockup for a breath, then fades into the home page (Easy Ease) and the music starts, on every visit (no remembered
  pause or mute; volume is remembered). Browsers only allow sound after a click, tap or key press: a click or Skip
  during the intro counts, otherwise the music starts on the visitor's first interaction, and the music button opens
  a small "Tap for music" cue (with a soft pulse) until it does. Chrome usually allows it straight away for
  returning visitors; Safari and first visits are the strict cases.
- **Location map in every enquiry section** (`components/LocationMap.jsx` in `EnquirySection.jsx`): "Find us", the
  address, a Google map softened to the palette (grey-sepia) in the page's frame tone, and "Get directions". 39 on Church
  points to Walmer (`church.mapEmbed` / `mapUrl` in `content/site.js`); every other page, The Boma included, to the
  estate. Desktop: under "Prefer to talk?" beside the form; phones: after the form. Loads only as it scrolls near.
  Unlike the Contact page (map on request), this loads Google's map without asking: fine for most sites, but worth a
  line in the privacy notice.
- **Social rail** (`components/SocialRail.jsx`, `components/SocialIcon.jsx`): Instagram, Facebook, Pinterest and X (the
  four channels on the current site's Contact page, in `content/site.js`), as fine line icons in a slim (34 px) porcelain
  rail centred in the left page margin, so it never touches content. Wide screens (xl) only. It appears once the hero
  has scrolled away and steps aside at the footer, which carries the same icons. Hover: Forest fill plus a name tag.
- **Back to the top** (`components/ScrollTop.jsx`): bottom-right, the mirror of the music player (both 44 px, same
  material). A fine ring fills in Forest as you read down the page; click eases back to the top (Easy Ease, 1.4 s).
  Appears after the hero, hidden over the footer (its own "Back to the top" link takes over). Both controls use
  `utils/useFloatingChrome.js` to know where the visitor is.
- **Reload goes home** (`main.jsx`): reloading any page starts again on the home page, at the top. Only a reload: a
  shared link or a search result still opens the page it points to.
- **Page transitions: camera lens blur** (`layouts/MainLayout.jsx`): on every page change the old page racks out of
  focus and blooms softly toward ivory (0.45 s), the page jumps to the top at its softest point, and the new page pulls
  back into sharp focus (0.75 s). Easy Ease, no zoom or movement. The header comes back as the transition starts and
  leftover scroll momentum is frozen, so nothing jolts as it settles. Reduced motion: a quick fade instead.
- **3D engagement ring in "Imagine"** (`components/ring/RingRenderer.js` + `RingCanvas.jsx`, used by
  `ImagineSequence` with `ring`): the supplied solitaire GLB (`public/ring/solitaire-ring.glb`, Draco; decoder
  self-hosted in `public/ring/draco/`) lit only by the Pretoria Gardens HDRI (`public/ring/pretoria_gardens_1k.hdr`,
  cut down from the 92 MB 4K EXR in Blender). It arrives with the first line, turns in Y and Z through the three lines
  until it faces the visitor exactly as the finale arrives, tipped towards them so the stone's table faces you
  (like a ring on a display; X 1.0 rad), zooming in from small (x0.6 to x1.12), and leaves with the finale.
  Drag to turn it (mouse: any direction; touch: sideways, so vertical swipes still scroll); a "Drag to turn" hint
  shows until the first drag. The visitor's turn stays while they look and eases back (Easy Ease) once they scroll on.
  Desktop: words centred in the left 7 columns, ring in the right 5; tablet/phone: ring above the words. Platinum band
  as supplied; the stone is a faceted diamond lit by the same HDRI turned upside down (light out of the pavilion).
  three.js (0.187) is lazy-loaded, so it is only downloaded on the Weddings page (~160 KB gzipped). Frames are drawn
  only when the scroll moves. Reduced motion: no ring. Dev only: `window.__ring` is the renderer.
  Check the model's and the HDRI's licences allow use on a commercial website.
- **Wedding "Imagine" sequence** (`components/ImagineSequence.jsx`): the section pins for four screens of scroll. Each
  "Imagine..." line fades in out of a soft blur, holds, then drifts up and away as the next arrives; the last line,
  "Imagine your wedding at The Plantation.", fades in and zooms in slowly, then fades away as the section lets go into "The Plantation
  experience". Driven by scroll position, so it plays at the visitor's pace in both directions; dots show the step.
  Reduced motion: the lines are simply listed.
- **Wedding "experience" reel** (`components/MomentReel.jsx` + `components/reel/ReelGL.js`, after siena.film): the six
  moments are gold-framed cards in a pinned reel drawn in WebGL (no library). Cards are projected onto a drum (flat at
  the centre, curving away top and bottom) and bow with scroll speed (the middle trails the edges); inside, each photo
  is cover-fitted, zoomed and drifts against the card's travel. Card text is real HTML on a strict grid (equal padding,
  shared top and bottom lines), put through the same drum maths so it stays locked to the card. The reel settles on the
  nearest card; counter pill + numeral rail navigate; the header steps aside while it's on screen. Touch devices and
  reduced motion get a stacked version; no WebGL falls back to flat CSS cards.
- **Photo behaviour:** framed photos float in from blur on scroll (`floatIn` in utils/motion.js), ease in slightly on
  hover, and in overlapping pairs (`.overlap-group` / `.overlap-item`) pointing at one blurs the other. Frame rule: 4px.
- **Music** (`components/MusicPlayer.jsx`, `public/music/*.m4a`): bottom-left button with a music icon; plays three
  tracks in turn across every page (it lives in the layout). Starts by itself when the logo intro ends (event
  `plantation:intro-done`); if the browser blocks sound before any interaction, it starts on the first click/tap/key.
  A visitor who pauses it is not auto-started again. Fades in/out, next track, mute, volume slider (remembered). Licensed stock tracks (AudioJungle: Alex Shulgin, MoodMode;
  the "wedding" Full Track pack): keep each licence on file for this website.
- **Cuisine carousel** (`components/Carousel.jsx`, home page): a free horizontal carousel (drag, swipe, arrows, keyboard)
  with snap points and a progress line; it never pins or takes over the page scroll.
- **Frame system** (`components/Frame.jsx`, `content/frames.js`): every photo inside the layout hangs in a rounded
  frame: a 2px rule in its experience's colour, a 5px gap, then the photo with a nested radius. Weddings + Gallery: gold;
  Corporate: forest; Accommodation: sage; The Boma: champagne; 39 on Church: charcoal; Cuisine: evergreen; Story: champagne.
  Pages set it with `<FrameTone>`; full-bleed photos opt out with `frame={false}` (square, edge to edge).
- **Design tokens live in one place.** `frontend/src/styles/index.css` holds the palette, the type scale (`type-hero`
  to `type-label`), the 12-column grid and the section rhythm. `src/components/Intro.jsx` locks the spacing between
  eyebrow, heading, copy and buttons so every section opens the same way.
- **Real photography only.** `tools/photos.py` exports the venue's own photos (downloaded from the three current
  sites into `assets-source/`) as WebP at three widths with blurred placeholders, and trims photographer credits that
  are printed into some originals. Run `python3 tools/photos.py` after changing which photo goes where.
- **Opening:** every full page load plays the logo write-on intro (`components/LogoIntro.jsx`): the light version of
  the After Effects animation (`public/intro/logo-write-on.mp4`, from `/Volumes/ThinkTank/Clint/Plantation Logo Animation`)
  on white at a modest size (script ~540px wide on desktop), stopped on the finished lockup at 5.3 s, then a 0.9 s fade to the page. The home headline then gathers out
  of "fairy dust" (2 s). Skip button / click / Escape skip it; if the video is not ready within 2.5 s (slow connection,
  iOS Low Power Mode blocking autoplay) the visitor goes straight to the site; reduced motion shows the still lockup.
  Outside the intro the logo is never animated.
- **Every animation uses Easy Ease** (After Effects F9, `cubic-bezier(0.333, 0, 0.667, 1)`), set once in
  `utils/motion.js`, `styles/index.css` and as Motion's global default. Two deliberate exceptions: the client-name
  marquee and the loading spinner run at constant speed (`linear`), because a continuous loop with easing stutters
  every cycle. Lenis' scroll smoothing is scrolling, not an animation, and keeps its own curve.
- **Motion uses one library (Motion for React)**, not GSAP as well: it is already in the stack and covers the scroll
  effects (pinned chapel reveal, sideways cuisine row, parallax). Lenis adds smooth wheel scrolling. Everything
  switches to simple fades for visitors who ask their device for reduced motion.
- **Booking stays on NightsBridge.** "Book online" goes to the existing NightsBridge engines (bbid 21113 for The
  Plantation suites, 18531 for 39 on Church). The site does not show availability it cannot know; wedding dates are
  confirmed by the team after an enquiry.
- **Third parties load only on request.** The wedding film (YouTube, no-cookie domain) and the Google map load when a
  visitor clicks, which keeps pages fast and private.
- **One enquiries table for six audiences.** Shared columns (name, contact, dates, guests) plus a small `details`
  field for what only one audience needs (company, suite, package...). The API accepts only the listed options.
- **Search:** each page sets its own title, description and canonical link; `robots.txt`, `sitemap.xml` and
  venue structured data are included. It is still a browser-rendered React site, so link previews use the
  site-wide image in `index.html`.
- **A small admin for specials only.** The venue's most time-sensitive content (offers with dates) is the part they
  edit themselves; everything else stays in the code so the design can't be broken by accident. Specials live in a
  `specials` table, and a "show until" date retires an offer automatically, so an expired special never stays up.
- **Admin sign-in:** passwords are stored only as bcrypt hashes (`bcryptjs`, the pure-JavaScript build, so the Alpine
  image needs no build tools). A signed session token sits in an httpOnly cookie that page scripts can't read; every
  `/api/admin` route checks it on the server. Wrong email and wrong password give the same message, and sign-in is
  rate limited. `/admin` is hidden from search engines (`robots.txt` and a noindex tag).
