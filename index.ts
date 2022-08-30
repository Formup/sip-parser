type SIPMessage = SIPRequest | SIPResponse;

interface SIPRequest {
    method: string,
    requestUri: SipUri,
    version: '2.0'
    content: string
}

interface SipUri {
    host: 'string',
    user: 'string',
    port: number | undefined,
}

interface SIPResponse {
    version: '2.0',
    statusCode: number,
    reason: string
}

export function parse(rawMessage: string): SIPMessage {
    const messageLines = rawMessage.split('\r\n');
    const startLine = messageLines[0];
    const requestLineMatches = matchRequestLine(startLine);
    if (requestLineMatches)
        return parseRequest();

    const statusLineMatches = matchStatusLine(startLine);
    if (statusLineMatches)
        return parseResponse();
    
    throw new Error('Message start line was neither valid request line nor valid status line: ' + startLine);
}

function matchRequestLine(startLine: string) {
    // Matches the method, request URI and SIP version.
    return startLine.match(/([A-Z]+)\s(sip:[a-zA-Z]+@[a-zA-Z]+\.[a-zA-Z]+)\sSIP\/(\d\.\d)/);
}

function matchStatusLine(startLine: string) {
    // Matches the version, status code and reason string.
    return startLine.match(/SIP\/(\d\.\d)\s(\d{3})\s(\w+)/);
}

