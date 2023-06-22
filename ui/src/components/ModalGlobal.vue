<template>
    <div class="background" v-if="modalAberto">
        <Transition appear :name="animacao">
            <div class="modal" :style="{ width: width, height: height }">
                    <slot></slot>
            </div>
        </Transition>
        <template v-if="efeito == 'canhao'">
            <img class="efeito" v-if="efeito !== 'none'" src="../assets/con4/gif/canhaoconfetti.gif" alt="canhao de confetti"
            style="left: 0;">
            <img class="efeito" v-if="efeito !== 'none'" src="../assets/con4/gif/canhaoconfetti.gif" alt="canhao de confetti"
            style="right: 0; transform: rotateY(180deg);">
        </template>
    </div>
</template>

<script>
export default {
    name: "ModalGlobal",
    props: ["width", "height", "modalAberto", "animacao", "efeito"],
    components: {},
    data() {
        return {}
    },
    methods: {},
    computed: {},
    watch: {}
}
</script>

<style scoped>
.background {
    background-color: rgba(0, 0, 0, 0.3);
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
}
.modal {
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
}

.efeito {
    width: 50%;
    position: absolute;
    bottom: 0;
    pointer-events: none;
}

.modal-enter-active,
.modal-leave-active {
    transition: all 0.3s;
}

.modal-enter,
.modal-leave-to {
    opacity: 1;
    transform: scale(0.5);
}

</style>