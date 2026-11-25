/**
 * Hiring staff “Your account” hub — design spec for /documentation/your-account
 * Prototype page: GET /home (interruptions/profiles.njk, homePage: true)
 */

const EXAMPLE_USER_QUERY = '?userEmailAddress=rachael@courtland.sch.uk'

function withUser (path) {
  return path + EXAMPLE_USER_QUERY
}

module.exports = {
  guideTitle: 'Your account hub (hiring staff)',
  guideDescription:
    'Design specification for the signed-in hiring staff account landing page: MOJ page header with actions, notification banner, and featured task links with stroke icon tiles.',
  imageDir: 'your-account',
  prototypePath: withUser('/home'),
  prototypePathRaw: '/home',
  exampleUserQuery: EXAMPLE_USER_QUERY,
  implementation: {
    view: 'views/interruptions/profiles.njk',
    macros: 'views/includes/hiring-account-hub-macros.njk',
    styles: 'app/assets/sass/patterns/_account-hub.scss'
  },
  pageHeader: {
    component: 'mojPageHeaderActions (MOJ Design System)',
    caption: 'Organisation name from session (e.g. Courtland Primary School)',
    heading: {
      element: 'h1',
      text: 'Your account',
      classes: 'govuk-heading-l'
    },
    actions: [
      {
        text: 'Create a job listing',
        href: '/jobs/new/start',
        classes: 'govuk-button'
      },
      {
        text: 'Create a job template',
        href: '/jobs/templates',
        classes: 'govuk-button govuk-button--secondary'
      }
    ],
    mainWrapperClasses: 'govuk-main-wrapper--auto-spacing app-account-main-wrapper'
  },
  welcomeBanner: {
    component: 'govukNotificationBanner',
    classes: 'app-profiles-welcome-banner govuk-!-margin-bottom-6',
    summary: 'Candidate profiles retirement notice shown above the page header on the account landing page.'
  },
  featuredSection: {
    wrapperClasses: 'app-account-hub',
    sectionClasses: 'app-account-featured',
    listClasses: 'app-account-featured-list',
    ariaLabel: 'Account tasks'
  },
  iconTile: {
    mobile: { size: '56px', glyphSize: '32px' },
    tabletUp: { size: '60px', glyphSize: '36px' },
    gapMobile: '15px',
    gapTablet: '20px',
    rowPaddingMobile: '15px 0',
    rowPaddingTablet: '20px 0',
    format: 'inline SVG (stroke icons, stroke-width 1.5, currentColor)',
    svgIncludes: 'views/includes/account-hub-icons/*.njk'
  },
  linkTitle: {
    color: '#1a65a6',
    hoverColor: '#0f385c',
    fontSize: '21px',
    underlineThickness: 'max(3px, 0.1875rem)'
  },
  description: {
    color: '#0b0c0c',
    fontSize: '19px'
  },
  items: [
    {
      key: 'jobs',
      modifierClass: 'app-account-featured__icon--jobs',
      svgFile: 'jobs.svg',
      title: 'Manage jobs',
      description:
        'View and manage your job listings, including drafts, scheduled and closed jobs.',
      href: '/jobs'
    },
    {
      key: 'messages',
      modifierClass: 'app-account-featured__icon--messages',
      svgFile: 'messages.svg',
      title: 'Messages',
      description:
        'Read and reply to messages from candidates about your job listings.',
      href: '/messages',
      hiddenWhenOrganisation: 'Hope college2'
    },
    {
      key: 'statistics',
      modifierClass: 'app-account-featured__icon--statistics',
      svgFile: 'statistics.svg',
      title: 'Statistics',
      description:
        'See an overview of your job listings and equal opportunities data.',
      href: '/statistics'
    },
    {
      key: 'notifications',
      modifierClass: 'app-account-featured__icon--notifications',
      svgFile: 'notifications.svg',
      title: 'Notifications',
      description: 'Read updates about your job listings and hiring activity.',
      href: '/notifications',
      hiddenWhenOrganisation: 'Hope college2'
    },
    {
      key: 'profile',
      modifierClass: 'app-account-featured__icon--profile',
      svgFile: 'profile.svg',
      title: 'Profile',
      description: 'Manage the profile shown on your job listings.',
      href: '/organisation',
      requiresSignedIn: true
    }
  ],
  iconColors: {
    jobs: { background: '#f4dce5', foreground: '#942514' },
    messages: { background: '#e5f5fa', foreground: '#0b556c' },
    statistics: { background: '#cadbee', foreground: '#0b556c' },
    notifications: { background: '#cce2d8', foreground: '#00401a' },
    profile: { background: '#f3f2f1', foreground: '#0b0c0c' }
  }
}