const routes = (handler) => ([
    {
        method:'PUT',
        path:'/threads/{thread_id}/comments/{comment_id}/likes',
        handler: handler.putCommentLikeHandler,
        options: {
            auth: 'forumapi_jwt',
        },
    }
]);

module.exports = routes;