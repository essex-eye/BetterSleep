Page({
  data: {
    isLoggedIn: true, // 默认为已登录状态
    userInfo: {
      avatarUrl: '/assets/images/user/default-avatar.png',
      nickName: '用户名'
    },
    device: {
      isConnected: true,
      name: 'Sleep Monitor Pro'
    },
    sleepStats: {
      averageDuration: '8小时02分',
      quality: '80分',
      issues: '3个',
      monitorCount: '3次'
    },
    assessmentStats: {
      cognitive: '80分',
      emotion: '80分',
      physical: '90分'
    }
  },

  onLoad() {
    this.getUserInfo();
    this.getDeviceInfo();
    this.getStats();
  },

  onShow() {
    // 每次显示页面时检查登录状态
    const app = getApp();
    this.setData({
      isLoggedIn: app.globalData.isLoggedIn
    });
  },

  getUserInfo() {
    // TODO: 从服务器获取用户信息
  },

  getDeviceInfo() {
    // TODO: 获取设备连接状态和信息
  },

  getStats() {
    // TODO: 获取统计数据
  },

  navigateToLogin() {
    wx.navigateTo({
      url: '/pages/login/login'
    });
  },

  navigateToVip() {
    wx.navigateTo({
      url: '/pages/user/vip/vip'
    });
  },

  // 导航处理函数
  navigateToTutorial() {
    wx.navigateTo({
      url: '/pages/tutorial/tutorial'
    });
  },

  navigateToNews() {
    const app = getApp();
    if (app.globalData.isLoggedIn) {
    wx.navigateTo({
      url: '/pages/news/news'
    });
    } else {
      // 未登录状态下跳转到登录页
      this.navigateToLogin();
    }
  },

  navigateToCollection() {
    const app = getApp();
    if (app.globalData.isLoggedIn) {
    wx.navigateTo({
      url: '/pages/collection/collection'
    });
    } else {
      // 未登录状态下跳转到登录页
      this.navigateToLogin();
    }
  },

  navigateToService() {
    wx.navigateTo({
      url: '/pages/service/service'
    });
  },

  navigateToSettings() {
    wx.navigateTo({
      url: '/pages/user/settings/settings'
    });
  },

  navigateToDevice() {
    wx.navigateTo({
      url: '/pages/user/device/device'
    });
  },

  // 底部标签切换
  switchTab(e) {
    const page = e.currentTarget.dataset.page;
    wx.switchTab({
      url: `/pages/${page}/${page}`
    });
  }
}) 