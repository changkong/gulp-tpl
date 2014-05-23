'use strict'

module.exports.filter = (data) ->
  data = data || {}
  data.name  += " hello world!"
  return data
