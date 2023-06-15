<!--
    IDEIAS RESTANTES
    servidores
    deletar servidores automaticamente
    multiplayer online
    convidar por URL no multiplayer online
    vs bot
    interface do jogo melhorada
    opçao de jogar com mais de 2 jogadores

    manual de ligue-4

    tela de vitoria - adiada por falta de curso
    modais tela de multiplayer online - adiada por falta de curso
    desenho do close na landing page - adiada por falta de close
-->

<template>
    <div class="page">
        <div class="lobby" v-if="!interface.jogoAtivo">
            <template v-if="interface.fase === 1">
                <div class="landing-title">
                    <template v-if="lang === 'pt-BR' || lang === 'pt'">
                        LIGUE-4
                    </template>
                    <template v-else>
                        CONNECT-4
                    </template>
                </div>
                <div class="landing-main">
                    <div class="landing-main-half"></div>
                    <div class="landing-main-half">
                        <button @click="interface.fase = 2" class="landing-main-button">
                            <div class="landing-main-button-symbol"></div>
                        </button>
                    </div>
                </div>
            </template>
            <template v-else-if="interface.fase === 2">
                <div class="landing-title">
                    <template v-if="lang === 'pt-BR' || lang === 'pt'">
                        Escolha um modo de jogo
                    </template>
                    <template v-else>
                        Choose a game mode
                    </template>
                </div>
                <div class="landing-main">
                    <div class="landing-main-only">
                        <div class="landing-main-button-placeholder">
                            <span class="landing-main-button-text">Solo</span>
                            <button @click="interface.jogoAtivo = true" class="landing-main-button solo"></button>
                        </div>
                        <div class="landing-main-button-placeholder">
                            <span class="landing-main-button-text">Local</span>
                            <button @click="interface.jogoAtivo = true" class="landing-main-button local"></button>
                        </div>
                        <div class="landing-main-button-placeholder">
                            <span class="landing-main-button-text">Online</span>
                            <button @click="interface.fase = 3" class="landing-main-button online"></button>
                        </div>
                    </div>
                </div>
            </template>
            <template v-else-if="interface.fase === 3">
                <input @keydown.enter="login" type="text" placeholder="Nickname" v-model="dadosUsuario.nome">
            </template>
            <template v-else-if="interface.fase === 4">
                <template v-if="interface.jogadoresConectados.length === 0">
                    <button @click="criarServidor">criar servidor</button>
                    <h3>serverlist</h3>
                    <div class="serverlist">
                        <div @click="conectarServidor(servidor.serverId)" class="server" v-for="(servidor, i) in interface.servidores" :key=i>
                            <span>{{ servidor.serverName }}</span>
                            <span>{{ servidor.playerCount }}/{{ servidor.playerMax }}</span>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <div>
                        <h3>servidor conectado</h3>
                        <span>{{ interface.jogadoresConectados }}</span>
                    </div>
                </template>
            </template>
        </div>
        <div class="board-placeholder" v-else>
            <template v-for="(linha, iLinha) in matrizTiles">
                <div v-for="(coluna, iColuna) in linha" v-if="coluna.status === 1 || coluna.status === 2" :ref="`peca${iLinha}:${iColuna}`"
                    :key="`${iLinha}${iColuna}`" :style="{
                        marginLeft: `calc(var(--con4-board_tile_size) * ${((Math.floor(linha.length / 2)) - iColuna) * -2})`,
                        marginTop: `calc(var(--con4-board_tr_size) * ${(iLinha - 3.5) * 2})`
                    }" class="pecinha" :class="coluna.time === 1 ? 'vermelha' : 'amarela'"></div>
            </template>
            <div class="board-tbody">
                <div v-for="(linha, iLinha) in [...Array(matrizTiles.length - 1)]" :key="iLinha" class="board-tr">
                    <div v-for="(coluna, iColuna) in [...Array(matrizTiles[iLinha].length)]" :key="`${iLinha}${iColuna}`"
                        :ref="`espaco${iLinha}:${iColuna}`" class="board-tile" @mouseenter="men(false, iColuna)"
                        @mouseleave="mle(iLinha + 1, iColuna)" @click="cli(false, iLinha + 1, iColuna)">
                        <div class="board-circulo-placeholder"></div>
                    </div>
                </div>
            </div>
        </div>
        </div>
