// AI顾问页面
const userService = require('../../services/userService');
const aiService = require('../../services/aiService');
const storage = require('../../utils/storage');

Page({
  data: {
    messages: [],
    inputValue: '',
    userInfo: {
      average_sleep_duration: '',
      sleep_quality_score: '',
      cognitive_assessment: '',
      emotional_assessment: '',
      psychological_assessment: ''
    },
    scrollToView: ''
  },

  onLoad: function() {
    // 初始化页面时获取用户数据
    this.initUserData();
  },

  // 初始化用户数据
  initUserData: function() {
    // 确保用户已登录
    if (!userService.isLoggedIn()) {
      this.getOpenid();
    } else {
      this.getUserHealthData();
    }
  },

  // 获取用户openid
  getOpenid: function() {
    const that = this;
    wx.showLoading({
      title: '加载中...'
    });

    userService.login()
      .then(() => {
        // 登录成功后获取用户健康数据
        that.getUserHealthData();
      })
      .catch(err => {
        console.error('登录失败', err);
        wx.hideLoading();
        wx.showToast({
          title: '登录失败，请重试',
          icon: 'none'
        });
        // 使用空数据
        that.setEmptyValues();
      });
  },

  // 获取用户健康数据
  getUserHealthData: function() {
    const that = this;
    
    wx.showLoading({
      title: '获取数据...'
    });

    userService.getUserHealthData()
      .then(userData => {
        // 更新页面数据
        that.setData({
          'userInfo.average_sleep_duration': userData.averageSleepDuration || 'none',
          'userInfo.sleep_quality_score': userData.sleepQualityScore || 'none',
          'userInfo.cognitive_assessment': userData.cognitiveScore || 'none',
          'userInfo.emotional_assessment': userData.emotionalScore || 'none',
          'userInfo.psychological_assessment': userData.psychologicalScore || 'none'
        });

        console.log('从数据库获取的健康数据:', that.data.userInfo);
        wx.hideLoading();
      })
      .catch(err => {
        console.error('获取用户健康数据失败', err);
        wx.hideLoading();
        // 使用临时数据
        that.useTempData();
      });
  },

  // 使用临时数据
  useTempData: function() {
    const that = this;
    // 从本地存储获取临时数据
    const userPageData = storage.get(storage.keys.USER_HEALTH_DATA) || {};
    
    this.setData({
      'userInfo.average_sleep_duration': userPageData.averageSleepDuration || 'none',
      'userInfo.sleep_quality_score': userPageData.sleepQualityScore || 'none',
      'userInfo.cognitive_assessment': userPageData.cognitiveScore || 'none',
      'userInfo.emotional_assessment': userPageData.emotionalScore || 'none',
      'userInfo.psychological_assessment': userPageData.psychologicalScore || 'none'
    });
    
    console.log('使用临时数据', this.data.userInfo);
  },

  // 设置空值
  setEmptyValues: function() {
    this.setData({
      'userInfo.average_sleep_duration': 'none',
      'userInfo.sleep_quality_score': 'none',
      'userInfo.cognitive_assessment': 'none',
      'userInfo.emotional_assessment': 'none',
      'userInfo.psychological_assessment': 'none'
    });
  },

  // 处理输入框内容变化
  handleInput: function(e) {
    this.setData({
      inputValue: e.detail.value
    });
  },

  // 发送消息
  sendMessage: function() {
    if (!this.data.inputValue.trim()) return;

    const userMessage = this.data.inputValue;
    const messages = this.data.messages;
    
    // 添加用户消息
    messages.push({
      type: 'user',
      content: userMessage
    });

    // 更新UI并清空输入框
    this.setData({
      messages,
      inputValue: ''
    });

    // 滚动到底部
    this.scrollToBottom();
    
    // 调用AI服务
    this.callAIService(userMessage);
  },

  // 调用AI服务
  callAIService: function(userQuery) {
    const that = this;
    
    // 显示等待中消息
    let messages = this.data.messages;
    const waitingMsgIndex = messages.length;
    messages.push({
      type: 'ai',
      content: '正在思考...'
    });
    
    this.setData({ messages });
    this.scrollToBottom();

    // 调用AI服务
    aiService.sendAiQuery(userQuery)
      .then(res => {
        // 检查是否有错误
        if (res.error) {
          messages[waitingMsgIndex] = {
            type: 'ai',
            content: res.answer
          };
          that.setData({ messages });
          that.scrollToBottom();
          
          // 如果是错误响应，显示错误提示
          wx.showToast({
            title: '请求失败，请重试',
            icon: 'none'
          });
          return;
        }
        
        if (res && res.answer) {
          // 更新AI回复
          messages[waitingMsgIndex] = {
            type: 'ai',
            content: res.answer
          };
          that.setData({ messages });
          that.scrollToBottom();
        } else {
          throw new Error('AI回复为空');
        }
      })
      .catch(error => {
        console.error('AI服务调用失败', error);
        
        // 更新错误消息
        messages[waitingMsgIndex] = {
          type: 'ai',
          content: '抱歉，我暂时无法回答您的问题。请检查网络连接或稍后再试。'
        };
        that.setData({ messages });
        that.scrollToBottom();
        
        wx.showToast({
          title: '请求失败，请重试',
          icon: 'none'
        });
      });
  },

  // 滚动到底部
  scrollToBottom: function() {
    const messages = this.data.messages;
    if (messages.length > 0) {
      this.setData({
        scrollToView: `msg-${messages.length - 1}`
      });
    }
  },

  // 保存用户数据到云数据库（测试用）
  saveUserDataToCloud: function() {
    wx.showLoading({
      title: '保存数据...'
    });

    userService.saveUserHealthData({
      averageSleepDuration: "7.5",
      sleepQualityScore: "85",
      cognitiveScore: "80",
      emotionalScore: "65",
      psychologicalScore: "75"
    })
      .then(res => {
        console.log('数据保存成功:', res);
        wx.hideLoading();
        wx.showToast({
          title: '数据已保存',
          icon: 'success'
        });
        // 重新获取数据
        setTimeout(() => {
          this.getUserHealthData();
        }, 1000);
      })
      .catch(err => {
        console.error('数据保存失败:', err);
        wx.hideLoading();
        wx.showToast({
          title: '保存失败',
          icon: 'none'
        });
      });
  }
}); 