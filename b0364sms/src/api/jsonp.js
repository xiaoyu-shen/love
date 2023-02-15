import jsonp from 'jsonp'
export function reqWeather(city) {
    const url = 'https://www.yiketianqi.com/free/day?appid=99575847&appsecret=YkxXu8Fq&city=%E5%93%88%E5%B0%94%E6%BB%A8'

    return new Promise((resolve, reject) => {
        jsonp(url, {
            param: 'callback',
        }, (error, response) => {
            console.log(response);
            if (!error && response.cityid) {
                const { wea, wea_img, tem_night, tem_day } = response
                resolve({ wea, wea_img, tem_night, tem_day })
            } else {
                alert("获取天气信息失败")
            }
        })
    })
}