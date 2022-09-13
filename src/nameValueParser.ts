import { NameValuePair } from './types';

export function parseNameValuePairs(input: string): NameValuePair[] {
    if (!input)
        return [];

    const paramList: NameValuePair[] = [];
    const params = input.split(';').map(str => str.trim());
    for (const param in params) {
        const [paramName, paramValue] = param.split('=').map(str => str.trim());
        paramList.push({
            name: paramName,
            value: paramValue
        });
    }
    return paramList;
}
