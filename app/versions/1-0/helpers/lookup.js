exports.findById = (items, id) => {
  if (!Array.isArray(items)) return null
  return items.find(item => item.id == id) || null
}
