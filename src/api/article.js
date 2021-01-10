// 文章相关请求模块
import request from "@/utils/request";

// 获取文章列表
export const getArticle = params => {
    return request({
        method: "GET",
        url: "/mp/v1_0/articles",
        // body参数使用data设置
        // query参数使用params设置
        // headers参数使用headers设置
        params
    })
}

