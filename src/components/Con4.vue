<template>
    <div class="page">
        <template v-for="(linha, iLinha) in matrizTiles">
            <div v-for="({status}, iColuna) in linha" v-if="status !== null" :ref="`peca${iLinha}:${iColuna}`"
                :key="`${iLinha}${iColuna}`" :style="{
                    marginLeft: `calc(var(--con4-board_tile_size) * ${((Math.floor(linha.length / 2)) - iColuna) * -2})`,
                    marginTop: `calc(var(--con4-board_tr_size) * ${(iLinha - 3.5) * 2})`
                }" class="pecinha" :class="status ? 'vermelha' : 'amarela'"></div>
        </template>
        <div class="board-tbody">
            <div v-for="(linha, iLinha) in [...Array(matrizTiles.length - 1)]" :key="iLinha" class="board-tr">
                <div v-for="(coluna, iColuna) in [...Array(matrizTiles[iLinha].length)]" :key="`${iLinha}${iColuna}`"
                    :ref="`espaco${iLinha}:${iColuna}`" class="board-tile" @mouseenter="men(iColuna)"
                    @mouseleave="mle(iLinha + 1, iColuna)" @click="cli(iLinha + 1, iColuna)">
                    <div class="board-circulo-placeholder"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Con4",
    props: [],
    components: {},
    data() {
        return {
            matrizTiles: [...Array(7)].fill([...Array(7)].fill({
                status: null
            }))
        }
    },
    methods: {
        men(iColuna) {
            this.matriz[0][0].status = true
        },
        mle(iLinha, iColuna) {
            const linha = [...this.matrizTiles[0]]
            linha[iColuna].status = null
            this.$set(this.matrizTiles, 0, linha)
        },
        cli(iLinha, iColuna) {
            // this.acaoOcorrendo = true
            const linha = [...this.matrizTiles[iLinha]]
            linha[iColuna].status = true
            // this.matrizTilesUsadas[iLinha] = linha
            // const velocidade = 100 * iLinha
            // const pecaAtual = this.$refs[`peca0:${iColuna}`][0].style
            // pecaAtual.transition = `margin-top ${velocidade}ms linear`
            // pecaAtual.marginTop = `calc(var(--con4-board_tr_size) * ${(iLinha - 3.5) * 2})`
            // setTimeout(() => {
            //    this.acaoOcorrendo = false
            // pecaAtual.transition = ""
            this.$set(this.matrizTiles, iLinha, linha)
            // }, velocidade)
        }
    },
    computed: {},
    watch: {}
}
</script>

<style>
:root {
    --con4-board_height: calc(80vw / 2.2);
    --con4-board_width: calc(60vw);

    --con4-board_tr_size: calc(var(--con4-board_height) / 6);
    --con4-board_tile_size: calc(var(--con4-board_width) / 7);
    --con4-board_circle_size: calc(var(--con4-board_height) / 8);
}
</style>
<style scoped>
.page {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
}

.board-tbody {
    height: var(--con4-board_height);
    width: var(--con4-board_width);
    display: flex;
    flex-direction: column;
}

.board-tr {
    height: var(--con4-board_tr_size);
    width: var(--con4-board_width);
    display: flex;
}

.board-tile {
    height: var(--con4-board_tr_size);
    width: var(--con4-board_tile_size);
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
}

.board-circulo-placeholder {
    height: var(--con4-board_circle_size);
    width: var(--con4-board_circle_size);
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    border-top: calc(((var(--con4-board_tr_size) - var(--con4-board_circle_size)) / 2) + 1px);
    border-bottom: calc(((var(--con4-board_tr_size) - var(--con4-board_circle_size)) / 2) + 1px);
    border-left: calc(((var(--con4-board_tile_size) - var(--con4-board_circle_size)) / 2) + 1px);
    border-right: calc(((var(--con4-board_tile_size) - var(--con4-board_circle_size)) / 2) + 1px);
    border-color: #003386;
    border-style: solid;
    background-image: url("../assets/con4/img/tilemask.png");
    background-size: cover;
}

.pecinha {
    height: calc(var(--con4-board_circle_size) * 0.8);
    width: calc(var(--con4-board_circle_size) * 0.8);
    border: calc(var(--con4-board_circle_size) * 0.15) solid;
    border-radius: 50%;
    position: absolute;
}

.vermelha {
    background-color: #e43e2b;
    border-color: #b43224;
}

.amarela {
    background-color: #ffe932;
    border-color: #d1c028;
}
</style>