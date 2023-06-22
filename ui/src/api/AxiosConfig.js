import axios from "axios"

const AxiosConfig = axios.create({
    baseURL: "http://10.18.6.155:3001",
    timeout: 1000,
    headers: {
        "Content-Type": "application/json",
    }
})

export default AxiosConfig