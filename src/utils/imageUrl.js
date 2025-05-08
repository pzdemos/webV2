/**
 * 图片URL处理工具函数
 * 为图片URL添加基础前缀
 */

// 基础URL前缀
const BASE_URL = 'https://www.haoaiganfan.top';

/**
 * 为图片URL添加基础前缀
 * @param {string} url 原始图片URL
 * @returns {string} 处理后的图片URL
 */
export function getImageUrl(url) {
  if (!url) return '';
  
  // 如果已经是完整URL（以http或https开头），则直接返回
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // 确保URL以/开头
  const path = url.startsWith('/') ? url : `/${url}`;
  
  return `${BASE_URL}${path}`;
}

/**
 * 批量处理多个图片URL
 * @param {Array<string>} urls 图片URL数组
 * @returns {Array<string>} 处理后的图片URL数组
 */
export function getImageUrls(urls) {
  if (!urls || !Array.isArray(urls)) return [];
  
  return urls.map(url => getImageUrl(url));
}

export default {
  getImageUrl,
  getImageUrls
};
