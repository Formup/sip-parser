import { SIPMessage, SIPRequest, SIPResponse } from './types';
import { stringifyUri } from './uri';
import { stringifyHeader } from './headers';

export function stringify(message: SIPMessage): string {
    if ('method' in message) {
        return stringifyRequest(message);
    } else {
        return stringifyResponse(message);
    }
}

function stringifyRequest(message: SIPRequest): string {
    const uriString = stringifyUri(message.requestUri);
    const startLine = `${message.method} ${uriString} SIP/${message.version}`;
    const headerLines = message.headers.map(header => stringifyHeader(header));
    let requestString = startLine + '\r\n';
    requestString += headerLines.join('\r\n');
    if (message.content?.length > 0)
        requestString += `\r\n\r\n${message.content}`;

    return requestString;
}

function stringifyResponse(message: SIPResponse): string {
    return 'not yet implemented';
}
