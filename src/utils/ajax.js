import Vue from 'vue'
import router from '@/router';
import store from '@/store'

const defaultPostParam = {
  cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
  credentials: 'include', // include, same-origin, *omit
  headers: {
    'content-type': 'application/json;charset=UTF-8',
  },
  // method: 'POST', // *GET, POST, PUT, DELETE, etc.
  mode: 'cors', // no-cors, cors, *same-origin
  redirect: 'follow', // manual, *follow, error
  referrer: 'no-referrer', // *client, no-referrer
}
const defaultGetParam = {
  cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
  credentials: 'include', // include, same-origin, *omit
  headers: {
    'Content-type': 'application/json;charset=UTF-8',
  },
  method: 'GET', // *GET, POST, PUT, DELETE, etc.
  mode: 'cors', // no-cors, cors, *same-origin
  redirect: 'follow', // manual, *follow, error
  referrer: 'no-referrer', // *client, no-referrer
}
const defaultFileParam = {
  cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
  credentials: 'include', // include, same-origin, *omit=
  method: 'GET', // *GET, POST, PUT, DELETE, etc.
  mode: 'cors', // no-cors, cors, *same-origin
  redirect: 'follow', // manual, *follow, error
  referrer: 'no-referrer', // *client, no-referrer
}

const getJson = async (url, urlparam, param, err) => {
  url = getAsUriParameters(url, urlparam)
  let p = Object.assign(defaultGetParam, param)
  let response = await fetch(url, p)
  return await handleResponseJson(response, err)
}

const postJson = async (url, body, param, err) => {
  let p = Object.assign(defaultPostParam, param)
  p.method = 'POST'
  p.body = JSON.stringify(body)
  let response = await fetch(url, p)
  return await handleResponseJson(response, err)
}

const postFile = async (url, formData, param, err) => {
  let p = Object.assign(defaultFileParam, param)
  p.method = 'POST'
  p.body = formData
  let response = await fetch(url, p)
  return await handleResponseJson(response, err)
}

const putJson = async (url, body, param, err) => {
  let p = Object.assign(defaultPostParam, param)
  p.method = 'PUT'
  p.body = JSON.stringify(body)
  let response = await fetch(url, p)
  return await handleResponseJson(response, err)
}

const saveJson = async (url, body, param, err) => {
  if (body.pkid) {
    const arr = url.split('?')
    if (!arr[0].charAt(url.length - 1) !== '/') {
      arr[0] += '/'
    }
    url =
      arr.length === 1 ? arr[0] + body.pkid : arr[0] + body.pkid + '?' + arr[1]
    return await putJson(url, body, param, err)
  } else {
    return await postJson(url, body, param, err)
  }
}

const delJson = async (url, body, param, err) => {
  let p = Object.assign(defaultPostParam, param)
  p.method = 'DELETE'
  p.body = JSON.stringify(body)
  let response = await fetch(url, p)
  return await handleResponseJson(response, err)
}

const handleResponseJson = async (response, err) => {
  if (response.ok) {
    console.log(response);

    let data = await response.json()
    console.log(data);
    if (data.success) {
      return data.data
    } else if (!err) {
      let f = false
      for (let i = 0; i < jsonErrorHandlers.length; i++) {
        if (await jsonErrorHandlers[i](data)) {
          f = true
          break
        }
      }
      if (!f) {
        await defaultErrorHandler(data)
      }
    } else {
      err(data)
    }
  } else {
    await defaultErrorHandler({ errormsg: '服务器连接出错' })
  }
  return null
}

let jsonErrorHandlers = []

let defaultErrorHandler = (data) => {
  Vue.prototype.$baseMessage(
    data.errormsg ? data.errormsg : '发生未知错误',
    'error'
  )
  // alert(data.errormsg ? data.errormsg : '发生未知错误')
}

const setAjaxErrorHandlers = (handler) => {
  jsonErrorHandlers.push(handler)
}
const setDefaultErrorHandlers = (handler) => {
  defaultErrorHandler = handler
}

const getAsUriParameters = (url, data) => {
  let p = ''
  for (let prop in data) {
    p += encodeURIComponent(prop) + '=' + encodeURIComponent(data[prop]) + '&'
  }

  p = p.substring(0, p.length - 1)
  return url + (url.indexOf('?') > 0 ? '' : '?') + p
}

let loginErrorHandler = async (data) => {
  // console.log(data)
  if (data.errormsg === 'nosign') {
    await store.dispatch('user/resetAll')
    router.push('/login')
    return true
  } else {
    return false
  }
}
jsonErrorHandlers.push(loginErrorHandler)

export default {
  getJson,
  postJson,
  postFile,
  putJson,
  delJson,
  saveJson,
  setAjaxErrorHandlers,
  setDefaultErrorHandlers,
}
