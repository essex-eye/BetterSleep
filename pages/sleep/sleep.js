// 睡眠检测页面
const userService = require('../../services/userService');
const aiService = require('../../services/aiService');
const dateUtil = require('../../utils/date');
const storage = require('../../utils/storage');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 当前日期
    currentDate: '',
    // 设备信息
    deviceInfo: {
      name: 'SleepMate Pro',
      isConnected: false
    },
    // 时间选择器数据
    hours: [],
    minutes: [],
    timeIndex: [24, 0, 30], // 初始索引，将设置在中间位置
    // 睡眠数据
    sleepData: {
      quality: 85,
      qualityText: '良好',
      totalDuration: '7小时35分钟',
      deepSleep: '3小时10分钟',
      lightSleep: '3小时45分钟',
      remSleep: '40分钟',
      bedTime: '23:05',
      wakeTime: '06:40'
    },
    // 周数据
    weeklyData: [
      { day: '一', value: 7.2, height: '60%' },
      { day: '二', value: 6.8, height: '56%' },
      { day: '三', value: 7.5, height: '62%' },
      { day: '四', value: 8.1, height: '67%' },
      { day: '五', value: 7.0, height: '58%' },
      { day: '六', value: 9.2, height: '76%' },
      { day: '日', value: 8.5, height: '70%' }
    ],
    // 监测状态
    isMonitoring: false,
    // 提示弹窗
    showTipsPopup: false,
    // 睡眠建议
    sleepTips: [
      '保持规律的作息时间，每天固定时间上床睡觉和起床',
      '睡前1小时避免使用电子设备，蓝光会抑制褪黑素的分泌',
      '营造良好的睡眠环境，保持房间安静、黑暗和适宜的温度',
      '避免睡前饮用咖啡、酒精和进食大餐',
      '白天保持适量的体育活动，但避免睡前3小时内剧烈运动',
      '如果15-20分钟内无法入睡，建议起床做些放松活动，直到感到困倦再回到床上',
      '睡前可以进行深呼吸、冥想等放松活动'
    ],
    // 当前选中的tab
    activeTab: 'sleep',
    // 是否使用默认图标
    useDefaultIcon: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setCurrentDate();
    this.checkDeviceConnection();
    this.fetchSleepData();
    this.fetchWeeklyData();
    this.initTimePicker();
    
    // 延迟一会儿，确保时间选择器已完全初始化
    setTimeout(() => {
      this.refreshTimePickerStatus();
    }, 500);
  },

  /**
   * 获取当前日期
   */
  setCurrentDate: function () {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
    const weekday = weekdays[now.getDay()];
    
    this.setData({
      currentDate: `${year}年${month}月${day}日 星期${weekday}`
    });
  },

  /**
   * 检查设备连接状态
   */
  checkDeviceConnection: function () {
    // 这里应调用设备连接API，示例中仅模拟
    const isConnected = Math.random() > 0.3; // 模拟70%几率连接成功
    
    this.setData({
      'deviceInfo.isConnected': isConnected
    });
  },

  /**
   * 连接设备
   */
  connectDevice: function () {
    wx.showLoading({
      title: '正在连接设备...',
    });
    
    // 模拟连接过程
    setTimeout(() => {
      const success = Math.random() > 0.2;
      
      wx.hideLoading();
      
      if (success) {
        this.setData({
          'deviceInfo.isConnected': true
        });
        
        wx.showToast({
          title: '设备已连接',
          icon: 'success'
        });
      } else {
        wx.showModal({
          title: '连接失败',
          content: '请确保设备已开启并在范围内',
          showCancel: false
        });
      }
    }, 1500);
  },

  /**
   * 获取睡眠数据
   */
  fetchSleepData: function () {
    // 这里应调用API获取数据，示例中使用模拟数据
    // 实际应用中可从服务器或本地存储获取
  },

  /**
   * 获取周数据
   */
  fetchWeeklyData: function () {
    // 这里应调用API获取周数据，示例中使用模拟数据
    // 实际应用中可从服务器或本地存储获取
  },

  /**
   * 开始/停止监测
   */
  toggleMonitoring: function () {
    if (!this.data.deviceInfo.isConnected) {
      wx.showModal({
        title: '设备未连接',
        content: '请先连接设备',
        showCancel: false
      });
      return;
    }
    
    const isMonitoring = !this.data.isMonitoring;
    
    this.setData({
      isMonitoring: isMonitoring
    });
    
    if (isMonitoring) {
      wx.showToast({
        title: '已开始监测',
        icon: 'success'
      });
    } else {
      wx.showToast({
        title: '已停止监测',
        icon: 'none'
      });
    }
  },

  /**
   * 查看睡眠报告
   */
  viewReport: function () {
    wx.navigateTo({
      url: '../report/report',
    });
  },

  /**
   * 显示睡眠建议
   */
  showTips: function () {
    this.setData({
      showTipsPopup: true
    });
  },

  /**
   * 关闭睡眠建议弹窗
   */
  closeTipsPopup: function () {
    this.setData({
      showTipsPopup: false
    });
  },

  /**
   * 切换底部标签
   */
  switchTab: function (e) {
    const tab = e.currentTarget.dataset.tab;
    
    if (tab === this.data.activeTab) {
      return;
    }
    
    this.setData({
      activeTab: tab
    });
    
    // 跳转到相应页面
    if (tab === 'brain') {
      wx.redirectTo({
        url: '../brain/brain',
      });
    } else if (tab === 'user') {
      wx.redirectTo({
        url: '../user/user',
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      activeTab: 'sleep'
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // 刷新数据
    this.checkDeviceConnection();
    this.fetchSleepData();
    this.fetchWeeklyData();
    
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '睡眠监测 - 了解你的睡眠质量',
      path: '/pages/sleep/sleep'
    };
  },

  /**
   * 初始化时间选择器
   */
  initTimePicker: function() {
    const hours = [];
    const minutes = [];
    
    // 为了实现无限循环滚动，我们创建一个扩展的数组
    // 重复3次时间数据，以便在中间部分进行选择
    for (let j = 0; j < 3; j++) {
      // 生成小时选项 (0-23)
      for (let i = 0; i < 24; i++) {
        hours.push(i < 10 ? `0${i}` : `${i}`);
      }
    }
    
    // 同样重复3次分钟数据
    for (let j = 0; j < 3; j++) {
      // 生成分钟选项 (0-59)
      for (let i = 0; i < 60; i++) {
        minutes.push(i < 10 ? `0${i}` : `${i}`);
      }
    }
    
    // 获取当前时间
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    // 将初始索引设置在中间的数据集，使得可以向上或向下滚动
    this.setData({
      hours,
      minutes,
      timeIndex: [currentHour + 24, 0, currentMinute + 60] // 定位在中间数据集
    });
  },

  /**
   * 时间选择器变化事件
   */
  bindTimeChange: function(e) {
    const val = e.detail.value;
    
    // 处理小时索引，确保在合理范围内循环
    let hourIndex = val[0];
    let minuteIndex = val[2];
    
    // 检查并重置选择位置，保持在中间区域
    if (hourIndex < 12) {
      // 如果滚动到了前部区域，重置到中间区域
      hourIndex += 24;
      setTimeout(() => {
        this.setData({
          'timeIndex[0]': hourIndex
        });
      }, 200);
    } else if (hourIndex >= 48) {
      // 如果滚动到了后部区域，重置到中间区域
      hourIndex -= 24;
      setTimeout(() => {
        this.setData({
          'timeIndex[0]': hourIndex
        });
      }, 200);
    }
    
    // 检查并重置分钟选择位置
    if (minuteIndex < 30) {
      minuteIndex += 60;
      setTimeout(() => {
        this.setData({
          'timeIndex[2]': minuteIndex
        });
      }, 200);
    } else if (minuteIndex >= 90) {
      minuteIndex -= 60;
      setTimeout(() => {
        this.setData({
          'timeIndex[2]': minuteIndex
        });
      }, 200);
    }
    
    // 更新时间索引
    this.setData({
      timeIndex: [hourIndex, val[1], minuteIndex]
    });
    
    // 获取实际选中的小时和分钟（取模运算获取实际时间）
    const actualHour = this.data.hours[hourIndex % 24];
    const actualMinute = this.data.minutes[minuteIndex % 60];
    console.log(`选中的时间: ${actualHour}:${actualMinute}`);
  },
  
  /**
   * 开始睡眠
   */
  startSleep: function() {
    // 获取实际选中的小时和分钟（取模运算获取实际时间）
    const hourIndex = this.data.timeIndex[0] % 24;
    const minuteIndex = this.data.timeIndex[2] % 60;
    
    const hour = this.data.hours[hourIndex];
    const minute = this.data.minutes[minuteIndex];
    
    wx.showToast({
      title: `已设置${hour}:${minute}开始睡眠`,
      icon: 'none'
    });
    
    // 这里可以添加开始睡眠的逻辑
  },

  /**
   * 处理图片加载失败
   */
  imageError: function(e) {
    console.log('图片加载失败', e);
    // 使用本地CSS图标作为备用
    this.setData({
      useDefaultIcon: true
    });
  },

  /**
   * 刷新时间选择器状态，确保循环滚动正常工作
   */
  refreshTimePickerStatus: function() {
    // 触发一次微小的变化，确保picker-view更新其内部状态
    const currentIndex = this.data.timeIndex;
    
    this.setData({
      timeIndex: [currentIndex[0], currentIndex[1], currentIndex[2]]
    });
  },
}); 