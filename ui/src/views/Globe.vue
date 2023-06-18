<template>
    <div>
        <canvas ref="webGl" />
    </div>
</template>

<script>
import * as THREE from "three"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"
import { watch, onMounted, ref, computed } from "vue"

// https://web.cortland.edu/flteach/civ/davidweb/resources.htm

export default {
    setup() {
        const
        webGl = ref(),
        width = 500,
        height = 500,

        aspectRatio = computed(() => {
            return width / height
        })

        let
        camera = new THREE.PerspectiveCamera(45, aspectRatio.value, 0.1, 100),
        renderer,
        scene = new THREE.Scene(),
        mesh = new THREE.Mesh(
            new THREE.SphereGeometry(5, 50, 50),
            new THREE.MeshStandardMaterial({
                map: new THREE.TextureLoader().load("https://cdn.shopify.com/s/files/1/0616/2685/products/Earth-III-_winter_1024x1024.jpg?v=1447863164"),
            })
        ),
        controls,
        light = new THREE.PointLight(0xffffff, 1)

        const setCanvas = () => {
            // Create Scene
            scene.background = new THREE.TextureLoader().load("https://raw.githubusercontent.com/NightWiing/three-vue3-globe/main/public/images/galaxy1.avif")

            // Create Object
            scene.add(mesh)

            // Lights
            // light = new HemisphereLight(0xffff, 0x080820, 1)
            light.position.set(50, 50, 50)
            scene.add(light)

            // Camera
            camera.position.z = 30
            scene.add(camera)
            camera.add(light)

            // Renderer
            renderer = new THREE.WebGLRenderer({ canvas: webGl.value, antialias: true })
            renderer.setSize(width, height)
            renderer.render(scene, camera)

            // Controls
            controls = new OrbitControls(camera, webGl.value)
            controls.enableDamping = true
        }

        const updateCamera = () => {
            camera.aspect = aspectRatio.value
            camera.updateProjectionMatrix()
        }

        const updateRenderer = () => {
            renderer.setSize(width, height)
            renderer.render(scene, camera)
        }

        watch(aspectRatio, (val) => {
            if (val) {
                updateCamera()
                updateRenderer()
            }
        })

        const animate = () => {
            // mesh.rotation.y += 0.01
            controls.update()
            renderer.render(scene, camera)
            requestAnimationFrame(animate)
        }

        onMounted(() => {
            setCanvas()
            animate()
        })

        return { webGl }
    },
}
</script>
