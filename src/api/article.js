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

// 获取文章频道
export const getArticleChannels = params => {
    return request({
        method: "GET",
        url: "/mp/v1_0/channels"
    })
}

// 删除文章
export const deleteArticle = articleId => {
    return request({
        method: 'DELETE',
        // 接口文档中写的路径参数需要在url中进行传递
        // 凡是看到接口路径中有:xxx，则就需要传递路径参数
        url: `/mp/v1_0/articles/${articleId}`
    })
}

// 新建文章
export const addArticle = (data, draft = false) => {
    return request({
        method: 'POST',
        url: '/mp/v1_0/articles',
        params: {
            draft // 是否存为草稿（true 为草稿）
        },
        data
    })
}

// 编辑文章
export const updateArticle = (articleId, data, draft = false) => {
    return request({
        method: 'PUT',
        url: `/mp/v1_0/articles/${articleId}`,
        params: {
            draft // 是否存为草稿（true 为草稿）
        },
        data
    })
}

// 获取指定文章
export const getArticles = articleId => {
    return request({
        method: 'GET',
        url: `/mp/v1_0/articles/${articleId}`,
    })
}

// 修改文章评论状态
export const updateCommentStatus = (articleId, allowComment) => {
    return request({
        method: 'PUT',
        url: '/mp/v1_0/comments/status',
        params: {
            article_id: articleId
        },
        data: {
            allow_comment: allowComment
        }
    })
}

