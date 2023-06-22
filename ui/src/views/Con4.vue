<!--
    IDEIAS RESTANTES
    modais tela de multiplayer online
    interface do jogo melhorada
    convidar por URL no multiplayer online
    foto para sua bolinha
    animaçao pesquisando servidores
    vs bot
    opçao de jogar com mais de 2 jogadores
    manual de ligue-4 - videozinho legal feito em css

    desenho do close na landing page - adiada
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
                            <button @click="selecionarModo('solo')" class="landing-main-button solo"></button>
                        </div>
                        <div class="landing-main-button-placeholder">
                            <span class="landing-main-button-text">Local</span>
                            <button @click="selecionarModo('local')" class="landing-main-button local"></button>
                        </div>
                        <div class="landing-main-button-placeholder">
                            <span class="landing-main-button-text">Online</span>
                            <button @click="selecionarModo('online')" class="landing-main-button online"></button>
                        </div>
                    </div>
                </div>
            </template>
            <template v-else-if="interface.fase === 3">
                <template v-if="interface.jogadoresConectados.length === 0">
                    <button @click="criarServidor">criar servidor</button>
                    <h3>serverlist</h3>
                    <input class="serverlist-searchbar" placeholder="Pesquise por algo">
                    <transition-group name="serverlist" tag="div" class="serverlist">
                        <div @click="conectarServidor(servidor.serverId)" class="server" v-for="(servidor, i) in interface.servidores" :key=servidor.serverId>
                            <span>{{ servidor.serverName }}</span>
                            <span>{{ servidor.playerCount }}/{{ servidor.playerMax }}</span>
                        </div>
                    </transition-group>
                </template>
                <template v-else>
                    <div>
                        <h3>servidor conectado</h3>
                        <span>{{ interface.jogadoresConectados }}</span>
                        <button @click="iniciarJogo">Iniciar jogo</button>
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
                        @mouseleave="mle(false, iLinha + 1, iColuna)" @click="cli(false, iLinha + 1, iColuna)">
                        <div class="board-circulo-placeholder"></div>
                    </div>
                </div>
            </div>
        </div>
        <ModalGlobal efeito="canhao" animacao="modal" :modalAberto="interface.modalVitoria" width="70vh">
            <div style="width: 100%; height: 21vh; display: flex; justify-content: center; align-items: center;">
                <h1 style="text-align: center;" :style="{ color: game.jogadorVencedor == 1 ? '#e43e2b' : '#ffe932' }">
                    Vitória do jogador {{ game.jogadorVencedor }}
                </h1>
            </div>
            <div style="width: 75%; height: 28vh;" v-if="false"></div>
            <div style="width: 100%; height: 21vh; display: flex; justify-content: center; align-items: center;">
                <button style="
                width: 200px;
                height: 50px;
                cursor: pointer;
                border-radius: 20px;
                background-color: #003386;
                color: white;
                border: 1px gray solid;
                " @click="retornar">Retornar ao início</button>
            </div>
        </ModalGlobal>
        <ModalGlobal animacao="modal" :modalAberto="interface.modalNickname" width="70vh">
            <div style="
            width: 100%;
            height: 14vh;
            display: flex;
            align-items: center;
            justify-content: center;
            ">
                <h2 v-if="lang === 'pt-BR' || lang === 'pt'">Escolha um nickname para continuar</h2>
                <h2 v-else>Type a nickname to continue</h2>
            </div>
            <div style="width: 100%; height: 28vh; display: flex; align-items: center; justify-content: space-evenly; flex-direction: column;">
                <input type="text" style="width: 250px; height: 30px; border-radius: 5px; border: 1px solid rgb(185, 185, 185); padding: 5px;" placeholder="Nickname" @keydown.enter="aceitarNickname" v-model="dadosUsuario.userName">
                <button style="
                width: 200px;
                height: 30px;
                cursor: pointer;
                border-radius: 5px;
                background-color: #003386;
                color: white;
                font-weight: bold;
                border: 1px gray solid;
                " @click="aceitarNickname">
                <template v-if="lang === 'pt-BR' || lang === 'pt'">
                    Avançar
                </template>
                <template v-else>
                    Continue
                </template>
            </button>
            </div>
        </ModalGlobal>
        </div>
</template>

<script>
import axios from "../api/AxiosConfig"
import ModalGlobal from "../components/ModalGlobal.vue"

