import getJsonObject from "./getJsonObject";
import mockItems from '../itemApiAdaptor/mockItems';

const apiUrl = '/api/articles';
describe('get json object', () => {
    test('200 response', () => {
        window.fetch = jest.fn(() => new Promise(resolve => resolve({
            ok: true,
            status: 200,
            statusText: 'ok',
            json: () => mockItems,
        })));
        return (getJsonObject(apiUrl)({}).then(obj => expect(obj).toEqual(
            mockItems
        )));
    });
    test('!200 response', () => {
        window.fetch = jest.fn(() => new Promise(resolve => resolve({
            ok: true,
            status: 404,
            statusText: 'some reason',
            json: () => mockItems,
        })));
        return (getJsonObject(apiUrl)({}).catch(e => expect(e).toEqual(
            new Error('404 some reason')
        )));
    });
});


