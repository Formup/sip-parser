import { stringify } from '../stringifier';

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

describe('stringify', () => {
    describe('request', () => {
        describe('start line', () => {
            it('should stringify the startline without a defined port', () => {
                const stringified = stringify(exampleRequest);
                expect(stringified.startsWith('ACK sip:test@google.com SIP/2.0\r\n')).toBe(true);
            });
        });
    });
});
