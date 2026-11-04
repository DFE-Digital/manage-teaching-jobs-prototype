/* eslint-env jest */

const request = require('supertest')
const app = require('../../server')

describe('account sign in', () => {
  it('signs in without an email or password', async () => {
    const response = await request(app)
      .post('/account/sign-in')
      .type('form')
      .send({})

    expect(response.status).toBe(302)
    expect(response.headers.location).toBe('/interruptions/profiles')
  })

  it('signs in as the email address that was submitted', async () => {
    const agent = request.agent(app)
    const response = await agent
      .post('/account/sign-in')
      .type('form')
      .send({
        emailAddress: 'rachael@courtland.sch.uk',
        password: 'tv',
        returnUrl: '/jobs'
      })

    expect(response.status).toBe(302)
    expect(response.headers.location).toBe('/jobs')

    const jobs = await agent.get('/jobs')
    expect(jobs.status).toBe(200)
    expect(jobs.text).toContain('userEmailAddress=rachael@courtland.sch.uk')
    expect(jobs.text).not.toContain('userEmailaddress')
    expect(jobs.text).toContain('http://127.0.0.1:')
  })

  it('ignores an off-site return URL', async () => {
    const response = await request(app)
      .post('/account/sign-in')
      .type('form')
      .send({
        emailAddress: 'rachael@courtland.sch.uk',
        password: 'tv',
        returnUrl: '//evil.example/phish'
      })

    expect(response.status).toBe(302)
    expect(response.headers.location).toBe('/interruptions/profiles')
  })
})

describe('job applications', () => {
  it('shows the job title in the h1 for the signed-in organisation', async () => {
    const agent = request.agent(app)
    await agent
      .post('/account/sign-in')
      .type('form')
      .send({ emailAddress: 'rachael@courtland.sch.uk', password: 'tv' })

    const response = await agent.get('/jobs/686355/applications')
    expect(response.status).toBe(200)
    expect(response.text).toContain('Science lecturer')
  })

  it('redirects when the job does not belong to the signed-in organisation', async () => {
    const agent = request.agent(app)
    await agent
      .post('/account/sign-in')
      .type('form')
      .send({ emailAddress: 'rachael@courtland.sch.uk', password: 'tv' })

    const response = await agent.get('/jobs/000000/applications')
    expect(response.status).toBe(302)
    expect(response.headers.location).toBe('/jobs')
  })
})

describe('profiles interruption', () => {
  it('renders the v2 welcome page with page header actions', async () => {
    const agent = request.agent(app)
    await agent
      .post('/account/sign-in')
      .type('form')
      .send({ emailAddress: 'rachael@courtland.sch.uk', password: 'tv' })

    const response = await agent.get('/interruptions/profiles?v2')
    expect(response.status).toBe(200)
    expect(response.text).toContain('app-profiles-welcome-banner')
    expect(response.text).toContain('We have retired candidate profiles')
    expect(response.text).toContain('From 15 January 2027')
    expect(response.text).toContain('invite candidates to apply for jobs')
    expect(response.text).not.toContain('View your job listings')
    expect(response.text).not.toContain('The candidate profiles feature has been retired')
    expect(response.text).toContain('moj-page-header-actions')
    expect(response.text).toContain('Create a job listing')
    expect(response.text).toContain('Create a job template')
    expect(response.text.indexOf('app-profiles-welcome-banner')).toBeLessThan(
      response.text.indexOf('moj-page-header-actions')
    )
    expect(response.text).not.toContain('template not found')
  })
})

describe('candidate and application routes', () => {
  async function signedInAgent () {
    const agent = request.agent(app)
    await agent
      .post('/account/sign-in')
      .type('form')
      .send({ emailAddress: 'rachael@courtland.sch.uk', password: 'tv' })
    return agent
  }

  it('clears candidate filters without crashing', async () => {
    const agent = await signedInAgent()
    const response = await agent.get('/jobseeker-clear')
    expect(response.status).toBe(302)
    expect(response.headers.location).toBe('/jobseekers')
  })

  it('redirects when a candidate is not on the signed-in account', async () => {
    const agent = await signedInAgent()
    const response = await agent.get('/jobseekers/does-not-exist')
    expect(response.status).toBe(302)
    expect(response.headers.location).toBe('/jobseekers')
  })

  it('shows a candidate who belongs to the signed-in school', async () => {
    const agent = await signedInAgent()
    const response = await agent.get('/jobseekers/658653')
    expect(response.status).toBe(200)
    expect(response.text).toContain('Adriana')
  })

  it('does not crash when updating a missing application', async () => {
    const agent = await signedInAgent()
    const response = await agent
      .post('/jobs/application/tag/does-not-exist')
      .type('form')
      .send({ tag: 'Shortlisted' })

    expect(response.status).toBe(302)
    expect(response.headers.location).toBe('/jobs')
  })
})
