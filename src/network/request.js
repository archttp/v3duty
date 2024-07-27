import axios from "axios";
import router from "@/router";
import CompanyArr from '../config'

const handleData = ({data, code, message}) => {
    console.log(code);
    switch (code) {
        case 200:
            // 业务层级错误处理，以下是假定restful有一套统一输出格式(指不管成功与否都有相应的数据格式)情况下进行处理
            // 例如响应内容：
            // 错误内容：{ status: 1, msg: '非法参数' }
            // 正确内容：{ status: 200, data: {  }, msg: '操作正常' }
            // 修改返回内容为 `data` 内容，对于绝大多数场景已经无须再关心业务状态码(code)和消息(msg)
            // return data.data ? data.data : data.msg
            // 或者依然保持完整的格式
            return data;
        case 401:
            router.push({path: "/login", replace: true});
            break;
        case 403:
            router.push({path: "/403"});
            break;
        case 24016:
            router.push({path: "/403"});
            break;
    }
    return Promise.reject(message);
};

/**
 * @description axios初始化
 */
const instance = axios.create({
    baseURL: CompanyArr.requestUrl,
    timeout: 5000,
    headers: {
        "Content-Type": "application/json;charset=UTF-8",
    },
});

/**
 * @description axios请求拦截器
 */
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token") || "";
        if (token && config.url.indexOf("arparkLoginAdmin/login") < 0) {
            config.headers["Authorization"] = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * @description axios响应拦截器
 */
instance.interceptors.response.use(
    (response) => {
        var {code} = response.data
        if ([24010, 24002].includes(code)) {
            localStorage.clear();
            router.replace("/login");
        }
        return response.data;
    },
    (error) => {
        const {response} = error;
        if (response === undefined) {
            console.log("网络错误");
            // Vue.prototype.$baseMessage(
            //   '未可知错误，大部分是由于后端不支持跨域CORS或无效配置引起',
            //   'error'
            // )
            return {};
        } else return handleData(response);
    }
);

export default instance;
