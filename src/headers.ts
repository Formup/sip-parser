import { parseNameValuePairs } from './nameValueParser';
import { Header } from './types';

export function parseHeaderLine(headerLine: string): Header[] {
    const headerNameAndValues = matchHeaderLine(headerLine);
    if (!headerNameAndValues)
        throw new Error('Invalid header line ' + headerLine);

    const headerName = headerNameAndValues[1].trim();
    const authHeaderNames = [
        'www-authenticate', 'authorization',
        'proxy-authenticate', 'proxy-authorization'
    ];
    if (authHeaderNames.includes(headerName.toLowerCase())) {
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
    return valuesString.split(',').map(part => part.trim());
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

// Auth-related strings must be handles differently, as explained in RFC3261 chapter 7.3.1
function parseAuthHeaderLine(headerName: string, headerValueString: string) {
    const headerAndParams = splitAuthFieldValueAndParams(headerValueString);
    if (headerAndParams == null) {
        throw new Error(`Invalid authentication header ${headerName} ${headerValueString}`);
    }
    const headerValue = headerAndParams[1].trim();
    const headerParamsString = headerAndParams[2];
    const headerParamPieces = headerParamsString.split(',');
    const headerParams = headerParamPieces.flatMap(piece => parseNameValuePairs(piece.replaceAll('"', '')));
    return {
        fieldName: headerName,
        fieldValue: headerValue,
        parameters: headerParams,
    };
}

function matchHeaderLine(headerLine: string) {
    // Matches the field name and the entire field value, including potentially multiple header values with parameters.
    return headerLine.match(/([A-Za-z-]+):([\w\s\-;,=~<>!@:./"]+)/);
}

function splitFieldValueAndParams(headerValue: string): string[] {
    // Matches the header value, potentially with whitespace in the middle, followed by parameters.
    return headerValue.split(/(?<!<[^>]*);(?![^<]*>)/);
}

function splitAuthFieldValueAndParams(headerValue: string) {
    return headerValue.match(/([A-Za-z-]+)\s+([\w\s\-,~!<>="@:.\/]+)/);
}

export function stringifyHeader(header: Header): string {
    const parameterless = `${header.fieldName}: ${header.fieldValue}`;
    let parameters = '';
    if (header.parameters && header.parameters.length > 0) {
        const keyValueStrings = header.parameters.map(param => `${param.name}=${param.value}`);
        parameters = ';' + keyValueStrings.join(';');
    }
    return parameterless + parameters;
}
