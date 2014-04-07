var domready = require('domready')
  ,      raf = require('raf')

  , width    = window.innerWidth
  , height   = window.innerHeight

  , scene    = new THREE.Scene()
  , camera   = new THREE.PerspectiveCamera(40, width / height, 0.1, 10000)
  , controls = new THREE.OrbitControls(camera)
  , stats    = new Stats()

module.exports = {

  renderer:   new THREE.WebGLRenderer({ antialias: false })

  , init:     function(obj, cb) {
                var self = this
                process.nextTick(function() {
                  domready(function() {
                    scene.add(new THREE.AxisHelper(100))
                    scene.add(new THREE.AmbientLight(0x202020))
                    camera.position.set(0, 250, 500)
                    self.renderer.setSize(width, height)
                    document.body.appendChild(self.renderer.domElement)
                    stats.domElement.style.position = 'absolute'
                    stats.domElement.style.top = '0px'
                    stats.domElement.style.left = '0px'
                    document.body.appendChild(stats.domElement)
                    window.addEventListener('resize', self.resize.bind(self), false)

                    // animation.
                    raf(self.renderer.domElement).on('data', function(dt) {
                      self.update(dt)
                      self.render()
                    })

                    // async response.
                    cb(!scene instanceof THREE.Scene, scene)
                  })
                })
              }

  , update:   function(dt) {
                camera.lookAt(scene.position)
                controls.update()
                stats.update()
              }

  , render:   function() {
                this.renderer.render(scene, camera)
              }

  , resize:   function() {
                width  = window.innerWidth
                height = window.innerHeight
                this.renderer.setSize(width, height)
                camera.aspect = width / height
                camera.updateProjectionMatrix()
              }

}
