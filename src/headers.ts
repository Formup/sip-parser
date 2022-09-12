export interface Header {
    fieldName: string,
    fieldValue: string,
    parameters?: HeaderParameter[],
}

export interface HeaderParameter {
    parameterName: string,
    parameterValue: string,
}

export function parseHeaderLine(headerLine: string): Header[] {
    const headerNameAndValues = matchHeaderLine(headerLine);
    if (!headerNameAndValues)
        throw new Error('Invalid header line ' + headerLine);

    const headerName = headerNameAndValues[1];
    const headerValues = headerNameAndValues[2].split(',').map(part => part.trim());
    return headerValues.map(headerVal => buildSingleHeader(headerName, headerVal));
}

function buildSingleHeader(headerName: string, headerValue: string): Header {
    const fieldValueAndParams = matchHeaderValue(headerValue);
    if (!fieldValueAndParams)
        throw new Error('Could not parse header value from ' + headerValue);

    const fieldValue = fieldValueAndParams[1];
    const parameters: HeaderParameter[] = [];
    for (let i = 2; i < fieldValueAndParams.length; i += 2) {
        const parameterName = fieldValueAndParams[i];
        const parameterValue = fieldValueAndParams[i + 1];
        if (!parameterName || !parameterValue)
            continue;
        parameters.push({ parameterName, parameterValue });
    }
    return {
        fieldName: headerName,
        fieldValue: fieldValue,
        parameters: parameters.length > 0 ? parameters : undefined,
    };
}

function matchHeaderLine(headerLine: string) {
    // Matches the field name and the entire field value, including potentially multiple header values with parameters.
    return headerLine.match(/([A-Za-z-]+)\s*:\s*([\w\s\-;,=<>@:./]*[\w\-<>@:.])/);
}

function matchHeaderValue(headerValue: string) {
    // Matches the header value, potentially with whitespace in the middle, followed by parameters.
    return headerValue.match(/([\w\-<>@:./]*(?:\s*[\w\-<>@:./]+)*)\s*(?:;\s*([\w-]+)=([\w@<>\-:.]+))*/);
}
