<template>
    <div>
        <el-container>
            <el-header>
                <h2>中建五局大数据分析项目</h2>

            </el-header>
            <el-container>
                <el-main>
                    <div>
                        <div>
                            <el-row>
                                <el-col :span="8">
                                    <div>

                                        <el-upload class="upload-demo" action="材料表" :file-list="fileList1"
                                                   :on-change="handleChange1" :http-request="uploadFile"
                                                   :show-file-list="true" multiple>
                                            <el-button class="custom-btn" size="small" type="primary">上传材料表</el-button>
                                        </el-upload>
                                    </div>
                                </el-col>
                                <el-col :span="8">
                                    <el-upload class="upload-demo" action="劳务表" :file-list="fileList2"
                                               :on-change="handleChange2" :http-request="uploadFile"
                                               :show-file-list="true" multiple>
                                        <el-button class="custom-btn" size="small" type="primary">上传劳务表</el-button>
                                    </el-upload>
                                </el-col>
                                <el-col :span="8">
                                    <div>
                                        <el-upload class="upload-demo" action="计算模型" :on-change="handleChange3"
                                                   :file-list="tarFileList" :http-request="uploadTarFile"
                                                   :show-file-list="true" multiple>
                                            <el-button class="custom-btn" size="small" type="primary">上传计算模型</el-button>
                                        </el-upload>
                                    </div>
                                </el-col>
                            </el-row>
                            <div class="tableTitle"></div>

                            <el-row>
                                <el-col :span="12"></el-col>
                                <el-col :span="24">
                                    <div>
                                        <span class="login-tips"> 请选择需要计算的项目：</span>
                                        <el-select style="width: 300px" v-model="row_value" clearable placeholder="请选择">
                                            <el-option
                                                    v-for="item in options"
                                                    :key="item.value"
                                                    :label="item.label"
                                                    :value="item.value">
                                            </el-option>
                                        </el-select>
                                        &emsp;
                                        <el-button type="primary" size="small" v-on:click="CalculateXLS">计算</el-button>
                                        <el-button type="primary" size="small" v-on:click="correctData">修正</el-button>
                                        <el-button type="primary" size="small" v-on:click="resetData">重置</el-button>

                                    </div>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="12"></el-col>
                                <el-col :span="24">
                                    <div>
                                        <span class="login-tips"> ：</span>
                                        <el-select style="width: 300px" v-model="row_value" clearable placeholder="请选择">
                                            <el-option
                                                    v-for="item in options"
                                                    :key="item.value"
                                                    :label="item.label"
                                                    :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>

                        <div>
                            <el-table
                                    v-loading="loading"
                                    :data="tableData"
                                    border
                                    :span-method="objectSpanMethod"
                                    style="width: 100%">
                                <el-table-column
                                        prop="project_name"
                                        label="项目名称">
                                </el-table-column>
                                <el-table-column
                                        prop="area_type"
                                        label="指标"
                                        width="180">
                                </el-table-column>
                                <el-table-column
                                        sortable
                                        label="指标量">
                                    <template scope="scope">
                                        <span>{{scope.row.total_area}}</span>
                                        <el-input class="input" size="mini" v-model="scope.row.area"
                                                  placeholder="请输入内容">
                                            <i slot="suffix" class="el-icon-edit"></i>
                                        </el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        sortable
                                        label="计算基数">
                                    <template scope="scope">
                                        <span>{{scope.row.total_steel}}</span>
                                        <el-input class="input" size="mini" v-model="scope.row.steel"
                                                  placeholder="请输入内容">
                                            <i slot="suffix" class="el-icon-edit"></i>
                                        </el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        prop="KM"
                                        sortable
                                        label="单位指标">
                                </el-table-column>
                            </el-table>
                        </div>
                    </div>
                </el-main>


            </el-container>
        </el-container>
    </div>
</template>

