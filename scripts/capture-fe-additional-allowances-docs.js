#!/usr/bin/env node
/**
 * Capture #3436 additional allowances documentation screenshots (hiring staff).
 *   Terminal 1: PORT=3100 npm start
 *   Terminal 2: npm run capture:fe-additional-allowances-docs
 */

const fs = require('fs')
const path = require('path')
const { chromium } = require('playwright')

const BASE = process.env.PROTOTYPE_BASE_URL || 'https://127.0.0.1:3100'
const OUT_DIR = path.join(__dirname, '../app/assets/images/documentation/fe-additional-allowances-3436')

const CAPTURES = [
  {
    file: 'college-salary-no-allowances.png',
    path: '/jobs/new/salary?userEmailAddress=bob@hopecollege.sch.uk',
    selector: '#main-content'
  },
  {
    file: 'school-salary-with-allowances.png',
    path: '/jobs/new/salary?userEmailAddress=rachael@courtland.sch.uk',
    selector: '#main-content'
  },
  {
    file: 'college-check-no-allowances.png',
    path: '/jobs/new/check?userEmailAddress=bob@hopecollege.sch.uk',
    selector: '#main-content'
  }
]

async function assertServerRunning () {
  const probe = `${BASE}/`
  try {
    const res = await fetch(probe, {
      signal: AbortSignal.timeout(8000),
      redirect: 'follow'
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
  } catch (err) {
    console.error(`\nPrototype not reachable at ${BASE} (${err.message}).\n`)
    console.error('  Terminal 1:  PORT=3100 npm start')
    console.error('  Terminal 2:  npm run capture:fe-additional-allowances-docs\n')
    process.exit(1)
  }
}

async function main () {
  await assertServerRunning()
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
      await page.goto(url, { waitUntil: 'load', timeout: 60000 })
      await page.waitForTimeout(600)
      const outPath = path.join(OUT_DIR, capture.file)
      const el = await page.$(capture.selector)
      if (el) {
        await el.screenshot({ path: outPath })
      } else {
        await page.screenshot({ path: outPath, fullPage: true })
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
