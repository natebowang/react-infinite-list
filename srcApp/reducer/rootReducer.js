import ifReachBottomReducer from "./ifReachBottomReducer";

export default (prev, action) => {
    switch (action.type) {
        case 'ifReachBottom':
            return ifReachBottomReducer(prev, action);
        case 'abortFetchItems':
            return ifReachBottomReducer(prev, action);
        default:
            return prev;
    }
};
