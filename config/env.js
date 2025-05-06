// 环境配置
const env = {
  // 开发环境
  dev: {
    cloud: 'cloud1-6gjrdnnrf387bbb5', // 云环境ID
    mode: 'development',
    debug: true
  },
  
  // 生产环境
  prod: {
    cloud: 'cloud1-6gjrdnnrf387bbb5', // 云环境ID
    mode: 'production',
    debug: false
  }
};

// 当前环境，可根据需要切换
const currentEnv = env.dev;

module.exports = {
  env,
  currentEnv
}; 