export default {
    name: "Con4",
    components: {
        ModalGlobal
    },
    data() {
        return {
            dadosUsuario: {
                userId: null,
                userName: "",
                serverId: null,
                serverName: null,
                playerCount: null,
                maxPlayers: 2
            },
            interface: {
                jogoAtivo: false,
                fase: 1,
                servidores: [],
                jogadoresConectados: [],
                modalVitoria: false,
                modalNickname: false
            },
            game: {
                alternarTime: 1,
                ultimaPecaSelecionada: null,
                movimentacaoOcorrendo: false,
                modeSettings: {
                    modo: null,
                    jogadorAtual: false,
                    ultimoJogador: null
                },
                jogadorVencedor: null
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
                if (this.game.movimentacaoOcorrendo || (this.game.modeSettings.modo == "online" && !this.game.modeSettings.jogadorAtual)) return

                const linha = [...this.matrizTiles[0]]
                linha[iColuna].status = 1
                linha[iColuna].time = this.game.alternarTime
                this.$set(this.matrizTiles, 0, linha)
                resolve()
            })
        },
        mle(outcall, iLinha, iColuna) {
            return new Promise((resolve, reject) => {
                if (!outcall) this.game.ultimaPecaSelecionada = null
                if (this.game.movimentacaoOcorrendo || (this.game.modeSettings.modo == "online" && !this.game.modeSettings.jogadorAtual)) return
    
                const linha = [...this.matrizTiles[0]]
                
                if (linha[iColuna].status === 1) {
                    linha[iColuna].status = null
                    this.$set(this.matrizTiles, 0, linha)
                }
                resolve()
            })
        },
        cli(outcall, iLinha, iColuna) {
            if (this.game.movimentacaoOcorrendo || (this.game.modeSettings.modo == "online" && !this.game.modeSettings.jogadorAtual)) return
            this.game.movimentacaoOcorrendo = true

            if (!outcall) this.emitirJogada(iLinha, iColuna)

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
            pecaAtual.transition = `margin-top linear ${velocidade / 1000}s`
            setTimeout(() => {
                pecaAtual.marginTop = `calc(var(--con4-board_tr_size) * ${(iLinha - 3.5) * 2})`
            }, 1)

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
                            if (this.game.modeSettings.modo == "online" && !outcall) {} else {
                                const linha = [...this.matrizTiles[this.game.ultimaPecaSelecionada.iLinha]]
                                linha[this.game.ultimaPecaSelecionada.iColuna].status = 1
                                linha[this.game.ultimaPecaSelecionada.iColuna].time = this.game.alternarTime
                                
                                this.$set(this.matrizTiles, 0, linha)
                            }
                        }
                        this.game.movimentacaoOcorrendo = false

                    }, 300)
                } else {

                    setTimeout(() => {
                        if (this.game.modeSettings.modo == "local") {
                            this.vitoriaOcorreu(
                                this.game.alternarTime === 1 ? 2 : 1,
                                direcoesGanhadoras
                            )
                        } else if (this.game.modeSettings.modo == "online") {
                            this.vitoriaOcorreu(
                                this.game.modeSettings.ultimoJogador,
                                direcoesGanhadoras
                            )
                        }
                    }, 1)

                }

            }, velocidade)
        },
        vitoriaOcorreu(jogador, direcoes) {
            
            for(let i = 0; i < direcoes.length; i++) {
                const direcaoAtual = direcoes[i]
                
                if (direcaoAtual.direcao === "h") {
                    const pecas = direcaoAtual.pecas.map(p => p.iColuna)
                    const pecaMaisAEsquerda = Math.min(...pecas)
                    const tamanhoArea = Math.max(...pecas) - pecaMaisAEsquerda + 1

                    const novaDiv = document.createElement("div")
                    novaDiv.style.zIndex = "10"
                    novaDiv.style.height = "calc(var(--con4-board_circle_size) * 1.3)"
                    novaDiv.style.width = `calc(var(--con4-board_tile_size) * ${tamanhoArea})`
                    novaDiv.style.left = "0"
                    novaDiv.style.borderRadius = "var(--con4-board_circle_size)"
                    novaDiv.style.backgroundColor = "#4986e76e"
                    novaDiv.style.position = "absolute"

                    this.$refs[`espaco${direcaoAtual.pecas[0].iLinha - 1}:${pecaMaisAEsquerda}`][0].appendChild(novaDiv)
                } else if (direcaoAtual.direcao === "v") {
                    const pecas = direcaoAtual.pecas.map(p => p.iLinha)
                    const maisAcima = Math.min(...pecas)
                    const tamanhoArea = Math.max(...pecas) - maisAcima + 1

                    const novaDiv = document.createElement("div")
                    novaDiv.style.zIndex = "10"
                    novaDiv.style.height = `calc(var(--con4-board_tr_size) * ${tamanhoArea})`
                    novaDiv.style.width = "calc(var(--con4-board_circle_size) * 1.3)"
                    novaDiv.style.top = "0"
                    novaDiv.style.borderRadius = "var(--con4-board_circle_size)"
                    novaDiv.style.backgroundColor = "#4986e76e"
                    novaDiv.style.position = "absolute"

                    this.$refs[`espaco${maisAcima - 1}:${direcaoAtual.pecas[0].iColuna}`][0].appendChild(novaDiv)
                } else if (direcaoAtual.direcao === "r") {
                    // da direita cima => esquerda baixo
                    const pecasLinha = direcaoAtual.pecas.map(p => p.iLinha)
                    const pecasColuna = direcaoAtual.pecas.map(p => p.iColuna)

                    const qtdPecasHorizontal = Math.max(...pecasColuna) - Math.min(...pecasColuna) + 1
                    const qtdPecasVertical = Math.max(...pecasLinha) - Math.min(...pecasLinha) + 1

                    let board_tr_size = getComputedStyle(document.documentElement).getPropertyValue("--con4-board_tr_size")
                    let board_tile_size = getComputedStyle(document.documentElement).getPropertyValue("--con4-board_tile_size")
                    
                    const trocarCaractere = (texto, charAtual, charIntencionado) => {
                        while (texto.indexOf(charAtual) > -1) {
                            texto = texto.replace(charAtual, charIntencionado)
                        }
                        return texto
                    }

                    board_tr_size = eval(trocarCaractere(trocarCaractere(board_tr_size, "vw", ""), "calc", ""))
                    board_tile_size = eval(trocarCaractere(trocarCaractere(board_tile_size, "vw", ""), "calc", ""))
                    
                    const catetoOposto = qtdPecasVertical * board_tr_size
                    const catetoAdjacente = qtdPecasHorizontal * board_tile_size

                    const graus = Math.atan(catetoOposto / catetoAdjacente) * (180 / Math.PI)

                    const novaDiv = document.createElement("div")
                    
                    novaDiv.style.transform = `rotate(${graus - 90}deg)`

                    novaDiv.style.height = `${(((board_tile_size ** 2) + (board_tr_size ** 2)) ** 0.5) * qtdPecasHorizontal}vw`

                    novaDiv.style.zIndex = "10"
                    novaDiv.style.width = "calc(var(--con4-board_circle_size) * 1.3)"
                    novaDiv.style.left = "calc(var(--con4-board_circle_size) * 1.3 / 2 * -1)"
                    novaDiv.style.top = "0"
                    novaDiv.style.transformOrigin = "center top"
                    novaDiv.style.borderRadius = "var(--con4-board_circle_size)"
                    novaDiv.style.backgroundColor = "#4986e76e"
                    novaDiv.style.position = "absolute"

                    this.$refs[`espaco${Math.min(...pecasLinha) - 1}:${Math.min(...pecasColuna)}`][0].appendChild(novaDiv)
                } else if (direcaoAtual.direcao === "l") {
                    const pecasLinha = direcaoAtual.pecas.map(p => p.iLinha)
                    const pecasColuna = direcaoAtual.pecas.map(p => p.iColuna)

                    const qtdPecasHorizontal = Math.max(...pecasColuna) - Math.min(...pecasColuna) + 1
                    const qtdPecasVertical = Math.max(...pecasLinha) - Math.min(...pecasLinha) + 1

                    let board_tr_size = getComputedStyle(document.documentElement).getPropertyValue("--con4-board_tr_size")
                    let board_tile_size = getComputedStyle(document.documentElement).getPropertyValue("--con4-board_tile_size")
                    
                    const trocarCaractere = (texto, charAtual, charIntencionado) => {
                        while (texto.indexOf(charAtual) > -1) {
                            texto = texto.replace(charAtual, charIntencionado)
                        }
                        return texto
                    }

                    board_tr_size = eval(trocarCaractere(trocarCaractere(board_tr_size, "vw", ""), "calc", ""))
                    board_tile_size = eval(trocarCaractere(trocarCaractere(board_tile_size, "vw", ""), "calc", ""))
                    
                    const graus = Math.atan(
                        (qtdPecasHorizontal * board_tile_size)
                        /
                        (qtdPecasVertical * board_tr_size)
                    ) * (180 / Math.PI)

                    const novaDiv = document.createElement("div")
                    
                    novaDiv.style.transform = `rotate(${graus}deg)`

                    novaDiv.style.height = `${(((board_tile_size ** 2) + (board_tr_size ** 2)) ** 0.5) * qtdPecasHorizontal}vw`

                    novaDiv.style.zIndex = "10"
                    novaDiv.style.width = "calc(var(--con4-board_circle_size) * 1.3)"
                    novaDiv.style.left = "calc(var(--con4-board_tile_size) + (var(--con4-board_circle_size) * 1.3 / 2 * -1))"
                    novaDiv.style.top = "0"
                    novaDiv.style.transformOrigin = "center top"
                    novaDiv.style.borderRadius = "var(--con4-board_circle_size)"
                    novaDiv.style.backgroundColor = "#4986e76e"
                    novaDiv.style.position = "absolute"

                    this.$refs[`espaco${Math.min(...pecasLinha) - 1}:${Math.max(...pecasColuna)}`][0].appendChild(novaDiv)

                }

                this.game.jogadorVencedor = jogador
                setTimeout(() => { this.interface.modalVitoria = true }, 1000)
            }
        },
        criarServidor() {
            this.dadosUsuario.serverName = "Servidor de " + this.dadosUsuario.userName
            this.socket.emit("con4:CREATE_SERVER", {
                serverName: this.dadosUsuario.serverName,
                maxPlayers: this.dadosUsuario.maxPlayers
            })
        },
        async jogarAsync(iLinha, iColuna) {
            if (this.game.ultimaPecaSelecionada !== null) await this.mle(true, 0, this.game.ultimaPecaSelecionada.iColuna)
            await this.men(true, iColuna)
            this.cli(true, iLinha, iColuna)
        },
        conectarServidor(serverId) {
            this.dadosUsuario.serverId = serverId
            this.socket.emit("con4:SESSION", {
                tipoReq: "connect",
                serverId: this.dadosUsuario.serverId,
                userName: this.dadosUsuario.userName
            })
        },
        iniciarJogo() {
            this.socket.emit("con4:SESSION", {
                tipoReq: "start",
                serverId: this.dadosUsuario.serverId
            })
        },
        selecionarModo(modo) {
            this.game.modeSettings.modo = modo
            if (modo == "solo" || modo == "local") {
                this.interface.jogoAtivo = true
            } else if (modo == "online") {
                this.interface.modalNickname = true
            }
        },
        retornar() {
            window.location.reload()
        },
        aceitarNickname() {
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
            this.socket.on("con4:SESSION_RES", res => {
                switch (res.tipoReq) {
                    case "connect":
                        console.log(res)
                        this.interface.jogadoresConectados = res.info
                        break
                    case "start":
                        this.interface.jogoAtivo = true
                        if (res.info === this.dadosUsuario.userId) {
                            this.game.modeSettings.jogadorAtual = true
                        }
                        break
                    case "round":
                        this.game.modeSettings.ultimoJogador = res.nomeResponsavel

                        this.game.modeSettings.jogadorAtual = res.proximo.userId == this.dadosUsuario.userId
                        
                        if (res.responsavel == this.dadosUsuario.userId) return
                        

                        this.jogarAsync(res.pos.iLinha, res.pos.iColuna)

                        break
                }
            })

            this.interface.modalNickname = false
            this.interface.fase = 3
        },
        emitirJogada(iLinha, iColuna) {
            this.game.modeSettings.jogadorAtual = false
            this.socket.emit("con4:SESSION", {
                tipoReq: "round",
                serverId: this.dadosUsuario.serverId,
                userName: this.dadosUsuario.userName,
                pos: {
                    iLinha,
                    iColuna
                }
            })
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

@media (max-width: 600px) {
    .landing-title {
        width: 100%;
        font-size: 40px;
    }
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
    gap: normal 40px;
    flex-wrap: wrap;
}
.landing-main-button-placeholder {
    width: 20%;
    min-width: 200px;
    height: 80%;
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

.serverlist-searchbar {
    width: 800px;
    height: 50px;
    padding: 0;
    border: 1px solid rgb(185, 185, 185);
    margin: 0;
    font-size: 20px;
    text-indent: 10px;
}
.serverlist {
    width: 800px;
    height: 400px;
    overflow-y: scroll;
    border: 1px solid rgb(185, 185, 185);
}

.serverlist-enter-active,
.serverlist-leave-active {
    transition: all 0.5s;
}

.serverlist-enter,
.serverlist-leave-to {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
}

.serverlist-move {
    transition: transform 0.3s;
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