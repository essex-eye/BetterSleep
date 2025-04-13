// API接口配置
const BASE_URL = 'https://your-api-domain.com'

const request = (url, method = 'GET', data = {}) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${BASE_URL}${url}`,
      method,
      data,
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        resolve(res.data)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

// 登录接口
const login = (data) => {
  return request('/api/login', 'POST', data)
}

module.exports = {
  login
} 