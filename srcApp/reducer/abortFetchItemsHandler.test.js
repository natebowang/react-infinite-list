import abortFetchItemsHandler from '../reducer/abortFetchItemsHandler';

jest.spyOn(window.AbortController.prototype, 'abort');

test('cancel AJAX calls when unmount', (done) => {
    abortFetchItemsHandler({}, {});
    setTimeout(() => {
        expect(AbortController.prototype.abort).toHaveBeenCalledTimes(1);
        done();
    }, 0);
});