</template>

<script>
import axios from "../api/AxiosConfig"

export default {
    name: "Con4",
    props: [],
    components: {},
    data() {
        return {
            dadosUsuario: {
                userId: null,
                nome: ""
            },
            interface: {
                jogoAtivo: false,
                fase: 1,
                servidores: [],
                jogadoresConectados: []
            },
            game: {
                alternarTime: 1,
                ultimaPecaSelecionada: null,
                movimentacaoOcorrendo: false,
            },
            matrizTiles: [
                // Status
                // null: peça não está na posição nem em movimento
                // 1: peça está designada temporariamente à casa
                // 2: peça está designada permanentemente à casa
                // 3: peça está em movimento
                // Time
                // null: peça ainda não foi designada a um time
                // 1: peça é do time vermelho
                // 2: peça é do time amarelo
                [{ status: null, time: null }, { status: null, time: null }, { status: null, time: null }, { status: null, time: null }, { status: null, time: null }, { status: null, time: null }, { status: null, time: null }],
                [{ status: null, time: null }, { status: null, time: null }, { status: null, time: null }, { status: null, time: null }, { status: null, time: null }, { status: null, time: null }, { status: null, time: null }],
                [{ status: null, time: null }, { status: null, time: null }, { status: null, time: null }, { status: null, time: null }, { status: null, time: null }, { status: null, time: null }, { status: null, time: null }],
                [{ status: null, time: null }, { status: null, time: null }, { status: null, time: null }, { status: null, time: null }, { status: null, time: null }, { status: null, time: null }, { status: null, time: null }],
                [{ status: null, time: null }, { status: null, time: null }, { status: null, time: null }, { status: null, time: null }, { status: null, time: null }, { status: null, time: null }, { status: null, time: null }],
                [{ status: null, time: null }, { status: null, time: null }, { status: null, time: null }, { status: null, time: null }, { status: null, time: null }, { status: null, time: null }, { status: null, time: null }],
                [{ status: null, time: null }, { status: null, time: null }, { status: null, time: null }, { status: null, time: null }, { status: null, time: null }, { status: null, time: null }, { status: null, time: null }]
            ]
        }
    },
    methods: {
        men(outcall, iColuna) {
            return new Promise ((resolve, reject) => {
                if (!outcall) this.game.ultimaPecaSelecionada = { iLinha: 0, iColuna: iColuna }
                if (this.game.movimentacaoOcorrendo) return

                const linha = [...this.matrizTiles[0]]
                linha[iColuna].status = 1
                linha[iColuna].time = this.game.alternarTime
                this.$set(this.matrizTiles, 0, linha)
                resolve()
            })
        },
        mle(iLinha, iColuna) {
            this.game.ultimaPecaSelecionada = null
            if (this.game.movimentacaoOcorrendo) return

            const linha = [...this.matrizTiles[0]]
            
            if (linha[iColuna].status === 1) {
                linha[iColuna].status = null
                this.$set(this.matrizTiles, 0, linha)
            }
        },
        cli(outcall, iLinha, iColuna) {
            if (this.game.movimentacaoOcorrendo) return
            this.game.movimentacaoOcorrendo = true

            let linha = null
            // Checando onde a peca vai cair
            for(let i = this.matrizTiles.length-1; i >= 0; i--) {
                if (this.matrizTiles[i][iColuna].status === null) {
                    linha = [...this.matrizTiles[i]]
                    iLinha = i
                    break
                }
            }

            if (!linha) { this.game.movimentacaoOcorrendo = false; return }

            linha[iColuna].status = 3
            linha[iColuna].time = this.game.alternarTime
            this.$set(this.matrizTiles, iLinha, linha)

            const velocidade = 100 * iLinha
            const pecaAtual = this.$refs[`peca0:${iColuna}`][0].style
            pecaAtual.transition = `margin-top ${velocidade}ms linear`
            pecaAtual.marginTop = `calc(var(--con4-board_tr_size) * ${(iLinha - 3.5) * 2})`

            setTimeout(() => {
                pecaAtual.transition = ""
                
                this.game.alternarTime = this.game.alternarTime === 1 ? 2 : 1

                const linha2 = [...this.matrizTiles[0]]
                linha2[iColuna].status = null
                linha2[iColuna].time = null
                this.$set(this.matrizTiles, 0, linha2)

                linha[iColuna].status = 2
                this.$set(this.matrizTiles, iLinha, linha)

                // validar se usuario venceu o jogo
                const timeAtual = this.matrizTiles[iLinha][iColuna].time

                let
                direcoesGanhadoras = [],

                // busca horizontal

                pecasAdjacentes = 0,
                pecasGanhadoras = [{ iLinha: iLinha, iColuna: iColuna }],

                rodar = (left) => {
                    for(let i = 1; i < this.matrizTiles[iLinha].length; i++) {

                        const
                        indexColunaAtual = left ? iColuna + i : iColuna - i,
                        pecaObservada = this.matrizTiles[iLinha][indexColunaAtual]
                        
                        if (pecaObservada === undefined) break

                        if (pecaObservada.status === 2 && pecaObservada.time === timeAtual) {
                            pecasAdjacentes++
                            pecasGanhadoras.push({ iLinha: iLinha, iColuna: indexColunaAtual })
                        } else break
                    }
                }
                rodar(true)
                rodar(false)
                if (pecasAdjacentes >= 3) {
                    direcoesGanhadoras.push({ direcao: "h", pecas: pecasGanhadoras })
                }

                // validando vertical

                pecasAdjacentes = 0
                pecasGanhadoras = [{ iLinha: iLinha, iColuna: iColuna }]

                rodar = (left) => {
                    for(let i = 1; i < this.matrizTiles.length; i++) {

                        const
                        indexLinhaAtual = left ? iLinha + i : iLinha - i,
                        pecaObservada = this.matrizTiles[indexLinhaAtual]

                        if (pecaObservada === undefined) break

                        if (pecaObservada[iColuna].status === 2 && pecaObservada[iColuna].time === timeAtual) {
                            pecasAdjacentes++
                            pecasGanhadoras.push({ iLinha: indexLinhaAtual, iColuna: iColuna })
                        } else break
                    }
                }
                rodar(true)
                rodar(false)
                if (pecasAdjacentes >= 3) {
                    direcoesGanhadoras.push({ direcao: "v", pecas: pecasGanhadoras })
                }

                // validando diagonal inclinado para direita

                pecasAdjacentes = 0
                pecasGanhadoras = [{ iLinha: iLinha, iColuna: iColuna }]
                rodar = (left) => {
                    for(let i = 1; i < this.matrizTiles.length; i++) {

                        const
                        indexLinhaAtual = left ? iLinha + i : iLinha - i,
                        indexColunaAtual = left ? iColuna + i : iColuna - i,
                        pecaObservada = this.matrizTiles[indexLinhaAtual]

                        if (pecaObservada === undefined) break
                        if (pecaObservada[indexColunaAtual] === undefined) break

                        if (pecaObservada[indexColunaAtual].status === 2 && pecaObservada[indexColunaAtual].time === timeAtual) {
                            pecasAdjacentes++
                            pecasGanhadoras.push({ iLinha: indexLinhaAtual, iColuna: indexColunaAtual })
                        } else break
                    }
                }
                rodar(true)
                rodar(false)
                if (pecasAdjacentes >= 3) {
                    direcoesGanhadoras.push({ direcao: "r", pecas: pecasGanhadoras })
                }

                // validando diagonal inclinado para esquerda

                pecasAdjacentes = 0
                pecasGanhadoras = [{ iLinha: iLinha, iColuna: iColuna }]
                rodar = (left) => {
                    for(let i = 1; i < this.matrizTiles.length; i++) {

                        const
                        indexLinhaAtual = left ? iLinha + i : iLinha - i,
                        indexColunaAtual = left ? iColuna - i : iColuna + i,
                        pecaObservada = this.matrizTiles[indexLinhaAtual]

                        if (pecaObservada === undefined) break
                        if (pecaObservada[indexColunaAtual] === undefined) break

                        if (pecaObservada[indexColunaAtual].status === 2 && pecaObservada[indexColunaAtual].time === timeAtual) {
                            pecasAdjacentes++
                            pecasGanhadoras.push({ iLinha: indexLinhaAtual, iColuna: indexColunaAtual })
                        } else break
                    }
                }
                rodar(true)
                rodar(false)
                if (pecasAdjacentes >= 3) {
                    direcoesGanhadoras.push({ direcao: "l", pecas: pecasGanhadoras })
                }

                if (direcoesGanhadoras.length === 0) {
                    setTimeout(() => {
                        if (this.game.ultimaPecaSelecionada !== null) {
                            const linha = [...this.matrizTiles[this.game.ultimaPecaSelecionada.iLinha]]
                            linha[this.game.ultimaPecaSelecionada.iColuna].status = 1
                            linha[this.game.ultimaPecaSelecionada.iColuna].time = this.game.alternarTime
    
                            this.$set(this.matrizTiles, 0, linha)
                        }
                        this.game.movimentacaoOcorrendo = false
                    }, 300)
                } else {
                    alert("VITORIA!!!!!!!!!!!!!!!!!")
                    window.location.reload()
                }

            }, velocidade)
        },
        criarServidor() {
            this.socket.emit("con4:CREATE_SERVER", {
                serverName: "Servidor de " + this.dadosUsuario.nome,
                maxPlayers: 2
            })
        },
        async testeFuncionalidade(e) {
            if (e.keyCode !== 84) return

            // TODO
            //this.mle(this.ultimaPecaSelecionada.iLinha, this.ultimaPecaSelecionada.iColuna)
            this.movimentacaoOcorrendo = true
            await this.men(true, 2)
            this.cli(true, 2, 2)
            
        },
        login() {
            axios.get("/con4/serverlist")
            .then(res => {
                this.interface.servidores = res.data
            })
            .catch(console.log)

            this.socket.on("con4:SERVER_CREATED", res => {
                if (res.userId === this.dadosUsuario.userId) {
                    this.conectarServidor(res.serverId)
                }
                this.interface.servidores.push(res)
            })
            this.socket.on("con4:SERVER_DELETED", res => {
                for(let i = this.interface.servidores.length-1; i >= 0; i--) {
                    for(let j = 0; j < res.length; j++) {
                        if (this.interface.servidores[i].serverId === res[j]) {
                            this.interface.servidores.splice(i, 1)
                            break
                        }
                    }
                }
            })
            this.interface.fase = 4
        },
        conectarServidor(serverId) {
            this.socket.on("con4:SERVER_CONNECTED", res => {
                this.interface.jogadoresConectados = res
            })
            this.socket.emit("con4:CONNECT_SERVER", { serverId: serverId, userName: this.dadosUsuario.nome })
        }
    },
    computed: {
        socket() {
            return this.$store.state.socket
        },
        lang() {
            return navigator.language || navigator.userLanguage
        }
    },
    watch: {},
    mounted() {
        this.dadosUsuario.userId = this.socket.io.engine.id
    },
    created() {
        window.addEventListener("keydown", this.testeFuncionalidade)
    }
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
    height: 100vh;
}

