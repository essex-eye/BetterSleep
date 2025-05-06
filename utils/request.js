// 网络请求工具函数
const apiConfig = require('../config/api');

/**
 * 封装微信请求
 * @param {Object} options 请求选项
 * @param {string} options.url 请求地址，可以是相对路径(会自动添加baseUrl)或完整URL
 * @param {string} options.method 请求方法 GET/POST/PUT/DELETE等
 * @param {Object} options.data 请求数据
 * @param {Object} options.header 请求头
 * @param {boolean} options.loading 是否显示加载提示
 * @param {string} options.loadingText 加载提示文字
 * @returns {Promise} 返回Promise对象
 */
const request = (options = {}) => {
  // 默认显示loading
  if (options.loading !== false) {
    wx.showLoading({
      title: options.loadingText || '加载中...',
      mask: true
    });
  }

  // 处理URL
  let url = options.url;
  if (url && !url.startsWith('http')) {
    url = apiConfig.config.baseUrl + url;
  }

  // 处理Header
  const header = {
    'Content-Type': 'application/json',
    ...options.header
  };

  // 如果需要授权，添加token
  if (options.auth !== false) {
    const token = wx.getStorageSync('token');
    if (token) {
      header.Authorization = 'Bearer ' + token;
    }
  }

  return new Promise((resolve, reject) => {
    // 添加调试信息
    console.log('请求URL:', url);
    console.log('请求方法:', options.method || 'GET');
    console.log('请求数据:', options.data || {});
    
    wx.request({
      url,
      method: options.method || 'GET',
      data: options.data || {},
      header,
      success: (res) => {
        // 添加调试信息
        console.log('响应状态码:', res.statusCode);
        console.log('响应头:', res.header);
        console.log('响应数据:', res.data);
        
        // 处理成功响应
        if (res.statusCode >= 200 && res.statusCode < 300) {
          // 检查响应数据有效性
          if (res.data === null || res.data === undefined) {
            wx.showToast({
              title: '服务器返回空数据',
              icon: 'none',
              duration: 2000
            });
            reject({ message: '服务器返回空数据' });
            return;
          }
          resolve(res.data);
        } else {
          // 处理错误状态码
          handleError(res);
          reject(res);
        }
      },
      fail: (err) => {
        // 添加调试信息
        console.error('请求失败:', err);
        
        // 处理网络错误
        wx.showToast({
          title: '网络请求失败',
          icon: 'none',
          duration: 2000
        });
        reject(err);
      },
      complete: () => {
        if (options.loading !== false) {
          wx.hideLoading();
        }
      }
    });
  });
};

/**
 * 处理请求错误
 * @param {Object} res 响应对象
 */
const handleError = (res) => {
  let message = '';
  
  switch (res.statusCode) {
    case 401:
      message = '未授权，请重新登录';
      // 可以在这里处理登录失效的逻辑
      break;
    case 403:
      message = '拒绝访问';
      break;
    case 404:
      message = '请求的资源不存在';
      break;
    case 500:
      message = '服务器错误';
      break;
    default:
      message = res.data && res.data.message ? res.data.message : `请求失败(${res.statusCode})`;
  }

  wx.showToast({
    title: message,
    icon: 'none',
    duration: 2000
  });
};

// 请求方法封装
const get = (url, data, options = {}) => {
  return request({
    url,
    method: 'GET',
    data,
    ...options
  });
};

const post = (url, data, options = {}) => {
  return request({
    url,
    method: 'POST',
    data,
    ...options
  });
};

const put = (url, data, options = {}) => {
  return request({
    url,
    method: 'PUT',
    data,
    ...options
  });
};

const del = (url, data, options = {}) => {
  return request({
    url,
    method: 'DELETE',
    data,
    ...options
  });
};

module.exports = {
  request,
  get,
  post,
  put,
  delete: del
}; 