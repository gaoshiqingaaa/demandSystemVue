/*
 * @Description: 文件及简介
 * @Author: Cary
 * @Date: 2020-05-23 10:58:58
 * @FilePath: \alien-docsg:\CaryFile\project\project-resources\demandSystemVue\src\pages\manuscript\utils.js
 */

import mom from 'moment'

export const getPasteData = (callback) => {
  return (event) => {
    let isChrome = false;
    if (event.clipboardData || event.originalEvent) {
      //not for ie11  某些chrome版本使用的是event.originalEvent
      let clipboardData = (event.clipboardData || event.originalEvent.clipboardData);
      if (clipboardData.items) {
        // for chrome
        let items = clipboardData.items,
          len = items.length,
          blob = null;
        isChrome = true;
        // event.preventDefault();
        //在items里找粘贴的image,据上面分析,需要循环  
        for (let i = 0; i < len; i++) {
          if (items[i].type.indexOf("image") !== -1) {
            blob = items[i].getAsFile();
          }
        }
        if (blob !== null) {
          let reader = new FileReader();
          reader.onload = function (event) {
            // event.target.result 即为图片的Base64编码字符串
            let base64_str = event.target.result
            //可以在这里写上传逻辑 直接将base64编码的字符串上传（可以尝试传入blob对象，看看后台程序能否解析）
            callback && callback({
              file: base64ToFile(base64_str),
              isChrome: isChrome
            })
          }
          reader.readAsDataURL(blob);
        }
      } else {
        callback && callback({
          file: null,
          isChrome: isChrome
        })
      }
    } else {
      //for ie11
      callback && callback({
        file: null,
        isChrome: isChrome
      })
    }
  }
}

export const base64ToFile = (base64, filename) => {
  //将base64转换为文件
  filename = '第九工场_' + new Date().getTime() + '.png';
    let arr = base64.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, {
    type: mime
  })
}

export const isTypeAnImage = (ext) => {
  return ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'psd', 'svg', 'tiff'].
    indexOf(ext.toLowerCase()) !== -1
}

export const getFilePathName = (path) => {
  if(!path) return
  let index = path.lastIndexOf("/")
  if (index === -1) return
  let filename = path.substr(index + 1)
  return filename.substr(37)
}

export const throttle = function(func,delay){
  var timer = null;
  var startTime = Date.parse(new Date());

  return function(){
      var curTime = Date.parse(new Date());
      var remaining = delay-(curTime-startTime);
      var context = this;
      var args = arguments;

      clearTimeout(timer);
      if(remaining<=0){
          func.apply(context,args);
          startTime = Date.parse(new Date());
      }else{
          timer = setTimeout(func,remaining);
      }
  }
}