.lobby {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
.landing-title {
    width: 500px;
    height: 30%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #003386;
    font-size: 60px;
    font-family: "Arial Black";
    text-align: center;
}
.landing-main {
    width: 100%;
    height: 60%;
    display: flex;
}
.landing-main-half {
    width: 50%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
.landing-main-only {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
.landing-main-button-placeholder {
    width: 20%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
}
.landing-main-button {
    width: 200px;
    height: 200px;
    background-color: #003386;
    border: 0;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background-size: 100%;
}
.landing-main-button-text {
    color: rgb(0, 0, 0);
    font-size: 30px;
    font-family: "Trebuchet MS";
    text-align: center;
    font-weight: bold;
}
.landing-main-button-symbol {
    border-top: 40px solid transparent;
    border-bottom: 40px solid transparent;
    border-left: 40px solid rgb(255, 255, 255);
}

.solo {
    background-image: url("../assets/con4/img/solo.png");
}
.local {
    background-image: url("../assets/con4/img/local.png");
}
.online {
    background-image: url("../assets/con4/img/online.png");
}

.serverlist {
    width: 500px;
    height: 500px;
    overflow-y: scroll;
}
.server {
    width: 100%;
    height: 50px;
    background-color: #003386;
    color: white;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    cursor: pointer;
}


/* Tabuleiro */
.board-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
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