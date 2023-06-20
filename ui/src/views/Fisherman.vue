<template>
    <div>
        <div class="superficie">
            <div class="pescador"></div>
            <div class="linhaPlaceholder">
                <div class="linha" :style="{ height: tamanhoLinha }"></div>
            </div>
        </div>
        <div class="agua"></div>
    </div>
</template>

<script>
export default {
    name: "Fisherman",
    data() {
        return {
            tamanhoLinha: 0
        }
    },
    methods: {
        mouseMove({ clientY }) {
            this.tamanhoLinha = `calc(${clientY}px - var(--fisherman-altura-vara))`
        }
    },
    created() {
        window.addEventListener("mousemove", this.mouseMove)
    }
}
</script>

<style>
:root {
    --fisherman-surface-height: 20vh;
    
    /* Atributos que devem ser alterados sempre que o PNG da pasta for alterado */
    --fisherman-character-width: calc(var(--fisherman-surface-height) * 2.25);
    --fisherman-altura-vara: 55px;
}
</style>
<style scoped>
.superficie {
    height: 20vh;
}
.agua {
    background-color: rgb(199, 255, 255);
    height: 80vh;
}
.pescador {
    transform: scaleX(-1);
    width: var(--fisherman-character-width);
    height: var(--fisherman-surface-height);
    position: absolute;
    background-image: url(../assets/fisherman/img/Screenshot_56.png);
    background-position: center;
    background-size: contain;
    background-repeat: no-repeat;
}
.linhaPlaceholder {
    position: absolute;
    margin-left: var(--fisherman-character-width);
    width: 5px;
    height: 100vh;
}
.linha {
    width: 2px;
    background-color: black;
    margin-top: var(--fisherman-altura-vara);
}
</style>