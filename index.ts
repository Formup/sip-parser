export type SIPMessage = SIPRequest | SIPResponse;

export interface SIPRequest {
    method: string,
    requestUri: SipUri,
    version: '2.0',
    headers: string,
    content: string,
}

export interface SIPResponse {
    version: '2.0',
    statusCode: number,
    reason: string,
    headers: string,
    content: string,
}

export interface SipUri {
    host: string,
    user: string,
    port: number | undefined,
}

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

function matchRequestLine(startLine: string) {
    // Matches the method, request URI and SIP version.
    return startLine.match(/([A-Z]+)\s(sip:[a-zA-Z]+@[a-zA-Z]+\.[a-zA-Z]+(?::\d+)?)\sSIP\/(\d\.\d)/);
}

function matchStatusLine(startLine: string) {
    // Matches the version, status code and reason string.
    return startLine.match(/SIP\/(\d\.\d)\s(\d{3})\s(\w+)/);
}

function isolateHeaderLines(messageLines: string[]): string[] {
    const endOfHeaders = messageLines.findIndex(line => line === '\r\n');
    return endOfHeaders === -1 ? messageLines.slice(1) : messageLines.slice(1, endOfHeaders);
}

function isolateContentLines(messageLines: string[]): string[] {
    const endOfHeaders = messageLines.findIndex(line => line === '\r\n');
    return (endOfHeaders === -1 || endOfHeaders === messageLines.length - 1) 
        ? [] 
        : messageLines.slice(endOfHeaders + 1);
}

function parseRequest(method: string, requestUri: string, headerLines: string[], contentLines: string[]): SIPRequest { 
    return {
        method,
        version: '2.0',
        requestUri: parseUri(requestUri),
        headers: headerLines.join('\n'),
        content: contentLines.join('\n'),
    };
}

function parseUri(uriString: string): SipUri {
    // Mathces the username, the host and optionally a port.
    const uriMatches = uriString.match(/sip:(\w+)@(\w+\.\w+)(?::?(\d+))?/);
    if (!uriMatches)
        throw new Error('Given sring was not a valid URI: ' + uriString);

    return {
        user: uriMatches[1],
        host: uriMatches[2],
        port: uriMatches[3] ? parseInt(uriMatches[3]) : undefined,
    };
}

function parseResponse(statusCode: number, reason: string, headerLines: string[], contentLines: string[]): SIPResponse {
    return {
        version: '2.0',
        statusCode,
        reason,
        headers: headerLines.join('\n'),
        content: contentLines.join('\n'),
    };
}
