export type SIPMessage = SIPRequest | SIPResponse;

export interface SIPRequest {
    method: string,
    requestUri: SipUri,
    version: string,
    headers: Header[],
    content: string,
}

export interface SIPResponse {
    version: string,
    statusCode: number,
    reason: string,
    headers: Header[],
    content: string,
}

export interface SipUri {
    secure?: boolean,
    host: string,
    user?: string,
    port?: number,
    parameters?: NameValuePair[];
}

export interface Header {
    fieldName: string,
    fieldValue: string,
    parameters?: NameValuePair[],
}

export interface NameValuePair {
    name: string,
    value?: string,
}
