// 事件循环
const nextTick = (() => {
    let callbackList = [];
    let waiting = false;

    // 事件循环要执行的函数
    let nextTickHandler = () => {
        waiting = false;
        let copies = callbackList.slice(0);
        callbackList.length = 0;
        copies.forEach(cb => {
            cb();
        });
    }

    // 模拟事件循环的函数
    let loopFunction;
    // prmise模拟
    if (typeof Promise !== 'undefined') {
        loopFunction = () => {
            Promise.resolve().then(nextTickHandler);
        }
    // setTimeout模拟
    } else {
        loopFunction = () => {
            setTimeout(nextTickHandler, 0);
        }
    }

    return (callback) => {
        callbackList.push(callback);
        if (!waiting) {
            waiting = true;
            loopFunction();
        }
    }
})();

export default nextTick;