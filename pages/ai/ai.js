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
    }
  },

  onLoad: function() {
    // 先获取openid，然后再获取用户数据
    this.getOpenid();
    
    // 添加测试按钮，用于保存测试数据
    wx.showModal({
      title: '数据源选择',
      content: '是否将您的云数据库中的记录关联到当前用户?',
      confirmText: '是',
      cancelText: '否',
      success: (res) => {
        if (res.confirm) {
          this.saveUserDataToCloud();
        }
      }
    });
  },

  // 获取用户openid
  getOpenid: function() {
    const that = this;
    
    // 检查本地存储中是否已有openid
    const openid = wx.getStorageSync('openid');
    if (openid) {
      console.log('从本地存储获取到openid:', openid);
      that.getUserInfo();
      return;
    }
    
    // 本地没有openid，需要通过云函数获取
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('云函数获取到的openid: ', res.result.openid);
        const openid = res.result.openid;
        // 存储openid到本地
        wx.setStorageSync('openid', openid);
        // 获取用户数据
        that.getUserInfo();
      },
      fail: err => {
        console.error('获取openid失败', err);
        wx.showToast({
          title: '获取用户身份失败',
          icon: 'none'
        });
        // 使用临时数据
        that.useTempData();
      }
    });
  },

  getUserInfo: function() {
    const that = this;
    
    try {
      // 检查云开发是否初始化
      if (!wx.cloud) {
        console.error('云开发未启用');
        return that.setEmptyValues();
      }
      
      // 从本地存储获取openid
      const openid = wx.getStorageSync('openid');
      
      // 如果没有openid，则使用临时数据
      if (!openid) {
        console.warn('未获取到openid，使用临时数据');
        return that.useTempData();
      }
      
      console.log('查询数据使用的openid:', openid);
      
      // 使用云开发方式查询数据
      const db = wx.cloud.database();
      
      // 方法1：按openid查询（适用于通过云函数添加的有_openid的记录）
      // db.collection('user_health_data').where({
      //   _openid: openid
      // }).get().then(res => {
      
      // 方法2：查询所有记录，这里用于测试阶段，找到第一条记录就使用
      db.collection('user_health_data').get().then(res => {
        console.log('获取到的云数据库数据:', res.data);
        if (res.data.length > 0) {
          const userData = res.data[0]; // 使用第一条记录
          that.setData({
            'userInfo.average_sleep_duration': userData.averageSleepDuration || 'none',
            'userInfo.sleep_quality_score': userData.sleepQualityScore || 'none',
            'userInfo.cognitive_assessment': userData.cognitiveScore || 'none',
            'userInfo.emotional_assessment': userData.emotionalScore || 'none',
            'userInfo.psychological_assessment': userData.psychologicalScore || 'none'
          });
          
          console.log('从数据库获取的数据:', {
            averageSleepDuration: userData.averageSleepDuration,
            sleepQualityScore: userData.sleepQualityScore,
            cognitiveScore: userData.cognitiveScore,
            emotionalScore: userData.emotionalScore,
            psychologicalScore: userData.psychologicalScore
          });
        } else {
          console.log('未找到用户数据，使用默认值');
          // 用户没有数据，全部使用none
          that.setEmptyValues();
        }
      }).catch(err => {
        console.error('获取用户数据失败', err);
        that.setEmptyValues();
      });
    } catch (error) {
      console.error('云函数调用失败', error);
      that.useTempData();
    }
  },

  // 使用临时数据
  useTempData: function() {
    // 从本地存储获取数据
    const userPageData = wx.getStorageSync('userPageData') || {};
    
    this.setData({
      'userInfo.average_sleep_duration': userPageData.averageSleepDuration || 'none',
      'userInfo.sleep_quality_score': userPageData.sleepQualityScore || 'none',
      'userInfo.cognitive_assessment': userPageData.cognitiveScore || 'none',
      'userInfo.emotional_assessment': userPageData.emotionalScore || 'none',
      'userInfo.psychological_assessment': userPageData.psychologicalScore || 'none'
    });
    
    console.log('使用临时数据', this.data.userInfo);
  },

  setEmptyValues: function() {
    this.setData({
      'userInfo.average_sleep_duration': 'none',
      'userInfo.sleep_quality_score': 'none',
      'userInfo.cognitive_assessment': 'none',
      'userInfo.emotional_assessment': 'none',
      'userInfo.psychological_assessment': 'none'
    });
  },

  handleInput: function(e) {
    this.setData({
      inputValue: e.detail.value
    });
  },

  sendMessage: function() {
    if (!this.data.inputValue.trim()) return;

    const userMessage = this.data.inputValue;
    const messages = this.data.messages;
    
    // 添加用户消息
    messages.push({
      type: 'user',
      content: userMessage
    });

    this.setData({
      messages,
      inputValue: ''
    });
    
    // 直接调用API，用户输入作为query
    this.callAIAPI(userMessage);
  },

  callAIAPI: function(userQuery) {
    const that = this;
    const { userInfo } = this.data;
    
    console.log('AI请求中使用的用户数据:', userInfo);
    
    // 处理输入数据，确保数字类型正确
    const inputs = {
      average_sleep_duration: userInfo.average_sleep_duration === 'none' ? 'none' : userInfo.average_sleep_duration,
      sleep_quality_score: userInfo.sleep_quality_score === 'none' ? 'none' : userInfo.sleep_quality_score,
      cognitive_assessment: userInfo.cognitive_assessment === 'none' ? 'none' : userInfo.cognitive_assessment,
      emotional_assessment: userInfo.emotional_assessment === 'none' ? 'none' : userInfo.emotional_assessment,
      psychological_assessment: userInfo.psychological_assessment === 'none' ? 'none' : userInfo.psychological_assessment
    };
    
    wx.request({
      url: 'https://api.dify.ai/v1/chat-messages',
      method: 'POST',
      header: {
        'Authorization': 'Bearer app-dpqLsdcV4QfxmNgPUf5NBqTj',
        'Content-Type': 'application/json'
      },
      data: {
        inputs: inputs,
        query: userQuery,
        response_mode: "blocking",
        conversation_id: "",
        user: "user123"
      },
      success(res) {
        console.log('API响应：', res.data);
        if (res.data && res.data.answer) {
          const messages = that.data.messages;
          messages.push({
            type: 'ai',
            content: res.data.answer
          });
          that.setData({ messages });
        } else if (res.data && res.data.error) {
          console.error('API返回错误：', res.data.error);
          wx.showToast({
            title: '请求失败：' + res.data.error,
            icon: 'none',
            duration: 3000
          });
        }
      },
      fail(error) {
        console.error('API调用失败：', error);
        let errorMsg = '网络请求失败';
        if (error.errMsg && error.errMsg.includes('url not in domain list')) {
          errorMsg = '请在小程序管理后台添加API域名到request合法域名列表中';
        } else if (error.statusCode === 401) {
          errorMsg = 'API授权失败，请检查密钥是否正确';
        } else if (error.statusCode === 400) {
          errorMsg = '请求格式错误，请检查输入数据';
        }
        wx.showToast({
          title: errorMsg,
          icon: 'none',
          duration: 3000
        });
        
        // 添加一条错误提示消息
        const messages = that.data.messages;
        messages.push({
          type: 'ai',
          content: '抱歉，我暂时无法回答您的问题。请检查网络连接或稍后再试。'
        });
        that.setData({ messages });
      }
    });
  },

  // 保存用户数据到云数据库
  saveUserDataToCloud: function() {
    wx.cloud.callFunction({
      name: 'updateUserData',
      data: {
        averageSleepDuration: "7.5",
        sleepQualityScore: "85",
        cognitiveScore: "80",
        emotionalScore: "65",
        psychologicalScore: "75"
      },
      success: res => {
        console.log('数据保存成功:', res);
        wx.showToast({
          title: '数据已保存',
          icon: 'success'
        });
        // 重新获取数据
        setTimeout(() => {
          this.getUserInfo();
        }, 1000);
      },
      fail: err => {
        console.error('数据保存失败:', err);
        wx.showToast({
          title: '保存失败',
          icon: 'none'
        });
      }
    });
  }
}); 