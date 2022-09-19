import { parseHeaderLine } from './headers';
import { parseUri } from './uri';
import { SIPMessage, SIPRequest, SIPResponse } from './types';

export function parse(rawMessage: string): SIPMessage {
    const startLine = isolateStartLine(rawMessage);
    const headerLines = isolateHeaderLines(rawMessage);
    const contentLines = isolateContentLines(rawMessage);

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

function isolateStartLine(messageString: string): string {
    return messageString.split('\r\n')[0];
}

function isolateHeaderLines(messageString: string): string[] {
    const endOfHeaders = messageString.indexOf('\r\n\r\n');
    if (endOfHeaders === -1)
        throw new Error('Could not find an empty line indicating the end of headers.');

    const headerLines = messageString.slice(0, endOfHeaders).split('\r\n').slice(1);

    // Headers can be split into multiple lines. If a line starts with whitespace, it's combined to the previous line.
    const combinedLines: string[] = [];
    for (let line of headerLines) {
        const startWhiteSpace = line.match(/^\s+/);
        if (startWhiteSpace) {
            if (combinedLines.length === 0)
                throw new Error('The first header line cannot start with a whitespace: ' + line);

            combinedLines[combinedLines.length-1] += ` ${line.trimStart()}`;
        } else {
            combinedLines.push(line);
        }
    }
    return combinedLines;
}

function isolateContentLines(messageString: string): string[] {
    const endOfHeaders = messageString.indexOf('\r\n\r\n');
    if (endOfHeaders === -1)
        throw new Error('Could not find an empty line indicating the end of headers.');

    return messageString.slice(endOfHeaders + '\r\n\r\n'.length).split('\r\n');
}

function matchRequestLine(startLine: string) {
    // Matches the method, request URI and SIP version.
    return startLine.match(/([A-Z]+)\s(sip:(?:[\w-]+@)?[\w\-.]+(?::\d+)?)\sSIP\/(\d\.\d)/);
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
