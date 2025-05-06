// AI顾问服务
const request = require('../utils/request');
const apiConfig = require('../config/api');
const userService = require('./userService');

/**
 * 发送AI顾问请求
 * @param {string} query 用户提问
 * @param {Object} userHealthData 用户健康数据
 * @returns {Promise<Object>} 返回Promise对象，成功时返回AI回答
 */
const sendAiQuery = async (query, userHealthData = null) => {
  try {
    // 如果没有提供用户健康数据，尝试从数据库获取
    if (!userHealthData) {
      try {
        userHealthData = await userService.getUserHealthData();
      } catch (err) {
        console.warn('获取用户健康数据失败，使用空数据', err);
        userHealthData = {};
      }
    }

    // 准备请求数据 - 根据Dify.ai API格式
    const requestData = {
      query: query,
      response_mode: "blocking",
      user: "user123",
      inputs: {
        average_sleep_duration: userHealthData.averageSleepDuration || 'none',
        sleep_quality_score: userHealthData.sleepQualityScore || 'none',
        cognitive_assessment: userHealthData.cognitiveScore || 'none',
        emotional_assessment: userHealthData.emotionalScore || 'none',
        psychological_assessment: userHealthData.psychologicalScore || 'none'
      }
    };

    // 发送请求到AI服务
    const response = await request.post(apiConfig.api.chat, requestData, {
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiConfig.config.apiKey}`
      },
      loading: true,
      loadingText: '思考中...'
    });

    // 检查响应有效性
    if (!response || !response.answer) {
      throw new Error('无效的AI响应');
    }

    return response;
  } catch (error) {
    console.error('AI请求失败', error);
    // 返回一个带有错误信息的对象，而不是直接抛出异常
    return {
      error: true,
      message: error.message || '请求失败',
      answer: '抱歉，我暂时无法回答您的问题。请检查网络连接或稍后再试。'
    };
  }
};

/**
 * 获取睡眠建议
 * @param {Object} sleepData 睡眠数据
 * @returns {Promise<string>} 返回Promise对象，成功时返回睡眠建议
 */
const getSleepSuggestion = async (sleepData) => {
  try {
    const query = `根据我的睡眠数据，给我一些改善睡眠质量的建议。我的平均睡眠时长是${sleepData.duration}小时，睡眠质量评分是${sleepData.quality}分。`;
    
    const response = await sendAiQuery(query, {
      averageSleepDuration: sleepData.duration.toString(),
      sleepQualityScore: sleepData.quality.toString()
    });
    
    // 检查是否有错误
    if (response.error) {
      return response.answer;
    }
    
    return response.answer || '暂时无法提供睡眠建议，请稍后再试。';
  } catch (error) {
    console.error('获取睡眠建议失败', error);
    return '获取睡眠建议失败，请检查网络连接或稍后再试。';
  }
};

/**
 * 获取脑力训练建议
 * @param {Object} brainData 脑力数据
 * @returns {Promise<string>} 返回Promise对象，成功时返回脑力训练建议
 */
const getBrainTrainingSuggestion = async (brainData) => {
  try {
    const query = `根据我的认知评估（${brainData.cognitive}）、情绪状态（${brainData.emotional}）和心理状态（${brainData.psychological}），给我一些合适的脑力训练建议。`;
    
    const response = await sendAiQuery(query, {
      cognitiveScore: brainData.cognitive,
      emotionalScore: brainData.emotional,
      psychologicalScore: brainData.psychological
    });
    
    // 检查是否有错误
    if (response.error) {
      return response.answer;
    }
    
    return response.answer || '暂时无法提供脑力训练建议，请稍后再试。';
  } catch (error) {
    console.error('获取脑力训练建议失败', error);
    return '获取脑力训练建议失败，请检查网络连接或稍后再试。';
  }
};

module.exports = {
  sendAiQuery,
  getSleepSuggestion,
  getBrainTrainingSuggestion
}; 