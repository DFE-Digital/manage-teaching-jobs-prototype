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
