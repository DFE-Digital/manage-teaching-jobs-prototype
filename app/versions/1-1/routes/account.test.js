/* eslint-env jest */

const request = require('supertest')
const app = require('../../../../server')

describe('account sign in', () => {
  it('signs in without an email or password', async () => {
    const response = await request(app)
      .post('/account/sign-in')
      .type('form')
      .send({})

    expect(response.status).toBe(302)
    expect(response.headers.location).toBe('/1-0/home')
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
    expect(response.headers.location).toBe('/1-0/home')
  })

  it('redirects to the v2 welcome landing after sign-in', async () => {
    const agent = request.agent(app)
    const signIn = await agent
      .post('/account/sign-in')
      .type('form')
      .send({ emailAddress: 'rachael@courtland.sch.uk', password: 'tv' })

    expect(signIn.headers.location).toBe('/1-0/home')

    const landing = await agent.get(signIn.headers.location)
    expect(landing.status).toBe(200)
    expect(landing.text).toContain('app-profiles-welcome-banner')
    expect(landing.text).toContain('Create a job listing')
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

  it('sends sign-in with returnUrl /interruptions/profiles to home', async () => {
    const response = await request(app)
      .post('/account/sign-in')
      .type('form')
      .send({
        emailAddress: 'rachael@courtland.sch.uk',
        password: 'tv',
        returnUrl: '/interruptions/profiles'
      })

    expect(response.status).toBe(302)
    expect(response.headers.location).toBe('/1-0/home')
  })
})

describe('organisation profile', () => {
  it('updates organisation logo without the check page', async () => {
    const agent = request.agent(app)
    await agent
      .post('/account/sign-in')
      .type('form')
      .send({ emailAddress: 'rachael@courtland.sch.uk', password: 'tv' })

    const orgId = 'ea4959ee-de5a-4f6b-a657-40a5ec15b794'
    const response = await agent
      .post(`/organisation/${orgId}/logo/edit`)
      .type('form')
      .send({})

    expect(response.status).toBe(302)
    expect(response.headers.location).toBe('/organisation')

    const profile = await agent.get('/organisation')
    expect(profile.text).toContain('Organisation logo updated')
    expect(profile.text).toContain('Organisation logo')
    expect(profile.text).toContain('Organisation photo')
  })

  it('renders school profile preview with summary and job alert', async () => {
    const agent = request.agent(app)
    await agent
      .post('/account/sign-in')
      .type('form')
      .send({ emailAddress: 'rachael@courtland.sch.uk', password: 'tv' })

    const orgId = 'ea4959ee-de5a-4f6b-a657-40a5ec15b794'
    const response = await agent.get(`/organisation/${orgId}/preview`)
    expect(response.status).toBe(200)
    expect(response.text).toContain('Edit preview')
    expect(response.text).toContain('School name')
    expect(response.text).toContain('Set up a job alert')
    expect(response.text).toContain('Commitment to safeguarding')
  })

  it('shows incomplete school profile when ?incomplete is set', async () => {
    const agent = request.agent(app)
    await agent
      .post('/account/sign-in')
      .type('form')
      .send({ emailAddress: 'rachael@courtland.sch.uk', password: 'tv' })

    const response = await agent.get('/organisation?incomplete')
    expect(response.status).toBe(200)
    expect(response.text).toContain('Complete your school profile')
    expect(response.text).toContain('Enter an email address')
    expect(response.text).toContain('Enter a school description')
    expect(response.text).toContain('Add an organisation logo')
    expect(response.text).toContain('http://piercing-cymbal.co')
  })
})

describe('profiles interruption', () => {
  it('redirects /interruptions/profiles to home', async () => {
    const agent = request.agent(app)
    await agent
      .post('/account/sign-in')
      .type('form')
      .send({ emailAddress: 'rachael@courtland.sch.uk', password: 'tv' })

    const response = await agent.get('/interruptions/profiles')
    expect(response.status).toBe(302)
    expect(response.headers.location).toBe('/1-0/home')

    const landing = await agent.get('/home')
    expect(landing.text).toContain('We have retired candidate profiles')
    expect(landing.text).not.toContain('The candidate profiles feature has been retired')
  })

  it('redirects /interruptions/profiles?v2 to home', async () => {
    const agent = request.agent(app)
    await agent
      .post('/account/sign-in')
      .type('form')
      .send({ emailAddress: 'rachael@courtland.sch.uk', password: 'tv' })

    const response = await agent.get('/interruptions/profiles?v2')
    expect(response.status).toBe(302)
    expect(response.headers.location).toBe('/1-0/home')
  })

  it('renders the welcome home page with page header actions', async () => {
    const agent = request.agent(app)
    await agent
      .post('/account/sign-in')
      .type('form')
      .send({ emailAddress: 'rachael@courtland.sch.uk', password: 'tv' })

    const response = await agent.get('/home')
    expect(response.status).toBe(200)
    expect(response.text).toContain('app-profiles-welcome-banner')
    expect(response.text).toContain('We have retired candidate profiles')
    expect(response.text).toContain('From [DD Month YYYY]')
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
