const faker =  require('@faker-js/faker').faker
faker.setLocale('en_GB');

module.exports = ({organisation}) => {
  let phase;

  if(organisation.type == 'School') {
    phase = organisation.phase
  } else {
    phase = faker.helpers.arrayElement(organisation.schools).phase
  }

  switch(phase) {
    case 'Nursery':
      return ['Early years']
    case 'Primary school':
      return ['Early years', 'Key stage 1', 'Key stage 2']
    case 'Middle school':
      return ['Key stage 1', 'Key stage 2', 'Key stage 3', 'Key stage 4']
    case 'Secondary school':
      return ['Key stage 3', 'Key stage 4']
    case 'Sixth form or college':
      return ['Key stage 5']
    case 'Through school':
      return ['Early years', 'Key stage 1', 'Key stage 2', 'Key stage 3', 'Key stage 4', 'Key stage 5']
  }
}
