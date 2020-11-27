<template>
    <div>
        <h2>statistical 分省季度统计分析</h2>

        <el-row>
<!--            <el-button>默认按钮</el-button>-->
<!--            <el-button type="success">成功按钮</el-button>-->
<!--            <el-button type="info">信息按钮</el-button>-->
<!--            <el-button type="warning">警告按钮</el-button>-->
<!--            <el-button type="danger">危险按钮</el-button>-->
        </el-row>
        <el-container>
            <el-header>

            </el-header>
            <el-container>
                <el-aside width="500px">
                    <div>
                        <div>
                            选择类型
                            <el-cascader style="width: 400px"
                                    v-model="value"
                                    :options="catalog"
                                    :props="{ expandTrigger: 'hover' ,children: 'sub_cat',label: 'name',value:'code'}"
                                    @change="handleChange"
                                    filterable
                                    placeholder="试试搜索：国有"></el-cascader>
                        </div>

                        <el-input
                                placeholder="输入关键字进行过滤"
                                v-model="filterText">
                        </el-input>

                        <el-tree
                                class="filter-tree"
                                :data="catalog"
                                :props="defaultProps"
                                :sum-text="sumText"
                                default-expand-all
                                :filter-node-method="filterNode"
                                ref="tree">
                        </el-tree>

                    </div>
                </el-aside>
                <el-main>
                    <div class="center-div">
                        <div>
                            <el-row>
                            <span class="login-tips">年份：</span>
                            <el-select v-model="year" clearable placeholder="请选择">
                                <el-option
                                        v-for="item in years"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                            &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;

                            <span class="login-tips"> 列统计：</span>
                            <el-select  v-model="row_value" clearable placeholder="请选择">
                                <el-option
                                        v-for="item in options"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                                &emsp;&emsp;&emsp;
                            <el-button type="primary" size="small" v-on:click="clickSubmit">提交</el-button>

                            </el-row>
                        </div>
                        <el-table
                                v-loading="loading"
                                :data="data"
                                style="width: 100%"
                                max-height="1000"
                                :summary-method="getSummaries"
                                show-summary
                                :row-class-name="tableRowClassName">
                            <el-table-column
                                    prop="province"
                                    label="省/直辖市"
                            >
                            </el-table-column>
                            <el-table-column
                                    prop="first_quarter"
                                    label="第一季度"
                            >
                            </el-table-column>
                            <el-table-column
                                    prop="second_quarter"
                                    label="第二季度"
                            >
                            </el-table-column>
                            <el-table-column
                                    prop="third_quarter"
                                    label="第三季度"
                            >
                            </el-table-column>
                            <el-table-column
                                    prop="fourth_quarter"
                                    label="第四季度"
                            >
                            </el-table-column>
                            <el-table-column
                                    prop="unit"
                                    label="单位"
                            >
                            </el-table-column>
                        </el-table>
                    </div>
                </el-main>
            </el-container>
        </el-container>




    </div>
</template>

