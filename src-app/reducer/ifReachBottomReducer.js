import {PAGE_SIZE, BOTTOM_DISTANCE} from "../config";
import {ITEM_API_URL} from "../item-api-adaptor/config";
import apiRespToItems from '../item-api-adaptor/apiRespToItems';
import getJsonObject from "../item-api-adaptor/getJsonObject";

// Firefox does not support AbortController in 2019. So I have to define a fallback here.
export const controller = window.AbortController === undefined ?
    {
        abort: () => {
            console.error('AbortController is not defined, suggest to update this browser. ' );
        },
        signal: null
    } :
    new AbortController();
const signal = controller.signal;

let nextPageNo = 0;

// Since this is a async reducer, this status flag must be checked when dispatch.
let downloading = false;
export const setDownloading = (b) => { // setter for test
    downloading = b
};
// You can write the below logic in a middleware.
// if (!downloading) {
//     downloading = true;
//     dispatch({type: 'ifReachBottom'}); // set downloading to false in reducer.
// }
export const ifReachBottomMiddleware = (dispatch) => {
    if (!downloading) {
        downloading = true;
        // console.debug('check if reach bottom '
        //     + (window.innerHeight + window.scrollY + BOTTOM_DISTANCE)
        //     + ' >= ' + document.body.clientHeight);
        // 需要用>=判断，如果用===判断，页面比窗口短的时候或者有滚动条的时候，就不会触发。
        // 但是用>=有一个问题就是会连续触发，这时候需要先removeEventListener再add上去
        // +BOTTOM_DISTANCE的原因是，这个尺寸的测量值不准，所以必须得留富裕
        const isReachBottom =
            (window.innerHeight + window.scrollY + BOTTOM_DISTANCE) >= document.body.clientHeight;
        if (isReachBottom) {
            getJsonObject(ITEM_API_URL)({
                signal: signal,
                nextPageNo: nextPageNo,
                size: PAGE_SIZE,
            })
                .then(apiRespToItems)
                .then(newItems => {
                    dispatch({type: 'ifReachBottom', newItems: newItems});
                })
                .catch(error => {
                    downloading = false;
                    throw error;
                });
        } else {
            downloading = false;
        }
    }
};

export default (prev, action) => {
    downloading = false;
    nextPageNo++;
    // console.debug('check if reach bottom '
    return {
        ...prev,
        items: prev.items.concat(action.newItems),
    };
};
