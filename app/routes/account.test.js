/* eslint-env jest */

const request = require('supertest')
const app = require('../../server')

describe('account sign in', () => {
  it('rejects the old email field instead of signing in as the first user', async () => {
    const response = await request(app)
      .post('/account/sign-in')
      .type('form')
      .send({ email: 'rachael@courtland.sch.uk', password: 'tv' })

    expect(response.status).toBe(401)
    expect(response.text).toContain('There is a problem')
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
