import { parseNameValuePairs, stringifyNameValuePairs } from '../nameValueParser';

describe('name-value parser', () => {
    it('should trim whitespace', () => {
        const paramString = '  hello= abc123  ;hi =nebukatnesar';
        const nameValuePairs = parseNameValuePairs(paramString);
        expect(nameValuePairs.length).toBe(2);
        expect(nameValuePairs[0]).toEqual({
            name: 'hello', value: 'abc123'
        });
        expect(nameValuePairs[1]).toEqual({
            name: 'hi', value: 'nebukatnesar'
        });
    });
});
describe('name-value stringifier', () => {
    it('should stringify a single name-value pair', () => {
        let pair = [{ name: 'abc', value: 'val' }];
        const pairString = stringifyNameValuePairs(pair);
        expect(pairString).toBe(';abc=val');
    });
    it('should stringify a multiple name-value pair', () => {
        let pair = [
            { name: 'abc', value: 'val' },
            { name: 'def', value: 'val2' }
        ];
        const pairString = stringifyNameValuePairs(pair);
        expect(pairString).toBe(';abc=val;def=val2');
    });
});
