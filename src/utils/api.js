import request from "@/utils/axios.config";

const getNewsList = () => request.get("/news/list");
const getNewsDetail = (id) => request.get(`/news/list/${id}`);
const getNewsTopList = () => request.get("/news/topList");
const getProductList = () => request.get("/product/list");

const login = (data) => request.post("/user/login", data);
const register = (data) => request.post("/user/register", data);

/**
 * 
 * @param {*} targetType 'news', 'product'
 * @param {*} targetId 'news', 'product'  id
 * @returns 
 */
const getCommentList = (targetType, targetId) => request.get(`/comment/${targetType}/${targetId}`);
/**
 * 
 * @param {*} data  { content, targetType, targetId }
 * @returns 
 */
const addComment = (data) => request.post("/comment", data);
const deleteComment = (id) => request.delete(`/comment/${id}`);

export { 
    getNewsList,
    getNewsDetail,
    getNewsTopList, 
    getProductList,
    login,
    register,
    getCommentList,
    addComment,
    deleteComment
 };




