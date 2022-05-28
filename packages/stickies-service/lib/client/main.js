"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = createPrismaWebClient;
exports.createUrl = createUrl;
function createPrismaWebClient({ baseUrl , request =defaultRequest  }) {
    const proxy = new Proxy({}, createModelProxy((payload)=>request({
            baseUrl,
            ...payload
        })));
    return proxy;
}
function createActionProxy(request) {
    return {
        get (_, action) {
            return (body)=>request({
                    action,
                    body
                });
        }
    };
}
function createModelProxy(request) {
    return {
        get (_, model) {
            return new Proxy({}, createActionProxy((payload)=>request({
                    model,
                    ...payload
                })));
        }
    };
}
function createUrl({ baseUrl , model , action , body  }) {
    const url = `${baseUrl}/${model}/${action}`.toLowerCase();
    return url;
}
function defaultRequest(args) {
    const url = createUrl(args);
    console.log({
        url
    });
    return fetch(url, {
        method: "post",
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            action: args.action,
            payload: args.body
        })
    }).then((r)=>{
        if (!r.ok) throw r;
        return r;
    }).then((r)=>r.json());
}
