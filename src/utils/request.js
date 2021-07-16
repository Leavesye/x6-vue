import Vue from 'vue'
import axios from 'axios'

const BASE_URL = process.env.VUE_APP_BASEURL
// create an axios instance
const service = axios.create({
  baseURL: BASE_URL,
  timeout: 60 * 1000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    config.headers['Content-Type'] = 'application/json'
    return config
  },
  error => {
    // do something with request error
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    return response
  },
  error => {
    return Promise.reject(error)
  }
)
Vue.prototype.$request = service
export default service
