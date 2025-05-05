// 项目文件: formatTime.js
// 目录路径:src/utils
// 创建时间:2024-12-25 1:20
import moment from "moment";
moment.locale("zh-cn");//语言
const formatTime = {
    getTime:(data)=> {
        return moment(data).format('YYYY年MM月DD日');
    },
    getTimeDetail:(data)=> {
        return moment(data).format('YYYY年MM月DD日 HH:mm');
    }
}

export default formatTime
