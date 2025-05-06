Page({
  data: {
    isLoggedIn: true
  },
  
  onLoad() {
    // 页面加载时获取登录状态
    const app = getApp();
    this.setData({
      isLoggedIn: app.globalData.isLoggedIn
    });
  },
  
  onShow() {
    // 每次显示页面时检查登录状态
    const app = getApp();
    this.setData({
      isLoggedIn: app.globalData.isLoggedIn
    });
  },
  
  clearCache() {
    wx.clearStorage({
      success() {
        wx.showToast({ title: '缓存已清理', icon: 'success' })
      }
    })
  },
  
  handleLogin() {
    // 跳转到登录页面
    wx.navigateTo({
      url: '/pages/login/login'
    });
  },
  
  logout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success(res) {
        if (res.confirm) {
          // 设置全局登录状态为未登录
          const app = getApp();
          app.globalData.isLoggedIn = false;
          
          // 跳转到我的页面
          wx.switchTab({
            url: '/pages/user/user'
          });
        }
      }
    })
  }
}) 