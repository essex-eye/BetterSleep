// 日期处理工具函数

/**
 * 格式化日期
 * @param {Date|string|number} date 日期对象、日期字符串或时间戳
 * @param {string} format 格式化模式，如 'YYYY-MM-DD HH:mm:ss'
 * @returns {string} 格式化后的日期字符串
 */
const formatDate = (date, format = 'YYYY-MM-DD') => {
  if (!date) return '';
  
  // 转换为日期对象
  if (typeof date === 'string' || typeof date === 'number') {
    date = new Date(date);
  }
  
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    console.error('无效的日期');
    return '';
  }
  
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  
  const map = {
    'YYYY': year.toString(),
    'YY': year.toString().slice(-2),
    'MM': padZero(month),
    'M': month.toString(),
    'DD': padZero(day),
    'D': day.toString(),
    'HH': padZero(hour),
    'H': hour.toString(),
    'mm': padZero(minute),
    'm': minute.toString(),
    'ss': padZero(second),
    's': second.toString()
  };
  
  return format.replace(/YYYY|YY|MM|M|DD|D|HH|H|mm|m|ss|s/g, match => map[match]);
};

/**
 * 获取当前日期
 * @param {string} format 格式化模式
 * @returns {string} 格式化后的当前日期
 */
const now = (format = 'YYYY-MM-DD HH:mm:ss') => {
  return formatDate(new Date(), format);
};

/**
 * 获取相对日期
 * @param {number} offset 日期偏移量
 * @param {string} format 格式化模式
 * @returns {string} 格式化后的相对日期
 */
const relativeDate = (offset, format = 'YYYY-MM-DD') => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return formatDate(date, format);
};

/**
 * 获取日期所在周的日期数组
 * @param {Date|string|number} date 日期对象、日期字符串或时间戳
 * @param {number} firstDay 一周的第一天，0表示周日，1表示周一
 * @param {string} format 格式化模式
 * @returns {Array<string>} 日期数组
 */
const getWeekDays = (date, firstDay = 1, format = 'YYYY-MM-DD') => {
  if (!date) date = new Date();
  
  // 转换为日期对象
  if (typeof date === 'string' || typeof date === 'number') {
    date = new Date(date);
  }
  
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    console.error('无效的日期');
    return [];
  }
  
  const day = date.getDay();
  const diff = (day + 7 - firstDay) % 7;
  
  // 调整到周的第一天
  date.setDate(date.getDate() - diff);
  
  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(date);
    currentDate.setDate(date.getDate() + i);
    weekDays.push(formatDate(currentDate, format));
  }
  
  return weekDays;
};

/**
 * 获取日期范围
 * @param {number} count 返回的日期数量
 * @param {Date|string|number} endDate 结束日期，默认为今天
 * @param {string} format 格式化模式
 * @returns {Array<string>} 日期数组
 */
const getDateRange = (count, endDate = new Date(), format = 'YYYY-MM-DD') => {
  // 转换为日期对象
  if (typeof endDate === 'string' || typeof endDate === 'number') {
    endDate = new Date(endDate);
  }
  
  if (!(endDate instanceof Date) || isNaN(endDate.getTime())) {
    console.error('无效的日期');
    return [];
  }
  
  const range = [];
  for (let i = count - 1; i >= 0; i--) {
    const date = new Date(endDate);
    date.setDate(date.getDate() - i);
    range.push(formatDate(date, format));
  }
  
  return range;
};

/**
 * 计算两个日期之间的天数
 * @param {Date|string|number} start 开始日期
 * @param {Date|string|number} end 结束日期
 * @returns {number} 天数
 */
const getDaysDiff = (start, end) => {
  // 转换为日期对象
  if (typeof start === 'string' || typeof start === 'number') {
    start = new Date(start);
  }
  if (typeof end === 'string' || typeof end === 'number') {
    end = new Date(end);
  }
  
  if (!(start instanceof Date) || !(end instanceof Date) || isNaN(start.getTime()) || isNaN(end.getTime())) {
    console.error('无效的日期');
    return 0;
  }
  
  // 转换为零点
  start = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  end = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  
  const diff = end.getTime() - start.getTime();
  return Math.floor(diff / (24 * 60 * 60 * 1000));
};

/**
 * 补零
 * @param {number} num 数字
 * @returns {string} 补零后的字符串
 */
const padZero = (num) => {
  return num < 10 ? '0' + num : num.toString();
};

module.exports = {
  formatDate,
  now,
  relativeDate,
  getWeekDays,
  getDateRange,
  getDaysDiff
}; 