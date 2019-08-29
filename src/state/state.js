let accessToken = ''
let citySelParams = ''

try {
  if (localStorage.accessToken) {
    accessToken = localStorage.accessToken
  }
  if (localStorage.citySelParams) {
    citySelParams = JSON.parse(localStorage.citySelParams)
  }
} catch (e) {}

export default {
  accessToken: accessToken,
  citySelParams: citySelParams,
}
