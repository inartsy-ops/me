/* ============================================================================
 *  main.js — renders the page from window.SITE and wires up interaction.
 *
 *  You shouldn't need to touch this file. All content lives in content.js.
 *  Plain script (not a module) on purpose, so the site also works when you
 *  double-click index.html straight off disk.
 * ==========================================================================*/

(function () {
  'use strict';

  var S = window.SITE || {};
  var person  = S.person   || {};
  var resume  = S.resume   || {};
  var contact = S.contact  || {};
  var meta    = S.meta     || {};

  var gate    = S.gate     || {};

  /* The viewport each demo gets inside its card thumbnail. 16:10 to match
     .work-thumb, and wide enough that the demos lay out as they would on a
     laptop instead of collapsing into a narrow single column. Declared up
     here because renderWork writes them into the markup. */
  var THUMB_W = 1280;
  var THUMB_H = 800;

  var $  = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  };

  /* Escape anything interpolated into an HTML template string. */
  function esc(v) {
    return String(v == null ? '' : v)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function has(v) { return typeof v === 'string' ? v.trim().length > 0 : !!v; }

  /* ======================================================================
   *  Theme + accent
   * ==================================================================== */
  if (has(meta.accent)) {
    document.documentElement.style.setProperty('--accent-base', meta.accent);
  }

  var themeToggle = $('#themeToggle');
  themeToggle.addEventListener('click', function () {
    var next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('cv-theme', next); } catch (e) { /* private mode */ }
  });

  /* Follow the OS if the visitor hasn't made an explicit choice here. */
  var mq = window.matchMedia('(prefers-color-scheme: dark)');
  var onSchemeChange = function (e) {
    var saved = null;
    try { saved = localStorage.getItem('cv-theme'); } catch (err) { /* noop */ }
    if (!saved) document.documentElement.dataset.theme = e.matches ? 'dark' : 'light';
  };
  if (mq.addEventListener) mq.addEventListener('change', onSchemeChange);
  else if (mq.addListener) mq.addListener(onSchemeChange);

  /* ======================================================================
   *  Document metadata — title and link-preview tags
   * ==================================================================== */
  (function documentMeta() {
    var name = person.name || 'Curriculum Vitae';
    var role = person.role || '';
    var title = role ? name + ' — ' + role : name;
    var desc = person.tagline || 'Résumé, selected work, and contact details.';

    document.title = title;

    var set = function (selector, attr, value) {
      var el = $(selector);
      if (el && value) el.setAttribute(attr, value);
    };
    set('meta[name="description"]', 'content', desc);
    set('meta[name="author"]', 'content', name);
    set('meta[property="og:title"]', 'content', title);
    set('meta[property="og:description"]', 'content', desc);

    if (has(meta.siteUrl)) {
      var base = meta.siteUrl.replace(/\/?$/, '/');
      var ogEl = $('meta[property="og:image"]');
      if (ogEl && has(meta.ogImage)) {
        ogEl.setAttribute('content', /^https?:/i.test(meta.ogImage)
          ? meta.ogImage
          : base + meta.ogImage.replace(/^\.?\//, ''));
      }
      var link = document.createElement('link');
      link.rel = 'canonical';
      link.href = base;
      document.head.appendChild(link);

      var ogUrl = document.createElement('meta');
      ogUrl.setAttribute('property', 'og:url');
      ogUrl.setAttribute('content', base);
      document.head.appendChild(ogUrl);
    }
  })();

  /* ======================================================================
   *  Simple text bindings — [data-bind="key"]
   * ==================================================================== */
  (function bindText() {
    var values = {
      name: person.name || '',
      initials: person.initials || (person.name || '?').trim().charAt(0).toUpperCase(),
      role: person.role || '',
      location: person.location || '',
      tagline: person.tagline || '',
      /* summary is handled below — it renders as paragraphs, not plain text */
      email: contact.email || '',
      'status-line': person.status || '',
      'resume-updated': has(resume.updated) ? 'last updated ' + resume.updated : 'up to date',
    };

    /* The summary is the one multi-paragraph field, so it's rendered as real
       <p> elements rather than a single run of text. Accepts either an array
       of paragraphs or a plain string. */
    var summaryEl = $('[data-bind="summary"]');
    if (summaryEl) {
      var paras = Array.isArray(person.summary)
        ? person.summary.filter(has)
        : (has(person.summary) ? [person.summary] : []);
      summaryEl.innerHTML = paras.map(function (para) {
        return '<p>' + esc(para) + '</p>';
      }).join('');
    }

    Object.keys(values).forEach(function (key) {
      $$('[data-bind="' + key + '"]').forEach(function (el) {
        el.textContent = values[key];
      });
    });

    /* Hide the separator dot when there's nothing on one side of it. */
    if (!person.role || !person.location) {
      $$('[data-bind="location-sep"]').forEach(function (el) { el.remove(); });
    }
    $('#year').textContent = new Date().getFullYear();
  })();

  /* ======================================================================
   *  Contact links (hero + contact section) and mailto targets
   * ==================================================================== */
  (function renderLinks() {
    var links = (contact.links || []).filter(function (l) { return l && has(l.href); });

    var heroLinks = $('#heroLinks');
    var contactLinks = $('#contactLinks');

    links.forEach(function (l) {
      /* mailto:/tel: must stay in the current tab — opening them in a new one
         leaves a blank tab behind and, on desktop, often does nothing at all. */
      var a = '<a href="' + esc(l.href) + '"' +
              (isHandoff(l.href) ? '' : ' target="_blank" rel="noopener noreferrer"') +
              '>' + esc(l.label) + '</a>';
      heroLinks.insertAdjacentHTML('beforeend', a);
      contactLinks.insertAdjacentHTML('beforeend', a);
      if (isHandoff(l.href)) {
        [heroLinks.lastElementChild, contactLinks.lastElementChild]
          .forEach(function (el) { wireHandoff(el, l.href); });
      }
    });

    if (has(contact.email)) {
      var mailto = 'mailto:' + contact.email;
      var emailLink = $('#emailLink');
      emailLink.href = mailto;
      wireHandoff(emailLink, mailto);
      /* Lead both link rows with Email — it's the channel that actually
         gets a reply. */
      [heroLinks, contactLinks].forEach(function (row) {
        row.insertAdjacentHTML('afterbegin',
          '<a href="' + esc(mailto) + '">Email</a>');
        wireHandoff(row.firstElementChild, mailto);
      });
    } else {
      $('#emailLink').removeAttribute('href');
    }
  })();

  /* mailto: and tel: hand off to another app. When no handler is registered —
     a desktop with no mail client, most laptops for tel: — the click silently
     does nothing. Copy the address/number too, so a click always has a
     visible result whether or not the handoff lands. */
  function isHandoff(href) {
    return /^(mailto:|tel:)/i.test(String(href || ''));
  }

  function wireHandoff(el, href) {
    if (!el) return;
    var isTel = /^tel:/i.test(href);
    var value = href.replace(/^(mailto:|tel:)/i, '');
    el.addEventListener('click', function () {
      copyText(value, isTel ? 'Number' : 'Address');
    });
  }

  /* ======================================================================
   *  Focus cards
   * ==================================================================== */
  (function renderFocus() {
    var grid = $('#focusGrid');
    var items = S.focus || [];
    if (!items.length) { grid.remove(); return; }

    grid.innerHTML = items.map(function (f, i) {
      return '<article class="focus-card reveal" data-delay="' + (i % 4) + '">' +
               '<h3>' + esc(f.title) + '</h3>' +
               '<p>' + esc(f.body) + '</p>' +
             '</article>';
    }).join('');
  })();

  /* ======================================================================
   *  Selected work grid
   * ==================================================================== */
  var work = (S.work || []).filter(function (w) { return w && has(w.title); });

  (function renderWork() {
    var grid = $('#workGrid');
    if (!work.length) {
      grid.innerHTML = '<p class="work-empty">Work samples coming soon.</p>';
      return;
    }

    grid.innerHTML = work.map(function (w, i) {
      /* Vary the generated-thumbnail tint per card so the grid reads as a
         set rather than four identical placeholders. */
      var tint = [26, 15, 34, 20, 11, 29][i % 6];

      /* Say what the card actually is. A demo is a live build, an image is a
         document to look at, everything else is a recording. */
      var isDemo = has(w.demo);
      var isImage = !isDemo && has(w.image);
      /* Some videos can't be embedded — the owner disables playback on other
         sites. Those cards leave the page instead of opening the lightbox. */
      var isExternal = has(w.external);

      /* .play-icon svg is fill-only (no stroke), so these are solid shapes. */
      var launchIcon = '<svg viewBox="0 0 10 10" aria-hidden="true"><path d="M4.8 2H8v3.2L4.8 2z' +
                       'M2.65 8.05L1.95 7.35L5.65 3.65L6.35 4.35z"/></svg>';
      var docIcon    = '<svg viewBox="0 0 10 10" aria-hidden="true">' +
                       '<path d="M2.4 1h3.1l2.1 2.1V9H2.4zM5.6 1.2V3h1.8z"/></svg>';
      var playIcon   = '<svg viewBox="0 0 10 10" aria-hidden="true"><path d="M2 1v8l6-4z"/></svg>';

      var play =
        '<span class="play">' +
          '<span class="play-icon">' +
            (isDemo || isExternal ? launchIcon : isImage ? docIcon : playIcon) +
          '</span>' +
          (isDemo ? 'Open demo'
            : isExternal ? 'Watch on YouTube'
            : isImage ? 'View record' : 'Play') +
        '</span>';

      /* Give every card something real to look at. In preference order:
         a supplied poster image, the demo itself running scaled-down, or a
         frame of the video. The generated gradient stays underneath as the
         backdrop while any of those load — and as the fallback if a card has
         no source at all. */
      var preview = '';
      if (has(w.poster)) {
        preview = '<img src="' + esc(w.poster) + '" alt="" loading="lazy" decoding="async">';
      } else if (isDemo) {
        /* Sized 400% and scaled to 25% (see styles.css), so the demo gets a
           desktop-width viewport inside a card-sized box. Loaded lazily —
           src is only set once the card scrolls into view. */
        preview = '<iframe class="thumb-live" data-src="' + esc(w.demo.trim()) + '" ' +
                  'tabindex="-1" aria-hidden="true" scrolling="no" title="" ' +
                  'width="' + THUMB_W + '" height="' + THUMB_H + '"></iframe>';
      } else if (has(w.video)) {
        /* #t=1 asks the browser to paint the frame one second in rather than
           a black box. Plays muted on hover — see wireThumbs(). */
        preview = '<video class="thumb-video" data-src="' + esc(w.video.trim()) + '#t=1" ' +
                  'muted playsinline preload="none" tabindex="-1" aria-hidden="true"></video>';
      } else if (youTubeId(w.embed || w.external)) {
        /* Use YouTube's own still so an embed card isn't the one card on the
           page without a preview. maxres only exists for videos uploaded in
           HD, so fall back to hqdefault, which always does. */
        var id = youTubeId(w.embed || w.external);
        preview = '<img class="thumb-yt" src="https://i.ytimg.com/vi/' + id + '/maxresdefault.jpg" ' +
                  'data-fallback="https://i.ytimg.com/vi/' + id + '/hqdefault.jpg" ' +
                  'alt="" loading="lazy" decoding="async">';
      }

      var thumb =
        '<div class="work-thumb is-generated' + (preview ? ' has-preview' : '') +
          '" style="--tint:' + tint + '">' + preview + play + '</div>';

      var kicker = [w.kind, w.year, w.duration].filter(has)
        .map(esc).join('<span class="sep">/</span>');

      var tags = (w.tags || []).map(function (t) {
        return '<span class="tag">' + esc(t) + '</span>';
      }).join('');

      /* An external card is a link, not a dialog trigger — so it renders as
         an anchor and gets the browser's own affordances (open in new tab,
         copy link, middle-click). */
      var open  = isExternal
        ? '<a class="work-card reveal" href="' + esc(w.external.trim()) + '" ' +
          'target="_blank" rel="noopener noreferrer"'
        : '<button class="work-card reveal" type="button"';

      return open + ' data-delay="' + (i % 3) + '" data-index="' + i + '" ' +
               'aria-label="' +
               (isDemo ? 'Open live demo: '
                 : isExternal ? 'Watch on YouTube (opens in a new tab): '
                 : isImage ? 'View record: ' : 'Play: ') +
               esc(w.title) + '">' +
               thumb +
               '<div class="work-body">' +
                 (kicker ? '<div class="work-kicker">' + kicker + '</div>' : '') +
                 '<h3>' + esc(w.title) + '</h3>' +
                 (has(w.blurb) ? '<p>' + esc(w.blurb) + '</p>' : '') +
                 (tags ? '<div class="tag-row">' + tags + '</div>' : '') +
               '</div>' +
             (isExternal ? '</a>' : '</button>');
    }).join('');

    grid.addEventListener('click', function (e) {
      var card = e.target.closest('.work-card');
      /* Anchor cards navigate on their own — don't also open the lightbox. */
      if (!card || card.tagName === 'A') return;
      openLightbox(Number(card.dataset.index), card);
    });

    wireThumbs(grid);
  })();

  /* Pull the video id out of any of the URL shapes YouTube hands out —
     youtu.be/ID, /watch?v=ID, /embed/ID, /shorts/ID — including the
     nocookie domain. Returns '' for anything else (Vimeo, a bare file). */
  function youTubeId(url) {
    if (!has(url)) return '';
    var m = String(url).match(
      /(?:youtu\.be\/|\/embed\/|[?&]v=|\/shorts\/)([A-Za-z0-9_-]{11})/
    );
    return m ? m[1] : '';
  }

  /* Scale each live preview so its fixed 1280x800 viewport exactly fills the
     card. Measured rather than expressed in CSS percentages, and re-measured
     whenever the card changes size — including when it first gets a size at
     all, which is what happens after the passphrase gate is dismissed. */
  function sizeLiveThumbs(grid) {
    var frames = $$('.thumb-live', grid);
    if (!frames.length) return;

    var fit = function (frame) {
      var box = frame.parentNode;
      var w = box ? box.clientWidth : 0;
      if (!w) return; // still hidden — the observer will call us again
      frame.style.transform = 'scale(' + (w / THUMB_W) + ')';
      frame.classList.add('is-sized');
    };

    frames.forEach(fit);

    if ('ResizeObserver' in window) {
      var ro = new ResizeObserver(function (entries) {
        entries.forEach(function (entry) {
          var frame = $('.thumb-live', entry.target);
          if (frame) fit(frame);
        });
      });
      frames.forEach(function (f) { if (f.parentNode) ro.observe(f.parentNode); });
    } else {
      var t;
      window.addEventListener('resize', function () {
        clearTimeout(t);
        t = setTimeout(function () { frames.forEach(fit); }, 120);
      });
    }
  }

  /* Card previews are real iframes and videos, so they only start loading
     once the card is near the viewport — otherwise opening the page would
     pull every demo and both video files at once. */
  function wireThumbs(grid) {
    var lazy = $$('.thumb-live, .thumb-video', grid);

    sizeLiveThumbs(grid);

    var load = function (el) {
      if (el.dataset.src) {
        el.src = el.dataset.src;
        delete el.dataset.src;
      }
    };

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          load(entry.target);
          io.unobserve(entry.target);
        });
      }, { rootMargin: '200px' });
      lazy.forEach(function (el) { io.observe(el); });
    } else {
      lazy.forEach(load);
    }

    /* YouTube only generates a maxres still for HD uploads; swap to the
       hqdefault size, which always exists, if the first one 404s. */
    $$('.thumb-yt', grid).forEach(function (img) {
      img.addEventListener('error', function handle() {
        img.removeEventListener('error', handle);
        if (img.dataset.fallback) img.src = img.dataset.fallback;
      });
    });

    /* A still frame says "video"; a moving one says "watch this". Muted and
       silent, reset on the way out so it always starts from the top. */
    $$('.work-card', grid).forEach(function (card) {
      var vid = $('.thumb-video', card);
      if (!vid) return;

      var play = function () {
        load(vid);
        vid.loop = true;
        var p = vid.play();
        if (p && p.catch) p.catch(function () { /* autoplay refused — fine */ });
      };
      var stop = function () {
        vid.pause();
        try { vid.currentTime = 1; } catch (e) { /* not seekable yet */ }
      };

      card.addEventListener('mouseenter', play);
      card.addEventListener('mouseleave', stop);
      card.addEventListener('focus', play);
      card.addEventListener('blur', stop);
    });
  }

  /* ======================================================================
   *  Experience timeline, skills, education
   * ==================================================================== */
  (function renderExperience() {
    var tl = $('#timeline');
    var items = S.experience || [];
    if (!items.length) { tl.remove(); }
    else {
      tl.innerHTML = items.map(function (job, i) {
        var points = (job.points || []).map(function (p) {
          return '<li>' + esc(p) + '</li>';
        }).join('');
        var tags = (job.tags || []).map(function (t) {
          return '<span class="tag">' + esc(t) + '</span>';
        }).join('');

        return '<article class="tl-item reveal" data-delay="' + Math.min(i, 3) + '">' +
                 '<div class="tl-meta">' +
                   '<span class="tl-period">' + esc(job.period) + '</span>' +
                   (has(job.location)
                     ? '<span class="tl-location">' + esc(job.location) + '</span>' : '') +
                 '</div>' +
                 '<div class="tl-body">' +
                   '<h3 class="tl-role">' + esc(job.role) + '</h3>' +
                   '<p class="tl-company">' + esc(job.company) + '</p>' +
                   (points ? '<ul class="tl-points">' + points + '</ul>' : '') +
                   (tags ? '<div class="tag-row">' + tags + '</div>' : '') +
                 '</div>' +
               '</article>';
      }).join('');
    }

    var skillsEl = $('#skills');
    var groups = S.skills || [];
    if (!groups.length) { skillsEl.remove(); }
    else {
      skillsEl.innerHTML = groups.map(function (g, i) {
        var chips = (g.items || []).map(function (s) {
          return '<span class="chip">' + esc(s) + '</span>';
        }).join('');
        return '<div class="skill-group reveal" data-delay="' + Math.min(i, 3) + '">' +
                 '<h3>' + esc(g.group) + '</h3>' +
                 '<div class="skill-items">' + chips + '</div>' +
               '</div>';
      }).join('');
    }

    var eduEl = $('#education');
    var edu = S.education || [];
    if (!edu.length) { eduEl.remove(); }
    else { eduEl.innerHTML = edu.map(creditCard).join(''); }
  })();

  /* Education entries and certifications share a card shape. */
  function creditCard(c, i) {
    return '<div class="edu-card reveal" data-delay="' + Math.min(i, 3) + '">' +
             (has(c.period) ? '<span class="period">' + esc(c.period) + '</span>' : '') +
             '<h4>' + esc(c.title) + '</h4>' +
             '<p class="org">' + esc(c.org) + '</p>' +
             (has(c.note) ? '<p class="note">' + esc(c.note) + '</p>' : '') +
           '</div>';
  }

  /* ======================================================================
   *  Certifications
   * ==================================================================== */
  (function renderCertifications() {
    var section = $('#certifications');
    var certs = S.certifications || [];
    /* No certifications listed — drop the whole section, and its nav link
       with it, rather than leaving an empty heading behind. */
    if (!certs.length) {
      if (section) section.remove();
      var navLink = $('#nav a[href="#certifications"]');
      if (navLink) navLink.remove();
      return;
    }
    $('#certGrid').innerHTML = certs.map(creditCard).join('');
  })();

  /* ======================================================================
   *  Résumé section — stats, download links, inline PDF viewer
   * ==================================================================== */
  (function renderResume() {
    var file = has(resume.file) ? resume.file : 'assets/resume.pdf';

    $$('#heroDownload, #resumeDownload').forEach(function (a) {
      a.href = file;
      if (has(resume.downloadAs)) a.setAttribute('download', resume.downloadAs);
    });
    $('#resumeOpen').href = file;

    var stats = $('#resumeStats');
    (resume.highlights || []).forEach(function (h) {
      stats.insertAdjacentHTML('beforeend',
        '<div class="stat">' +
          '<div class="value">' + esc(h.value) + '</div>' +
          '<div class="label">' + esc(h.label) + '</div>' +
        '</div>');
    });

    var body = $('#viewerBody');

    function embed() {
      /* #view=FitH&toolbar=0 is honoured by Chrome/Edge and ignored elsewhere,
         which is fine — it's a nicety, not a requirement. */
      body.innerHTML =
        '<iframe src="' + esc(file) + '#view=FitH&toolbar=0&navpanes=0" ' +
        'title="Résumé (PDF)" loading="lazy"></iframe>';
    }

    function fallback() {
      body.innerHTML =
        '<div class="viewer-fallback">' +
          '<div class="doc-icon"></div>' +
          '<h3>No PDF found yet</h3>' +
          '<p>Drop your CV at <code>' + esc(file) + '</code> and this panel will ' +
             'render it inline. Nothing else needs to change.</p>' +
        '</div>';
    }

    /* A HEAD request tells us whether the file is actually there, so a missing
       PDF shows a helpful panel instead of a blank grey rectangle. fetch() is
       blocked on file:// URLs, so there we just embed optimistically. */
    if (location.protocol === 'file:') { embed(); return; }

    fetch(file, { method: 'HEAD' })
      .then(function (r) { (r.ok ? embed : fallback)(); })
      .catch(fallback);
  })();

  /* ======================================================================
   *  Lightbox
   * ==================================================================== */
  var lb        = $('#lightbox');
  var lbStage   = $('#lbStage');
  var lbTitle   = $('#lbTitle');
  var lbBlurb   = $('#lbBlurb');
  var lbTags    = $('#lbTags');
  var lbPrev    = $('#lbPrev');
  var lbNext    = $('#lbNext');
  var lbIndex   = -1;
  var lastFocus = null;

  /* YouTube/Vimeo want autoplay as a query param; respect any params the
     user already put in the URL (start times, privacy flags, etc). */
  function withAutoplay(url) {
    var sep = url.indexOf('?') === -1 ? '?' : '&';
    return url + sep + 'autoplay=1&rel=0&playsinline=1';
  }

  function renderStage(item) {
    /* A self-contained HTML build running live in the panel. Takes precedence
       over video/embed — if there's a working thing to show, show the thing. */
    if (has(item.demo)) {
      lbStage.innerHTML =
        '<iframe src="' + esc(item.demo.trim()) + '" ' +
        'title="' + esc(item.title) + ' (live demo)" ' +
        'allow="clipboard-write; fullscreen" loading="lazy"></iframe>';
      return;
    }

    /* A still artifact — a patent record, a diagram, a screenshot. */
    if (has(item.image)) {
      lbStage.innerHTML =
        '<img class="stage-image" src="' + esc(item.image.trim()) + '" ' +
        'alt="' + esc(item.title) + '">';
      return;
    }

    if (has(item.embed)) {
      lbStage.innerHTML =
        '<iframe src="' + esc(withAutoplay(item.embed.trim())) + '" ' +
        'title="' + esc(item.title) + '" allow="accelerometer; autoplay; ' +
        'clipboard-write; encrypted-media; picture-in-picture; fullscreen" ' +
        'allowfullscreen></iframe>';
      return;
    }

    if (has(item.video)) {
      lbStage.innerHTML =
        '<video controls autoplay playsinline preload="metadata"' +
        (has(item.poster) ? ' poster="' + esc(item.poster) + '"' : '') +
        '><source src="' + esc(item.video.trim()) + '">' +
        'Your browser can\'t play this video. ' +
        '<a href="' + esc(item.video.trim()) + '">Download it instead.</a></video>';
      return;
    }

    lbStage.innerHTML =
      '<div class="stage-empty">' +
        '<strong>Nothing attached yet</strong>' +
        '<span>Add <code>demo:</code>, <code>video:</code> or <code>embed:</code> ' +
        'to this entry in <code>content.js</code>.</span>' +
      '</div>';
  }

  function show(index) {
    var item = work[index];
    if (!item) return;
    lbIndex = index;

    /* A live app or a full-page document needs more room than a 16:9 frame. */
    var isDemo = has(item.demo);
    var isImage = !isDemo && has(item.image);
    $('.lightbox-panel', lb).classList.toggle('is-demo', isDemo || isImage);
    lbStage.classList.toggle('is-demo', isDemo);
    lbStage.classList.toggle('is-image', isImage);

    renderStage(item);
    lbTitle.textContent = item.title || '';
    lbBlurb.textContent = item.blurb || '';

    var chips = (item.tags || []).map(function (t) {
      return '<span class="tag">' + esc(t) + '</span>';
    });
    (item.links || []).filter(function (l) { return l && has(l.href); })
      .forEach(function (l) {
        chips.push('<a class="tag" href="' + esc(l.href) + '" target="_blank" ' +
                   'rel="noopener noreferrer">' + esc(l.label) + ' ↗</a>');
      });
    lbTags.innerHTML = chips.join('');

    var multiple = work.length > 1;
    lbPrev.hidden = !multiple;
    lbNext.hidden = !multiple;
  }

  function openLightbox(index, trigger) {
    lastFocus = trigger || document.activeElement;
    lb.hidden = false;
    document.body.classList.add('no-scroll');
    show(index);
    /* Next frame so the opening transition actually runs. */
    requestAnimationFrame(function () {
      lb.classList.add('is-open');
      $('.lightbox-close', lb).focus();
    });
  }

  function closeLightbox() {
    if (lb.hidden) return;
    lb.classList.remove('is-open');
    document.body.classList.remove('no-scroll');

    var finish = function () {
      lb.hidden = true;
      lbStage.innerHTML = ''; // stops playback and unloads the iframe
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    };
    /* Match the panel transition, but don't hang if it never fires. */
    setTimeout(finish, 350);
  }

  function step(delta) {
    if (!work.length) return;
    show((lbIndex + delta + work.length) % work.length);
  }

  $$('[data-close]', lb).forEach(function (el) {
    el.addEventListener('click', closeLightbox);
  });
  lbPrev.addEventListener('click', function () { step(-1); });
  lbNext.addEventListener('click', function () { step(1); });

  document.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape')     { closeLightbox(); }
    if (e.key === 'ArrowLeft')  { step(-1); }
    if (e.key === 'ArrowRight') { step(1); }

    /* Keep tab focus inside the dialog while it's open. */
    if (e.key === 'Tab') {
      var focusables = $$('button, [href], video, iframe', lb)
        .filter(function (el) { return !el.hidden && el.offsetParent !== null; });
      if (!focusables.length) return;
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ======================================================================
   *  Passphrase gate
   *
   *  A speed bump, not a lock. The page is a static site: the passphrase is
   *  checked in the browser, and every file under assets/ stays reachable by
   *  direct URL whether or not the gate is open. It keeps a casual visitor
   *  out; it will not stop anyone who opens devtools.
   *
   *  Only the SHA-256 of "salt + passphrase" ships, so the passphrase itself
   *  isn't sitting in the source.
   * ==================================================================== */
  (function passphraseGate() {
    var el = $('#gate');
    if (!el) return;

    /* Gate switched off in content.js — make sure nothing stays hidden. */
    if (gate.enabled === false || !has(gate.hash)) {
      document.documentElement.removeAttribute('data-locked');
      el.remove();
      return;
    }

    var form  = $('#gateForm');
    var input = $('#gatePass');
    var error = $('#gateError');

    if (has(gate.note)) $('#gateNote').textContent = gate.note;

    function unlock() {
      try { sessionStorage.setItem('cv-unlocked', '1'); } catch (e) { /* fine */ }
      document.documentElement.removeAttribute('data-locked');
      el.remove();
      window.scrollTo(0, 0);
      /* The scroll-reveal observer should pick everything up now that the
         page has boxes again. Safety net for anything already on screen that
         it missed — bounded to the viewport so the rest still animates in. */
      setTimeout(function () {
        $$('.reveal').forEach(function (r) {
          var box = r.getBoundingClientRect();
          if (box.top < window.innerHeight && box.bottom > 0) r.classList.add('is-in');
        });
      }, 500);
    }

    if (!document.documentElement.hasAttribute('data-locked')) {
      el.remove();
      return;
    }
    input.focus();

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var salt = gate.salt || '';
      if (sha256(salt + input.value) === String(gate.hash).toLowerCase()) {
        unlock();
        return;
      }
      error.textContent = has(gate.errorText)
        ? gate.errorText : 'That passphrase doesn\'t match.';
      error.hidden = false;
      el.classList.remove('is-wrong');
      void el.offsetWidth; /* restart the shake */
      el.classList.add('is-wrong');
      input.select();
    });
  })();

  /* Minimal SHA-256. crypto.subtle would be the obvious choice, but it only
     exists in a secure context — this file is meant to work off disk too. */
  function sha256(message) {
    function rr(n, x) { return (n >>> x) | (n << (32 - x)); }
    var K = [], H = [], i, j, p = 2, isPrime, root;
    for (i = 0; i < 64;) {
      for (isPrime = true, j = 2; j * j <= p; j++) { if (p % j === 0) { isPrime = false; break; } }
      if (isPrime) {
        root = Math.pow(p, 1 / 3);
        K[i] = ((root - (root | 0)) * 4294967296) | 0;
        if (i < 8) { root = Math.pow(p, 1 / 2); H[i] = ((root - (root | 0)) * 4294967296) | 0; }
        i++;
      }
      p++;
    }

    var bytes = [], c;
    for (i = 0; i < message.length; i++) {
      c = message.charCodeAt(i);
      if (c < 128) { bytes.push(c); }
      else if (c < 2048) { bytes.push(192 | (c >> 6), 128 | (c & 63)); }
      else if (c < 55296 || c >= 57344) {
        bytes.push(224 | (c >> 12), 128 | ((c >> 6) & 63), 128 | (c & 63));
      } else {
        i++;
        c = 65536 + (((c & 1023) << 10) | (message.charCodeAt(i) & 1023));
        bytes.push(240 | (c >> 18), 128 | ((c >> 12) & 63),
                   128 | ((c >> 6) & 63), 128 | (c & 63));
      }
    }

    var bitLen = bytes.length * 8;
    bytes.push(0x80);
    while (bytes.length % 64 !== 56) { bytes.push(0); }
    for (i = 7; i >= 0; i--) { bytes.push(Math.floor(bitLen / Math.pow(2, i * 8)) & 255); }

    var w = [], a, b, cc, d, e, f, g, h, t1, t2, s0, s1, ch, maj, blk;
    for (blk = 0; blk < bytes.length; blk += 64) {
      for (i = 0; i < 16; i++) {
        w[i] = (bytes[blk + i * 4] << 24) | (bytes[blk + i * 4 + 1] << 16) |
               (bytes[blk + i * 4 + 2] << 8) | bytes[blk + i * 4 + 3];
      }
      for (i = 16; i < 64; i++) {
        s0 = rr(w[i - 15], 7) ^ rr(w[i - 15], 18) ^ (w[i - 15] >>> 3);
        s1 = rr(w[i - 2], 17) ^ rr(w[i - 2], 19) ^ (w[i - 2] >>> 10);
        w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0;
      }
      a = H[0]; b = H[1]; cc = H[2]; d = H[3]; e = H[4]; f = H[5]; g = H[6]; h = H[7];
      for (i = 0; i < 64; i++) {
        s1 = rr(e, 6) ^ rr(e, 11) ^ rr(e, 25);
        ch = (e & f) ^ (~e & g);
        t1 = (h + s1 + ch + K[i] + w[i]) | 0;
        s0 = rr(a, 2) ^ rr(a, 13) ^ rr(a, 22);
        maj = (a & b) ^ (a & cc) ^ (b & cc);
        t2 = (s0 + maj) | 0;
        h = g; g = f; f = e; e = (d + t1) | 0; d = cc; cc = b; b = a; a = (t1 + t2) | 0;
      }
      H[0] = (H[0] + a) | 0; H[1] = (H[1] + b) | 0; H[2] = (H[2] + cc) | 0; H[3] = (H[3] + d) | 0;
      H[4] = (H[4] + e) | 0; H[5] = (H[5] + f) | 0; H[6] = (H[6] + g) | 0; H[7] = (H[7] + h) | 0;
    }

    var out = '';
    for (i = 0; i < 8; i++) { out += ('00000000' + (H[i] >>> 0).toString(16)).slice(-8); }
    return out;
  }

  /* ======================================================================
   *  Copy email
   * ==================================================================== */
  var toast = $('#toast');
  var toastTimer;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('is-visible'); }, 2200);
  }

  function copyText(text, noun) {
    if (!text) return;
    var label = noun || 'Text';
    var done = function () { showToast(text + ' copied'); };
    var fail = function () { showToast(label.toLowerCase() + ' is ' + text); };

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done, fail);
    } else {
      /* http:// and file:// don't get the async clipboard API. */
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;top:-1000px;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); done(); }
      catch (err) { fail(); }
      document.body.removeChild(ta);
    }
  }


  /* ======================================================================
   *  Scroll: sticky header, progress bar, active nav link
   * ==================================================================== */
  var header   = $('#siteHeader');
  var progress = $('#progressBar');
  var navLinks = $$('#nav a');
  var sections = navLinks
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var y = window.scrollY || document.documentElement.scrollTop;

      header.classList.toggle('is-stuck', y > 24);

      var max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (max > 0 ? Math.min(y / max, 1) * 100 : 0) + '%';

      /* Active link = last section whose top has passed the header line. */
      var line = y + (parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--header-h'), 10) || 68) + 40;
      var activeId = null;
      sections.forEach(function (sec) {
        if (sec.offsetTop <= line) activeId = sec.id;
      });
      navLinks.forEach(function (a) {
        a.classList.toggle('is-active', a.getAttribute('href') === '#' + activeId);
      });

      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ======================================================================
   *  Mobile menu
   * ==================================================================== */
  var menuBtn = $('#menuToggle');
  var nav = $('#nav');
  menuBtn.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      nav.classList.remove('is-open');
      menuBtn.setAttribute('aria-expanded', 'false');
    }
  });

  /* ======================================================================
   *  Scroll reveal — runs last so it picks up everything rendered above
   * ==================================================================== */
  (function reveal() {
    var els = $$('.reveal');
    els.forEach(function (el) {
      if (el.dataset.delay) el.style.setProperty('--d', el.dataset.delay);
    });

    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target); // reveal once, then stop watching
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });

    els.forEach(function (el) { io.observe(el); });
  })();
})();
