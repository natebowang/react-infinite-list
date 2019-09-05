import ifReachBottomReducer from "./ifReachBottomReducer";
import abortFetchItemsReducer from "./abortFetchItemsReducer";

export default (prev, action) => {
    switch (action.type) {
        case 'ifReachBottom':
            return ifReachBottomReducer(prev, action);
        case 'abortFetchItems':
            return abortFetchItemsReducer(prev, action);
        default:
            return prev;
    }
};
