import ifReachBottomReducer, {
    setDownloading,
    ifReachBottomMiddleware
} from "./ifReachBottomReducer";
import {BOTTOM_DISTANCE} from "../config";
import mockItems from '../itemApiAdaptor/mockItems';

let dispatch = jest.fn(() => {
    setDownloading(false);
});
window.fetch = jest.fn(() => new Promise(resolve => (resolve({
    ok: true,
    status: 200,
    json: () => mockItems,
}))));
window.innerHeight = 300;
window.scrollY = 100;

test('Dispatch ifReachBottomReducer when reach bottom', (done) => {
    Object.defineProperty(document.body, 'clientHeight', {
        // !isReachBottom
        get: jest.fn(() => window.innerHeight + window.scrollY + BOTTOM_DISTANCE + 1),
        configurable: true,
    });
    ifReachBottomMiddleware(dispatch); // will not dispatch because not reach bottom
    Object.defineProperty(document.body, 'clientHeight', {
        // isReachBottom
        get: jest.fn(() => window.innerHeight + window.scrollY + BOTTOM_DISTANCE - 1),
        configurable: true,
    });
    ifReachBottomMiddleware(dispatch); // will dispatch
    ifReachBottomMiddleware(dispatch); // will not dispatch because downloading is true
    setTimeout(() => {
        expect(dispatch).toHaveBeenCalledTimes(1);
    }, 0); // will dispatch
    setTimeout(() => {
        ifReachBottomMiddleware(dispatch); // will dispatch, last dispatch already done.
        setTimeout(() => {
            expect(dispatch).toHaveBeenCalledTimes(2);
            done()
        }, 0); // will dispatch
    }, 0); // will dispatch
});

test('in reach bottom reducer', () => {
    let prev = {items: []};
    let action = {newItems: mockItems};
    expect(ifReachBottomReducer(prev, action)).toEqual({items: mockItems});
});
