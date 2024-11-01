# sip-parser
A simple npm package for parsing and stringifying SIP messages.

# Install
`npm install sip-parser`

# Features
* Parse raw SIP messages into JavaScript objects.
* Stringify JS objects into SIP messages.
* Distinguishes requests and responses automatically.
* TypeScript typing.

# Usage
`parse` and `stringify` functions automatically recognize whether the message in question is a request or a response. In the parsed object, requests have a `method` field while responses have a `statusCode` field.
## Requests
### parse()
Use the `parse(message)` function to parse a raw SIP message into a JavaScript object.
```JavaScript
import { parse } from 'sip-parser';

// In a real use case, maybe you get this from a TCP socket.
const messageString =
    'INVITE sip:bob@biloxi.com SIP/2.0\r\n' +
    'Via: SIP/2.0/UDP pc33.atlanta.com;branch=z9hG4bKkjshdyff\r\n' +
    'To: Bob <sip:bob@biloxi.com>\r\n' +
    'From: Alice <sip:alice@atlanta.com>;tag=88sja8x\r\n' +
    'Max-Forwards: 70\r\n' +
    'Subject: I know you are there\r\n' +
    '         pick up the phone\r\n' +
    '         and answer!\r\n' +
    'Call-ID: 987asjd97y7atg\r\n' +
    'CSeq: 986759 INVITE';

const parsedMessage = parse(messageString);

console.log(JSON.stringify(parsedMessage, null, 4));
```
This will print:
```JSON
{
    "method": "INVITE",
    "version": "2.0",
    "requestUri": {
        "user": "bob",
        "host": "biloxi.com"
    },
    "headers": [
        {
            "fieldName": "Via",
            "fieldValue": "SIP/2.0/UDP pc33.atlanta.com",
            "parameters": [
                {
                    "name": "branch",
                    "value": "z9hG4bKkjshdyff"
                }
            ]
        },
        {
            "fieldName": "To",
            "fieldValue": "Bob <sip:bob@biloxi.com>"
        },
        {
            "fieldName": "From",
            "fieldValue": "Alice <sip:alice@atlanta.com>",
            "parameters": [
                {
                    "name": "tag",
                    "value": "88sja8x"
                }
            ]
        },
        {
            "fieldName": "Max-Forwards",
            "fieldValue": "70"
        },
        {
            "fieldName": "Subject",
            "fieldValue": "I know you are there pick up the phone and answer!"
        },
        {
            "fieldName": "Call-ID",
            "fieldValue": "987asjd97y7atg"
        },
        {
            "fieldName": "CSeq",
            "fieldValue": "986759 INVITE"
        }
    ],
    "content": ""
}
```

### stringify()
Essentially, `stringify(messageObject)` is an inverse opration of `parse`. In the following example, we first parse a message and then stringify it back to SIP format. In your application, you most likely want to manipulate the message a bit more or create it from scratch in your application logic.

```JavaScript
import { parse, stringify } from 'sip-parser';

const messageString =
    'INVITE sip:bob@biloxi.com SIP/2.0\r\n' +
    'Via: SIP/2.0/UDP pc33.atlanta.com;branch=z9hG4bKkjshdyff\r\n' +
    'To: Bob <sip:bob@biloxi.com>\r\n' +
    'From: Alice <sip:alice@atlanta.com>;tag=88sja8x\r\n' +
    'Max-Forwards: 70\r\n' +
    'Subject: I know you are there\r\n' +
    '         pick up the phone\r\n' +
    '         and answer!\r\n' +
    'Call-ID: 987asjd97y7atg\r\n' +
    'CSeq: 986759 INVITE';

// In a real use case, you would build the message object in your
// application logic, whatever it might be.
const parsedMessage = parse(messageString);
// See the format of the parsed message in the previous example.
const stringifiedMessage = stringify(parsedMessage)
console.log(stringifiedMessage)
```
This would print:
```
INVITE sip:bob@biloxi.com SIP/2.0
Via: SIP/2.0/UDP pc33.atlanta.com;branch=z9hG4bKkjshdyff
To: Bob <sip:bob@biloxi.com>
From: Alice <sip:alice@atlanta.com>;tag=88sja8x
Max-Forwards: 70
Subject: I know you are there pick up the phone and answer!
Call-ID: 987asjd97y7atg
CSeq: 986759 INVITE
```

## Responses
SIP responses are very similar to requests; they only differ in the start line. Parsed responses have `statusCode` and `reason` fields:
```JavaScript
import { parse } from 'sip-parser';

const sipResponse =
    'SIP/2.0 200 OK\r\n' +
    'Via: SIP/2.0/UDP bobspc.biloxi.com:5060;branch=z9hG4bKnashds7\r\n' +
    '     ;received=192.0.2.4\r\n' +
    'To: Bob <sip:bob@biloxi.com>;tag=2493k59kd\r\n' +
    'From: Bob <sip:bob@biloxi.com>;tag=456248\r\n' +
    'Call-ID: 843817637684230@998sdasdh09\r\n' +
    'CSeq: 1826 REGISTER\r\n' +
    'Contact: <sip:bob@192.0.2.4>\r\n' +
    'Expires: 7200\r\n' +
    'Content-Length: 0';

const parsedResponse = parse(sipResponse);
console.log(JSON.stringify(parsedResponse, null, 4));
```
Prints:
```JSON
{
    "version": "2.0",
    "statusCode": 200,
    "reason": "OK",
    "headers": [
        {
            "fieldName": "Via",
            "fieldValue": "SIP/2.0/UDP bobspc.biloxi.com:5060",
            "parameters": [
                {
                    "name": "branch",
                    "value": "z9hG4bKnashds7"
                },
                {
                    "name": "received",
                    "value": "192.0.2.4"
                }
            ]
        },
        {
            "fieldName": "To",
            "fieldValue": "Bob <sip:bob@biloxi.com>",
            "parameters": [
                {
                    "name": "tag",
                    "value": "2493k59kd"
                }
            ]
        },
        {
            "fieldName": "From",
            "fieldValue": "Bob <sip:bob@biloxi.com>",
            "parameters": [
                {
                    "name": "tag",
                    "value": "456248"
                }
            ]
        },
        {
            "fieldName": "Call-ID",
            "fieldValue": "843817637684230@998sdasdh09"
        },
        {
            "fieldName": "CSeq",
            "fieldValue": "1826 REGISTER"
        },
        {
            "fieldName": "Contact",
            "fieldValue": "<sip:bob@192.0.2.4>"
        },
        {
            "fieldName": "Expires",
            "fieldValue": "7200"
        },
        {
            "fieldName": "Content-Length",
            "fieldValue": "0"
        }
    ],
    "content": ""
}
```
Obviously, stringifying the resulting object returns a valid SIP response string.

## Types
You can easily import all types, if you want to use them in the definitions of your own functions and variables:
```JavaScript
import { types as SipTypes } from 'sip-parser';

export function getHeader(message: SipTypes.SIPMessage, headerName: string): SipTypes.Header | undefined {
    return message.headers.find(h => h.fieldName.toLocaleLowerCase() === headerName.toLocaleLowerCase());
}
```
