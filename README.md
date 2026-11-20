# Dale's Dungeon: a pixel-art portfolio

The personal portfolio of **Dale Cyrus D. Edrosalan**, BSCS student at Gordon College, Olongapo City.
Built for **CSE 316: Web Application Development** (final project).

Instead of a usual scrolling page, the portfolio is a small 2D dungeon. Visitors start on the surface by a campfire, enter the castle, and go down floor by floor. Each floor is a room that holds one part of the portfolio.

| Floor | Room | What it holds |
|---|---|---|
| 0 | **The surface** | Introduction, portrait, and the castle entrance |
| 1 | **The archives** | A glowing book on a lectern: about me, what I do, highlights, stack and technical skills |
| 2 | **Training grounds** | A quest log with my experience (OJT and work immersion) |
| 3 | **The scroll hall** | Projects as scrolls on podiums (the Check8 case study is featured), a certifications cabinet, and a messenger for contacts |

## Features

- **Floor navigation:** Previous/Next floor buttons, a dungeon map with shortcuts to every room and page, and links between rooms.
- **Scrolling that depends on where the pointer is:** over the open book, the mouse wheel or touchpad turns its pages (and scrolls a page first if it has more text); over the quest board, it scrolls a quest that has more text and never changes floors; anywhere else, one flick moves one floor. A short note says how to change floors when you reach the end of the book or board. Boxes that scroll show "more" hints at their edges.
- **Case studies** that unroll from scrolls, following the case study template: overview, users, design, usability study, refinements, takeaways and next steps.
- **Movable, resizable windows** for certifications and contacts, and a certificate viewer.
- **Responsive layout** for phones, tablets (upright and sideways) and desktops. On phones every room fits one screen and long panels show one page at a time.
- **Accessibility (WCAG 2.2 AA):** keyboard access everywhere with no keyboard traps, a skip link, landmarks, visible focus, text alternatives, room changes announced to screen readers, and enough color contrast.
- **Motion control:** a Pause/Play animations button (remembered per device), support for the system "reduce motion" setting, and animations that pause in rooms you can't see.
- **Light on slow devices:** sprites are drawn once into tiny images; low-end phones get a lighter mode automatically, and a tip suggests pausing animations when the page stutters.
- **Custom 404 page:** an empty treasure room.

## Technologies used

- **HTML5**, **CSS3** and **vanilla JavaScript** (no frameworks, no build step)
- **Canvas API** to draw the pixel-art sprites from letter grids
- **Fetch API** to load the case-study scrolls from `components/`
- **Google Fonts:** Press Start 2P (headings) and Pixelify Sans (text)
- **GitHub Pages** for hosting, with a custom domain
- Tested with **Playwright** (layout, keyboard and scrolling checks) and **axe-core** (accessibility checks)

## Project structure

```
.
├── index.html                  Page structure: the four rooms, the map, windows and dialogs
├── 404.html                    "Room not found" page (GitHub Pages shows it for unknown addresses)
├── README.md
├── css/
│   ├── style.css               Layout, colors, typography and responsive rules
│   ├── animations.css          Keyframes, transitions and animation settings, plus the rules that pause motion
│   └── 404.css                 Styles for the 404 page
├── js/
│   ├── sprites.js              Color palette, every pixel sprite, and drawing them on load
│   ├── rooms.js                Dale's dialogue, the archives book, phone pagers, quest board, text that fits its box
│   ├── dialogs.js              Case-study scrolls, windows (certifications, contacts), certificate viewer
│   ├── navigation.js           Dungeon map, floor buttons, links between rooms, current-room tracking
│   ├── scroll.js               Mouse wheel and touchpad behavior, touch swipes inside boxes, "more" hints
│   ├── motion.js               Pause/Play animations, pausing hidden rooms, slow-device tip, light mode
│   └── 404.js                  Sprites for the 404 page
├── components/                 Reusable scroll contents, loaded when a scroll is opened
│   ├── check8-case-study.html
│   ├── wispend-case-study.html
│   └── freelance-work.html
└── assets/
    ├── images/                 Portrait and project screenshots (check8/, wispend/)
    ├── certificates/           Certificate PDFs
    └── icons/                  Favicons
```

The scripts are loaded in this order (all with `defer`): `sprites.js`, `rooms.js`, `dialogs.js`, `navigation.js`, `scroll.js`, `motion.js`. Later files use functions from earlier ones.

## Running it locally

The case-study scrolls are loaded with `fetch`, which browsers block for files opened straight from a folder (`file://`). Run the site from a small local web server instead:

**Option 1: Python** (installed on most computers)

```bash
cd path/to/this/folder
python -m http.server 8000
```

Then open <http://localhost:8000> in your browser.

**Option 2: VS Code**

Install the **Live Server** extension, open this folder, right-click `index.html` and choose **Open with Live Server**.

**Option 3: Node.js**

```bash
npx serve .
```

To see the 404 page locally, open <http://localhost:8000/404.html>. On the live site it appears automatically for any address that doesn't exist.

## Deployment

The site is hosted on **GitHub Pages** from the `main` branch (root folder), with a custom domain:

1. Repository **Settings → Pages → Build and deployment:** "Deploy from a branch", `main`, `/ (root)`.
2. **Custom domain** set in the same screen (GitHub keeps it in the `CNAME` file), with the domain's DNS pointing to GitHub Pages, and **Enforce HTTPS** turned on.
3. Every commit to `main` redeploys the site automatically, so the live site always matches this repository.

## Credits

- **Check8** was built as a team project. The case study was co-created with **Gian Karlo C. Reguindin** (Project Manager). My roles were Implementation Lead and Requirements and Documentation Lead.
- Usability testers for WiSpend and the portfolio asked to stay anonymous.
- All pixel art is original, drawn in code for this site.