<script>
    import {CalculateXLS, UploadFile, UploadTarFile, UploadXLSFile} from "@/api/api";

    export default {
        name: "cscec",
        data() {
            return {
                row_value: '',
                options: [],
                tableData: [],
                backupData: [],
                tarFileList: [],
                fileList1: [],
                fileList2: [],
                loading: false,
                calData: {
                    area: {
                        area_all: '',
                        area_ag: '',
                        area_ug: ''
                    },
                    steel: {
                        steel_all: '',
                        steel_ag: '',
                        steel_ug: ''
                    },
                    concrete: {
                        concrete_all: '',
                        concrete_ag: '',
                        concrete_ug: ''
                    }
                }
            };
        },
        methods: {
            handleCurrentChange(row, event, column) {
                console.log(row, event, column, event.currentTarget)
            },
            handleEdit(index, row) {
                console.log(index, row);
            },
            handleDelete(index, row) {
                console.log(index, row);
            },
            resetData() {
                //this.tableData = this.backupData;
                this.tableData = JSON.parse(JSON.stringify(this.backupData));
            },
            correctData() {
                console.log('click correctData ...');

                // 填充数据
                Object.keys(this.calData).forEach((key) => {
                    let key_data = this.calData[key];
                    let i = 0;
                    Object.keys(key_data).forEach((val) => {
                        // console.log(i);
                        // console.log(val,key_data[val]);
                        // console.log(this.tableData[i][key]);
                        key_data[val] = this.tableData[i][key];
                        i = i + 1;
                    });
                });
                console.log('cal----', this.calData);

                // 总量
                if (this.calData.area.area_ag && this.calData.area.area_all && this.calData.area.area_ug) {
                    // 如果值全在
                    if (Number(this.calData.area.area_all) !== (Number(this.calData.area.area_ag) + Number(this.calData.area.area_ug))) {
                        this.$message({
                            type: 'error',
                            message: '数据错误，请检查'
                        });
                        return;
                    }
                } else if (!this.calData.area.area_ag && !this.calData.area.area_all && !this.calData.area.area_ug) {
                    // 如果值全都不存在
                    //面积赋值
                    this.calData.area.area_all = this.tableData[0].total_area;
                    this.calData.area.area_ag = this.tableData[1].total_area;
                    this.calData.area.area_ug = this.tableData[2].total_area;
                } else if (this.calData.area.area_all && this.calData.area.area_ag) {
                    // 如果包含总面积和地上
                    // 地下=总量-地上
                    this.calData.area.area_ug = this.calData.area.area_all - this.calData.area.area_ag
                } else if (this.calData.area.area_all && this.calData.area.area_ug) {
                    // 如果包含总面积和地下
                    // 地上=总量-地下
                    this.calData.area.area_ag = this.calData.area.area_all - this.calData.area.area_ug
                } else if (this.calData.area.area_ag && this.calData.area.area_ug) {
                    // 如果包含地上和地下
                    // 总量=地上+地下
                    this.calData.area.area_all = Number(this.calData.area.area_ag) + Number(this.calData.area.area_ug)
                } else if (this.calData.area.area_all) {
                    // 如果只有总量
                    // 地上沿用原来的值
                    this.calData.area.area_ag = this.tableData[1].total_area;
                    // 地下=总量-地上
                    this.calData.area.area_ug = this.calData.area.area_all - this.calData.area.area_ag
                } else if (this.calData.area.area_ag) {
                    // 如果只有地上
                    // 总量沿用原来的值
                    this.calData.area.area_all = this.tableData[0].total_area;
                    // 地下=总量-地上
                    this.calData.area.area_ug = this.calData.area.area_all - this.calData.area.area_ag
                } else if (this.calData.area.area_ug) {
                    // 如果只有地下
                    // 总量沿用原来的值
                    this.calData.area.area_all = this.tableData[0].total_area;
                    // 地上=总量-地上
                    this.calData.area.area_ag = this.calData.area.area_all - this.calData.area.area_ug
                }

                //钢铁量
                if (this.calData.steel.steel_ag && this.calData.steel.steel_all && this.calData.steel.steel_ug) {
                    if (Number(this.calData.steel.steel_all) !== (Number(this.calData.steel.steel_ag) + Number(this.calData.steel.steel_ug))) {
                        this.$message({
                            type: 'error',
                            message: '数据错误，请检查'
                        });
                        return;
                    }
                    // 如果值全在
                } else if (!this.calData.steel.steel_ag && !this.calData.steel.steel_all && !this.calData.steel.steel_ug) {
                    // 如果值全都不存在
                    //面积赋值
                    this.calData.steel.steel_all = this.tableData[0].total_steel;
                    this.calData.steel.steel_ag = this.tableData[1].total_steel;
                    this.calData.steel.steel_ug = this.tableData[2].total_steel;
                } else if (this.calData.steel.steel_all && this.calData.steel.steel_ag) {
                    // 如果包含总面积和地上
                    // 地下=总量-地上
                    this.calData.steel.steel_ug = this.calData.steel.steel_all - this.calData.steel.steel_ag
                } else if (this.calData.steel.steel_all && this.calData.steel.steel_ug) {
                    // 如果包含总面积和地下
                    // 地上=总量-地下
                    this.calData.steel.steel_ag = this.calData.steel.steel_all - this.calData.steel.steel_ug
                } else if (this.calData.steel.steel_ag && this.calData.steel.steel_ug) {
                    // 如果包含地上和地下
                    // 总量=地上+地下
                    this.calData.steel.steel_all = Number(this.calData.steel.steel_ag) + Number(this.calData.steel.steel_ug)
                } else if (this.calData.steel.steel_all) {
                    // 如果只有总量
                    // 地上沿用原来的值
                    this.calData.steel.steel_ag = this.tableData[1].total_steel;
                    // 地下=总量-地上
                    this.calData.steel.steel_ug = this.calData.steel.steel_all - this.calData.steel.steel_ag
                } else if (this.calData.steel.steel_ag) {
                    // 如果只有地上
                    // 总量沿用原来的值
                    this.calData.steel.steel_all = this.tableData[0].total_steel;
                    // 地下=总量-地上
                    this.calData.steel.steel_ug = this.calData.steel.steel_all - this.calData.steel.steel_ag
                } else if (this.calData.steel.steel_ug) {
                    // 如果只有地下
                    // 总量沿用原来的值
                    this.calData.steel.steel_all = this.tableData[0].total_steel;
                    // 地上=总量-地上
                    this.calData.steel.steel_ag = this.calData.steel.steel_all - this.calData.steel.steel_ug
                }


                //混凝土量
                if (this.calData.concrete.concrete_ag && this.calData.concrete.concrete_all && this.calData.concrete.concrete_ug) {
                    if (Number(this.calData.concrete.concrete_all) !== (Number(this.calData.concrete.concrete_ag) + Number(this.calData.concrete.concrete_ug))) {
                        this.$message({
                            type: 'error',
                            message: '数据错误，请检查'
                        });
                        return;
                    }
                    // 如果值全在
                } else if (!this.calData.concrete.concrete_ag && !this.calData.concrete.concrete_all && !this.calData.concrete.concrete_ug) {
                    // 如果值全都不存在
                    //面积赋值
                    this.calData.concrete.concrete_all = this.tableData[0].total_concrete;
                    this.calData.concrete.concrete_ag = this.tableData[1].total_concrete;
                    this.calData.concrete.concrete_ug = this.tableData[2].total_concrete;
                } else if (this.calData.concrete.concrete_all && this.calData.concrete.concrete_ag) {
                    // 如果包含总面积和地上
                    // 地下=总量-地上
                    this.calData.concrete.concrete_ug = this.calData.concrete.concrete_all - this.calData.concrete.concrete_ag
                } else if (this.calData.concrete.concrete_all && this.calData.concrete.concrete_ug) {
                    // 如果包含总面积和地下
                    // 地上=总量-地下
                    this.calData.concrete.concrete_ag = this.calData.concrete.concrete_all - this.calData.concrete.concrete_ug
                } else if (this.calData.concrete.concrete_ag && this.calData.concrete.concrete_ug) {
                    // 如果包含地上和地下
                    // 总量=地上+地下
                    this.calData.concrete.concrete_all = Number(this.calData.concrete.concrete_ag) + Number(this.calData.concrete.concrete_ug)
                } else if (this.calData.concrete.concrete_all) {
                    // 如果只有总量
                    // 地上沿用原来的值
                    this.calData.concrete.concrete_ag = this.tableData[1].total_concrete;
                    // 地下=总量-地上
                    this.calData.concrete.concrete_ug = this.calData.concrete.concrete_all - this.calData.concrete.concrete_ag
                } else if (this.calData.concrete.concrete_ag) {
                    // 如果只有地上
                    // 总量沿用原来的值
                    this.calData.concrete.concrete_all = this.tableData[0].total_concrete;
                    // 地下=总量-地上
                    this.calData.concrete.concrete_ug = this.calData.concrete.concrete_all - this.calData.concrete.concrete_ag
                } else if (this.calData.concrete.concrete_ug) {
                    // 如果只有地下
                    // 总量沿用原来的值
                    this.calData.concrete.concrete_all = this.tableData[0].total_concrete;
                    // 地上=总量-地上
                    this.calData.concrete.concrete_ag = this.calData.concrete.concrete_all - this.calData.concrete.concrete_ug
                }

                let flag = false;
                // 填充数据
                Object.keys(this.calData).forEach((key) => {
                    let key_data = this.calData[key];
                    let n = 0;
                    Object.keys(key_data).forEach((val) => {
                        if((key_data[val] === '')|| (Number(key_data[val]) === 0)){
                            n = n + 1;
                        }
                        console.log('ok...',val,key_data[val])
                    });
                    if(n>=2){
                        flag = true
                    }
                });

                if(flag){
                    this.$message({
                        type: 'error',
                        message: '数据错误,无法计算，请检查'
                    });
                    return;
                }

                //面积赋值
                this.tableData[0].total_area = this.calData.area.area_all;
                this.tableData[1].total_area = this.calData.area.area_ag;
                this.tableData[2].total_area = this.calData.area.area_ug;

                //钢筋赋值
                this.tableData[0].total_steel = this.calData.steel.steel_all;
                this.tableData[1].total_steel = this.calData.steel.steel_ag;
                this.tableData[2].total_steel = this.calData.steel.steel_ug;


                //混凝土赋值
                this.tableData[0].total_concrete = this.calData.concrete.concrete_all;
                this.tableData[1].total_concrete = this.calData.concrete.concrete_ag;
                this.tableData[2].total_concrete = this.calData.concrete.concrete_ug;


                console.log('----steel--cal', this.calData);
                console.log('----over', this.tableData);
                this.calculateIndex()

            },
            // 计算指标
            calculateIndex() {
                console.log('click calculateData ...');
                this.tableData = this.tableData.map((row) => {
                    row.total_steel = Number(row.total_steel).toFixed(3);
                    row.total_area = Number(row.total_area).toFixed(3);
                    row.total_concrete = Number(row.total_concrete).toFixed(3);

                    row.KM = (row.total_steel / row.total_area).toFixed(6);
                    row.concrete_ratio = (row.total_concrete / row.total_area).toFixed(6);

                    // console.log('------');
                    // console.log('KM', row.KM);
                    // console.log('concrete_ratio', row.concrete_ratio);
                    return row;
                });
            },
            objectSpanMethod({row, column, rowIndex, columnIndex}) { // columnIndex 列 rowIndex 行
                // console.log({ row, column, rowIndex, columnIndex })
                if (columnIndex === 0) {
                    if (rowIndex % 5 === 0) {
                        // console.log('rowIndex--if', rowIndex)
                        return {
                            rowspan: 5,
                            colspan: 1
                        };
                    } else {
                        // console.log('rowIndex--else', rowIndex)
                        return {
                            rowspan: 0,
                            colspan: 0
                        };
                    }
                }
            },
            submitUpload() {
                this.$refs.upload.submit();
            },
            handleChange1(file, fileList) {
                this.fileList1 = fileList.slice(-1);
            },
            handleChange2(file, fileList) {
                this.fileList2 = fileList.slice(-1);
            },
            handleChange3(file, fileList) {
                this.tarFileList = fileList.slice(-1);
            },
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePreview(file) {
                console.log(file);
            },
            uploadFileMethod(name) {
                // let fileObject = param.file;
                console.log(name);
                let filelist = [];
                if (name === '材料表') {
                    filelist = this.fileList1;
                } else {
                    filelist = this.fileList2;
                }
                console.log(filelist[0]);
                let formData = new FormData();
                let fileObject = filelist[0].raw;
                formData.append("file", fileObject);
                formData.append("name", name);

                UploadXLSFile(
                    formData
                ).then((response) => {
                    console.log("response==", response);
                    let set_option = response.data.data.options;
                    let options = [];
                    if (set_option.length === 0) {
                        return;
                    }

                    for (let v of set_option) {
                        console.log(v);
                        options.push(
                            {
                                value: v,
                                label: v
                            }
                        )
                    }
                    this.options = options
                }).catch(function (error) {
                    console.log("message======================", message);
                });
            },
            CalculateXLS() {
                if (this.row_value === '') {
                    // this.$alert('请先选择项目名称', '标题名称', {
                    //     confirmButtonText: '确定',
                    //     callback: action => {
                    //         this.$message({
                    //             type: 'warning',
                    //             message: `action: ${ action }`
                    //         });
                    //     }
                    // });
                    this.$message({
                        type: 'error',
                        message: `请先选择项目名称`
                    });
                    return
                }
                this.loading = true
                CalculateXLS({
                    'name': this.row_value
                }).then((response) => {
                    console.log(response.data);
                    console.log(response.data.data.message);
                    if (response.data.error_code === 400) {
                        this.$message({
                            type: 'error',
                            message: response.data.data.message
                        });
                        this.loading = false;
                        return
                    }
                    //this.tableData = response.data.data;

                    this.tableData = response.data.data.map((item) => {
                        item.area = '';
                        item.steel = '';
                        item.concrete = '';

                        return item;
                    });
                    this.backupData = JSON.parse(JSON.stringify(this.tableData));
                    // this.backupData = this.tableData.concat();
                    this.loading = false
                }).catch(function (error) {
                    console.log('error', error);
                });
            },
            uploadTarFile(name) {
                // let fileObject = param.file;
                console.log(name);
                let filelist = this.tarFileList;

                console.log(filelist[0]);
                let formData = new FormData();
                let fileObject = filelist[0].raw;
                formData.append("file", fileObject);
                formData.append("name", name);

                UploadTarFile(
                    formData
                ).then((response) => {
                    console.log("response==", response);
                    this.$message({
                        type: 'success',
                        message: `上传成功`
                    });

                }).catch(function (error) {
                    console.log("message======================", message);
                });
            },
            uploadFile(param) {
                console.log(param);
                console.log(param.action);

                let fileObject = param.file;
                let formData = new FormData();
                formData.append("file", fileObject);
                formData.append("name", param.action);

                UploadXLSFile(
                    formData
                ).then((response) => {
                    console.log("response==", response);
                    this.$message({
                        type: 'success',
                        message: `上传成功`
                    });

                    let set_option = response.data.data.options;
                    let options = [];
                    if (set_option.length === 0) {
                        return;
                    }

                    for (let v of set_option) {
                        console.log(v);
                        options.push(
                            {
                                value: v,
                                label: v
                            }
                        )
                    }
                    this.options = options
                }).catch(function (error) {
                    console.log("message======================", message);
                });
            },
        }
    }
</script>

<style scoped>
    .tableTitle {
        position: relative;
        margin: 0 auto;
        width: 600px;
        height: 50px;
        text-align: center;
        font-size: 16px;
    }

    .midText {
        position: absolute;
        left: 50%;
        background-color: #ffffff;
        padding: 0 15px;
        transform: translateX(-50%) translateY(-50%);
    }

    .input {
        width: 120px;
        float: right;
    }

</style>
