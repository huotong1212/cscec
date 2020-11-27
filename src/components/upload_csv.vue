<template>
    <div>
        <el-upload class="uploadfile" action="" :http-request='uploadFileMethod' :show-file-list="false" multiple>
            <el-button class="custom-btn" size="small">上传</el-button>
        </el-upload>
        <el-button class="custom-btn" size="small" v-on:click="Testcors">测试跨域</el-button>

    </div>
</template>

<script>
    import {Testcors, UploadFile, UploadFile2} from "@/api/api";

    export default {
        name: "upload_csv",
        data() {
            return {
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
            uploadFileMethod(param) {
                console.log(param)
                let fileObject = param.file;
                let formData = new FormData();
                formData.append("file", fileObject);
                formData.append("role", 'other_img');

                UploadFile2(
                    formData
                ).then((response) => {
                    console.log("response==", response);
                }).catch(function (error) {
                    console.log("message======================", message);
                });
            },
            Testcors() {
                Testcors({}).then((response) => {
                    console.log("---ok");
                    console.log(response.data);
                }).catch(function (error) {
                    console.log('error', error);
                });
            }
        }
    }
</script>

<style scoped>

</style>
