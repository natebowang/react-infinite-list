import getJsonObject from "./getJsonObject";
import mockItems from './mockItems';

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
            new Error('Sorry something went wrong with the server. Please try again later.')
        )));
    });
});


