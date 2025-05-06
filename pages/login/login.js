Page({
  data: {
    isPrivacyChecked: false,
    showPrivacyPopup: false,
    showPhonePopup: false,
    hasWxPhone: false,
    wxPhoneNumber: '',
    hasHistoricalPhone: false,
    historicalPhone: '',
    // 测试模式配置
    isTestMode: true, // 开启测试模式
    testHasWxPhone: true, // 模拟微信已绑定手机号
    testPhoneNumber: '13688889999' // 模拟的手机号
  },

  // 手机号脱敏处理
  maskPhoneNumber(phoneNumber) {
    if (!phoneNumber || phoneNumber.length !== 11) {
      return phoneNumber;
    }
    // 保留前3位和后4位，中间用星号替代
    return phoneNumber.substring(0, 3) + '****' + phoneNumber.substring(7);
  },

  onLoad() {
    // 页面加载时检查是否有历史绑定手机号
    this.checkHistoricalPhone();
  },

  // 检查是否有历史绑定手机号
  checkHistoricalPhone() {
    const historicalPhones = wx.getStorageSync('historicalPhones') || [];
    if (historicalPhones.length > 0) {
      // 使用最近使用的一个手机号
      const lastPhone = historicalPhones[historicalPhones.length - 1];
      const maskedPhone = this.maskPhoneNumber(lastPhone);
      this.setData({
        hasHistoricalPhone: true,
        historicalPhone: maskedPhone
      });
    }
  },

  handleLogin() {
    if (!this.data.isPrivacyChecked) {
      this.setData({
        showPrivacyPopup: true
      });
    } else {
      // 测试模式下，直接显示模拟的手机号
      if (this.data.isTestMode) {
        const maskedPhoneNumber = this.maskPhoneNumber(this.data.testPhoneNumber);
        this.setData({
          showPhonePopup: true,
          hasWxPhone: this.data.testHasWxPhone,
          wxPhoneNumber: this.data.testHasWxPhone ? maskedPhoneNumber : ''
        });
      } else {
        // 正常模式，显示手机号弹窗
        this.setData({
          showPhonePopup: true
        });
      }
    }
  },

  // 处理历史手机号登录
  handleHistoricalPhoneLogin() {
    // 获取历史手机号
    const historicalPhones = wx.getStorageSync('historicalPhones') || [];
    if (historicalPhones.length > 0) {
      const lastPhone = historicalPhones[historicalPhones.length - 1];
      
      // 设置全局登录状态
      const app = getApp();
      app.globalData.isLoggedIn = true;
      app.globalData.userPhone = lastPhone;
      
      // 显示登录成功提示
      wx.showToast({
        title: '登录成功',
        icon: 'success',
        duration: 1500,
        success: () => {
          // 延迟跳转，等待提示显示完成
          setTimeout(() => {
            // 关闭弹窗
            this.setData({
              showPhonePopup: false
            });
            // 跳转到用户页面
            wx.reLaunch({
              url: '/pages/user/user'
            });
          }, 1500);
        }
      });
    }
  },

  // 处理手机号登录
  handlePhoneLogin() {
    // 设置全局登录状态
    const app = getApp();
    app.globalData.isLoggedIn = true;
    
    // 显示登录成功提示
    wx.showToast({
      title: '登录成功',
      icon: 'success',
      duration: 1500,
      success: () => {
        // 延迟跳转，等待提示显示完成
        setTimeout(() => {
          // 关闭弹窗
          this.setData({
            showPhonePopup: false
          });
          // 跳转到用户页面
          wx.reLaunch({
            url: '/pages/user/user'
          });
        }, 1500);
      }
    });
  },

  // 同意隐私协议并获取手机号
  handleAgreePrivacyAndGetPhone(e) {
    if (this.data.isTestMode) {
      // 测试模式下，使用模拟数据
      const maskedPhoneNumber = this.maskPhoneNumber(this.data.testPhoneNumber);
      this.setData({
        isPrivacyChecked: true,
        showPrivacyPopup: false,
        showPhonePopup: true,
        hasWxPhone: this.data.testHasWxPhone,
        wxPhoneNumber: this.data.testHasWxPhone ? maskedPhoneNumber : ''
      });
    } else {
      // 正常模式
      if (e.detail.errMsg === 'getPhoneNumber:ok') {
        // 用户同意授权，模拟手机号，实际开发中需要通过后端解密获取
        // 这里假设从后端获取到了完整手机号，然后进行脱敏处理
        const originalPhone = '13600000000';
        const phoneNumber = this.maskPhoneNumber(originalPhone);
        this.setData({
          isPrivacyChecked: true,
          showPrivacyPopup: false,
          showPhonePopup: true,
          hasWxPhone: true,
          wxPhoneNumber: phoneNumber
        });
      } else {
        // 用户拒绝授权
        this.setData({
          isPrivacyChecked: true,
          showPrivacyPopup: false,
          showPhonePopup: true,
          hasWxPhone: false
        });
      }
    }
  },

  handlePrivacyChange(e) {
    this.setData({
      isPrivacyChecked: e.detail.value.length > 0
    });
  },

  handleDisagreePrivacy() {
    this.setData({
      showPrivacyPopup: false
    });
  },

  handleUseWxPhone() {
    // 不允许使用微信手机号
    this.setData({
      showPhonePopup: false
    });
  },

  handleUseOtherPhone() {
    // 使用其他手机号
    this.setData({
      showPhonePopup: false
    });
    // 跳转到手机号输入页面
    wx.navigateTo({
      url: '/pages/login/phone-input/phone-input'
    });
  },

  goToRegister() {
    // 暂不登录的处理逻辑
    // 设置全局状态为未登录
    const app = getApp();
    app.globalData.isLoggedIn = false;
    
    // 跳转到用户页面
    wx.switchTab({
      url: '/pages/user/user'
    });
  },

  showPrivacyPolicy() {
    wx.showModal({
      title: '小程序隐私保护指引',
      content: '这是隐私保护指引的内容...',
      showCancel: false
    });
  },

  showUserAgreement() {
    wx.showModal({
      title: '用户协议',
      content: '这是用户协议的内容...',
      showCancel: false
    });
  },

  showPrivacyAgreement() {
    wx.showModal({
      title: '隐私协议',
      content: '这是隐私协议的内容...',
      showCancel: false
    });
  }
}) 