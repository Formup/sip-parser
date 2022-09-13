import { SipUri } from './types';

// TODO: URIs can also have parameters to them: Record-Route: <sip:p2.example.com;lr>

export function parseUri(uriString: string): SipUri {
    // Matches the username, the host and optionally a port.
    const uriMatches = uriString.match(/sip:(\w+)@([\w.-]+)(?::?(\d+))?/);
    if (!uriMatches)
        throw new Error('Given string was not a valid URI: ' + uriString);

    return {
        user: uriMatches[1],
        host: uriMatches[2],
        port: uriMatches[3] ? parseInt(uriMatches[3]) : undefined,
    };
}

export function stringifyUri(uri: SipUri): string {
    const withoutPort = `sip:${uri.user}@${uri.host}`;
    return uri.port ? `${withoutPort}:${uri.port}` : withoutPort;
}
