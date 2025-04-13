// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()
  
  try {
    // 创建集合
    await db.createCollection('user_health_data')
    return {
      success: true,
      message: '集合创建成功'
    }
  } catch (e) {
    // 如果集合已存在，会报错，但我们可以忽略
    return {
      success: false,
      message: e.message
    }
  }
} 