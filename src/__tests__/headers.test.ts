import { parseHeaderLine } from '../headers';

describe('Headers', () => {
    describe('parseHeader', () => {
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
            expect(parameters);
            if (parameters) {
                expect(parameters.length).toBe(1);
                expect(parameters[0].parameterName).toBe('tag');
                expect(parameters[0].parameterValue).toBe('a48s');
            }
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
                expect(parameters1[0].parameterName).toBe('level');
                expect(parameters1[0].parameterValue).toBe('1');
            }
        });
        it.todo('should allow breaking the header on multiple lines');
    });
});
