export const actions = {

    CREATE_BLOG_RECORD_PENDING: "CREATE_BLOG_RECORD_PENDING",
    CREATE_BLOG_RECORD_DISPATCH_SUCCESS: "CREATE_BLOG_RECORD_DISPATCH_SUCCESS",
    CREATE_BLOG_RECORD_DISPATCH_ERROR: "CREATE_BLOG_RECORD_DISPATCH_ERROR",

    DELETE_BLOG_RECORD_PENDING: "DELETE_BLOG_RECORD_PENDING",
    DELETE_BLOG_RECORD_DISPATCH_SUCCESS: "DELETE_BLOG_RECORD_DISPATCH_SUCCESS",
    DELETE_BLOG_RECORD_DISPATCH_ERROR: "DELETE_BLOG_RECORD_DISPATCH_ERROR"
};

export default (state =
    {
        createUpdateFlag: false,
        deleteUpdateFlag: false,

    }, action) => {

    state = { ...state };

    switch (action.type) {
        case actions.DELETE_BLOG_RECORD_PENDING:
            return state;
        case actions.DELETE_BLOG_RECORD_DISPATCH_SUCCESS:
            state.deleteUpdateFlag = !state.deleteUpdateFlag;
            return state;
        case actions.DELETE_BLOG_RECORD_DISPATCH_ERROR:
            return state;

        case actions.CREATE_BLOG_RECORD_PENDING:
            return state;
        case actions.CREATE_BLOG_RECORD_DISPATCH_SUCCESS:
            state.createUpdateFlag = !state.createUpdateFlag;
            return state;
        case actions.CREATE_BLOG_RECORD_DISPATCH_ERROR:
            return state;

        default:
            return state
    }
};
