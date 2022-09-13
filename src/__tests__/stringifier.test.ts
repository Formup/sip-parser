import { stringify } from '../stringifier';

describe('stringify', () => {
    describe('request', () => {
        describe('start line', () => {
            it('should stringify the startline without a defined port', () => {
                // This request is build based on the example on page 130 of RFC 3261.
                const exampleRequest = {
                    method: 'ACK',
                    requestUri: {
                        user: 'test',
                        host: 'google.com',
                    },
                    version: '2.0',
                    headers: [{
                        fieldName: 'Via',
                        fieldValue: 'SIP/2.0/UDP pc33.atlanta.com',
                        parameters: [{
                            parameterName: 'branch',
                            parameterValue: 'z9hG4bKkjshdyff',
                        }],
                    }, {
                        fieldName: 'To',
                        fieldValue: 'Bob <sip:bob@biloxi.com>',
                        parameters: [{
                            parameterName: 'tag',
                            parameterValue: '99sa0xk',
                        }],
                    }, {
                        fieldName: 'From',
                        fieldValue: 'Alice <sip:alice@atlanta.com>',
                        parameters: [{
                            parameterName: 'tag',
                            parameterValue: '88sja8x',
                        }],
                    }, {
                        fieldName: 'Max-Forwards',
                        fieldValue: '70',
                    }, {
                        fieldName: 'Call-ID',
                        fieldValue: '987asjd97y7atg',
                    }, {
                        fieldName: 'CSeq',
                        fieldValue: '986759 ACK',
                    }],
                    content: '',
                };
                const stringified = stringify(exampleRequest);
                expect(stringified.startsWith('ACK sip:test@google.com SIP/2.0\r\n')).toBe(true);
            });
            it('should stringify the startline with a defined port', () => {
                const exampleRequest = {
                    method: 'ACK',
                    requestUri: {
                        user: 'test',
                        host: 'google.com',
                        port: 2923
                    },
                    version: '2.0',
                    headers: [{
                        fieldName: 'Via',
                        fieldValue: 'SIP/2.0/UDP pc33.atlanta.com',
                        parameters: [{
                            parameterName: 'branch',
                            parameterValue: 'z9hG4bKkjshdyff',
                        }],
                    }, {
                        fieldName: 'To',
                        fieldValue: 'Bob <sip:bob@biloxi.com>',
                        parameters: [{
                            parameterName: 'tag',
                            parameterValue: '99sa0xk',
                        }],
                    }, {
                        fieldName: 'From',
                        fieldValue: 'Alice <sip:alice@atlanta.com>',
                        parameters: [{
                            parameterName: 'tag',
                            parameterValue: '88sja8x',
                        }],
                    }, {
                        fieldName: 'Max-Forwards',
                        fieldValue: '70',
                    }, {
                        fieldName: 'Call-ID',
                        fieldValue: '987asjd97y7atg',
                    }, {
                        fieldName: 'CSeq',
                        fieldValue: '986759 ACK',
                    }],
                    content: '',
                };
                const stringified = stringify(exampleRequest);
                expect(stringified.startsWith('ACK sip:test@google.com:2923 SIP/2.0\r\n')).toBe(true);
            })
        });
        describe('full request', () => {
            const exampleRequest = {
                method: 'ACK',
                requestUri: {
                    user: 'test',
                    host: 'google.com',
                    port: 2923
                },
                version: '2.0',
                headers: [{
                    fieldName: 'Via',
                    fieldValue: 'SIP/2.0/UDP pc33.atlanta.com',
                    parameters: [{
                        parameterName: 'branch',
                        parameterValue: 'z9hG4bKkjshdyff',
                    }],
                }, {
                    fieldName: 'To',
                    fieldValue: 'Bob <sip:bob@biloxi.com>',
                    parameters: [{
                        parameterName: 'tag',
                        parameterValue: '99sa0xk',
                    }],
                }, {
                    fieldName: 'From',
                    fieldValue: 'Alice <sip:alice@atlanta.com>',
                    parameters: [{
                        parameterName: 'tag',
                        parameterValue: '88sja8x',
                    }],
                }, {
                    fieldName: 'Max-Forwards',
                    fieldValue: '70',
                }, {
                    fieldName: 'Call-ID',
                    fieldValue: '987asjd97y7atg',
                }, {
                    fieldName: 'CSeq',
                    fieldValue: '986759 ACK',
                }],
                content: '',
            };
            const stringified = stringify(exampleRequest);
            expect(stringified).toBe('ACK sip:test@google.com:2923 SIP/2.0\r\n' +
                'Via: SIP/2.0/UDP pc33.atlanta.com;branch=z9hG4bKkjshdyff\r\n' +
                'To: Bob <sip:bob@biloxi.com>;tag=99sa0xk\r\n' +
                'From: Alice <sip:alice@atlanta.com>;tag=88sja8x\r\n' +
                'Max-Forwards: 70\r\n' +
                'Call-ID: 987asjd97y7atg\r\n' +
                'CSeq: 986759 ACK');
        });
    });
});
