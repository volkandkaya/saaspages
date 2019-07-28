export const getCategories = (sites) => {
  const categories = {}
  sites.map(s => {
    categories[s.category] = ''
  })
  return Object.keys(categories)
}
