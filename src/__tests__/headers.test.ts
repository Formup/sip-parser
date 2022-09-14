import { parseHeaderLine, stringifyHeader } from '../headers';

describe('parse header', () => {
    it('should parse a alphabetical header without parameters', () => {
        const headerLine = 'content-disposition: session';
        const parsedHeaders = parseHeaderLine(headerLine);
        expect(parsedHeaders.length).toBe(1);
        const header = parsedHeaders[0];
        expect(header.fieldName).toBe('content-disposition');
        expect(header.fieldValue).toBe('session');
    });
    it('should allow whitespace in the header value', () => {
        const headerLine = 'CSeq: 63104 OPTIONS';
        const parsedHeaders = parseHeaderLine(headerLine);
        expect(parsedHeaders.length).toBe(1);
        const header = parsedHeaders[0];
        expect(header.fieldName).toBe('CSeq');
        expect(header.fieldValue).toBe('63104 OPTIONS');
    });
    it('should allow multiple values on the same line', () => {
        const headerLine = 'Route: <sip:alice@atlanta.com>,<sip:bob@biloxi.com>';
        const parsedHeaders = parseHeaderLine(headerLine);
        expect(parsedHeaders.length).toBe(2);
        expect(parsedHeaders[0].fieldName).toBe('Route');
        expect(parsedHeaders[1].fieldName).toBe('Route');
        expect(parsedHeaders[0].fieldValue).toBe('<sip:alice@atlanta.com>');
        expect(parsedHeaders[1].fieldValue).toBe('<sip:bob@biloxi.com>');
    });
    it('should ignore whitespace between values', () => {
        const headerLine = 'Route: <sip:alice@atlanta.com> ,  <sip:bob@biloxi.com>';
        const parsedHeaders = parseHeaderLine(headerLine);
        expect(parsedHeaders.length).toBe(2);
        expect(parsedHeaders[0].fieldName).toBe('Route');
        expect(parsedHeaders[1].fieldName).toBe('Route');
        expect(parsedHeaders[0].fieldValue).toBe('<sip:alice@atlanta.com>');
        expect(parsedHeaders[1].fieldValue).toBe('<sip:bob@biloxi.com>');
    });
    it('should not add parameters if they do not exist', () => {
        const headerLine = 'Route: Alice <sip:alice@atlanta.com>';
        const parsedHeaders = parseHeaderLine(headerLine);
        expect(parsedHeaders.length).toBe(1);
        expect(parsedHeaders[0].parameters).toBeUndefined();
    });
    it('should allow parameters headers', () => {
        const headerLine = 'From: "Bob" <sips:bob@biloxi.com> ;tag=a48s';
        const parsedHeaders = parseHeaderLine(headerLine);
        expect(parsedHeaders.length).toBe(1);
        const parameters = parsedHeaders[0].parameters;
        expect(parameters).toBeTruthy();
        if (parameters) {
            expect(parameters.length).toBe(1);
            expect(parameters[0].name).toBe('tag');
            expect(parameters[0].value).toBe('a48s');
        }
    });
    it('should allow multiple parameters for a header', () => {
        const headerLine = 'Via: SIP/2.0/UDP 192.0.2.1:5060 ;received=192.0.2.207;branch=z9hG4bK77asjd'
        const parsedHeaders = parseHeaderLine(headerLine);
        expect(parsedHeaders.length).toBe(1);
        expect(parsedHeaders[0].fieldName).toBe('Via');
        expect(parsedHeaders[0].fieldValue).toBe('SIP/2.0/UDP 192.0.2.1:5060');
        expect(parsedHeaders[0].parameters).toBeDefined();
        expect(parsedHeaders[0].parameters?.length).toBe(2);
        if (parsedHeaders[0].parameters) {
            expect(parsedHeaders[0].parameters[0].name).toBe('received');
            expect(parsedHeaders[0].parameters[0].value).toBe('192.0.2.207');
            expect(parsedHeaders[0].parameters[1].name).toBe('branch');
            expect(parsedHeaders[0].parameters[1].value).toBe('z9hG4bK77asjd');
        }
    });
    it('should allow URI with parameters in the header value', () => {
        /*
        The Contact, From, and To header fields contain a URI.  If the URI
        contains a comma, question mark or semicolon, the URI MUST be
        enclosed in angle brackets (< and >).  Any URI parameters are
        contained within these brackets.  If the URI is not enclosed in angle
        brackets, any semicolon-delimited parameters are header-parameters,
        not URI parameters.
        */
        const headerLine = 'Contact: "Mr. Watson" <sip:watson@worcester.bell-telephone.com;custom=abc123>;q=0.7; expires=3600';
        const parsedHeaders = parseHeaderLine(headerLine);
        expect(parsedHeaders.length).toBe(1);
        const header = parsedHeaders[0];
        expect(header.fieldName).toBe('Contact');
        expect(header.fieldValue).toBe('"Mr. Watson" <sip:watson@worcester.bell-telephone.com;custom=abc123>');
        expect(header.parameters?.length).toBe(2);
        expect(header.parameters).toEqual([{
            name: 'q', value: '0.7'
        }, {
            name: 'expires', value: '3600'
        }]);
    });
    it('should allow parameters for multiple header values', () => {
        const headerLine = 'Accept: application/sdp;level=1, application/x-private, text/html';
        const parsedHeaders = parseHeaderLine(headerLine);
        expect(parsedHeaders.length).toBe(3);
        const parameters1 = parsedHeaders[0].parameters;
        const parameters2 = parsedHeaders[1].parameters;
        expect(parameters1).toBeDefined();
        expect(parameters2).toBeUndefined();
        if (parameters1) {
            expect(parameters1.length).toBe(1);
            expect(parameters1[0].name).toBe('level');
            expect(parameters1[0].value).toBe('1');
        }
    });
    it.todo('should allow breaking the header on multiple lines');
});

describe('stringify header', () => {
    it('should handle parameterless headers', () => {
        const header = {
            fieldName: 'Call-ID',
            fieldValue: '987asjd97y7atg',
        };
        const stringified = stringifyHeader(header);
        expect(stringified).toBe('Call-ID: 987asjd97y7atg');
    });
    it('should not add params if the parameters field is an empy list', () => {
        const header = {
            fieldName: 'Call-ID',
            fieldValue: '987asjd97y7atg',
            parameters: []
        };
        const stringified = stringifyHeader(header);
        expect(stringified).toBe('Call-ID: 987asjd97y7atg');
    });
    it('should handle a single parameter', () => {
        const header = {
            fieldName: 'From',
            fieldValue: 'Alice <sip:alice@atlanta.com>',
            parameters: [{
                name: 'tag',
                value: '88sja8x',
            }],
        };
        const stringified = stringifyHeader(header);
        expect(stringified).toBe('From: Alice <sip:alice@atlanta.com>;tag=88sja8x');
    });
    it('should handle multiple parameters', () => {
        const header = {
            fieldName: 'From',
            fieldValue: 'Alice <sip:alice@atlanta.com>',
            parameters: [{
                name: 'tag',
                value: '88sja8x',
            }, {
                name: 'custom',
                value: 'abc123',
            }],
        };
        const stringified = stringifyHeader(header);
        expect(stringified).toBe('From: Alice <sip:alice@atlanta.com>;tag=88sja8x;custom=abc123');
    });
});
