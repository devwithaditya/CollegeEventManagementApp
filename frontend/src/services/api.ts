import axios from "axios";

const api = axios.create({
    baseURL: "http://docker-aws-alb-827173914.ap-northeast-1.elb.amazonaws.com/api",
    withCredentials: true,
});

export default api;