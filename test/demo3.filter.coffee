'use strict'

module.exports.filter = (data) ->
  data.name  += " hello world!"
  return data
