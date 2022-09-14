import { parseHeaderLine } from './headers';
import { parseUri } from './uri';
import { SIPMessage, SIPRequest, SIPResponse } from './types';

export function parse(rawMessage: string): SIPMessage {
    const messageLines = rawMessage.split('\r\n');
    const startLine = messageLines[0];
    const headerLines = isolateHeaderLines(messageLines);
    const contentLines = isolateContentLines(messageLines);

    const requestLineMatches = matchRequestLine(startLine);
    if (requestLineMatches) {
        if (requestLineMatches[3] !== '2.0')
            throw new Error('Unsupported SIP version: ' + requestLineMatches[3]);

        return parseRequest(requestLineMatches[1], requestLineMatches[2], headerLines, contentLines);
    }

    const statusLineMatches = matchStatusLine(startLine);
    if (statusLineMatches) {
        if (statusLineMatches[1] !== '2.0')
            throw new Error('Unsupported SIP version: ' + statusLineMatches[1]);

        return parseResponse(parseInt(statusLineMatches[2]), statusLineMatches[3], headerLines, contentLines);
    }

    throw new Error('Message start line was neither a valid request line nor a valid status line: ' + startLine);
}

function isolateHeaderLines(messageLines: string[]): string[] {
    const endOfHeaders = messageLines.findIndex(line => line === '\r\n');
    const headerLines = endOfHeaders === -1 ? messageLines.slice(1) : messageLines.slice(1, endOfHeaders);

    // Headers can be split into multiple lines. If a line starts with whitespace, it's combined to the previous line.
    const compressedLines: string[] = [];
    return headerLines.reduce((allLines, currentLine) => {
        const startWhiteSpace = currentLine.match(/^\s+/);
        if (startWhiteSpace) {
            if (allLines.length === 0)
                throw new Error('The first header line cannot start with a whitespace: ' + currentLine);

            allLines[allLines.length-1] += ` ${currentLine.trimStart()}`;
        } else {
            allLines.push(currentLine);
        }
        return allLines;
    }, compressedLines);
}

function isolateContentLines(messageLines: string[]): string[] {
    const endOfHeaders = messageLines.findIndex(line => line === '\r\n');
    return (endOfHeaders === -1 || endOfHeaders === messageLines.length - 1)
        ? []
        : messageLines.slice(endOfHeaders + 1);
}

function matchRequestLine(startLine: string) {
    // Matches the method, request URI and SIP version.
    return startLine.match(/([A-Z]+)\s(sip:[a-zA-Z]+@[a-zA-Z]+\.[a-zA-Z]+(?::\d+)?)\sSIP\/(\d\.\d)/);
}

function matchStatusLine(startLine: string) {
    // Matches the version, status code and reason string.
    return startLine.match(/SIP\/(\d\.\d)\s(\d{3})\s(\w+)/);
}

function parseRequest(method: string, requestUri: string, headerLines: string[], contentLines: string[]): SIPRequest {
    return {
        method,
        version: '2.0',
        requestUri: parseUri(requestUri),
        headers: headerLines.flatMap(line => parseHeaderLine(line)),
        content: contentLines.join('\r\n'),
    };
}

function parseResponse(statusCode: number, reason: string, headerLines: string[], contentLines: string[]): SIPResponse {
    return {
        version: '2.0',
        statusCode,
        reason,
        headers: headerLines.flatMap(line => parseHeaderLine(line)),
        content: contentLines.join('\r\n'),
    };
}
