import {controller} from "./ifReachBottomReducer";

export default (prev, action) => {
    console.debug('abort fetch');
    controller.abort();
    return prev;
};
