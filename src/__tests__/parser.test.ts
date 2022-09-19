import { parse } from '../parser';

describe('start line', () => {
    describe('request', () => {
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
                'Content-Length: 0\r\n\r\n';
            const parsed = parse(optionsRequestValid);
            expect('method' in parsed).toBeTruthy();
            expect('requestUri' in parsed).toBeTruthy();
            if ('method' in parsed && 'requestUri' in parsed) {
                expect(parsed.method).toBe('OPTIONS');
                expect(parsed.requestUri).toEqual({
                    user: 'carol', host: 'chicago.com'
                });
            }
        });
        it('should read a start line with ip address as a host', () => {
            const ipHostRequest =
                'OPTIONS sip:carol@192.168.1.106 SIP/2.0\r\n' +
                'Via: SIP/2.0/UDP pc33.atlanta.com;branch=z9hG4bKhjhs8ass877\r\n' +
                'Max-Forwards: 70\r\n' +
                'To: <sip:carol@chicago.com>\r\n' +
                'From: Alice <sip:alice@atlanta.com>;tag=1928301774\r\n' +
                'Call-ID: a84b4c76e66710\r\n' +
                'CSeq: 63104 OPTIONS\r\n' +
                'Contact: <sip:alice@pc33.atlanta.com>\r\n' +
                'Accept: application/sdp\r\n' +
                'Content-Length: 0\r\n\r\n';
            const parsed = parse(ipHostRequest);
            expect('method' in parsed).toBeTruthy();
            expect('requestUri' in parsed).toBeTruthy();
            if ('method' in parsed && 'requestUri' in parsed) {
                expect(parsed.method).toBe('OPTIONS');
                expect(parsed.requestUri).toEqual({
                    user: 'carol', host: '192.168.1.106'
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
                'Content-Length: 0\r\n\r\n';
            const parsed = parse(optionsRequestValid);
            expect('method' in parsed).toBeTruthy();
            expect('requestUri' in parsed).toBeTruthy();
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
                'Content-Length: 0\r\n\r\n';
            const parsed = parse(optionsRequestValid);
            expect('method' in parsed).toBeTruthy();
            expect('requestUri' in parsed).toBeTruthy();
            if ('method' in parsed && 'requestUri' in parsed) {
                expect(parsed.method).toBe('OPTIONS');
                expect(parsed.requestUri).toEqual({
                    user: 'sip', host: 'espoosip.com', port: 44092
                });
            }
        });
        it('should allow a Request-URI without the user part', () => {
            const registerRequest =
                'REGISTER sip:registrar.biloxi.com SIP/2.0\r\n' +
                'Via: SIP/2.0/UDP bobspc.biloxi.com:5060;branch=z9hG4bKnashds7\r\n' +
                'Max-Forwards: 70\r\n' +
                'To: Bob <sip:bob@biloxi.com>\r\n' +
                'From: Bob <sip:bob@biloxi.com>;tag=456248\r\n' +
                'Call-ID: 843817637684230@998sdasdh09\r\n' +
                'CSeq: 1826 REGISTER\r\n' +
                'Contact: <sip:bob@192.0.2.4>\r\n' +
                'Expires: 7200\r\n' +
                'Content-Length: 0\r\n\r\n';
            const parsed = parse(registerRequest);
            expect('method' in parsed);
            expect('requestUri' in parsed);
            if ('method' in parsed && 'requestUri' in parsed) {
                expect(parsed.method).toBe('REGISTER');
                expect(parsed.requestUri).toEqual({
                    host: 'registrar.biloxi.com'
                });
                expect(parsed.headers.length).toBe(9);
            }
        });
        it('should allow a Request-URI without the user part but with a port', () => {
            const registerRequest =
                'REGISTER sip:registrar.biloxi.com:54747 SIP/2.0\r\n' +
                'Via: SIP/2.0/UDP bobspc.biloxi.com:5060;branch=z9hG4bKnashds7\r\n' +
                'Max-Forwards: 70\r\n' +
                'To: Bob <sip:bob@biloxi.com>\r\n' +
                'From: Bob <sip:bob@biloxi.com>;tag=456248\r\n' +
                'Call-ID: 843817637684230@998sdasdh09\r\n' +
                'CSeq: 1826 REGISTER\r\n' +
                'Contact: <sip:bob@192.0.2.4>\r\n' +
                'Expires: 7200\r\n' +
                'Content-Length: 0\r\n\r\n';
            const parsed = parse(registerRequest);
            expect('method' in parsed);
            expect('requestUri' in parsed);
            if ('method' in parsed && 'requestUri' in parsed) {
                expect(parsed.method).toBe('REGISTER');
                expect(parsed.requestUri).toEqual({
                    host: 'registrar.biloxi.com', port: 54747
                });
                expect(parsed.headers.length).toBe(9);
            }
        });
        it.todo('should handle a user with unescaped, allowed special characters');
        it.todo('should handle a user with escaped special characters');
        it.todo('should throw an error for a version other than 2.0');
    });
    describe('response', () => {
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
                'Content-Length: 131\r\n\r\n';
            const parsed = parse(validResponse);
            expect('statusCode' in parsed).toBeTruthy();
            expect('reason' in parsed).toBeTruthy();
            if ('statusCode' in parsed && 'reason' in parsed) {
                expect(parsed.statusCode).toBe(200);
                expect(parsed.reason).toBe('OK');
            }
        });
    });
});
describe('header lines', () => {
    it('should combine multi-line headers, split before parameters', () => {
        const messageString =
            'SIP/2.0 200 OK\r\n' +
            'Via: SIP/2.0/UDP server10.biloxi.com\r\n' +
            '   ;branch=z9hG4bKnashds8;received=192.0.2.3\r\n' +
            'Via: SIP/2.0/UDP bigbox3.site3.atlanta.com\r\n' +
            '   ;branch=z9hG4bK77ef4c2312983.1;received=192.0.2.2\r\n' +
            'Via: SIP/2.0/UDP pc33.atlanta.com\r\n' +
            '   ;branch=z9hG4bK776asdhds ;received=192.0.2.1\r\n' +
            'To: Bob <sip:bob@biloxi.com>;tag=a6c85cf\r\n' +
            'From: Alice <sip:alice@atlanta.com>;tag=1928301774\r\n' +
            'Call-ID: a84b4c76e66710@pc33.atlanta.com\r\n' +
            'CSeq: 314159 INVITE\r\n' +
            'Contact: <sip:bob@192.0.2.4>\r\n' +
            'Content-Type: application/sdp\r\n' +
            'Content-Length: 131\r\n\r\n';
        const parsed = parse(messageString);
        expect(parsed.headers.length).toBe(10);
        expect(parsed.headers[0]).toEqual({
            fieldName: 'Via', fieldValue: 'SIP/2.0/UDP server10.biloxi.com',
            parameters: [
                { name: 'branch', value: 'z9hG4bKnashds8' },
                { name: 'received', value: '192.0.2.3' }
            ]
        });
        expect(parsed.headers[1]).toEqual({
            fieldName: 'Via', fieldValue: 'SIP/2.0/UDP bigbox3.site3.atlanta.com',
            parameters: [
                { name: 'branch', value: 'z9hG4bK77ef4c2312983.1' },
                { name: 'received', value: '192.0.2.2' }
            ]
        });
    });
    it('should combine multi-line params, split in the middle of the value', () => {
        const messageString =
            'INVITE sip:bob@biloxi.com SIP/2.0\r\n' +
            'Via: SIP/2.0/UDP pc33.atlanta.com;branch=z9hG4bKkjshdyff\r\n' +
            'To: Bob <sip:bob@biloxi.com>\r\n' +
            'From: Alice <sip:alice@atlanta.com>;tag=88sja8x\r\n' +
            'Max-Forwards: 70\r\n' +
            'Subject: I know you are there\r\n' +
            '         pick up the phone\r\n' +
            '         and answer!\r\n' +
            'Call-ID: 987asjd97y7atg\r\n' +
            'CSeq: 986759 INVITE\r\n\r\n';
        const parsed = parse(messageString);
        expect(parsed.headers.length).toBe(7);
        expect(parsed.headers[4]).toEqual({
            fieldName: 'Subject', fieldValue: 'I know you are there pick up the phone and answer!'
        });
    });
});
describe('empty line', () => {
    it('should not parse if en empty line is missing after the headers', () => {
        const messageString =
            'SIP/2.0 200 OK\r\n' +
            'Via: SIP/2.0/UDP server10.biloxi.com\r\n' +
            '   ;branch=z9hG4bKnashds8;received=192.0.2.3\r\n' +
            'Via: SIP/2.0/UDP bigbox3.site3.atlanta.com\r\n' +
            '   ;branch=z9hG4bK77ef4c2312983.1;received=192.0.2.2\r\n' +
            'Via: SIP/2.0/UDP pc33.atlanta.com\r\n' +
            '   ;branch=z9hG4bK776asdhds ;received=192.0.2.1\r\n' +
            'To: Bob <sip:bob@biloxi.com>;tag=a6c85cf\r\n' +
            'From: Alice <sip:alice@atlanta.com>;tag=1928301774\r\n' +
            'Call-ID: a84b4c76e66710@pc33.atlanta.com\r\n' +
            'CSeq: 314159 INVITE\r\n' +
            'Contact: <sip:bob@192.0.2.4>\r\n' +
            'Content-Type: application/sdp\r\n' +
            'Content-Length: 131';
        expect(() => parse(messageString)).toThrowError('an empty line');
    });
});
