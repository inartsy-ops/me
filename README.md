# Personal CV site

A single-page, no-build static site: your résumé, a video gallery of technical
work, experience, and contact details. Send someone the link and they can get
everything from one page.

No frameworks, no npm install, no font CDN. Open `index.html` in a browser and
it works.

```
index.html                  markup + link-preview tags
assets/css/styles.css       all styling (light + dark themes)
assets/js/content.js        ← YOUR CONTENT LIVES HERE
assets/js/main.js           rendering + interaction (you shouldn't need to edit)
assets/resume.pdf           ← YOUR CV GOES HERE (placeholder included)
assets/img/                 poster thumbnails + og.png
assets/video/               local .mp4 files
.github/workflows/deploy.yml  auto-deploy to GitHub Pages on push to main
```

---

## 1. Fill in your content

Everything you'll change is in **`assets/js/content.js`**. It's one commented
object — name, role, summary, experience, skills, work samples, contact links.
Save the file, refresh the browser, done.

Then replace `assets/resume.pdf` with your real CV, keeping the same filename
(or point `resume.file` at a different path).

### Preview locally

Double-click `index.html`, or for a closer match to production:

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

---

## 2. Add your videos

Each entry in the `work:` array becomes a card that plays in a lightbox. Two
supported sources — you can mix them freely across cards:

**Hosted (recommended for anything over ~20MB).** Upload to YouTube or Vimeo as
*unlisted*, then use the embed URL:

```js
{ title: 'Zero-downtime shard migration',
  embed: 'https://www.youtube.com/embed/VIDEO_ID' }
```

Use the `/embed/VIDEO_ID` form, not `watch?v=`. Vimeo:
`https://player.vimeo.com/video/VIDEO_ID`.

**Local file.** Drop the `.mp4` in `assets/video/`:

```js
{ title: 'Self-serve deployment platform',
  video: 'assets/video/deploy-demo.mp4' }
```

Local files count against the GitHub 1GB soft repo limit and 100MB per-file hard
limit, so keep them short and compressed:

```sh
ffmpeg -i raw.mov -vcodec libx264 -crf 26 -preset slow \
       -vf "scale=1280:-2" -acodec aac -b:a 128k assets/video/demo.mp4
```

**Thumbnails** are optional. Omit `poster:` and the card renders a generated
gradient that still looks deliberate. To use a real frame:

```sh
ffmpeg -i assets/video/demo.mp4 -ss 00:00:03 -vframes 1 assets/img/demo.jpg
```

If a card has neither `video` nor `embed`, it still renders and the lightbox
shows a quiet "no video attached yet" panel — so you can ship the layout before
the footage is ready.

---

## 3. Publish to GitHub Pages

```sh
git init -b main
git add -A
git commit -m "Personal CV site"
gh repo create cv --public --source=. --push
```

Then in the repo: **Settings → Pages → Build and deployment → Source →
GitHub Actions**. That's the one manual step. Every push to `main` redeploys via
`.github/workflows/deploy.yml`.

Your link will be `https://<username>.github.io/cv/`.

> The repo must be **public** for Pages on a free account. If your CV shouldn't
> be indexed, see "Keeping it semi-private" below.

### Shorter URL

Name the repo `<username>.github.io` instead of `cv`, and the site serves from
`https://<username>.github.io/` with no path.

### Custom domain

Add a file named `CNAME` at the repo root containing just your domain
(`cv.yourdomain.com`), point a DNS CNAME record at `<username>.github.io`, then
set the domain under Settings → Pages and tick **Enforce HTTPS**.

---

## 4. Make the link preview well

This matters more than it sounds — a bare URL in Slack, iMessage, or LinkedIn
looks like spam, while a card with your name and photo looks like a portfolio.

1. Set `meta.siteUrl` in `content.js` to your real URL, e.g.
   `'https://yourhandle.github.io/cv/'`.
2. Save a **1200 × 630** image as `assets/img/og.png` — your name, role, and a
   headshot or clean background is plenty.

Both are read at page load and injected into the `og:` tags. Previews are cached
aggressively, so use LinkedIn's Post Inspector or Slack's link unfurl debugger to
force a refresh after changing them.

---

## Customising the look

**Accent colour** — one value in `content.js` retints the entire site:

```js
meta: { accent: '#3f6f5c' }   // forest (default)
```

Other options that hold up in both themes: `#3d5a80` slate blue, `#8c5a3c` clay,
`#5a4e7c` aubergine, `#2f6f74` teal. The dark theme automatically lightens
whatever you pick so contrast stays readable.

**Sections** — set any content array to `[]` and that section removes itself
from the DOM rather than rendering an empty heading. Same for individual
contact links: an empty `href` is skipped.

**Type** — headings use the system serif (New York on Apple platforms, Georgia
elsewhere) and body copy uses the system sans. Swap `--font-display` /
`--font-body` at the top of `styles.css` if you want something else. Deliberately
no webfont CDN: nothing to load, nothing to break, no third-party request.

---

## Keeping it semi-private

The repo has to be public, but the *site* doesn't have to be discoverable:

- Add `<meta name="robots" content="noindex, nofollow">` to `<head>` in
  `index.html` to keep it out of search results.
- Publish under an unguessable path (`.../cv-8f3a2b/`) and share only that link.
- For genuine access control you need a host with auth in front of it — Pages
  has none. Netlify's password protection or Cloudflare Access are the usual
  answers.

---

## Browser support

Current Chrome, Safari, Firefox, and Edge. Uses `color-mix()`, `aspect-ratio`,
and `IntersectionObserver`; older browsers degrade to an unanimated but fully
readable page. Respects `prefers-reduced-motion` and `prefers-color-scheme`,
keyboard-navigable throughout, and prints cleanly to PDF.
