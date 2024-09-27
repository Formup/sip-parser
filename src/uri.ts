import { parseNameValuePairs, stringifyNameValuePairs } from './nameValueParser';
import { SipUri } from './types';

const SipUriRegexp = /sip(?<secure>s?):(?:(?<user>[^@]+)@)?(?<host>[\w.-]+)(?::?(?<port>\d+))?(?:;(?<params>[\w.\-=;]+))?/u;

export function parseUri(uriString: string): SipUri {
    // Matches the username, the host and optionally a port.
    const uriMatches = uriString.match(SipUriRegexp);
    if (!uriMatches || !uriMatches.groups)
        throw new Error('Given string was not a valid URI: ' + uriString);

    const params = parseNameValuePairs(uriMatches.groups.params);
    return {
        secure: uriMatches.groups.secure === 's' || undefined,
        user: uriMatches.groups.user,
        host: uriMatches.groups.host,
        port: uriMatches.groups.port ? parseInt(uriMatches.groups.port) : undefined,
        parameters: params.length > 0 ? params : undefined,
    };
}

export function stringifyUri(uri: SipUri): string {
    let sipString = `sip${uri.secure === true ? 's' : ''}:`;

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
