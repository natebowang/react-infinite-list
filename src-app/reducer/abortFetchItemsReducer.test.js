import abortFetchItemsReducer from './abortFetchItemsReducer';

jest.spyOn(window.AbortController.prototype, 'abort');

test('cancel AJAX calls when unmount', (done) => {
    abortFetchItemsReducer({}, {});
    setTimeout(() => {
        expect(AbortController.prototype.abort).toHaveBeenCalledTimes(1);
        done();
    }, 0);
});
