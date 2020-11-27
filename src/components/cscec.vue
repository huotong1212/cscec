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
                    <el-upload
                      class="upload-demo"
                      action="材料表"
                      :file-list="fileList1"
                      :on-change="handleChange1"
                      :http-request="uploadFile"
                      :show-file-list="true"
                      multiple
                    >
                      <el-button class="custom-btn" size="small" type="primary"
                        >上传材料表</el-button
                      >
                    </el-upload>
                  </div>
                </el-col>
                <el-col :span="8">
                  <el-upload
                    class="upload-demo"
                    action="劳务表"
                    :file-list="fileList2"
                    :on-change="handleChange2"
                    :http-request="uploadFile"
                    :show-file-list="true"
                    multiple
                  >
                    <el-button class="custom-btn" size="small" type="primary"
                      >上传劳务表</el-button
                    >
                  </el-upload>
                </el-col>
                <el-col :span="8">
                  <div>
                    <el-upload
                      class="upload-demo"
                      action="计算模型"
                      :on-change="handleChange3"
                      :file-list="tarFileList"
                      :http-request="uploadTarFile"
                      :show-file-list="true"
                      multiple
                    >
                      <el-button class="custom-btn" size="small" type="primary"
                        >上传计算模型</el-button
                      >
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
                    <el-select
                      style="width: 300px"
                      v-model="row_value"
                      clearable
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                    &emsp;
                    <el-button
                      type="primary"
                      size="small"
                      v-on:click="CalculateXLS"
                      >计算</el-button
                    >
                    <el-button
                      type="primary"
                      size="small"
                      v-on:click="correctData"
                      >修正</el-button
                    >
                    <el-button type="primary" size="small" v-on:click="reset"
                      >重置</el-button
                    >
                  </div>
                </el-col>
              </el-row>
              <div class="top">
                <div
                  v-for="(tab, index) in topHeader"
                  :key="index"
                  class="top-header"
                >
                  <div class="label">{{ tab.name }}</div>
                  <div class="value">{{ tab.amount }}{{ tab.unit }}</div>
                  <div class="input">
                    <el-input
                      size="medium"
                      @input="forceUpdate"
                      v-model="tab.modifyValue"
                      placeholder="请输入修正值"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <el-table
                v-loading="loading"
                :data="tableData1"
                border
                :span-method="objectSpanMethod"
                style="width: 100%"
              >
                <el-table-column prop="title" label="项目名称">
                </el-table-column>
                <el-table-column prop="indicator" label="指标">
                </el-table-column>
                <el-table-column label="指标量">
                  <template scope="scope">
                    <span>{{ scope.row.indicatorLabel }}</span>
                    <el-input
                      class="input"
                      size="mini"
                      v-model="scope.row.modifyValue"
                      placeholder="请输入修正值"
                    >
                      <i slot="suffix" class="el-icon-edit"></i>
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="calIndex" label="计算基数">
                </el-table-column>
                <el-table-column prop="unitIndicator" label="单位指标">
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
import {
  CalculateXLS,
  UploadFile,
  UploadTarFile,
  UploadXLSFile,
} from '@/api/api'

const mockData = {
  基数部分: {
    yj_area: {
      name: '园建面积',
      amount: 10000,
      unit: '平方米',
    },
    lh_area: {
      name: '绿化面积',
      amount: 10000,
      unit: '平方米',
    },
  },
  指标部分: {
    project_name: '青白江区XXXX',
    index: [
      {
        name: '铺装石材',
        value: [
          {
            amount: 1000,
            unit: '平方米',
          },
        ],
        base: 'yj_area',
      },
      {
        name: '铺装混凝土',
        value: [
          {
            amount: 2000,
            unit: '平方米',
          },
          {
            amount: 200,
            unit: '立方米',
          },
        ],
        base: 'yj_area',
      },
      {
        name: '大乔木',
        value: [
          {
            amount: 25,
            unit: '棵',
          },
        ],
        base: 'lh_area',
      }
    ],
  },
}

