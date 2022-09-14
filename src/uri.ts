import { parseNameValuePairs } from './nameValueParser';
import { SipUri } from './types';

export function parseUri(uriString: string): SipUri {
    // Matches the username, the host and optionally a port.
    const uriMatches = uriString.match(/sip:(\w+)@([\w.-]+)(?::?(\d+))?(?:;([\w.\-=;]+))?/);
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
    const withoutPort = `sip:${uri.user}@${uri.host}`;
    return uri.port ? `${withoutPort}:${uri.port}` : withoutPort;
}
