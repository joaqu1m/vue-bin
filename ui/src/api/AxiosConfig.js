import axios from "axios"

const AxiosConfig = axios.create({
    baseURL: "http://localhost:3001",
    timeout: 1000,
    headers: {
        "Content-Type": "application/json",
    }
})

export default AxiosConfig