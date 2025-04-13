Page({
  data: {
    isPrivacyChecked: false,
    showPrivacyPopup: false,
    showPhonePopup: false,
    hasWxPhone: false,
    wxPhoneNumber: '',
    // 测试模式配置
    isTestMode: true, // 开启测试模式
    testHasWxPhone: true, // 模拟微信已绑定手机号
    testPhoneNumber: '13688889999' // 模拟的手机号
  },

  onLoad() {
    // 页面加载时执行
  },

  handleLogin() {
    if (!this.data.isPrivacyChecked) {
      this.setData({
        showPrivacyPopup: true
      });
    } else {
      // 测试模式下，直接显示模拟的手机号
      if (this.data.isTestMode) {
        this.setData({
          showPhonePopup: true,
          hasWxPhone: this.data.testHasWxPhone,
          wxPhoneNumber: this.data.testHasWxPhone ? this.data.testPhoneNumber : ''
        });
      } else {
        // 正常模式，显示手机号弹窗
        this.setData({
          showPhonePopup: true
        });
      }
    }
  },

  // 处理手机号登录
  handlePhoneLogin() {
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
      this.setData({
        isPrivacyChecked: true,
        showPrivacyPopup: false,
        showPhonePopup: true,
        hasWxPhone: this.data.testHasWxPhone,
        wxPhoneNumber: this.data.testHasWxPhone ? this.data.testPhoneNumber : ''
      });
    } else {
      // 正常模式
      if (e.detail.errMsg === 'getPhoneNumber:ok') {
        // 用户同意授权，模拟手机号，实际开发中需要通过后端解密获取
        const phoneNumber = '136****0000';
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
    // TODO: 跳转到手机号输入页面
  },

  goToRegister() {
    // 暂不登录的处理逻辑
    wx.switchTab({
      url: '/pages/index/index'
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