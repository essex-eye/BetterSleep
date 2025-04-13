// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()

  // 提取用户数据
  const { 
    averageSleepDuration, 
    sleepQualityScore, 
    cognitiveScore, 
    emotionalScore, 
    psychologicalScore 
  } = event

  // 查询用户是否已有数据
  const userQuery = await db.collection('user_health_data').where({
    _openid: wxContext.OPENID
  }).get()

  try {
    if (userQuery.data.length > 0) {
      // 更新现有数据
      return await db.collection('user_health_data').where({
        _openid: wxContext.OPENID
      }).update({
        data: {
          averageSleepDuration,
          sleepQualityScore,
          cognitiveScore,
          emotionalScore,
          psychologicalScore,
          updateTime: db.serverDate()
        }
      })
    } else {
      // 添加新数据
      return await db.collection('user_health_data').add({
        data: {
          _openid: wxContext.OPENID,
          averageSleepDuration,
          sleepQualityScore,
          cognitiveScore,
          emotionalScore,
          psychologicalScore,
          createTime: db.serverDate(),
          updateTime: db.serverDate()
        }
      })
    }
  } catch (error) {
    return {
      success: false,
      error
    }
  }
} 