import { parseUri, stringifyUri } from '../uri';

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
        it('should handle ip-addresses as a host', () => {
            const validUri = 'sip:tester@192.168.1.16:5060';
            const uri = parseUri(validUri);
            expect(uri.host).toBe('192.168.1.16');
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
    describe('parameters', () => {
        it('should read URI parameters that have a key and a value', () => {
            const parametersUri = 'sip:alice@atlanta.com;maddr=239.255.255.1';
            const uri = parseUri(parametersUri);
            expect(uri.parameters).toBeDefined();
            expect(uri.parameters?.length).toBe(1);
            if (uri.parameters) {
                expect(typeof uri.parameters[0]).toBe('object');
                if (typeof uri.parameters[0] === 'object') {
                    expect(uri.parameters[0].name).toBe('maddr');
                    expect(uri.parameters[0].value).toBe('239.255.255.1');
                }
            }
        });
        it.todo('should read URI parameters that only have a key');
        it.todo('should read multiple key-only URI parameters');
        it('should read multiple key-value parameters', () => {
            const parametersUri = 'sip:alice@atlanta.com;maddr=239.255.255.1;custom=abc123';
            const uri = parseUri(parametersUri);
            expect(uri.parameters).toBeDefined();
            expect(uri.parameters?.length).toBe(2);
            if (uri.parameters) {
                expect(typeof uri.parameters[0]).toBe('object');
                if (typeof uri.parameters[0] === 'object') {
                    expect(uri.parameters[0].name).toBe('maddr');
                    expect(uri.parameters[0].value).toBe('239.255.255.1');
                }
                expect(typeof uri.parameters[1]).toBe('object');
                if (typeof uri.parameters[1] === 'object') {
                    expect(uri.parameters[1].name).toBe('custom');
                    expect(uri.parameters[1].value).toBe('abc123');
                }
            }
        });
        it.todo('should read mixed key-only and key-value parameters');
    });
    describe('headers', () => {
        it.todo('should test the header feature of URIs');
    });
});

describe('stringifyUri', () => {
    describe('no port', () => {
        it('should stringify a URI that has no port', () => {
            const uri = {
                user: 'hemuli',
                host: 'moominvalley.com'
            };
            const uriStr = stringifyUri(uri);
            expect(uriStr).toBe('sip:hemuli@moominvalley.com');
        });
        it('should stringify when the host is an IP address and has no port', () => {
            const uri = {
                user: 'pappa',
                host: '19.82.44.120'
            };
            const uriStr = stringifyUri(uri);
            expect(uriStr).toBe('sip:pappa@19.82.44.120');
        });
    });
    describe('with port', () => {
        it('should stringify a URI that has a port', () => {
            const uri = {
                user: 'hemuli',
                host: 'moominvalley.com',
                port: 5062
            };
            const uriStr = stringifyUri(uri);
            expect(uriStr).toBe('sip:hemuli@moominvalley.com:5062');
        });
        it('should stringify when the host is an IP address and has a port', () => {
            const uri = {
                user: 'pappa',
                host: '19.82.44.120',
                port: 5063
            };
            const uriStr = stringifyUri(uri);
            expect(uriStr).toBe('sip:pappa@19.82.44.120:5063');
        });
    });
});
