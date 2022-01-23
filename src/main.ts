import * as https from 'https';
import * as querystring from 'querystring';
import md5 = require('md5');
import { appId, appSecret } from './private';
export const translate = (word: string) => {
    let from, to;
    const salt = Math.random();
    const sign = md5(appId + word + salt + appSecret);

    if (/\w/.test(word[0])) {
        from = 'en';
        to = 'zh';
    } else {
        from = 'zh';
        to = 'en';
    }

    const query: string = querystring.stringify({
        q: word,
        from,
        to,
        appid: appId,
        salt,
        sign,
    });

    const options = {
        hostname: 'api.fanyi.baidu.com',
        port: 443,
        path: '/api/trans/vip/translate?' + query,
        method: 'GET',
    };
    type ErrorMap = {
        [k: string]: string;
    };
    const errormap: ErrorMap = {
        52003: '用户认证失败',
        52004: 'error2',
        52005: 'error3',
        unknown: '服务器繁忙',
    };

    const requset = https.request(options, (response) => {
        let chunks: Buffer[] = [];
        response.on('data', (chunk) => {
            chunks.push(chunk);
        });
        response.on('end', () => {
            const string = Buffer.concat(chunks).toString();
            type BaiduResulvt = {
                error_code?: string;
                error_msg?: string;
                from: string;
                to: string;
                trans_result: {
                    src: string;
                    dst: string;
                }[];
            };
            const object: BaiduResulvt = JSON.parse(string);
            if (object.error_code) {
                console.error(errormap[object.error_code] || object.error_msg);
                process.exit(1);
            } else {
                object.trans_result.map((obj) => {
                    console.log(obj.dst);
                });
                process.exit(0);
            }
        });
    });

    requset.on('error', (e) => {
        console.error(e);
    });
    requset.end();
};
