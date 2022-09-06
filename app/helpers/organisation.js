exports.getLocations = (org) => {
  const locations = [{
    name: org.name,
    address: org.address,
    schoolType: org.schoolType,
    trustType: org.trustType
  }]

  if(org.schools) {
    locations.concat(org.schools)
  }

  return locations
}

exports.getMissingInformation = (org) => {
  let attrs = [
    'phase',
    'about',
    'supportForEmployees',
    'logo',
    'photo'
  ]

  let missing = []

  attrs.forEach(item => {
    if(!org[item]) {
      missing.push(item)
    }
  })

  return missing
}