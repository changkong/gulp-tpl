'use strict';
module.exports.filter = (data) ->
  datas = []

  data.ispc = true
  datas.push({filename:"demo5_pc", data:data})

  data = JSON.parse(JSON.stringify(data))
  data.ispc = false
  datas.push({filename:"demo5_mobile", data:data})

  return datas