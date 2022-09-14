import { parseNameValuePairs } from '../nameValueParser';

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
