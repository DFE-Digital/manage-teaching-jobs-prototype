#!/usr/bin/env node
/**
 * Capture #3080 FE qualifications documentation screenshots (hiring staff, 1.2).
 *   Terminal 1: npm run dev
 *   Terminal 2: npm run capture:fe-qualifications-about-docs
 *
 * Optional env:
 *   PROTOTYPE_BASE_URL=http://127.0.0.1:3007  — must match “Listening on port …” from npm run dev
 *   PROTOTYPE_VERSION=1-2
 *
 * With npm start (no BrowserSync): use PROTOTYPE_BASE_URL=http://127.0.0.1:3000
 */

const fs = require('fs')
const path = require('path')
const { chromium } = require('playwright')
const config = require('../lib/load-config.js')

const DEV_PORTS_TO_TRY = [3006, 3007, 3005, 3008, Number(config.port) || 3000, 3000]
const VERSION = process.env.PROTOTYPE_VERSION || '1-2'
const PREFIX = `/${VERSION}`
const COLLEGE = 'userEmailAddress=bob@hopecollege.sch.uk'

const OUT_DIR = path.join(__dirname, '../app/assets/images/documentation/fe-qualifications-about')

const CAPTURES = [
  {
    file: 'about-v1.png',
    path: `${PREFIX}/jobs/new/about?v1&${COLLEGE}`,
    selector: '#main-content',
    fullPage: true
  },
  {
    file: 'about-v2.png',
    path: `${PREFIX}/jobs/new/about?v2&${COLLEGE}`,
    selector: '#main-content',
    fullPage: true
  },
  {
    file: 'about-v3.png',
    path: `${PREFIX}/jobs/new/about?v3&${COLLEGE}`,
    selector: '#main-content',
    fullPage: true
  },
  {
    file: 'listing-v2.png',
    path: `${PREFIX}/jobs/new/check_preview?v2`,
    selector: '#documentation-listing',
    scrollTo: '#documentation-listing'
  }
]

async function probeUrl (base) {
  const res = await fetch(`${base}/`, {
    signal: AbortSignal.timeout(4000),
    redirect: 'follow'
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return base
}

async function resolveBaseUrl () {
  if (process.env.PROTOTYPE_BASE_URL) {
    return probeUrl(process.env.PROTOTYPE_BASE_URL.replace(/\/$/, ''))
  }
  const seen = new Set()
  for (const port of DEV_PORTS_TO_TRY) {
    if (!port || seen.has(port)) continue
    seen.add(port)
    const candidate = `http://127.0.0.1:${port}`
    try {
      await probeUrl(candidate)
      if (port !== (Number(config.port) || 3000)) {
        console.log(`Using ${candidate} (set PROTOTYPE_BASE_URL to pin this)\n`)
      }
      return candidate
    } catch (_) {}
  }
  console.error('\nPrototype not reachable on localhost.\n')
  console.error('  Terminal 1:  npm run dev')
  console.error('  Note the line:  Listening on port NNNN   url: http://localhost:NNNN')
  console.error('  Terminal 2:  PROTOTYPE_BASE_URL=http://127.0.0.1:NNNN npm run capture:fe-qualifications-about-docs')
  console.error('  Or npm start:  PROTOTYPE_BASE_URL=http://127.0.0.1:3000 npm run capture:fe-qualifications-about-docs\n')
  process.exit(1)
}

async function main () {
  const BASE = await resolveBaseUrl()
  fs.mkdirSync(OUT_DIR, { recursive: true })

  const browser = await chromium.launch()
  let failed = 0

  for (const capture of CAPTURES) {
    const url = `${BASE}${capture.path}`
    process.stdout.write(`Capturing ${capture.file} … `)
    const context = await browser.newContext({
      viewport: { width: 1280, height: 900 },
      deviceScaleFactor: 2,
      ignoreHTTPSErrors: true
    })
    const page = await context.newPage()
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 })
      await page.waitForTimeout(800)
      if (capture.scrollTo) {
        await page.locator(capture.scrollTo).scrollIntoViewIfNeeded()
        await page.waitForTimeout(300)
      }
      const outPath = path.join(OUT_DIR, capture.file)
      const el = await page.$(capture.selector)
      if (el && !capture.fullPage) {
        await el.screenshot({ path: outPath })
      } else if (el && capture.fullPage) {
        await el.screenshot({ path: outPath })
      } else {
        await page.screenshot({ path: outPath, fullPage: Boolean(capture.fullPage) })
      }
      console.log('ok')
    } catch (err) {
      failed += 1
      console.log('failed')
      console.error(`  ${err.message}`)
    } finally {
      await context.close()
    }
  }

  await browser.close()
  require('./ensure-documentation-images')

  if (failed) {
    process.exit(1)
  }
  console.log(`\nSaved to ${OUT_DIR}\n`)
}

main()