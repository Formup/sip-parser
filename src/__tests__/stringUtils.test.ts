import { splitIfNotBetween } from '../stringUtils';

describe('splitIfNotBetween', () => {
    it('should return one piece if no splitters occur', () => {
        const testStr = 'abc"def"';
        const pieces = splitIfNotBetween(testStr, ',', '"');
        expect(pieces.length).toBe(1);
        expect(pieces[0]).toBe(testStr);
    });
    it('should split for splitter', () => {
        const testStr = 'abc,def';
        const pieces = splitIfNotBetween(testStr, ',', '"');
        expect(pieces.length).toBe(2);
        expect(pieces[0]).toBe('abc');
        expect(pieces[1]).toBe('def');
    });
    it('should remove starting and trailing splitters', () => {
        const testStr = ',abcdef,';
        const pieces = splitIfNotBetween(testStr, ',', '"');
        expect(pieces.length).toBe(1);
        expect(pieces[0]).toBe('abcdef');
    });
    it('should not split if between surrounding characters', () => {
        const testStr = ',ab"c,d"ef,';
        const pieces = splitIfNotBetween(testStr, ',', '"');
        expect(pieces.length).toBe(1);
        expect(pieces[0]).toBe('ab"c,d"ef');
    });
    it('should split if surrounded only from one side', () => {
        const testStr = 'a"bc,def';
        const pieces = splitIfNotBetween(testStr, ',', '"');
        expect(pieces.length).toBe(2);
        expect(pieces[0]).toBe('a"bc');
        expect(pieces[1]).toBe('def');
    });
});
