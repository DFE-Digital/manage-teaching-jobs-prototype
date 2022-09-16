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
  let attrs

  if(org.schools) {
    attrs = [
      'about',
      'supportForEmployees',
      'website',
      'emailAddress',
      'logo',
      'photo'
    ]
  } else {
    attrs = [
      'phase',
      'about',
      'supportForEmployees',
      'website',
      'emailAddress',
      'safeguardingCommitment',
      'logo',
      'photo'
    ]
  }

  let missing = []

  attrs.forEach(item => {
    if(!org[item]) {
      missing.push(item)
    }
  })

  return missing
}


exports.hasMissingInformation = (org) => {
  let hasMissingInformation = false

  if(org.schools) {
    hasMissingInformation = this.getMissingInformation(org).length

    // if the org does not have missing information
    // then check the schools within
    if(!hasMissingInformation) {
      hasMissingInformation = org.schools.find(school => {
        if(this.getMissingInformation(school).length) {
          return true
        }
      })
    }
  } else {
    hasMissingInformation = this.getMissingInformation(org).length
  }

  return hasMissingInformation
}