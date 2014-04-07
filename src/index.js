var webgl = require('./webgl')
  , settings = {}

webgl.init(settings, function(err, data) { 
  if (err) console.error(err)
  console.log('ready', data)
})
