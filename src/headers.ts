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
    // Matches the field name and the entire field value, including potentially multiple header values with parameters.
    return headerLine.match(/([A-Za-z-]+):([\w\s\-;,=<>@:./"]+)/);
}

function splitFieldValueAndParams(headerValue: string): string[] {
    // Matches the header value, potentially with whitespace in the middle, followed by parameters.
    return headerValue.split(/(?<!<[^>]*);(?![^<]*>)/);
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
