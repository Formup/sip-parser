import { parse } from "../index";

describe('parse', () => {
    describe('request', () => {
        it('should read the method', () => {
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
            if ('method' in parsed) {
                expect(parsed.method).toBe('OPTIONS');
            }
        });
    });
});
