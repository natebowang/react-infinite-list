import {controller} from "./ifReachBottomReducer";

export default (prev, action) => {
    controller.abort();
    return prev;
};
