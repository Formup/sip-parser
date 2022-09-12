import { parseHeaderLine } from "../headers";

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
        it('should allow multiple values on the same line', () => {
            const headerLine = 'Route: <sip:alice@atlanta.com>, <sip:bob@biloxi.com>';
            const parsedHeaders = parseHeaderLine(headerLine);
            expect(parsedHeaders.length).toBe(2);
            expect(parsedHeaders[0].fieldName).toBe('Route');
            expect(parsedHeaders[1].fieldName).toBe('Route');
            expect(parsedHeaders[0].fieldValue).toBe('<sip:alice@atlanta.com>');
            expect(parsedHeaders[1].fieldValue).toBe('<sip:bob@biloxi.com>');
        });
        it.todo('should allow parameters for a single header value');
        it.todo('should allow parameters for multiple header values');
        it.todo('should allow breaking the header on multiple lines');
    });
});
