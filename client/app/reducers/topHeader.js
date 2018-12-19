export const actions = {
    SET_TOP_HEADER_TITLE: "SET_TOP_HEADER_TITLE",
    ENABLE_TOP_HEADER_SPINNER: "ENABLE_TOP_HEADER_SPINNER",
    DISABLE_TOP_HEADER_SPINNER: "DISABLE_TOP_HEADER_SPINNER",
    DISABLE_ALL_TOP_HEADER_SPINNERS: "DISABLE_ALL_TOP_HEADER_SPINNERS"
};

export default (state =
    {
        title: null,
        spinners: new Map(),
        topHeaderSpinnerIsEnabled: false,
        addFlag: false,
        deleteFlag: false,
    }, action) => {

    state = { ...state };

    switch (action.type) {
        case actions.SET_TOP_HEADER_TITLE:
            state.title = action.payload;
            return state;

        case actions.ENABLE_TOP_HEADER_SPINNER:
            state.spinners.set(action.payload.message, action.payload);
            state.topHeaderSpinnerIsEnabled = true;
            state.addFlag = !state.addFlag;
            return state;
        case actions.DISABLE_TOP_HEADER_SPINNER:
            state.spinners.delete(action.payload);
            state.deleteFlag = !state.deleteFlag;
            if (state.spinners.size == 0) {
                state.topHeaderSpinnerIsEnabled = false;
            }
            return state;
        case actions.DISABLE_ALL_TOP_HEADER_SPINNERS:
            state.spinners = new Map();
            state.topHeaderSpinnerIsEnabled = false;
            state.deleteFlag = !state.deleteFlag;
            return state;
        default:
            return state;
    }
};