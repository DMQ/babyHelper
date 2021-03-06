const originalWx = wx;
const isFunction = fn => typeof fn === 'function';

// promise添加always方法
Promise.prototype.always = function (callback) {
    let P = this.constructor;
    return this.then(
        value => P.resolve(callback(value)),
        reason => P.resolve(callback(reason))
    );
};

/** 包装promise
 * @param {string} method 需要支持promise的wx对象方法名
 * @param {boolean} optionsIsCallback 方法接受的参数是否是回调函数，一般是on开头的方法
 */
const makePromise = (method, optionsIsCallback) => {
    if (!isFunction(originalWx[method])) {
        return console.warn(`wx do not support method ${method}`)
    }

    return function(optionsOrCb = {}) {
        let s = optionsOrCb.success, f = optionsOrCb.fail;
        return new Promise((rs, rj) => {
            originalWx[method](
                optionsIsCallback 
                ? function(res) {
                    isFunction(optionsOrCb) && optionsOrCb(res);
                    rs(res);
                }
                : Object.assign(optionsOrCb, {
                    success(res) {
                        s && s(res);
                        rs(res);
                    },
                    fail(res) {
                        f && f(res);
                        rj(res);
                    }
                })
            );
        });
    }
}

const makeWxSupportPromise = () => {
    let filterReg = /^on/, syncReg = /Sync$/
    wx = {};

    for (let key in originalWx) {
        // 不是方法或者是同步方法，直接拷贝
        if (!isFunction(originalWx[key]) || syncReg.test(key)) {
            wx[key] = originalWx[key];
        } else {
            // on开头的方法，接收的参数是callback
            wx[key] = makePromise(key, filterReg.test(key));
        }
    } 
}

const resetWx = () => {
    wx = getOriginalWx;
}

const getOriginalWx = () => {
    return originalWx;
}

export {
    makePromise, 
    makeWxSupportPromise, 
    getOriginalWx, 
    resetWx
}