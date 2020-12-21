import axios from 'axios';

// axios.defaults.withCredentials = true

// const api = axios.create({})

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}

axios.interceptors.request.use(function (config) {
    // console.log('api-platform：', history.getItem('platform'))
    let token = getCookie("token");

    console.log("interceptors-token", token);
    // 是否已授权，是否有token
    if (token) {
        config.headers.common.Authorization = `Bearer ${token}`
    }
    return config
});

// axios.interceptors.request.use((config) => {
//     // console.log('Making request to ' + Cookie.get(AUTH_TOKEN))
//     // console.log('$cookies', Cookie.get('token'))
//     let token = Cookie.get(AUTH_TOKEN)
//     if (!token && config.headers.common && config.headers.common.cookie) {
//         token = config.headers.common.cookie.replace('auth.token=', '')
//     }
//     if (token) {
//         config.headers.common.Authorization = `Bearer ${token}`
//     }
//     config.paramsSerializer = params => qs.stringify(params, { arrayFormat: 'repeat' })
//     return config
// })


let host = 'http://shop.projectsedu.com';
let localhost = 'http://47.93.91.115:7418';
// let localhost = 'http://127.0.0.1:8000';
//let localhost = 'http://192.168.5.223:8000';
//let localhost = 'https://staging-stcsm-svr.marketbox.cn'

//-----------------User(用户)---------------------

//登录
export const login = params => {
    return axios.post(`${localhost}/login/`, params)
}

//获取分省季度数据
export const getProvinceSeasonData = params => {
    return axios.get(`${localhost}/data/statistical/`, {params: params})
};

//获取分省季度目录
export const getProvinceSeasonCatalog = params => {
    return axios.get(`${localhost}/data/catalog/season_data/`, {params: params})
};


//获取处理后的分省季度数据
export const getProcessSeasonData = params => {
    return axios.get(`${localhost}/process_data/season/`, {params: params})
};

//获取处理后的分省季度目录
export const getProcessSeasonCatalog = params => {
    return axios.get(`${localhost}/process_data/catalog/season_data/`, {params: params})
};

//上传CSV文件
export const UploadFile = formData => {
    return axios.post(`${localhost}/sample/upload/`, formData, {headers: {'Content-Type': 'multipart/form-data'}})
};

//上传文件测试
export const UploadFile2 = formData => {
    return axios.post(`${localhost}/v1/api/data_source/upload_csv/`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoyLCJuYW1lIjoiXHU5NjQ4XHU1YmI2XHU5YTg1IiwiZXh0cmEiOiIyMDIwLTAzLTE0IDE4OjIxOjU2In0.Ao5k5vmr5ASaRc3uyA3gJfZL-XDgwdEpT3E-ysbIQww'
        }
    })
};

//测试跨域
export const Testcors = params => {
    return axios.get(`${localhost}/v1/api/organization/`, {params: params})
};


//上次XLS文件
export const UploadXLSFile = formData => {
    return axios.post(`${localhost}/module/calcuate/upload/`, formData, {headers: {'Content-Type': 'multipart/form-data'}})
};

//上次XLS文件
export const UploadTarFile = formData => {
    return axios.post(`${localhost}/api/tar_upload/`, formData, {headers: {'Content-Type': 'multipart/form-data'}})
};


//计算
export const CalculateXLS = params => {
    return axios.get(`${localhost}/calculate/`, {params: params})
};

//计算
export const getReprt = params => {
    return axios.get(`${localhost}/v1/api/report/`, {params: params})
};


//计算
export const logOut = params => {
    return axios.get(`${localhost}/v1/api/accounts/logout`, {params: params})
};
