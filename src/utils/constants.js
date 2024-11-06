let apiRoot = ''
if (process.env.BUILD_MODE === 'dev') {
  apiRoot = 'http://localhost:8017'
}

if (process.env.BUILD_MODE === 'production') {
  apiRoot = 'https://trello-api-fiiz.onrender.com'
}

export const API_ROOT = apiRoot

export const DEFAULT_PAGE_SIZE = 12
