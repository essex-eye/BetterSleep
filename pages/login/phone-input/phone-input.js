// 引入验证工具
const app = getApp();

Page({
  data: {
    country: '中国大陆',
    countryCode: '86',
    phoneNumber: '',
    verifyCode: '',
    correctVerifyCode: '', // 存储正确的验证码
    savePhone: true,
    countdown: 0,
    canSendCode: false,
    canSubmit: false,
    loginSuccess: false,
    timer: null,
    verifyError: false, // 验证码错误标记
    errorMsg: '' // 错误信息
  },

  onLoad(options) {
    // 页面加载时执行
    // 检查是否有历史保存的手机号
    const savedPhone = wx.getStorageSync('savedPhone');
    if (savedPhone) {
      this.setData({
        phoneNumber: savedPhone,
        canSendCode: savedPhone.length === 11 && /^1[3-9]\d{9}$/.test(savedPhone)
      });
    }
  },

  onUnload() {
    // 页面卸载时清除定时器
    if (this.data.timer) {
      clearInterval(this.data.timer);
    }
  },

  // 选择国家/地区
  selectCountry() {
    // 这里可以弹出国家/地区选择器
    // 暂时只支持中国大陆
    wx.showToast({
      title: '暂只支持中国大陆',
      icon: 'none'
    });
  },

  // 处理手机号输入
  handlePhoneInput(e) {
    const phoneNumber = e.detail.value;
    this.setData({ 
      phoneNumber,
      canSendCode: phoneNumber.length === 11 && /^1[3-9]\d{9}$/.test(phoneNumber)
    });
    this.checkCanSubmit();
  },

  // 处理验证码输入
  handleCodeInput(e) {
    const verifyCode = e.detail.value;
    this.setData({ verifyCode });
    this.checkCanSubmit();
  },

  // 检查是否可以提交
  checkCanSubmit() {
    const { phoneNumber, verifyCode } = this.data;
    const canSubmit = phoneNumber.length === 11 && 
                     /^1[3-9]\d{9}$/.test(phoneNumber) && 
                     verifyCode.length === 6;
    this.setData({ canSubmit });
  },

  // 发送验证码
  sendVerifyCode() {
    if (!this.data.canSendCode || this.data.countdown > 0) {
      return;
    }

    // 生成随机验证码
    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // 在实际应用中，这里应该调用后端API发送验证码
    // 这里为了演示，我们只显示验证码，实际应用中不应该这样做
    wx.showModal({
      title: '模拟短信验证码',
      content: `您的验证码是：${randomCode}，请在输入框中填写此验证码。`,
      showCancel: false
    });

    // 保存正确的验证码
    this.setData({
      correctVerifyCode: randomCode,
      countdown: 30,
      verifyError: false,
      errorMsg: ''
    });

    // 启动定时器
    this.data.timer = setInterval(() => {
      if (this.data.countdown <= 1) {
        clearInterval(this.data.timer);
        this.setData({
          countdown: 0
        });
      } else {
        this.setData({
          countdown: this.data.countdown - 1
        });
      }
    }, 1000);
  },

  // 切换保存手机号选项
  toggleSavePhone() {
    this.setData({
      savePhone: !this.data.savePhone
    });
  },

  // 确认提交
  handleConfirm() {
    if (!this.data.canSubmit) {
      return;
    }

    // 验证验证码
    if (this.data.verifyCode !== this.data.correctVerifyCode) {
      this.setData({
        verifyError: true,
        errorMsg: '验证码错误，请重新输入'
      });
      wx.showToast({
        title: '验证码错误',
        icon: 'error',
        duration: 2000
      });
      return;
    }

    // 如果用户选择保存手机号，则存储到本地
    if (this.data.savePhone) {
      wx.setStorageSync('savedPhone', this.data.phoneNumber);
      
      // 保存到全局历史手机号数组中
      const historicalPhones = wx.getStorageSync('historicalPhones') || [];
      if (!historicalPhones.includes(this.data.phoneNumber)) {
        historicalPhones.push(this.data.phoneNumber);
        wx.setStorageSync('historicalPhones', historicalPhones);
      }
    }

    // 登录成功
    this.setData({
      loginSuccess: true,
      verifyError: false,
      errorMsg: ''
    });

    // 设置全局登录状态
    app.globalData.isLoggedIn = true;
    app.globalData.userPhone = this.data.phoneNumber;

    // 延迟跳转
    setTimeout(() => {
      wx.reLaunch({
        url: '/pages/user/user'
      });
    }, 1500);
  }
}) 