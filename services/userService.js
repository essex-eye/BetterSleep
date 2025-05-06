// 用户相关服务
const storage = require('../utils/storage');
const request = require('../utils/request');

/**
 * 获取用户登录状态
 * @returns {boolean} 是否已登录
 */
const isLoggedIn = () => {
  // 判断是否有openid
  return !!storage.get(storage.keys.OPENID);
};

/**
 * 获取用户OpenID
 * @returns {string|null} 用户OpenID
 */
const getOpenid = () => {
  return storage.get(storage.keys.OPENID);
};

/**
 * 保存OpenID
 * @param {string} openid 用户OpenID
 */
const saveOpenid = (openid) => {
  if (openid) {
    storage.set(storage.keys.OPENID, openid);
  }
};

/**
 * 获取用户信息
 * @returns {Object|null} 用户信息
 */
const getUserInfo = () => {
  return storage.get(storage.keys.USER_INFO);
};

/**
 * 保存用户信息
 * @param {Object} userInfo 用户信息
 */
const saveUserInfo = (userInfo) => {
  if (userInfo) {
    storage.set(storage.keys.USER_INFO, userInfo);
  }
};

/**
 * 登录系统
 * @returns {Promise} 返回Promise对象
 */
const login = () => {
  return new Promise((resolve, reject) => {
    // 调用微信登录
    wx.login({
      success: (res) => {
        if (res.code) {
          // 获取用户openid
          getOpenidByCode(res.code)
            .then(openid => {
              saveOpenid(openid);
              resolve(openid);
            })
            .catch(err => {
              reject(err);
            });
        } else {
          reject(new Error('微信登录失败'));
        }
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
};

/**
 * 通过登录code获取OpenID
 * @param {string} code 登录code
 * @returns {Promise<string>} 返回Promise对象，成功时返回openid
 */
const getOpenidByCode = (code) => {
  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        if (res.result && res.result.openid) {
          resolve(res.result.openid);
        } else {
          reject(new Error('获取openid失败'));
        }
      },
      fail: err => {
        reject(err);
      }
    });
  });
};

/**
 * 获取用户健康数据
 * @returns {Promise<Object>} 返回Promise对象，成功时返回用户健康数据
 */
const getUserHealthData = () => {
  return new Promise((resolve, reject) => {
    const openid = getOpenid();
    if (!openid) {
      return reject(new Error('未获取到openid'));
    }

    try {
      // 使用云开发方式查询数据
      const db = wx.cloud.database();
      db.collection('user_health_data').where({
        _openid: openid
      }).get().then(res => {
        if (res.data.length > 0) {
          const userData = res.data[0];
          resolve(userData);
        } else {
          reject(new Error('未找到用户健康数据'));
        }
      }).catch(err => {
        reject(err);
      });
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * 保存用户健康数据
 * @param {Object} healthData 健康数据
 * @returns {Promise} 返回Promise对象
 */
const saveUserHealthData = (healthData) => {
  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name: 'updateUserData',
      data: healthData,
      success: res => {
        resolve(res.result);
      },
      fail: err => {
        reject(err);
      }
    });
  });
};

module.exports = {
  isLoggedIn,
  getOpenid,
  saveOpenid,
  getUserInfo,
  saveUserInfo,
  login,
  getUserHealthData,
  saveUserHealthData
}; 