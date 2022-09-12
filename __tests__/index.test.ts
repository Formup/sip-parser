import { parse } from "../index";

describe('parse', () => {
    describe('request', () => {
        describe('start line', () => {
            it('should read simple start line', () => {
                // Example unmodified from RFC3261
                const optionsRequestValid =
                    'OPTIONS sip:carol@chicago.com SIP/2.0\r\n' +
                    'Via: SIP/2.0/UDP pc33.atlanta.com;branch=z9hG4bKhjhs8ass877\r\n' +
                    'Max-Forwards: 70\r\n' +
                    'To: <sip:carol@chicago.com>\r\n' +
                    'From: Alice <sip:alice@atlanta.com>;tag=1928301774\r\n' +
                    'Call-ID: a84b4c76e66710\r\n' +
                    'CSeq: 63104 OPTIONS\r\n' +
                    'Contact: <sip:alice@pc33.atlanta.com>\r\n' +
                    'Accept: application/sdp\r\n' +
                    'Content-Length: 0';
                const parsed = parse(optionsRequestValid);
                expect('method' in parsed);
                expect('requestUri' in parsed);
                if ('method' in parsed && 'requestUri' in parsed) {
                    expect(parsed.method).toBe('OPTIONS');
                    expect(parsed.requestUri).toEqual({
                        user: 'carol', host: 'chicago.com'
                    });
                }
            });
            it('should read a start line with a port', () => {
                // Example modified from RFC3261
                const optionsRequestValid =
                    'OPTIONS sip:carol@chicago.com:44092 SIP/2.0\r\n' +
                    'Via: SIP/2.0/UDP pc33.atlanta.com;branch=z9hG4bKhjhs8ass877\r\n' +
                    'Max-Forwards: 70\r\n' +
                    'To: <sip:carol@chicago.com>\r\n' +
                    'From: Alice <sip:alice@atlanta.com>;tag=1928301774\r\n' +
                    'Call-ID: a84b4c76e66710\r\n' +
                    'CSeq: 63104 OPTIONS\r\n' +
                    'Contact: <sip:alice@pc33.atlanta.com>\r\n' +
                    'Accept: application/sdp\r\n' +
                    'Content-Length: 0';
                const parsed = parse(optionsRequestValid);
                expect('method' in parsed);
                expect('requestUri' in parsed);
                if ('method' in parsed && 'requestUri' in parsed) {
                    expect(parsed.method).toBe('OPTIONS');
                    expect(parsed.requestUri).toEqual({
                        user: 'carol', host: 'chicago.com', port: 44092
                    });
                }
            });
            it('should handle a user with sip in their name', () => {
                // Example modified from RFC3261
                const optionsRequestValid =
                    'OPTIONS sip:sip@espoosip.com:44092 SIP/2.0\r\n' +
                    'Via: SIP/2.0/UDP pc33.atlanta.com;branch=z9hG4bKhjhs8ass877\r\n' +
                    'Max-Forwards: 70\r\n' +
                    'To: <sip:sip@espoosip.com>\r\n' +
                    'From: Alice <sip:alice@atlanta.com>;tag=1928301774\r\n' +
                    'Call-ID: a84b4c76e66710\r\n' +
                    'CSeq: 63104 OPTIONS\r\n' +
                    'Contact: <sip:alice@pc33.atlanta.com>\r\n' +
                    'Accept: application/sdp\r\n' +
                    'Content-Length: 0';
                const parsed = parse(optionsRequestValid);
                expect('method' in parsed);
                expect('requestUri' in parsed);
                if ('method' in parsed && 'requestUri' in parsed) {
                    expect(parsed.method).toBe('OPTIONS');
                    expect(parsed.requestUri).toEqual({
                        user: 'sip', host: 'espoosip.com', port: 44092
                    });
                }
            });
            it.todo('should handle a user with unescaped, allowed special characters');
            it.todo('should handle a user with escaped special characters');
            it.todo('should throw an error for a version other than 2.0');
        });
        describe('Headers general', () => {
            it.todo('should find headers in case-insensitive manner');
            it.todo('should allow arbitrary whitespace between the header name and value');
            it.todo('should ')
        });
        describe('Via', () => {
            it.todo('should throw an error if protocol is not 2.0');
            it.todo('should throw an error if branch param is missing');
            it.todo('should throw an error if branch does not start with z9hG4bK');
        });
        describe('From', () => {
            it.todo('should test Form header properly');
        });
        // Describe and test other headers...
    });

    describe('response', () => {
        describe('start line', () => {
            it.todo('should implement relevant tests for the responses');
        });
        // Implement tests for the responses.
    });
});
