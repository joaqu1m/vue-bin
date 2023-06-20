<template>
    <div>
        <canvas ref="webGl"></canvas>
        <select @change="resetMesh">
            <option value="earth">Terra</option>
            <option value="moon">Lua</option>
            <option value="mars">Marte</option>
            <option value="jupiter">Júpiter</option>
            <option value="venus">Vênus</option>
        </select>
    </div>
</template>

<script>
import * as THREE from "three"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"
import earth from "../assets/globe/texture/earth.jpg"
import moon from "../assets/globe/texture/moon.jpg"
import mars from "../assets/globe/texture/mars.jpg"
import jupiter from "../assets/globe/texture/jupiter.jpg"
import venus from "../assets/globe/texture/venus.jpg"
import galaxy from "../assets/globe/texture/galaxy.jpg"

const imports = { earth, moon, mars, jupiter, venus }

export default {
    name: "Globe",
    data() {
        return {
            width: 500,
            height: 500,
            camera: new THREE.PerspectiveCamera(45, this.aspectRatio, 0.1, 100),
            renderer: null,
            scene: new THREE.Scene(),
            mesh: new THREE.Mesh(
                new THREE.SphereGeometry(5, 50, 50),
                new THREE.MeshStandardMaterial({
                    map: new THREE.TextureLoader().load(earth)
                })
            ),
            controls: null,
            light: new THREE.PointLight(0xffffff, 1)
        }
    },
    methods: {
        updateCamera() {
            this.camera.aspect = this.aspectRatio
            this.camera.updateProjectionMatrix()
        },
        updateRenderer() {
            this.renderer.setSize(this.width, this.height)
            this.renderer.render(this.scene, this.camera)
        },
        animate() {
            this.controls.update()
            this.renderer.render(this.scene, this.camera)
            requestAnimationFrame(this.animate)
        },
        resetMesh({ target }) {
            this.scene.remove(this.mesh)
            this.mesh = new THREE.Mesh(
                new THREE.SphereGeometry(5, 50, 50),
                new THREE.MeshStandardMaterial({
                    map: new THREE.TextureLoader().load(imports[target.value]),
                })
            )
            this.scene.add(this.mesh)
        }
    },
    computed: {
        aspectRatio() {
            return this.width / this.height
        }
    },
    watch: {
        aspectRatio(after) {
            if (after) {
                this.updateCamera()
                this.updateRenderer()
            }
        }
    },
    mounted() {

        this.scene.background = new THREE.TextureLoader().load(galaxy)
        this.scene.add(this.mesh)

        this.light.position.set(50, 50, 50)
        this.scene.add(this.light)

        this.camera.position.z = 30
        this.scene.add(this.camera)

        this.camera.add(this.light)

        this.renderer = new THREE.WebGLRenderer({ canvas: this.$refs.webGl, antialias: true })
        this.renderer.setSize(this.width, this.height)
        this.renderer.render(this.scene, this.camera)

        this.controls = new OrbitControls(this.camera, this.$refs.webGl)
        this.controls.enableDamping = true

        this.animate()
    }
}
</script>
