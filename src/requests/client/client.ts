import axios, {InternalAxiosRequestConfig} from "axios";
import http from "node:http";
import https from "node:https";
import JSZip from "jszip";
import {parseResponse} from "../../responses";
import {fidelioDebug} from "../../helpers/helpers";

export const axiosApiInstance = axios.create({
    // Reuse TCP/TLS connections: the Fidelio IIS wrapper pays a full
    // handshake per request otherwise.
    httpAgent: new http.Agent({keepAlive: true}),
    httpsAgent: new https.Agent({keepAlive: true}),
    headers: {
        "V8-supported": "Zip/Msg",
        "content-type": "V8/ZIP",
        "User-Agent": "sdk-fidelio-suite-8",
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': '0',
    }
})

axiosApiInstance.interceptors.request.use(
    async (req: InternalAxiosRequestConfig) => {
        fidelioDebug('send...')
        const zip = new JSZip();
        fidelioDebug(req.data)
        zip.file('MSG', req.data);
        req.data = await zip.generateAsync({type: "base64"})
        return req;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosApiInstance.interceptors.response.use(
    async (res) => {

        const contentType = res.headers['content-type'];
        if (typeof contentType === 'string' && contentType.indexOf('V8/ZIP') !== -1) {
            fidelioDebug('received')
            const buff = Buffer.from(res.data, 'base64');
            const zip = new JSZip();
            const unzipped = await zip.loadAsync(buff)
            const msg = await unzipped.file('MSG')!.async('string');
            res.data = msg;
            fidelioDebug(msg)
            fidelioDebug('parsing...')
            try {
                res.data = await parseResponse(res)
            } catch (e) {
                return Promise.reject(e)
            }

            fidelioDebug('parsed')

        }

        return Promise.resolve(res);
    },
    async (err) => {
        return Promise.reject(err);
    }
);
