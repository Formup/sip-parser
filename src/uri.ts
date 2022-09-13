export interface SipUri {
    host: string,
    user: string,
    port: number | undefined,
}

export function parseUri(uriString: string): SipUri {
    // Matches the username, the host and optionally a port.
    const uriMatches = uriString.match(/sip:(\w+)@(\w+\.\w+)(?::?(\d+))?/);
    if (!uriMatches)
        throw new Error('Given string was not a valid URI: ' + uriString);

    return {
        user: uriMatches[1],
        host: uriMatches[2],
        port: uriMatches[3] ? parseInt(uriMatches[3]) : undefined,
    };
}
