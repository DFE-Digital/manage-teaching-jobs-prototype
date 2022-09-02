const faker =  require('@faker-js/faker').faker
faker.setLocale('en_GB');

module.exports = ({phase}) => {
  let keyStages;

  switch(phase) {
    case 'Nursery school':
      keyStages = ['Early years']
      break
    case 'Primary school':
      keyStages = ['Early years', 'Key stage 1', 'Key stage 2']
      break
    case 'Middle school':
      keyStages = ['Key stage 1', 'Key stage 2', 'Key stage 3', 'Key stage 4']
      break
    case 'Secondary school':
      keyStages = ['Key stage 3', 'Key stage 4']
      break
    case 'Sixth form or college':
      keyStages = ['Key stage 5']
      break
    case 'Through school':
      keyStages = ['Early years', 'Key stage 1', 'Key stage 2', 'Key stage 3', 'Key stage 4', 'Key stage 5']
      break
  }

  return keyStages

}
