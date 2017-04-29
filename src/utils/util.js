// 劫持属性，实现scope.xx -> scope.data.xx
export function hijackProperty(prop, pageScope, isData = true, ns='') {
  if (typeof prop != 'object') return prop;
  for (let key in prop) {
      Object.defineProperty(pageScope, `${ns ? ns+'.'+key : key}`, {
          enumerable: true, // 可枚举
          configurable: false, // 不能再define
          get: function() {
              return prop[key];
          },
          set: function(newVal) {
              if (prop[key] === newVal) return newVal;

              if (isData) {
                this.setData({
                  [key]: newVal
                });
              } else {
                prop[key] = newVal;
              }
          }
      });
  }
  return prop;
}