Page({
  data: {
    userInfo: {
      avatarUrl: '/assets/images/default-avatar.png',
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

  getUserInfo() {
    // TODO: 从服务器获取用户信息
  },

  getDeviceInfo() {
    // TODO: 获取设备连接状态和信息
  },

  getStats() {
    // TODO: 获取统计数据
  },

  // 导航处理函数
  navigateToTutorial() {
    wx.navigateTo({
      url: '/pages/tutorial/tutorial'
    });
  },

  navigateToNews() {
    wx.navigateTo({
      url: '/pages/news/news'
    });
  },

  navigateToCollection() {
    wx.navigateTo({
      url: '/pages/collection/collection'
    });
  },

  navigateToService() {
    wx.navigateTo({
      url: '/pages/service/service'
    });
  },

  navigateToSettings() {
    wx.navigateTo({
      url: '/pages/settings/settings'
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