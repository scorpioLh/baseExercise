/** 功能类库 */
var util = {}

/** function 返回数组的指定项 */
util.indexOf = function (array, item) {
  for (var i = 0; i < array.length; i++) {
    if (array[i] === item) {
      return i
    }
  }
  return -1
}

/** function 判断是否为函数 */
util.isFunction = function (source) {
  return '[Object Function]' === Object.prototype.toString.call(source)
}

/** 判断是不是ie */
util.isIE = function () {
  var myNav = navigator.userAgent.toLowerCase()
  return (myNav.indexOf('msie') !== -1 ? parseInt(myNav.split('msie')([1])) : false)
}

/** 对象潜复制 */
util.extend = function (dst, obj) {
  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      dst[i] = obj[i]
    }
  }
}

/** 获取随机5位字符串 */
util.getName = function (prefix) {
  return prefix + Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)
}

/** 在页面中注入js脚本 */
util.createScript = function (url, charset) {
  var script = document.createElement('script')
  script.setAttribute('type', 'text/javascript')
  charset && script.setAttribute('charset', charset)
  script.setAttribute('src', url)
  script.async = true
  return script
}

/** jsonp */
util.jsonp = function (url, onsuccess, onerror, charset) {
  var callbackName = util.getName('tt_player')
  window[callbackName] = function () {
    if (onsuccess && util.isFunction(onsuccess)) {
      onsuccess(arguments[0])
    }
  }
  var script = util.createScript(url + '&callback=' + callbackName, charset)
  script.onload = script.onreadystatechange = function () {
    if (!script.readyState || /loaded|complete/.test(script.readyState)) {
      script.onload = script.onreadystatechange = null
      // 解除该script的DOM对象
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
      // 删除函数或变量
      window[callbackName] = null
    }
  }
  script.onerror = function () {
    if (onerror && util.isFunction(onerror)) {
      onerror()
    }
  }
  document.getElementsByTagName('head')[0].appendChild(script)
}

/** 实现ajax */
util.json = function (options) {
  var opt = {
    url: '',
    type: 'get',
    data: {},
    success: function () {},
    error: function () {}
  }
  util.extend(opt, options)
  if (opt.url) {
    var xhr = XMLHttpRequest ? new XMLHttpRequest() : new window.ActiveXObject('Microsoft.XMLHTTP')
    var data = opt.data
    var url = opt.url
    var type = opt.type.toUpperCase()
    var dataArr = []
    for (var k in data) {
      dataArr.push(k + '=' + data[k])
    }
    if (type === 'GET') {
      url = url + '?' + dataArr.join('&')
      xhr.open(type, url.replace(/\?$/g, ''), true)
      xhr.send()
    }
    if (type === 'POST') {
      xhr.open(type, url, true)
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
      xhr.send(dataArr.join('&'))
    }
    xhr.onload = function () {
      if (xhr.status === 200 || xhr.status === 304) {
        var res
        if (opt.success && opt.success instanceof Function) {
          res = xhr.responseText
          if (typeof res === 'string') {
            res = JSON.parse(res)
            opt.success.call(xhr, res)
          }
        }
      } else {
        if (opt.error && opt.error instanceof Function) {
          opt.error.call(xhr, res)
        }
      }
    }
  }
}

export default util
