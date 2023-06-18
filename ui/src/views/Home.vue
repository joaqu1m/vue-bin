<template>
    <div>
        <div class="[main]">
            <div class="header"></div>
            <div class="bg">
                <div class="textbox">
                    Repositório de mini-projetos
                </div>
                <div class="haste"></div>
            </div>
            <div class="divisor"></div>
            <div class="page">
                <div v-for="card in cardlist" class="card">
                    <router-link :to="card.path">
                        <img class="card-imagem" :src="card.img" :alt="card.name">
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Home",
    props: [],
    components: {},
    data() {
        return {
            cardlist: [{
                name: "connect-4",
                path: "/con4",
                img: "https://bouncycastlenetwork-res.cloudinary.com/88d5fe1c177000a840ede7a2238cbfa1.jpg"
            }, {
                name: "fisherman",
                path: "/fisherman",
                img: "https://pescadordeportivo.files.wordpress.com/2017/07/pescador-deportivo.png"
            }, {
                name: "globe",
                path: "/globe",
                img: "https://www.pngkey.com/png/full/3-34977_globe-png-transparent-background-globe-png.png"
            }]
        }
    },
    methods: {},
    computed: {},
    watch: {}
}
</script>

<style scoped>
.main {
    width: 100%;
}
.header {
    height: 5vh;
    background-color: #31475e;
}
.bg {
    height: 90vh;
    background: url(../assets/main/img/vue_1200_630.jpg) center;
    background-size: cover;
    display: flex;
    flex-direction: column;
}

.textbox {
    width: 100%;
    height: calc(100% - 50px);
    background-color: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 60px;
    color: white;
    font-weight: bold;
    text-align: center;
}

@media (max-width: 500px) {
    .bg {
        height: 60vh;
    }

    .textbox {
        font-size: 40px;
    }
}

@media (max-width: 250px) {
    .bg {
        height: 30vh;
    }

    .textbox {
        font-size: 20px;
    }
}

.haste {
    width: 300px;
    height: 50px;
    background-color: #31475e;
    border-radius: 10px 10px 0 0;
    align-self: center;
}

.divisor {
    height: 20vh;
    background-color: #31475e;
}

.page {
    background-color: #f2f2f2;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    padding-top: 40px;
    padding-bottom: 40px;
}

.card {
    min-width: 300px;
    max-width: 300px;
    min-height: 300px;
    max-height: 300px;
    margin: 40px;
    background-color: #31475e;
    border-radius: 10px;
}

.card-imagem {
    width: 100%;
    height: 100%;
    border-radius: 10px;
}

@media (max-width: 500px) {
    .card {
        width: 250px;
        height: 250px;
    }
}

@media (max-width: 250px) {
    .card {
        width: 200px;
        height: 200px;
    }
}
</style>