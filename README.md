# Reeds Solutions LLC

Official website repository for **Reeds Solutions LLC**, a California small business focused on federal government contracting.

## Production Website

- Primary domain: `https://reedssolutionsllc.org`
- Repository: `domogotu/reedsolutionsllc-website`
- Production branch: `main`
- Site type: static HTML/CSS/JavaScript website
- Custom domain configuration: `CNAME` → `reedssolutionsllc.org`

This repository is the source for the public-facing Reeds Solutions LLC business website. It is separate from the **PrimeContractorOS** SaaS application and its repositories.

## Business Purpose

Reeds Solutions LLC pursues and manages federal contracting opportunities across two primary service lanes:

- **Information Technology services**
- **Facilities and support services**

The company may perform as a prime contractor while coordinating qualified subcontractors, vendors, and service providers as appropriate for individual contract requirements.

## Website Content

The repository contains public pages covering areas such as:

- Home
- About
- Capabilities
- Capability Statement
- Government Contracting
- Services / Features
- Careers
- Contact
- Accessibility
- Supporting public information and legal/site pages

## Website Rules

When maintaining this website:

1. Use the company name **Reeds Solutions LLC** consistently.
2. Preserve the approved professional visual identity and existing working design unless a change is specifically approved.
3. Keep `reedssolutionsllc.org` as the canonical public business domain unless an intentional domain migration is approved.
4. Do not mix PrimeContractorOS customer/platform application code into this website repository.
5. Do not publish secrets, API keys, credentials, private customer information, or internal business records.
6. Keep all navigation links and public pages functional; no broken, blank, placeholder, or dead-end pages should remain in production.
7. Treat GitHub `main` as the authoritative website source and avoid maintaining conflicting outdated copies of the public site.
8. Changes should preserve existing working content unless the replacement is verified to be current and correct.

## Repository Structure

This is primarily a static website. Important files include:

- `index.html` — public home page
- `about.html` — company information
- `capabilities.html` — business capabilities
- `capability-statement.html` — capability statement content
- `contracting.html` — government contracting information
- `contact.html` — contact page
- `careers.html` — careers information
- `404.html` — not-found handling
- `CNAME` — production custom-domain declaration
- `.nojekyll` — static hosting behavior

Additional HTML pages and site assets in this repository are part of the public website and should be reviewed before removal or replacement.

## Separation From PrimeContractorOS

**Reeds Solutions LLC website** and **PrimeContractorOS** are separate products:

- `reedsolutionsllc-website` = public Reeds Solutions LLC company website.
- `-primecontractoros-v2` = current PrimeContractorOS SaaS production/development repository.
- `primecontractoros` = older PrimeContractorOS historical/reference repository.

A change to PrimeContractorOS should not overwrite or redefine the Reeds Solutions LLC website, and a website change should not alter PrimeContractorOS application behavior unless an integration is intentionally approved.

## Maintenance Checkpoint

Before deploying website changes, verify:

- the home page loads correctly;
- navigation works on desktop and mobile;
- the custom domain still points to the intended site;
- HTTPS works;
- branding and company information are correct;
- contact links work;
- no old or conflicting site version is being served;
- all changed pages were checked before the production update.

## License

Private/proprietary business content — **Reeds Solutions LLC. All rights reserved.**
