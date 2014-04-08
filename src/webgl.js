var domready = require('domready')
  ,      raf = require('raf')

  , width    = window.innerWidth
  , height   = window.innerHeight

  , scene    = new THREE.Scene()
  , camera   = new THREE.PerspectiveCamera(40, width / height, 0.1, 10000)
  , controls = new THREE.OrbitControls(camera)
//, stats    = new Stats()
  , light    = new THREE.DirectionalLight(0xffffff, 1.5)

  , floorTexture
  , floorMaterial
  , floorMesh

module.exports = {

  renderer:   new THREE.WebGLRenderer({ antialias: false })

  , init:     function(obj, cb) {
                var self = this
                process.nextTick(function() {
                  domready(function() {
                    scene.add(light)
                    scene.add(self.ground())

                    //scene.add(new THREE.AxisHelper(100))

                    scene.add(new THREE.AmbientLight(0xff9000))
                    scene.fog = new THREE.Fog(0xaabfee, 3000, 8000)
                    controls.maxPolarAngle = Math.PI / 2
                    camera.position.set(0, 250, 500)

                    self.renderer.setSize(width, height)
                    self.renderer.setClearColor(scene.fog.color, 1)
                    document.body.appendChild(self.renderer.domElement)

                    /*
                    stats.domElement.style.position = 'absolute'
                    stats.domElement.style.top  = '0px'
                    stats.domElement.style.left = '0px'
                    document.body.appendChild(stats.domElement)
                    */

                    // async response.
                    cb(!scene instanceof THREE.Scene, scene)

                    // start the animation loop.
                    raf(self.renderer.domElement).on('data', function(dt) {
                      self.update(dt)
                      self.render()
                    })

                    window.addEventListener('resize', self.resize.bind(self), false)
                  })
                })
              }

  , ground:   function() {
                floorTexture = THREE.ImageUtils.loadTexture('img/floor.jpg')
                floorTexture.repeat.set(0.5, 0.8)
                floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping
                floorMaterial  = new THREE.MeshPhongMaterial({
                    ambient:   0x444444
                  , color:     0x66aa66
                  , shininess: 150
                  , specular:  0x888888
                  , shading:   THREE.SmoothShading
                  , map:       floorTexture
                })

                floorMesh = new THREE.Mesh(new THREE.PlaneGeometry(16000, 16000), floorMaterial)
                floorMesh.flipSided     = false
                floorMesh.castShadow    = false
                floorMesh.receiveShadow = true
                floorMesh.rotation.x    = -Math.PI / 2
                floorMesh.position.y    = -10

                return floorMesh
              }

  , update:   function(dt) {
                light.position = camera.position.clone()
                light.position.y += 5000
                controls.update()
                //stats.update()
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
