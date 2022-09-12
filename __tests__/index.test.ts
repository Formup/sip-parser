import { parse } from '../index';

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
    });

    describe('response', () => {
        describe('start line', () => {
            it('should read simple, valid start line', () => {
                const validResponse =
                    'SIP/2.0 200 OK\r\n' +
                    'Via: SIP/2.0/UDP server10.biloxi.com;branch=z9hG4bKnashds8;received=192.0.2.3\r\n' +
                    'Via: SIP/2.0/UDP bigbox3.site3.atlanta.com;branch=z9hG4bK77ef4c2312983.1;received=192.0.2.2\r\n' +
                    'Via: SIP/2.0/UDP pc33.atlanta.com;branch=z9hG4bK776asdhds ;received=192.0.2.1\r\n' +
                    'To: Bob <sip:bob@biloxi.com>;tag=a6c85cf\r\n' +
                    'From: Alice <sip:alice@atlanta.com>;tag=1928301774\r\n' +
                    'Call-ID: a84b4c76e66710@pc33.atlanta.com\r\n' +
                    'CSeq: 314159 INVITE\r\n' +
                    'Contact: <sip:bob@192.0.2.4>\r\n' +
                    'Content-Type: application/sdp\r\n' +
                    'Content-Length: 131';
                const parsed = parse(validResponse);
                expect('statusCode' in parsed);
                expect('reason' in parsed);
                if ('statusCode' in parsed && 'reason' in parsed) {
                    expect(parsed.statusCode).toBe(200);
                    expect(parsed.reason).toBe('OK');
                }
            });
        });
    });
});
