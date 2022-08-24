const faker =  require('@faker-js/faker').faker
faker.setLocale('en_GB');

module.exports = ({organisation, role}) => {
  const titles = [
    'Maths teacher',
    'Science teacher',
    'English teacher',
    'Class teacher',
    'Teacher of religious education',
    'Teacher of computing'
  ]

  if(organisation) {

  }



  return faker.helpers.arrayElement(titles)
}
