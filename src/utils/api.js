import request from "@/utils/axios.config";

// 新闻相关API
const getNewsList = () => request.get("/news/list");
const getNewsDetail = (id) => request.get(`/news/list/${id}`);
const getNewsTopList = () => request.get("/news/topList");

// 产品相关API
const getProductList = () => request.get("/product/list");

// 用户相关API
const login = (data) => request.post("/user/login", data);
const register = (data) => request.post("/user/register", data);

// 评论相关API
/**
 * 获取评论列表
 * @param {*} targetType 'news', 'product'
 * @param {*} targetId 'news', 'product' id
 * @returns 
 */
const getCommentList = (targetType, targetId) => request.get(`/comment/${targetType}/${targetId}`);

/**
 * 添加评论
 * @param {*} data { content, targetType, targetId }
 * @returns 
 */
const addComment = (data) => request.post("/comment", data);
const deleteComment = (id) => request.delete(`/comment/${id}`);

// 网站配置相关API
/**
 * 获取所有网站配置
 * @returns 网站配置对象
 */
const getWebsiteConfigs = () => request.get("/website-configs");

/**
 * 获取单个配置
 * @param {string} key 配置键名
 * @returns 配置值
 */
const getConfigByKey = (key) => request.get(`/config/${key}`);

// 导出所有API
export { 
    getNewsList,
    getNewsDetail,
    getNewsTopList, 
    getProductList,
    login,
    register,
    getCommentList,
    addComment,
    deleteComment,
    getWebsiteConfigs,
    getConfigByKey
};




