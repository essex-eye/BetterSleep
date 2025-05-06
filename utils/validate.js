// 数据验证工具函数

/**
 * 验证手机号
 * @param {string} phone 手机号
 * @returns {boolean} 是否合法
 */
const isValidPhone = (phone) => {
  return /^1[3-9]\d{9}$/.test(phone);
};

/**
 * 验证邮箱
 * @param {string} email 邮箱
 * @returns {boolean} 是否合法
 */
const isValidEmail = (email) => {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
};

/**
 * 验证身份证号
 * @param {string} idCard 身份证号
 * @returns {boolean} 是否合法
 */
const isValidIdCard = (idCard) => {
  return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(idCard);
};

/**
 * 验证是否为空
 * @param {any} value 要验证的值
 * @returns {boolean} 是否为空
 */
const isEmpty = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

/**
 * 验证是否为数字
 * @param {any} value 要验证的值
 * @returns {boolean} 是否为数字
 */
const isNumber = (value) => {
  if (typeof value === 'number') return !isNaN(value);
  if (typeof value === 'string') return !isNaN(Number(value));
  return false;
};

/**
 * 验证是否为整数
 * @param {any} value 要验证的值
 * @returns {boolean} 是否为整数
 */
const isInteger = (value) => {
  return isNumber(value) && Number.isInteger(Number(value));
};

/**
 * 验证是否为正数
 * @param {any} value 要验证的值
 * @returns {boolean} 是否为正数
 */
const isPositive = (value) => {
  return isNumber(value) && Number(value) > 0;
};

/**
 * 验证是否在指定范围内
 * @param {number} value 要验证的值
 * @param {number} min 最小值
 * @param {number} max 最大值
 * @returns {boolean} 是否在范围内
 */
const isInRange = (value, min, max) => {
  if (!isNumber(value)) return false;
  const num = Number(value);
  return num >= min && num <= max;
};

/**
 * 验证字符串长度是否在指定范围内
 * @param {string} str 要验证的字符串
 * @param {number} min 最小长度
 * @param {number} max 最大长度
 * @returns {boolean} 是否在范围内
 */
const isLengthInRange = (str, min, max) => {
  if (typeof str !== 'string') return false;
  return str.length >= min && str.length <= max;
};

module.exports = {
  isValidPhone,
  isValidEmail,
  isValidIdCard,
  isEmpty,
  isNumber,
  isInteger,
  isPositive,
  isInRange,
  isLengthInRange
}; 