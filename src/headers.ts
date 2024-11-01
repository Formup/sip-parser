import { parseNameValuePairs, stringifyNameValuePairs } from './nameValueParser';
import { splitIfNotBetween } from './stringUtils';
import { Header, NameValuePair } from './types';

export function parseHeaderLine(headerLine: string): Header[] {
    const headerNameAndValues = matchHeaderLine(headerLine);
    if (!headerNameAndValues)
        throw new Error('Invalid header line ' + headerLine);

    const headerName = headerNameAndValues[1].trim();
    if (isAuthHeader(headerName)) {
        return [parseAuthHeaderLine(headerName, headerNameAndValues[2])];
    } else {
        return parseNormalHeaderLine(headerName, headerNameAndValues[2]);
    }
}

function parseNormalHeaderLine(headerName: string, fullHeaderValueString: string) {
    const headerValues = splitNormalHeaderValues(fullHeaderValueString);
    return headerValues.map(headerVal => buildSingleHeader(headerName, headerVal));
}

function splitNormalHeaderValues(valuesString: string): string[] {
    /*
        We split the values by commas, but we need to be careful with
          * commas inside quoted strings
          * escaped quotes inside quoted strings (e.g. "this is a quote \"")
        see RFC 3261 section 25.1 "quoted-string"
     */
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    let escapeNext = false;

    for(const char of valuesString) {
        if (escapeNext) {
            escapeNext = false;
        } else if (char === '\\') {
            escapeNext = true;
        } else if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
            continue;
        }
        current += char;
    }

    return result.concat(current.trim());
}

function buildSingleHeader(headerName: string, headerValue: string): Header {
    const fieldValueAndParams = splitFieldValueAndParams(headerValue);
    const fieldValue = fieldValueAndParams[0].trim();
    const paramsString = fieldValueAndParams.slice(1).join(';');
    const parameters = parseNameValuePairs(paramsString);
    return {
        fieldName: headerName,
        fieldValue: fieldValue,
        parameters: parameters.length > 0 ? parameters : undefined,
    };
}

function matchHeaderLine(headerLine: string) {
    // Returns two groups:
    // 1. Header name
    // 2. All values that come after the colon
    return headerLine.match(/([A-Za-z-]+):(.+)/);
}

function splitFieldValueAndParams(headerValue: string): string[] {
    // Returns two strings:
    // 1. Header field value
    // 2. (Optional) The parameter string of the header value, if exists
    // We want to split the input from the position of the first semicolon that is not between angled brackets.
    // We avoid using regex lookbehind, because it's still not fully supported by JavaScriptCore (engine running
    // Safari and React Native, for instance).
    // Instead, we traverse the string character by character and keep track of angled brackets on the go.
    let splitIndex = -1;
    let openAngledBrackets = 0;
    for (let i = 0; i < headerValue.length; i++) {
        const char = headerValue[i];
        if (char === '<') {
            openAngledBrackets++;
            continue;
        }
        if (openAngledBrackets === 0) {
            if (char === ';') {
                splitIndex = i;
                break;
            }
        }
        else if (headerValue[i] === '>') {
            openAngledBrackets--;
        }
    }
    if (splitIndex === -1)
        return [headerValue];

    if (splitIndex === 0)
        throw new Error('Invalid header value, cannot start with a semicolon: ' + headerValue.slice(10));

    return [headerValue.slice(0, splitIndex), headerValue.slice(splitIndex + 1)];
}

// Auth-related strings must be handles differently, as explained in RFC3261 chapter 7.3.1
function parseAuthHeaderLine(headerName: string, headerValueString: string) {
    const headerAndParams = splitAuthFieldValueAndParams(headerValueString);
    if (headerAndParams == null) {
        throw new Error(`Invalid authentication header ${headerName} ${headerValueString}`);
    }
    const headerValue = headerAndParams[1].trim();
    const headerParamsString = headerAndParams[2].trim();
    // const headerParamPieces = headerParamsString.split(',');
    const headerParamPieces = splitIfNotBetween(headerParamsString, ',', '"');
    const headerParams = headerParamPieces.flatMap(piece => parseNameValuePairs(piece.replaceAll('"', '')));
    return {
        fieldName: headerName,
        fieldValue: headerValue,
        parameters: headerParams,
    };
}

function splitAuthFieldValueAndParams(headerValue: string) {
    return headerValue.match(/([A-Za-z-]+)\s+([\w\s\-,~!<>="@:./]+)/);
}

export function stringifyHeader(header: Header): string {
    const parameterless = `${header.fieldName}: ${header.fieldValue}`;

    if (header.parameters && header.parameters.length > 0) {
        const parameters = isAuthHeader(header.fieldName) ? stringifyAuthHeaderParams(header.parameters) : stringifyNameValuePairs(header.parameters);
        return parameterless + parameters;
    }
    return parameterless;
}

function stringifyAuthHeaderParams(params: NameValuePair[]) {
    const noQuotesValues = ['algorithm', 'stale'];
    const paramStrings = params.map(pair => {
        const quotedParamValue = noQuotesValues.includes(pair.name.toLowerCase()) ?
            (pair.value || '') :
            `"${pair.value || ''}"`;
        return `${pair.name}=${quotedParamValue}`;
    });
    return ' ' + paramStrings.join(', ');
}

function isAuthHeader(headerName: string) {
    const authHeaderNames = [
        'www-authenticate', 'authorization',
        'proxy-authenticate', 'proxy-authorization'
    ];
    return authHeaderNames.includes(headerName.toLowerCase().trim());
}
