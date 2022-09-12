export interface Header {
    fieldName: string,
    fieldValue: string,
    parameters?: HeaderParameter[],
}

export interface HeaderParameter {
    parameterName: string,
    parameterValue: string
}

export function parseHeaderLine(headerLine: string): Header[] {
    // Matches the header name (alphabet and dash characters), and one or more header values with zero or more parameters
    const headerMatches = headerLine.match(/([A-Za-z-]+)\s*:\s*([\w\s\-;,=<>@:.]*[\w\-<>@:.])/); // TODO: the latter part is not matching all possible characters.
    if (!headerMatches)
        throw new Error('Invalid header line ' + headerLine);

    const headerName = headerMatches[1];
    const headerValueParts = headerMatches[2].split(',');
    const parsedHeaders: Header[] = [];
    for (const headerValuePart of headerValueParts) {
        const headerValueMatches = headerValuePart.match(/([\w\-<>@:.]+)(?:;([\w-]+)=([\w@<>\-:.]+))*/);
        if (!headerValueMatches)
            throw new Error('Could not parse header value from ' + headerValuePart);

        const headerValue = headerValueMatches[1];
        const parameters: HeaderParameter[] = [];
        for (let i = 2; i < headerValueMatches.length; i += 2) {
            const parameterName = headerValueMatches[i];
            const parameterValue = headerValueMatches[i + 1];
            if (!parameterName || !parameterValue)
                continue;
            parameters.push({ parameterName,  parameterValue });
        }
        parsedHeaders.push({fieldName: headerName, fieldValue: headerValue, parameters: parameters || undefined});
    }

    return parsedHeaders
}

