'use strict'

module.exports.filter = (data) ->
  data.name = "hello " + data.name
  return data
