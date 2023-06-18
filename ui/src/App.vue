<template>
    <router-view></router-view>
</template>

<script>
export default {
    name: "App",
    components: {
        Home: () => import("./views/Home.vue")
    },
    watch: {
        $route(to) {
            switch (to.name) {
                case "home":
                    document.title=
                    "Vue Bin"
                    break
                case "connect-4":
                    document.title=
                    "Connect 4"
                    break
                case "fisherman":
                    document.title=
                    "Fisherman"
                    break
            }
        }
    },
    beforeMount() {
        const link = document.createElement("link")
        link.rel = "icon"
        link.href = require("./assets/main/img/composicao-de-imagem-galeria-1.jpg")
        document.head.appendChild(link)
    }
}
</script>

<style>
body {
    margin: 0;
}
* {
    font-family: "Trebuchet MS";
}
</style>
