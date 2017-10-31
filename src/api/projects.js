// Mocking client-server processing
const _projects = [
  {'id': 1, 'title': 'Project 1', 'price': 500.01, 'inventory': 2},
  {'id': 2, 'title': 'Project 2', 'price': 500.01, 'inventory': 2},
  {'id': 3, 'title': 'Project 3', 'price': 500.01, 'inventory': 2}
]

export default {
  getProjects (cb) {
    setTimeout(() => cb(_projects), 100)
  },

  buyProducts (projects, cb, errorCb) {
    setTimeout(() => {
      // simulate random checkout failure.
      (Math.random() > 0.5 || navigator.userAgent.indexOf('PhantomJS') > -1)
        ? cb()
        : errorCb()
    }, 100)
  }
}
