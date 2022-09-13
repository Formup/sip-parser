import { parseUri } from '../uri';

describe('parseUri', () => {
    describe('missing protocol part', () => {
        it('should throw an error if the protocol part is missing', () => {
            const malformedUri = 'alice@chicago.com:4330';
            expect(() => parseUri(malformedUri)).toThrowError('not a valid');
            const malformedUri2 = 'bob@newyork.com';
            expect(() => parseUri(malformedUri2)).toThrowError('not a valid');
            const malformedUri3 = 'sip@newyork.com';
            expect(() => parseUri(malformedUri3)).toThrowError('not a valid');
        });
    });
    describe('user', () => {
        it('should parse an alphanumeric username', () => {
            const validUri = 'sip:alice@chicago.com';
            const uri = parseUri(validUri);
            expect(uri.user).toBe('alice');
        });
        it.todo('should parse special allowed characters in the user name');
        it.todo('should not allow characters that are not allowed in the RFC');
    });
    describe('host', () => {
        it('should parse an alphanumeric host name', () => {
            let validUrl = 'sip:jonathan@jonesboro.com';
            let uri = parseUri(validUrl);
            expect(uri.host).toBe('jonesboro.com');

            validUrl = 'sip:jonathan@turku.com:4992';
            uri = parseUri(validUrl);
            expect(uri.host).toBe('turku.com');
        });
        it.todo('should parse a hostname with all the allowed characters');
        it.todo('should reject a hostname with illegal characters');
    });
    describe('port', () => {
        it('should have undefined port if it is not defined', () => {
            const undefinedPortUri = 'sip:charles@example.com';
            const uri = parseUri(undefinedPortUri);
            expect(uri.port).toBeUndefined();
        });
        it('should parse a valid port number', () => {
            const validPortUri = 'sip:sipuser@paris.com:4459';
            const uri = parseUri(validPortUri);
            expect(uri.port).toBe(4459);
        });
        it('should reject a port that is not numeric', () => {
            const badPortUri = 'sip:jesus@nasaret.com:hallelujah';
            const uri = parseUri(badPortUri);
            expect(uri.port).toBeUndefined();
        });
    });
});
