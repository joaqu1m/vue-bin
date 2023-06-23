<template>
    <div>
        <h2>código gerado a partir do plugin AutoHTML do figma</h2>
        <component :is="componente" />
        <button @click="alternar">alternar</button> <br>
        <iframe
        height="300"
        width="400"
        src="https://www.figma.com/embed?embed_host=astra&url=
            https://www.figma.com/proto/HwExhrd8ybtX5QUuDWbs2I/playground"
        />
    </div>
</template>

<script>
import SwitchSwitchOn from "../components/daytimeswitch/SwitchSwitchOn.vue";
import SwitchSwitchOff from "../components/daytimeswitch/SwitchSwitchOff.vue";

export default {
	name: "DaytimeSwitch",
	components: {
		SwitchSwitchOn,
		SwitchSwitchOff
	},
	data() {
		return {
			componente: "SwitchSwitchOff"
		}
	},
	methods: {
		alternar() {
			this.componente = this.componente === "SwitchSwitchOff" ? "SwitchSwitchOn" : "SwitchSwitchOff"
		}
	}
}
</script>