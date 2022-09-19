import { parseNameValuePairs } from './nameValueParser';
import { Header } from './types';

export function parseHeaderLine(headerLine: string): Header[] {
    const headerNameAndValues = matchHeaderLine(headerLine);
    if (!headerNameAndValues)
        throw new Error('Invalid header line ' + headerLine);

    const headerName = headerNameAndValues[1].trim();
    const headerValues = splitHeaderValues(headerNameAndValues[2]);
    return headerValues.map(headerVal => buildSingleHeader(headerName, headerVal));
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

function splitHeaderValues(valuesString: string): string[] {
    return valuesString.split(',').map(part => part.trim());
}

function matchHeaderLine(headerLine: string) {
    // Returns two groups:
    // 1. Header name
    // 2. All values that come after the colon
    return headerLine.match(/([A-Za-z-]+):([\w\s\-;,=~<>!@:./"]+)/);
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

export function stringifyHeader(header: Header): string {
    const parameterless = `${header.fieldName}: ${header.fieldValue}`;
    let parameters = '';
    if (header.parameters && header.parameters.length > 0) {
        const keyValueStrings = header.parameters.map(param => `${param.name}=${param.value}`);
        parameters = ';' + keyValueStrings.join(';');
    }
    return parameterless + parameters;
}
