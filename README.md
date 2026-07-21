> **💡 TIP:** Press `Ctrl + Shift + V` (Windows) or `Cmd + Shift + V` (Mac) to preview this documentation!

<div align="center">

<img src="assets/00-universal/00-brand-icon-lotus-1563x1563.png" alt="Dora Health & Wellbeing lotus" width="120">

# Dora Health & Wellbeing — Website

**Perth's In-Home Care Specialists · Compassionate · Dignified · Personalised**

[Live placeholder site](https://www.dorahealth.com.au) · [Instagram](https://www.instagram.com/dora_health/) · [Facebook](https://www.facebook.com/people/Dora-Health-Wellbeing/61577910100130/)

![Static site](https://img.shields.io/badge/site-static%20HTML-informational)
![Tailwind CSS](https://img.shields.io/badge/styles-Tailwind%20CDN%20%2B%20dora.css-38bdf8)
![No build step](https://img.shields.io/badge/build-none%20required-success)

</div>

---

## Table of Contents

- [About](#about)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Asset Naming Convention](#asset-naming-convention)
- [Pages](#pages)
- [Design System](#design-system)
- [Motion System](#motion-system)
- [Legal & Credentials](#legal--credentials)
- [Roadmap / Outstanding](#roadmap--outstanding)

## About

Upgraded website for **Dora Health and Wellbeing Pty Ltd**, a Perth (WA) in-home care and
disability support provider specialising in spinal cord injury care. This repo replaces the
GoDaddy placeholder currently deployed at dorahealth.com.au.

Static HTML + Tailwind (CDN) + a small custom CSS/JS layer — no build step, deployable to any
static host.

## Quick Start

```bash
# from the project root — any static server works
python3 -m http.server 8742
# then open http://localhost:8742/index.html
```

## Project Structure

```
.
├── index.html               # Home
├── team.html                # Our Team (founder story + team grid)
├── services.html            # Services (6 service sections)
├── testimonial.html         # Kind words
├── blog.html                # News index (12 articles)
├── news-*.html              # 12 SEO articles (dateless)
├── contact.html             # Contact + map
├── brand.html               # Hidden brand kit (footer lotus glyph)
├── terms.html / privacy.html
├── css/
│   ├── dora.css             # Brand styles + motion companion CSS
│   └── style.css            # Legacy template styles
├── js/
│   └── dora-motion.js       # Page/scroll animation system (see below)
└── assets/                  # All imagery, organised by page section
    ├── 00-universal/        # Brand: logos, icons, pattern, line art, videos, merch
    ├── 01-navbar/
    ├── 02-hero/             # Colour hero illustrations
    ├── 04-passion/
    ├── 05-services/
    ├── 06-team/
    ├── 07-about/
    ├── 08-community/
    ├── 09-testimonials/
    ├── placeholders/        # Blog stubs + missing-asset SVGs (X + dimensions)
    └── zz-archive/          # Unused/reference imagery (incl. old-site screenshots)
```

## Asset Naming Convention

```
[SectionNumber]-[Section/Use]-[Type]-[Content]-[WidthxHeight].[ext]

examples:
00-lineart-wheelchair-couple-1024x1536.png       # universal single-line vector art
02-hero-illustration-colour-nurse-1024x1536.png
05-services-photo-woman-powerchair-2048x2048.png
06-team-photo-andrew-suit-1165x1323.png
```

Types used: `logo`, `icon`, `favicon`, `pattern`, `pagebreak`, `lineart` (single-line vectors),
`illustration` (colour/filled art), `photo`, `video`, `brand-photo` (merch).
Duplicates are removed at import time (checksum-matched, highest resolution kept).

## Pages

Every page shares: index-style split hero (text slides from left, image from right), frosted
shrinking navbar (logo = home link), scroll-to-top dot, fade page transitions, and the footer
with legals, brand-kit glyph and TDC credit.

## Design System

| Token     | Value            |
|-----------|------------------|
| `gold`    | `#aa9144`        |
| `gold-dk` | `#8e7424`        |
| `warm`    | `#f4f1ec`        |
| `beige`   | `#eddba5`        |
| `brand`   | `#1e1c18`        |
| Serif     | Playfair Display |
| Sans      | Inter            |

Brand casing: always **Dora** / *Dora Health & Wellbeing* — never all-caps in copy.
Full palette, logo downloads and type specimens: [brand.html](brand.html).

## Motion System

[`js/dora-motion.js`](js/dora-motion.js) + companion rules in [`css/dora.css`](css/dora.css):

- Page-load fade-in and fade-to-white page exits
- `dm-hero-left` / `dm-hero-right` hero entrances
- Scroll reveals (`dm-reveal`), parallax drift clusters (`data-drift`, `data-speed`)
- Traced single-line SVG overlays over photos (per-section colour/weight voices)
- Scroll-strengthening section gradients (`dm-gradient-top`, `dm-grad-*`)
- Draw-on-load hero line art (`dm-hero-draw`)
- Honours `prefers-reduced-motion`

## Legal & Credentials

- **Entity:** Dora Health and Wellbeing Pty Ltd
- **ABN:** 71 684 687 901 (GST registered) — [ABN Lookup](https://abr.business.gov.au/ABN/View?abn=71684687901)
- **NDIS:** no registration number verifiable — footer wording is
  "Supporting NDIS participants (self-managed & plan-managed)". Update if/when registered.

## Roadmap / Outstanding

- [ ] Real photos: Charles, Timothy, "two nurses making a bed" (Clinical Support tile)
- [ ] TDC footer link URL · LinkedIn URL
- [ ] Contact map: broaden + restyle to service radius (Joondalup→Busselton, coast→Wheatbelt)
- [ ] Point dorahealth.com.au at this site when ready

---

<sub>Site by TDC · README structure inspired by [amazing-github-template](https://github.com/dec0dOS/amazing-github-template)</sub>
