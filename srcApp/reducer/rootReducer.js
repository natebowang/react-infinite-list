import ifReachBottomReducer from "./ifReachBottomReducer";
import abortFetchItemsHandler from "./abortFetchItemsHandler";

export default (prev, action) => {
    switch (action.type) {
        case 'ifReachBottom':
            return ifReachBottomReducer(prev, action);
        case 'abortFetchItems':
            return abortFetchItemsHandler(prev, action);
        default:
            return prev;
    }
};
