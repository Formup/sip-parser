import { stringify } from '../stringifier';
import { SIPResponse } from '../types';

describe('stringify', () => {
    describe('request', () => {
        describe('start line', () => {
            it('should stringify the startline without a defined port', () => {
                // This request is build based on the example on page 130 of RFC 3261.
                const exampleRequest = {
                    method: 'ACK',
                    requestUri: { user: 'test', host: 'google.com' },
                    version: '2.0',
                    headers: [{
                        fieldName: 'Via',
                        fieldValue: 'SIP/2.0/UDP pc33.atlanta.com',
                        parameters: [{ name: 'branch', value: 'z9hG4bKkjshdyff' }],
                    }, {
                        fieldName: 'To',
                        fieldValue: 'Bob <sip:bob@biloxi.com>',
                        parameters: [{ name: 'tag', value: '99sa0xk' }],
                    }, {
                        fieldName: 'From',
                        fieldValue: 'Alice <sip:alice@atlanta.com>',
                        parameters: [{ name: 'tag', value: '88sja8x' }],
                    }, {
                        fieldName: 'Max-Forwards', fieldValue: '70'
                    }, {
                        fieldName: 'Call-ID', fieldValue: '987asjd97y7atg'
                    }, {
                        fieldName: 'CSeq', fieldValue: '986759 ACK'
                    }],
                    content: '',
                };
                const stringified = stringify(exampleRequest);
                expect(stringified.startsWith('ACK sip:test@google.com SIP/2.0\r\n')).toBe(true);
            });
            it('should stringify secure SIP', () => {
                // This request is build based on the example on page 130 of RFC 3261.
                const exampleRequest = {
                    method: 'ACK',
                    requestUri: { user: 'test', host: 'google.com', secure: true },
                    version: '2.0',
                    headers: [{
                        fieldName: 'Via',
                        fieldValue: 'SIP/2.0/UDP pc33.atlanta.com',
                        parameters: [{ name: 'branch', value: 'z9hG4bKkjshdyff' }],
                    }, {
                        fieldName: 'To',
                        fieldValue: 'Bob <sip:bob@biloxi.com>',
                        parameters: [{ name: 'tag', value: '99sa0xk' }],
                    }, {
                        fieldName: 'From',
                        fieldValue: 'Alice <sip:alice@atlanta.com>',
                        parameters: [{ name: 'tag', value: '88sja8x' }],
                    }, {
                        fieldName: 'Max-Forwards', fieldValue: '70'
                    }, {
                        fieldName: 'Call-ID', fieldValue: '987asjd97y7atg'
                    }, {
                        fieldName: 'CSeq', fieldValue: '986759 ACK'
                    }],
                    content: '',
                };
                const stringified = stringify(exampleRequest);
                expect(stringified.startsWith('ACK sips:test@google.com SIP/2.0\r\n')).toBe(true);
            });
            it('should stringify the startline with a defined port', () => {
                const exampleRequest = {
                    method: 'ACK',
                    requestUri: { user: 'test', host: 'google.com', port: 2923 },
                    version: '2.0',
                    headers: [{
                        fieldName: 'Via',
                        fieldValue: 'SIP/2.0/UDP pc33.atlanta.com',
                        parameters: [{ name: 'branch', value: 'z9hG4bKkjshdyff' }],
                    }, {
                        fieldName: 'To',
                        fieldValue: 'Bob <sip:bob@biloxi.com>',
                        parameters: [{ name: 'tag', value: '99sa0xk' }],
                    }, {
                        fieldName: 'From',
                        fieldValue: 'Alice <sip:alice@atlanta.com>',
                        parameters: [{ name: 'tag', value: '88sja8x' }],
                    }, {
                        fieldName: 'Max-Forwards', fieldValue: '70'
                    }, {
                        fieldName: 'Call-ID', fieldValue: '987asjd97y7atg'
                    }, {
                        fieldName: 'CSeq', fieldValue: '986759 ACK'
                    }],
                    content: '',
                };
                const stringified = stringify(exampleRequest);
                expect(stringified.startsWith('ACK sip:test@google.com:2923 SIP/2.0\r\n')).toBe(true);
            });
        });
        describe('full request', () => {
            it('should build a complete request string', () => {
                const exampleRequest = {
                    method: 'ACK',
                    requestUri: { user: 'test', host: 'google.com', port: 2923 },
                    version: '2.0',
                    headers: [{
                        fieldName: 'Via',
                        fieldValue: 'SIP/2.0/UDP pc33.atlanta.com',
                        parameters: [{ name: 'branch', value: 'z9hG4bKkjshdyff' }],
                    }, {
                        fieldName: 'To',
                        fieldValue: 'Bob <sip:bob@biloxi.com>',
                        parameters: [{ name: 'tag', value: '99sa0xk' }],
                    }, {
                        fieldName: 'From',
                        fieldValue: 'Alice <sip:alice@atlanta.com>',
                        parameters: [{ name: 'tag', value: '88sja8x' }],
                    }, {
                        fieldName: 'Max-Forwards', fieldValue: '70'
                    }, {
                        fieldName: 'Call-ID', fieldValue: '987asjd97y7atg'
                    }, {
                        fieldName: 'CSeq', fieldValue: '986759 ACK'
                    }],
                    content: '',
                };
                const stringified = stringify(exampleRequest);
                const expectedResult = 'ACK sip:test@google.com:2923 SIP/2.0\r\n' +
                'Via: SIP/2.0/UDP pc33.atlanta.com;branch=z9hG4bKkjshdyff\r\n' +
                'To: Bob <sip:bob@biloxi.com>;tag=99sa0xk\r\n' +
                'From: Alice <sip:alice@atlanta.com>;tag=88sja8x\r\n' +
                'Max-Forwards: 70\r\n' +
                'Call-ID: 987asjd97y7atg\r\n' +
                'CSeq: 986759 ACK\r\n\r\n';
                expect(stringified).toBe(expectedResult);
            });
        });
    });
    describe('response', () => {
        describe('full example', () => {
            it('should build a correct response string', () => {
                const responseObject: SIPResponse = {
                    version: '2.0',
                    statusCode: 200,
                    reason: 'OK',
                    headers: [{
                        fieldName: 'Via', fieldValue: 'SIP/2.0/UDP server10.biloxi.com',
                        parameters: [
                            { name: 'branch', value: 'z9hG4bKnashds8' },
                            { name: 'received', value: '192.0.2.3' }
                        ]
                    }, {
                        fieldName: 'Via', fieldValue: 'SIP/2.0/UDP bigbox3.site3.atlanta.com',
                        parameters: [
                            { name: 'branch', value: 'z9hG4bK77ef4c2312983.1' },
                            { name: 'received', value: '192.0.2.2' }
                        ]
                    }, {
                        fieldName: 'Via', fieldValue: 'SIP/2.0/UDP pc33.atlanta.com',
                        parameters: [
                            { name: 'branch', value: 'z9hG4bK776asdhds ' },
                            { name: 'received', value: '192.0.2.1' }
                        ]
                    }, {
                        fieldName: 'To', fieldValue: 'Bob <sip:bob@biloxi.com>',
                        parameters: [
                            { name: 'tag', value: 'a6c85cf' },
                        ]
                    }, {
                        fieldName: 'From', fieldValue: 'Alice <sip:alice@atlanta.com>',
                        parameters: [
                            { name: 'tag', value: '1928301774' },
                        ]
                    }, {
                        fieldName: 'Call-ID', fieldValue: 'a84b4c76e66710@pc33.atlanta.com',
                    }, {
                        fieldName: 'CSeq', fieldValue: '314159 INVITE',
                    }, {
                        fieldName: 'Contact', fieldValue: '<sip:bob@192.0.2.4>',
                    }, {
                        fieldName: 'Content-Type', fieldValue: 'application/sdp',
                    }, {
                        fieldName: 'Content-Length', fieldValue: '131',
                    }],
                    content: ''
                };
                const stringified = stringify(responseObject);
                const expectedResult =
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

                expect(stringified).toBe(expectedResult);
            });
        });
    });
});
