import axios, {InternalAxiosRequestConfig} from "axios";
import 'dotenv/config'
import JSZip from "jszip";
import {parseResponse} from "../../responses";
import {fidelioDebug} from "../../helpers/helpers";

export const axiosApiInstance = axios.create({
    baseURL: process.env.FIDELIO_ENDPOINT,
    headers: {
        "V8-supported": "Zip/Msg",
        "content-type": "V8/ZIP",
        "User-Agent": process.env.USER_AGENT,
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

        if (res.headers['content-type'] && res.headers['content-type'].indexOf('V8/ZIP') !== -1) {
            fidelioDebug('received')
            const buff = Buffer.from(res.data, 'base64');
            const zip = new JSZip();
            const r = await zip.loadAsync(buff)
            res.data = await r.file('MSG').async('string');
            fidelioDebug(await r.file('MSG').async('string'))
            fidelioDebug('parsing...')
            res.data = await parseResponse(res)
            fidelioDebug('parsed')

        }

        return Promise.resolve(res);
    },
    async (err) => {
        return Promise.reject(err);
    }
);


