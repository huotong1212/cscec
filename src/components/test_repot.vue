<template>
    <div>
        <h1>测试获取Session</h1>
        <el-button class="custom-btn" size="small" v-on:click="getReport">获取报告</el-button>
        <el-button class="custom-btn" size="small" v-on:click="changeUrl">跳转页面</el-button>
        <el-button class="custom-btn" size="small" v-on:click="logOut">退出登录</el-button>

    </div>
</template>

<script>
    import {getReprt, logOut, Testcors, UploadFile, UploadFile2} from "@/api/api";

    export default {
        name: "upload_csv",
        data() {
            return {
                session_key: "",
                fileList: [{
                    name: 'food.jpeg',
                    url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
                }, {
                    name: 'food2.jpeg',
                    url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
                }]
            };
        },
        methods: {
            getReport() {
                getReprt({}).then((response) => {
                    console.log("---ok");
                    console.log(response.data);
                }).catch(function (error) {
                    console.log('error', error);
                });
            },
            logOut() {
                // TODO 清除Cookie Token
                document.cookie = "";

                window.location.href = "http://localhost:8000/v1/api/accounts/session?logout=true";
            },
            changeUrl() {
                window.location.href = "http://localhost:8000/v1/api/accounts/session";
            },
            addCookie(name, value, expireDays) {
                let cookieString = name + "=" + escape(value);
                //判断是否设置过期时间
                if (expireDays > 0) {
                    let date = new Date();
                    date.setTime(date.getTime + expireDays * 24 * 3600 * 1000);
                    cookieString = cookieString + "; expire=" + date.toGMTString();
                }
                document.cookie = cookieString;
            }
        },
        mounted: function () {
            // 取到了，vue已经渲染过了
            // 应用，操作DOM
            console.log("------mount");
            console.log(this.$route.query);

            let params = this.$route.query;
            const sessionid = params.sessionid;
            this.session_key = sessionid;
            const token = params.token;
            console.log("token", token);

            if (sessionid) {
                this.addCookie("sessionid", sessionid, 30);
                this.addCookie("token", token, 30);

                // alert("add session "+ sessionid);
            } else {
                this.changeUrl();
            }

        }
    }
</script>

<style scoped>

</style>
