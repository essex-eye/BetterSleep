// 睡眠质量评估等级
const SLEEP_QUALITY = {
  EXCELLENT: {
    score: 90,
    label: '优秀'
  },
  GOOD: {
    score: 75,
    label: '良好'
  },
  AVERAGE: {
    score: 60,
    label: '一般'
  },
  POOR: {
    score: 45,
    label: '较差'
  },
  BAD: {
    score: 30,
    label: '糟糕'
  }
};

// 认知评估等级
const COGNITIVE_LEVEL = {
  EXCELLENT: '优秀',
  GOOD: '良好',
  AVERAGE: '一般',
  POOR: '较差',
  BAD: '糟糕'
};

// 情绪评估等级
const EMOTIONAL_STATE = {
  STABLE: '稳定',
  FLUCTUATING: '波动',
  ANXIOUS: '焦虑',
  DEPRESSED: '低落',
  STRESSED: '紧张'
};

// 心理评估等级
const PSYCHOLOGICAL_STATE = {
  HEALTHY: '健康',
  NORMAL: '正常',
  MILD: '轻度',
  MODERATE: '中度',
  SEVERE: '重度'
};

module.exports = {
  SLEEP_QUALITY,
  COGNITIVE_LEVEL,
  EMOTIONAL_STATE,
  PSYCHOLOGICAL_STATE
}; 