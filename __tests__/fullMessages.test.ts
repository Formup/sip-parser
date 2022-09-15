import { parse } from '../index'

describe('parse', () => {
    it('should parse full INVITE message', () => {
        const inviteReq =
            'INVITE sip:test1@192.168.1.16 SIP/2.0\r\n' +
            'Via: SIP/2.0/TCP 192.168.1.86:59384;branch=z9hG4bK.VYb2WWKLB\r\n' +
            'From: Requester <sip:test2@192.168.1.16>;tag=Yoe~aGxm2\r\n' +
            'To: test1 <sip:test1@192.168.1.16>\r\n' +
            'CSeq: 20 INVITE\r\n' +
            'Call-ID: L4VssbhjDd\r\n' +
            'Max-Forwards: 70\r\n' +
            'Allow: INVITE, ACK, CANCEL, OPTIONS, BYE, REFER, NOTIFY, MESSAGE, SUBSCRIBE, INFO, PRACK, UPDATE\r\n' +
            'Content-Type: application/sdp\r\n' +
            'Content-Length: 519\r\n' +
            'Contact: <sip:test2@192.168.1.86:59384;transport=tcp>\r\n' +
            '\r\n' +
            'v=0\r\n' +
            'o=test2 2580 2247 IN IP4 192.168.1.86\r\n' +
            's=Talk\r\n' +
            'c=IN IP4 192.168.1.86\r\n' +
            't=0 0\r\n' +
            'a=rtcp-xr:rcvr-rtt=all:10000 stat-summary=loss,dup,jitt,TTL voip-metrics\r\n' +
            'm=audio 7212 RTP/AVP 96 97 98 0 8 18 99 100 101\r\n' +
            'a=rtpmap:96 opus/48000/2\r\n' +
            'a=fmtp:96 useinbandfec=1\r\n' +
            'a=rtpmap:97 speex/16000\r\n' +
            'a=fmtp:97 vbr=on\r\n' +
            'a=rtpmap:98 speex/8000\r\n' +
            'a=fmtp:98 vbr=on\r\n' +
            'a=fmtp:18 annexb=yes\r\n' +
            'a=rtpmap:99 telephone-event/48000\r\n' +
            'a=rtpmap:100 telephone-event/16000\r\n' +
            'a=rtpmap:101 telephone-event/8000\r\n' +
            'a=rtcp-fb:* trr-int 1000\r\n' +
            'a=rtcp-fb:* ccm tmmbr';
        const parsed = parse(inviteReq);
        expect(parsed.content).toBe(
            'v=0\r\n' +
            'o=test2 2580 2247 IN IP4 192.168.1.86\r\n' +
            's=Talk\r\n' +
            'c=IN IP4 192.168.1.86\r\n' +
            't=0 0\r\n' +
            'a=rtcp-xr:rcvr-rtt=all:10000 stat-summary=loss,dup,jitt,TTL voip-metrics\r\n' +
            'm=audio 7212 RTP/AVP 96 97 98 0 8 18 99 100 101\r\n' +
            'a=rtpmap:96 opus/48000/2\r\n' +
            'a=fmtp:96 useinbandfec=1\r\n' +
            'a=rtpmap:97 speex/16000\r\n' +
            'a=fmtp:97 vbr=on\r\n' +
            'a=rtpmap:98 speex/8000\r\n' +
            'a=fmtp:98 vbr=on\r\n' +
            'a=fmtp:18 annexb=yes\r\n' +
            'a=rtpmap:99 telephone-event/48000\r\n' +
            'a=rtpmap:100 telephone-event/16000\r\n' +
            'a=rtpmap:101 telephone-event/8000\r\n' +
            'a=rtcp-fb:* trr-int 1000\r\n' +
            'a=rtcp-fb:* ccm tmmbr'
        );
        expect('method' in parsed);
        if ('method' in parsed) {
            expect(parsed.method).toBe('INVITE');
            // Because Allow is split into multiple headers, one for each value.
            expect(parsed.headers.length).toBe(21);
        }
    });
});