<script>
    import {getProvinceSeasonData,getProvinceSeasonCatalog} from "../api/api";

    export default {
        name: "statistical",
        data() {
            return {
                params: {
                    index: 'B01A14A02',
                    location: '',
                    year: '2018',
                    page: 1,
                },
                data:[],
                unit:'',
                options: [{
                    value: 'mean',
                    label: '平均值'
                }, {
                    value: 'sum',
                    label: '总计'
                }, {
                    value: 'max',
                    label: '最大值'
                }, {
                    value: 'min',
                    label: '最小值'
                }, {
                    value: 'var',
                    label: '方差'
                }, {
                    value: 'std',
                    label: '标准差'
                }],
                row_value: 'sum',
                row_label: '总计',
                columns: [],
                catalog:[],
                catalog_name:'建筑业',
                //catalog_name:'',
                defaultProps: {
                    children: 'sub_cat',
                    label: 'name',
                    value:'code',
                },
                filterText: '',
                sumText:'合计',
                years: [{
                    value: '2015',
                    label: '2015年'
                }, {
                    value: '2016',
                    label: '2016年'
                }, {
                    value: '2017',
                    label: '2017年'
                }, {
                    value: '2018',
                    label: '2018年'
                }, {
                    value: '2019',
                    label: '2019年'
                },],
                year:'',
                value: [],
                code:'',
                loading:false
            }
        },
        created() {
            this.getProvinceSeasonData();
            this.getProvinceSeasonCatalog();
        },
        watch:{
            row_value(val){
                this.row_label = this.options.find((option) => option.value === val).label;
                // 用于触发getSummaries
                this.data = this.data;
            },
            filterText(val) {
                this.$refs.tree.filter(val);
            }
        },
        methods: {
            getProvinceSeasonData() {
                this.loading = true;
                getProvinceSeasonData(this.params).then((response) => {
                    console.log('------获取分省季度数据------');
                    console.log(response.data);
                    this.data = response.data.results;
                    this.unit = this.data[0].unit;
                    this.loading = false
                }).catch(function (error) {
                    console.log(error);
                });
            },
            getProvinceSeasonCatalog() {
                getProvinceSeasonCatalog({
                    'name':this.catalog_name
                }).then((response) => {
                    console.log('------获取分省季度目录------');
                    console.log(response.data);
                    this.catalog = response.data
                }).catch(function (error) {
                    console.log(error);
                });
            },
            tableRowClassName({row, rowIndex}) {
                if (rowIndex === 1) {
                    return 'warning-row';
                } else if (rowIndex === 3) {
                    return 'success-row';
                }
                return '';
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            },
            getSummaries(param) {
                let result = '';
                switch (this.row_value) {
                    case 'sum':
                        result = this.calculate_sum(param);
                        break;
                    case 'mean':
                        result = this.calculate_mean(param);
                        break;
                    case 'max':
                        result = this.calculate_max(param);
                        break;
                    case 'min':
                        result = this.calculate_min(param);
                        break;
                    case 'var':
                        result = this.calculate_var(param);
                        break;
                    case 'std':
                        result = this.calculate_std(param);
                        break;
                }
                return result
            },
            calculate_sum(param){
                const { columns, data } = param;
                const sums = [];
                columns.forEach((column, index) => {
                    //console.log(column,index)
                    if (index === 0) {
                        sums[index] = this.row_label;
                        return;
                    }
                    const values = data.map(item => Number(item[column.property]));
                    //console.log(values);
                    //console.log(isNaN('dsadsa')); //true
                    if (!values.every(value => isNaN(value))) {
                        sums[index] = values.reduce((prev, curr) => {
                            const value = Number(curr);
                            if (!isNaN(value)) {
                                return prev + curr;
                            } else {
                                return prev;
                            }
                        }, 0);
                        sums[index] = sums[index].toFixed(2)
                        // sums[index] += ' '+values[0];
                    } else {
                        // sums[index] = 'N/A';
                        sums[index] = this.unit;
                    }
                });
                return sums;
            },
            calculate_mean(param){
                const { columns, data } = param;
                const sums = [];
                columns.forEach((column, index) => {
                    if (index === 0) {
                        sums[index] = this.row_label;
                        return;
                    }
                    const values = data.map(item => Number(item[column.property]));
                    if (!values.every(value => isNaN(value))) {
                        sums[index] = values.reduce((prev, curr) => {
                            const value = Number(curr);
                            if (!isNaN(value)) {
                                return prev + curr;
                            } else {
                                return prev;
                            }
                        }, 0);
                        sums[index] = (sums[index]/values.length).toFixed(2)
                    } else {
                        sums[index] = this.unit;
                    }
                });
                return sums;
            },
            calculate_max(param){
                const { columns, data } = param;
                const sums = [];
                columns.forEach((column, index) => {
                    if (index === 0) {
                        sums[index] = this.row_label;
                        return;
                    }
                    const values = data.map(item => Number(item[column.property]));

                    if (!values.every(value => isNaN(value))) {
                        let max = 0;
                        for(let v of values) {
                            max = max > v ? max : v
                        }
                        sums[index] = max.toFixed(2)
                    } else {
                        sums[index] = this.unit;
                    }
                });
                return sums;
            },
            calculate_min(param){
                const { columns, data } = param;
                const sums = [];
                columns.forEach((column, index) => {
                    if (index === 0) {
                        sums[index] = this.row_label;
                        return;
                    }
                    const values = data.map(item => Number(item[column.property]));

                    if (!values.every(value => isNaN(value))) {
                        let min = values[0];
                        for(let v of values) {
                            min = min < v ? min : v
                        }
                        sums[index] = min.toFixed(2)
                    } else {
                        sums[index] = this.unit;
                    }
                });
                return sums;
            },
            calculate_var(param){
                const { columns, data } = param;
                const sums = [];
                columns.forEach((column, index) => {
                    if (index === 0) {
                        sums[index] = this.row_label;
                        return;
                    }
                    const values = data.map(item => Number(item[column.property]));
                    let mean = 0;
                    if (!values.every(value => isNaN(value))) {
                        sums[index] = values.reduce((prev, curr) => {
                            const value = Number(curr);
                            if (!isNaN(value)) {
                                return prev + curr;
                            } else {
                                return prev;
                            }
                        }, 0);
                        mean = (sums[index]/values.length).toFixed(2)
                    }
                    if (!values.every(value => isNaN(value))) {
                        sums[index] = values.reduce((prev, curr) => {
                            const value = Number(curr);
                            // console.log(prev,curr,Math.pow((curr-mean), 2));
                            if (!isNaN(value)) {
                                // 计算每个数与平均数的平方和
                                return  prev + Math.pow((curr-mean), 2);
                            } else {
                                return prev;
                            }
                        }, 0);
                        // 除以统计数量为方差
                        console.log(sums[index]);
                        sums[index] = (sums[index]/values.length).toFixed(2)
                    } else {
                        sums[index] = this.unit;
                    }
                });
                return sums;
            },
            calculate_std(param){
                const { columns, data } = param;
                const sums = [];
                columns.forEach((column, index) => {
                    if (index === 0) {
                        sums[index] = this.row_label;
                        return;
                    }
                    const values = data.map(item => Number(item[column.property]));
                    let mean = 0;
                    if (!values.every(value => isNaN(value))) {
                        sums[index] = values.reduce((prev, curr) => {
                            const value = Number(curr);
                            if (!isNaN(value)) {
                                return prev + curr;
                            } else {
                                return prev;
                            }
                        }, 0);
                        mean = (sums[index]/values.length).toFixed(2)
                    }
                    if (!values.every(value => isNaN(value))) {
                        sums[index] = values.reduce((prev, curr) => {
                            const value = Number(curr);
                            // console.log(prev,curr,Math.pow((curr-mean), 2));
                            if (!isNaN(value)) {
                                // 计算每个数与平均数的平方和
                                return  prev + Math.pow((curr-mean), 2);
                            } else {
                                return prev;
                            }
                        }, 0);
                        // 计算标准差，为方差的平方
                        sums[index] = Math.sqrt(sums[index]/values.length).toFixed(2)
                    } else {
                        sums[index] = this.unit;
                    }
                });
                return sums;
            },
            handleChange(value) {
                this.code = value[value.length-1]
            },
            clickSubmit(e) {
                console.log('handler click');
                //console.log(this) // 就是当前的vue对象
                this.params.index = this.code;
                this.params.year = this.year;
                this.getProvinceSeasonData()
            }
        },
        mounted() { //挂载，渲染
            //this.getProvinceSeasonData()
        },
        activated() { // keep-alive 激活
            //this.getProvinceSeasonData()
        }
    }
</script>

<style >
    .center-div {
        margin-left: auto;
        margin-right: auto;
        width: 70%;
    }
    .el-table .warning-row {
        background: oldlace;
    }

    .el-table .success-row {
        background: #f0f9eb;
    }
    .el-header, .el-footer {
        background-color: #B3C0D1;
        color: #333;
        text-align: center;
        line-height: 60px;
    }

    .el-aside {
        background-color: #D3DCE6;
        color: #333;
        text-align: center;
        line-height: 200px;
    }

    .el-main {
        background-color: #E9EEF3;
        color: #333;
        text-align: center;
        line-height: 160px;
    }

    body > .el-container {
        margin-bottom: 40px;
    }

    .el-container:nth-child(5) .el-aside,
    .el-container:nth-child(6) .el-aside {
        line-height: 260px;
    }

    .el-container:nth-child(7) .el-aside {
        line-height: 320px;
    }

</style>
