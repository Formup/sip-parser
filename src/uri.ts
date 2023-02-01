import { parseNameValuePairs, stringifyNameValuePairs } from './nameValueParser';
import { SipUri } from './types';

export function parseUri(uriString: string): SipUri {
    // Matches the username, the host and optionally a port.
    const uriMatches = uriString.match(/sip:(?:([\w.]+)@)?([\w.-]+)(?::?(\d+))?(?:;([\w.\-=;]+))?/);
    if (!uriMatches)
        throw new Error('Given string was not a valid URI: ' + uriString);

    const params = parseNameValuePairs(uriMatches[4]);
    return {
        user: uriMatches[1],
        host: uriMatches[2],
        port: uriMatches[3] ? parseInt(uriMatches[3]) : undefined,
        parameters: params.length > 0 ? params : undefined,
    };
}

export function stringifyUri(uri: SipUri): string {
    let sipString = 'sip:';

    if (uri.user)
        sipString += `${uri.user}@`;

    sipString += uri.host;

    if (uri.port)
        sipString += `:${uri.port}`;

    if (uri.parameters) {
        sipString += stringifyNameValuePairs(uri.parameters);
        sipString = `<${sipString}>`;
    }
    return sipString;
}
