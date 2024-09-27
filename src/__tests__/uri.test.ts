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
    describe('secure SIP', () => {
        it('should parse a secure SIP URI', () => {
            const secureUri = 'sips:alice@chicago.com';
            const uri = parseUri(secureUri);
            expect(uri.secure).toBeTruthy();
        });
        it('should parse an unsecure SIP URI', () => {
            const secureUri = 'sip:alice@chicago.com';
            const uri = parseUri(secureUri);
            expect(uri.secure).toBeFalsy();
        });
    });
    describe('user', () => {
        it('should parse an alphanumeric username', () => {
            const validUri = 'sip:alice@chicago.com';
            const uri = parseUri(validUri);
            expect(uri.user).toBe('alice');
        });
        it('should parse a userless uri format with port', () => {
            const userlessUri = 'sip:chicago.com:59375';
            const uri = parseUri(userlessUri);
            expect(uri).toEqual({
                host: 'chicago.com',
                port: 59375
            });
        });
        it('should parse userless uri format without port', () => {
            const plainHostUri = 'sip:chicago.com';
            const uri = parseUri(plainHostUri);
            expect(uri).toEqual({
                host: 'chicago.com'
            });
        });
        it('should parse a userless uri with ip host with port', () => {
            const ipHostUri = 'sip:192.168.1.16:44837';
            const uri = parseUri(ipHostUri);
            expect(uri).toEqual({
                host: '192.168.1.16',
                port: 44837
            });
        });
        it('should parse a userless uri with ip host without port', () => {
            const ipHostUri = 'sip:192.168.1.16';
            const uri = parseUri(ipHostUri);
            expect(uri).toEqual({
                host: '192.168.1.16',
            });
        });
        it('should handle a separate username outside the angle brackets', () => {
            const fullUserUri = '"Mr. Watson" <sip:watson@worcester.bell-telephone.com>';
            const uri = parseUri(fullUserUri);
            expect(uri.user).toBe('watson');
            expect(uri.host).toBe('worcester.bell-telephone.com');
        });
        it('should deal with angle brackets', () => {
            const fullUserUri = '<sip:callee@u2.rightprivatespace.com>';
            const uri = parseUri(fullUserUri);
            expect(uri.user).toBe('callee');
            expect(uri.host).toBe('u2.rightprivatespace.com');
        });
        it('should find username that has a dot in it', () => {
            const fullUserUri = 'sip:313877858.bc4808dd20@192.168.1.103:37311';
            const uri = parseUri(fullUserUri);
            expect(uri.user).toBe('313877858.bc4808dd20');
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
        it('should find the host if the username has a dot', () => {
            const fullUserUri = 'sip:313877858.bc4808dd20@192.168.1.103:37311';
            const uri = parseUri(fullUserUri);
            expect(uri.host).toBe('192.168.1.103');
            expect(uri.port).toBe(37311);
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
    describe('no user', () => {
        it('should stringify a URI with no user and a port', () => {
            const uri = {
                host: 'moominvalley.com',
                port: 12345
            };
            const uriStr = stringifyUri(uri);
            expect(uriStr).toBe('sip:moominvalley.com:12345');
        });
        it('should stringify a URI with no user and no port', () => {
            const uri = {
                host: 'moominvalley.com',
            };
            const uriStr = stringifyUri(uri);
            expect(uriStr).toBe('sip:moominvalley.com');
        });
    });
    describe('parameters', () => {
        it('should stringify uri parameters and enclose the result in angle brackets', () => {
            const uri = {
                host: 'wonderland.com',
                user: 'alice',
                port: 65251,
                parameters: [{
                    name: 'hole',
                    value: 'rabbit'
                }, {
                    name: 'portal',
                    value: 'magic'
                }]
            };
            const uriStr = stringifyUri(uri);
            expect(uriStr).toBe('<sip:alice@wonderland.com:65251;hole=rabbit;portal=magic>');
        });
    });
});
