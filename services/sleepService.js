// 睡眠相关服务
// 实际内容稍后添加 

const request = require('../utils/request');
const storage = require('../utils/storage');
const { getOpenid } = require('./userService');

/**
 * 睡眠服务 - 处理所有与睡眠相关的数据操作
 */
const sleepService = {
  /**
   * 获取用户睡眠数据
   * @param {String} date 日期，格式为YYYY-MM-DD，不传则获取最新的数据
   * @returns {Promise} 返回睡眠数据
   */
  getSleepData(date) {
    const openid = getOpenid();
    if (!openid) {
      return Promise.reject(new Error('用户未登录'));
    }

    return request.get('/api/sleep/data', {
      openid,
      date
    }).then(res => {
      if (res.data) {
        // 将最新的睡眠数据缓存到本地
        if (!date) {
          storage.set(storage.keys.SLEEP_DATA, res.data);
        }
        return res.data;
      }
      return null;
    });
  },

  /**
   * 获取本地缓存的睡眠数据
   * @returns {Object|null} 睡眠数据对象或null
   */
  getLocalSleepData() {
    return storage.get(storage.keys.SLEEP_DATA);
  },

  /**
   * 保存睡眠数据
   * @param {Object} data 睡眠数据对象
   * @returns {Promise} 成功返回true
   */
  saveSleepData(data) {
    const openid = getOpenid();
    if (!openid) {
      return Promise.reject(new Error('用户未登录'));
    }

    // 确保数据中包含openid
    const sleepData = {
      ...data,
      openid
    };

    return request.post('/api/sleep/data', sleepData)
      .then(res => {
        if (res.success) {
          // 更新本地缓存
          storage.set(storage.keys.SLEEP_DATA, sleepData);
          return true;
        }
        return false;
      });
  },

  /**
   * 获取睡眠统计数据
   * @param {String} period 周期，week-周，month-月，不传则为周
   * @returns {Promise} 返回统计数据
   */
  getSleepStats(period = 'week') {
    const openid = getOpenid();
    if (!openid) {
      return Promise.reject(new Error('用户未登录'));
    }

    return request.get('/api/sleep/stats', {
      openid,
      period
    });
  },

  /**
   * 获取睡眠质量评分
   * @param {Object} sleepData 睡眠数据，不传则使用本地缓存
   * @returns {Number} 睡眠质量评分(0-100)
   */
  calculateSleepScore(sleepData) {
    const data = sleepData || this.getLocalSleepData();
    if (!data) return 0;

    // 评分算法：
    // 1. 基础分 50分
    // 2. 睡眠时长评分：最佳睡眠时长7-8小时，每差0.5小时扣5分，满分30分
    // 3. 深睡眠比例评分：最佳20%-25%，每差5%扣5分，满分20分
    
    let score = 50;
    
    // 睡眠时长评分
    const duration = data.duration || 0; // 小时
    if (duration >= 7 && duration <= 8) {
      score += 30;
    } else if (duration >= 6 && duration < 7) {
      score += 25;
    } else if (duration > 8 && duration <= 9) {
      score += 25;
    } else if (duration >= 5 && duration < 6) {
      score += 20;
    } else if (duration > 9 && duration <= 10) {
      score += 20;
    } else if (duration < 5 || duration > 10) {
      score += 10;
    }
    
    // 深睡眠比例评分
    const deepSleepRatio = data.deepSleepRatio || 0; // 百分比
    if (deepSleepRatio >= 20 && deepSleepRatio <= 25) {
      score += 20;
    } else if ((deepSleepRatio >= 15 && deepSleepRatio < 20) || 
               (deepSleepRatio > 25 && deepSleepRatio <= 30)) {
      score += 15;
    } else if ((deepSleepRatio >= 10 && deepSleepRatio < 15) || 
               (deepSleepRatio > 30 && deepSleepRatio <= 35)) {
      score += 10;
    } else {
      score += 5;
    }
    
    return Math.min(100, Math.max(0, score));
  }
};

module.exports = sleepService; 