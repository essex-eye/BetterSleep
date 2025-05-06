// 存储管理工具函数

/**
 * 设置缓存数据
 * @param {string} key 键名
 * @param {any} value 要存储的数据
 * @param {number} expire 过期时间(秒)，默认不过期
 */
const set = (key, value, expire = 0) => {
  const data = {
    value,
    expire: expire > 0 ? new Date().getTime() + expire * 1000 : 0
  };
  try {
    wx.setStorageSync(key, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error('存储数据失败', e);
    return false;
  }
};

/**
 * 获取缓存数据
 * @param {string} key 键名
 * @param {any} def 默认值，当缓存不存在或已过期时返回
 * @returns {any} 缓存数据或默认值
 */
const get = (key, def = null) => {
  try {
    const data = wx.getStorageSync(key);
    if (!data) return def;
    
    const parsedData = JSON.parse(data);
    
    // 判断是否过期
    if (parsedData.expire > 0 && parsedData.expire < new Date().getTime()) {
      remove(key);
      return def;
    }
    
    return parsedData.value;
  } catch (e) {
    console.error('获取缓存数据失败', e);
    return def;
  }
};

/**
 * 移除缓存数据
 * @param {string} key 键名
 */
const remove = (key) => {
  try {
    wx.removeStorageSync(key);
    return true;
  } catch (e) {
    console.error('移除缓存数据失败', e);
    return false;
  }
};

/**
 * 清空所有缓存数据
 */
const clear = () => {
  try {
    wx.clearStorageSync();
    return true;
  } catch (e) {
    console.error('清空缓存数据失败', e);
    return false;
  }
};

/**
 * 获取缓存信息
 * @returns {Object} 缓存信息
 */
const info = () => {
  try {
    return wx.getStorageInfoSync();
  } catch (e) {
    console.error('获取缓存信息失败', e);
    return {};
  }
};

/**
 * 判断缓存是否存在
 * @param {string} key 键名
 * @returns {boolean} 是否存在
 */
const has = (key) => {
  try {
    const value = wx.getStorageSync(key);
    return !!value;
  } catch (e) {
    console.error('判断缓存是否存在失败', e);
    return false;
  }
};

// 用户相关的存储键
const keys = {
  USER_INFO: 'user_info',
  TOKEN: 'token',
  OPENID: 'openid',
  SLEEP_DATA: 'sleep_data',
  USER_HEALTH_DATA: 'user_health_data'
};

module.exports = {
  set,
  get,
  remove,
  clear,
  info,
  has,
  keys
}; 