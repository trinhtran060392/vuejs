export const getProjects = state => {
  return state.added.map(({ id, quantity }) => {
    const project = state.projects.all.find(p => p.id === id)
    return {
      title: project.title,
      price: project.price,
      quantity
    }
  })
}