export default {
  name: 'cscec',
  data() {
    return {
      maxlength: 10000,
      tableData1: [],
      topHeaderBack: [],
      tableData1Back: [],
      mockData,
      topHeader: [],
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
          area_ug: '',
        },
        steel: {
          steel_all: '',
          steel_ag: '',
          steel_ug: '',
        },
        concrete: {
          concrete_all: '',
          concrete_ag: '',
          concrete_ug: '',
        },
      },
    }
  },
  created() {
    this.init()
  },
  methods: {
    forceUpdate() {
      this.$forceUpdate()
    },
    init() {
      this.topHeader = this.modifyHeader(this.mockData)
      this.topHeaderBack = JSON.parse(JSON.stringify(this.topHeader))
      this.tableData1 = this.modifyTableData(this.mockData)
      this.tableData1Back = JSON.parse(JSON.stringify(this.tableData1))
    },
    reset() {
      this.topHeader = JSON.parse(JSON.stringify(this.topHeaderBack))
      this.tableData1 = JSON.parse(JSON.stringify(this.tableData1Back))
    },
    modifyTableData(data) {
      const baseIndicator = this.mockData['基数部分']
      const helper = data['指标部分']
      const tableData = []
      const rowspan = helper.index.length
      const title = helper.project_name
      helper.index.forEach((item) => {
        const colspan = item.value.length
        item.value.forEach((ele, index) => {
          const base = baseIndicator[item.base].amount
          tableData.push({
            colspan: index === 0 ? colspan : 0,
            title,
            indicator: item.name,
            indicatorValue: ele.amount,
            indicatorLabel: ele.amount + ele.unit,
            modifyValue: '',
            base: item.base,
            calIndex: baseIndicator[item.base].name,
            unitIndicator: (ele.amount / base).toFixed(4) || '-',
          })
        })
      })
      return tableData
    },
    modifyHeader(data) {
      const helper = Object.assign({}, this.mockData['基数部分'])
      for (let prop in helper) {
        helper[prop].modifyValue = ''
      }
      return helper
    },
    handleCurrentChange(row, event, column) {
      console.log(row, event, column, event.currentTarget)
    },
    handleEdit(index, row) {
      console.log(index, row)
    },
    handleDelete(index, row) {
      console.log(index, row)
    },
    resetData() {
      //this.tableData = this.backupData;
      this.tableData = JSON.parse(JSON.stringify(this.backupData))
    },
    correctData() {
      console.log('recaclucate')
      const { tableData1, topHeader } = this
      this.tableData1 = this.tableData1.map((item) => {
        // 优先取修正值
        const base =
          Number(topHeader[item.base].modifyValue) ||
          topHeader[item.base].amount
        const value = Number(item.modifyValue) || Number(item.indicatorValue)
        item.unitIndicator = (value / base).toFixed(4)
        return {
          ...item,
        }
      })
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex === 0) {
          return {
            rowspan: this.tableData1.length,
            colspan: 1,
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0,
          }
        }
      }
      if (columnIndex === 1) {
        const { colspan } = row
        if (colspan === 0) {
          return {
            rowspan: 0,
            colspan: 0,
          }
        } else {
          return {
            rowspan: colspan,
            colspan: 1,
          }
        }
      }
    },
    submitUpload() {
      this.$refs.upload.submit()
    },
    handleChange1(file, fileList) {
      this.fileList1 = fileList.slice(-1)
    },
    handleChange2(file, fileList) {
      this.fileList2 = fileList.slice(-1)
    },
    handleChange3(file, fileList) {
      this.tarFileList = fileList.slice(-1)
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    uploadFileMethod(name) {
      // let fileObject = param.file;
      console.log(name)
      let filelist = []
      if (name === '材料表') {
        filelist = this.fileList1
      } else {
        filelist = this.fileList2
      }
      console.log(filelist[0])
      let formData = new FormData()
      let fileObject = filelist[0].raw
      formData.append('file', fileObject)
      formData.append('name', name)

      UploadXLSFile(formData)
        .then((response) => {
          console.log('response==', response)
          let set_option = response.data.data.options
          let options = []
          if (set_option.length === 0) {
            return
          }

          for (let v of set_option) {
            console.log(v)
            options.push({
              value: v,
              label: v,
            })
          }
          this.options = options
        })
        .catch(function(error) {
          console.log('message======================', message)
        })
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
          message: `请先选择项目名称`,
        })
        return
      }
      this.loading = true
      CalculateXLS({
        name: this.row_value,
      })
        .then((response) => {
          console.log(response.data)
          console.log(response.data.data.message)
          if (response.data.error_code === 400) {
            this.$message({
              type: 'error',
              message: response.data.data.message,
            })
            this.loading = false
            return
          }
          //this.tableData = response.data.data;

          this.tableData = response.data.data.map((item) => {
            item.area = ''
            item.steel = ''
            item.concrete = ''

            return item
          })
          this.backupData = JSON.parse(JSON.stringify(this.tableData))
          // this.backupData = this.tableData.concat();
          this.loading = false
        })
        .catch(function(error) {
          console.log('error', error)
        })
    },
    uploadTarFile(name) {
      // let fileObject = param.file;
      console.log(name)
      let filelist = this.tarFileList

      console.log(filelist[0])
      let formData = new FormData()
      let fileObject = filelist[0].raw
      formData.append('file', fileObject)
      formData.append('name', name)

      UploadTarFile(formData)
        .then((response) => {
          console.log('response==', response)
          this.$message({
            type: 'success',
            message: `上传成功`,
          })
        })
        .catch(function(error) {
          console.log('message======================', message)
        })
    },
    uploadFile(param) {
      console.log(param)
      console.log(param.action)

      let fileObject = param.file
      let formData = new FormData()
      formData.append('file', fileObject)
      formData.append('name', param.action)

      UploadXLSFile(formData)
        .then((response) => {
          console.log('response==', response)
          this.$message({
            type: 'success',
            message: `上传成功`,
          })

          let set_option = response.data.data.options
          let options = []
          if (set_option.length === 0) {
            return
          }

          for (let v of set_option) {
            console.log(v)
            options.push({
              value: v,
              label: v,
            })
          }
          this.options = options
        })
        .catch(function(error) {
          console.log('message======================', message)
        })
    },
  },
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
.top-header {
  display: flex;
  align-items: center;
  margin-right: 40px;
}
.top {
  display: flex;
  align-items: center;
  margin: 20px;
  justify-content: center;
}
.label,
.value {
  margin: 0 10px;
}
</style>
