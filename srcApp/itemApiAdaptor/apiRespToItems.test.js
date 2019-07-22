import apiRespToItems from './apiRespToItems';
import mockItems from '../itemApiAdaptor/mockItems';

describe('Transform original backend format to items array format', () => {
    test('correct format', () => {
        expect(apiRespToItems(mockItems)).toEqual(
            mockItems
        );
    });
    test('wrong format', () => {
        // toThrow need a function wrapper
        expect(()=>{apiRespToItems(undefined)}).toThrow(
            /please try again later/i
        );
    });
});