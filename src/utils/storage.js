/**
 * 设置本地存储值
 * @param key      存储的key
 * @param value    存储的值
 * @param storTime 过期时间/秒
 * @return
 */
export function settLocalStorage (key, value, storTime = '') {
  var expTime = storTime !== '' ? new Date().getTime() / 1000 + storTime : ''
  var valueDate = JSON.stringify({ // 获取当前时间,转换成JSON字符串序列
    val: value,
    expTime: expTime
  })
  try {
    localStorage.setItem(key, valueDate)
  } catch (e) {
    alert('Error:保存到本地(登录认证信息)存储失败')
  }
}

/**
 * 获取本地存储值
 * @param key 存储的key
 * @return
 */
export function getLocalStorage (key) {
  if (localStorage.getItem(key)) {
    var vals = localStorage.getItem(key) // 获取本地存储的值
    var dataObj = JSON.parse(vals) // 将字符串转换成JSON对象
    var isTimed = false // 默认未过期
    if (dataObj.expTime !== '') {
      // 如果(当前时间 > 过期时间)
      isTimed = new Date().getTime() / 1000 > dataObj.expTime
    }
    if (isTimed) {
      console.log('存储已过期')
      localStorage.removeItem(key)
      return null
    } else {
      var newValue = dataObj.val
    }
    return newValue
  } else {
    return null
  }
}
