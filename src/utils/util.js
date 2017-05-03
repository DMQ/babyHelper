import nextTick from './nexttick'

const setDataNextTick = (() => {
    let wait = false;
    let data = {};

    return (key, value) => {
        data[key] = value;
        if (!wait) {
            wait = true;
            nextTick(() => {
                let pages = getCurrentPages();
                pages[pages.length - 1].setData(data);
                data = {};
                wait = false;
            });
        }
    }
})()

// 劫持属性，实现scope.xx -> scope.data.xx
function hijackProperty(prop, pageScope, isData = true, ns = '') {
    if (typeof prop != 'object') return prop;
    for (let key in prop) {
        Object.defineProperty(pageScope, `${ns ? ns + '.' + key : key}`, {
            enumerable: true, // 可枚举
            configurable: false, // 不能再define
            get: function () {
                return prop[key];
            },
            set: function (newVal) {
                if (prop[key] === newVal) return newVal;

                if (isData) {
                    setDataNextTick(key, newVal);  // 使用事件循环延迟setData，提高性能
                } else {
                    prop[key] = newVal;
                }
            }
        });
    }
    return prop;
}


// 获取一个promise实例
function getPromiseObject() {
    let obj = {};
    obj.promise = new Promise((rs, rj) => {
        obj.resolve = rs;
        obj.reject = rj;
    });
    return obj;
}

// 获取本地缓存（添加过期时间判断，单位秒）
function getStorageSyncWithExpire(key) {
    let value = wx.getStorageSync(key); 
    let expire = wx.getStorageSync(`${key}_expire`);

    // 未过期，返回实际值
    if (!expire || Date.now() < expire) {
        return value;
    } else {
        // 移除缓存
        wx.removeStorageSync(key)
        wx.removeStorageSync(`${key}_expire`)
        return '';
    }
}

/**
 *  设置本地缓存（添加过期时间）
 * @param {string} key
 * @param {any} value
 * @param {number} expire 过期时间，单位秒
 */
function setStorageSyncWithExpire(key, value, expire) {
    wx.setStorageSync(key, value);
    wx.setStorageSync(`${key}_expire`, Date.now() + expire * 1000);
}

// 小于10补0
const timeAddZero = num => num > 9 ? num : `0${num}`;
// 时间格式化
function dateFormat(time, formatStr) {
    let year, month, day, hour, minute, second, 
        reg, rule, afterFormat;

    if (typeof formatStr === 'undefined') {
        formatStr = time;
        time = new Date();
    }

    if (!(time instanceof Date)) time = new Date(time)

    if (!formatStr) return '';

    year = time.getFullYear();
    month = time.getMonth() + 1;
    day = time.getDate();
    hour = time.getHours();
    minute = time.getMinutes();
    second = time.getSeconds();

    rule = {
        'yy': year - 2000,
        'yyyy': year,
        'M': month,
        'MM': timeAddZero(month),
        'd': day,
        'dd': timeAddZero(day),
        'h': hour,
        'hh': timeAddZero(hour),
        'm': minute,
        'mm': timeAddZero(minute),
        's': second,
        'ss': timeAddZero(second)
    };

    reg = /y{2,4}|M{1,2}|d{1,2}|h{1,2}|m{1,2}|s{1,2}/g;

    afterFormat = formatStr.replace(reg, function($) {
        return rule[$] || $;
    });

    return afterFormat;
};


export {
    nextTick,
    hijackProperty,
    getPromiseObject,
    setStorageSyncWithExpire,
    getStorageSyncWithExpire,
    dateFormat
}