import request from "../utils/request";

export default {
    test() {
        request({
            url: '/test',
            method: 'get'
        }).then(response => {
            console.log(response);
        }).catch(error => {
            console.log(error);
        })
    }
}