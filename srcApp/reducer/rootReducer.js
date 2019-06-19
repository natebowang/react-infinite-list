import nextPageReducer from "./nextPageReducer";

export default (prev, action) => {
    switch (action.type) {
        case 'nextPage':
            return nextPageReducer(prev);
        default:
            return prev;
    }
};
