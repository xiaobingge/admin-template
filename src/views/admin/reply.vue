<template>
  <el-container>
    <el-main>
      <el-tabs v-model="activeName" @tab-click="checkTab()">
        <el-tab-pane label="关注公众号" name="first">
          <div class="filter-container">
            <el-form :inline="true" class="demo-form-inline">
              <el-form-item>
                <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="createReply(0)">添加回复</el-button>
              </el-form-item>
            </el-form>
          </div>
          <el-table
            :data="list"
            style="width: 100%">
            <el-table-column
              label="回复类型">
              <template slot-scope="scope">
              {{ scope.row.type | TextFilter  }}
              </template>
            </el-table-column>
            <el-table-column
              label="回复内容">
              <template slot-scope="scope">
                <el-image v-if="scope.row.type == '2' " :src="scope.row.content | getPicUrl" style="width: 150px" ></el-image><span v-else>{{ scope.row.content }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="操作">
              <template slot-scope="scope">
                <el-button  size="small" type="success" @click="updateReply(scope.row,1)"><i class="el-icon-edit"></i> 编辑</el-button>
                <el-button  size="small" type="danger" @click="deleteReply(scope.row,1)" icon="el-icon-delete">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-dialog
            :title="statusMap[textType]"
            :visible.sync="dialogVisible"
            width="35%">
            <el-tabs type="border-card" v-model="form.type">
              <el-tab-pane name="1">
                <span slot="label"><i class="el-icon-edit"></i> 文本</span>
                <el-form>
                <el-form-item>
                  <el-input type="textarea" v-model="form.content"></el-input>
                </el-form-item>
                </el-form>
              </el-tab-pane>
              <el-tab-pane name="2">
                <span slot="label"><i class="el-icon-picture"></i> 图片</span>
                <el-upload
                  class="upload-demo"
                  :action=uploadUrl
                  :on-remove="handleRemove"
                  :file-list="fileList"
                  :limit="1"
                  :on-exceed="handleExceed"
                  :on-success="uploadSuccess"
                  list-type="picture">
                  <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
              </el-tab-pane>
            </el-tabs>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="saveReply(1)">确 定</el-button>
            </div>
          </el-dialog>

        </el-tab-pane>
        <el-tab-pane label="扫描二维码" name="second">
          <div class="filter-container">
            <el-form :inline="true" class="demo-form-inline">
              <el-form-item label="">
                <el-input v-model="listQuery.keyword" placeholder="请输入规则名"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
              </el-form-item>
              <el-form-item>
                <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="createRule('create')">添加规则</el-button>
              </el-form-item>
            </el-form>
            <el-table
              :data="ruleList"
              style="width: 100%">
              <el-table-column
                label="规则序号">
                <template slot-scope="scope" style="width: 100px">
                  {{ scope.row.id }}
                </template>
              </el-table-column>
              <el-table-column
                label="规则名">
                <template slot-scope="scope">
                  {{ scope.row.name }}
                </template>
              </el-table-column>
              <el-table-column
                label="回复内容">
                <template slot-scope="scope">
                  {{ scope.row.remark }}
                </template>
              </el-table-column>
              <el-table-column
                label="二维码">
                <template slot-scope="scope">
                  <a title="点击下载" :href="scope.row.qr_code | getPicUrl" download=""> <el-image v-if="scope.row.qr_code" :src="scope.row.qr_code | getPicUrl" style="width: 150px" ></el-image></a>
                </template>
              </el-table-column>
              <el-table-column
                label="标识">
                <template slot-scope="scope">
                  {{ scope.row.keyword }}
                </template>
              </el-table-column>
              <el-table-column
                label="操作">
                <template slot-scope="scope">
                  <el-button  size="small" type="success" @click="updateRule(scope.row)"><i class="el-icon-edit"></i> 编辑</el-button>
                  <el-button  size="small" type="danger" @click="deleteRule(scope.row)" icon="el-icon-delete">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <el-dialog :title="statusMap2[textType]" :visible.sync="outerVisible">
            <el-form label-position="right" label-width="80px" :model="formLabelAlign" :inline="true" >
              <el-form-item label="规则名称">
                <el-input v-model="formLabelAlign.name" style="width: 200px;" placeholder="填写规则名"></el-input>
              </el-form-item>
              <el-form-item label="KEY标识">
                <el-input v-model="formLabelAlign.keyword" style="width: 200px;"  placeholder="小写英文字母"></el-input>
              </el-form-item>
            </el-form>
            <el-form :inline="true" class="demo-form-inline">
              <el-form-item>
                <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="createReply(formLabelAlign.id)">添加回复</el-button>
              </el-form-item>
            </el-form>
            <el-table
              :data="list"
              style="width: 100%">
              <el-table-column
                label="回复类型">
                <template slot-scope="scope">
                  {{ scope.row.type | TextFilter  }}
                </template>
              </el-table-column>
              <el-table-column
                label="回复内容">
                <template slot-scope="scope">
                  <el-image v-if="scope.row.type == '2'" :src="scope.row.content | getPicUrl" style="width: 150px" ></el-image><span v-else>{{ scope.row.content }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="操作">
                <template slot-scope="scope">
                  <el-button  size="small" type="danger" @click="deleteReply(scope.row,2)" icon="el-icon-delete">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-dialog
              width="35%"
              title="添加回复"
              :visible.sync="innerVisible"
              append-to-body>
              <el-tabs type="border-card" v-model="form.type">
                <el-tab-pane name="1">
                  <span slot="label"><i class="el-icon-edit"></i> 文本</span>
                  <el-form>
                    <el-form-item>
                      <el-input type="textarea" v-model="form.content"></el-input>
                    </el-form-item>
                  </el-form>
                </el-tab-pane>
                <el-tab-pane name="2">
                  <span slot="label"><i class="el-icon-picture"></i> 图片</span>
                  <el-upload
                    class="upload-demo"
                    :action=uploadUrl
                    :on-remove="handleRemove"
                    :file-list="fileList"
                    :limit="1"
                    :on-exceed="handleExceed"
                    :on-success="uploadSuccess"
                    list-type="picture">
                    <el-button size="small" type="primary">点击上传</el-button>
                  </el-upload>
                </el-tab-pane>
              </el-tabs>
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveReply(2)">确 定</el-button>
              </div>
            </el-dialog>
            <div slot="footer" class="dialog-footer">
              <el-button @click="outerVisible = false">取 消</el-button>
              <el-button type="primary" @click="saveRule()">保 存</el-button>
            </div>
          </el-dialog>
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>

</template>

<script>
  import {getReply,getReplyDetail,handleReply,deleteReply,handleRule,deleteRule,getRules} from '@/api/reply'
  const textMap = {
    1: '文本',
    2: '图片'
  };
  export default {
    filters: {
      TextFilter(status) {
        return textMap[status]
      },
      getPicUrl(url) {
        return process.env.VUE_APP_IMAGE_DIR + url;
      },
    },
    data() {
      return {
        uploadUrl: process.env.VUE_APP_UPLOAD_URL,
        fileList: [],
        form:{
          rule_id:'',
          type:'1',
          content:'',
        },
        statusMap :{
          'create': '添加回复',
          'edit':'编辑回复'
        },
        statusMap2 :{
          'create': '添加规则',
          'edit':'编辑规则'
        },
        formLabelAlign:{
          id:'',
          name:'',
          keyword:'',
        },
        textType:'create',
        dialogVisible: false,
        outerVisible: false,
        innerVisible: false,
        activeName: 'first',
        listQuery: {
          page: 1,
          limit: 5,
          keyword: '',
          sort: '-id'
        },
        list: [],
        ruleList: [],
      };
    },
    created(){
      this.getList();
      this.getRules();
    },
    methods: {
      checkTab(){
        if(this.activeName === 'first'){
          this.list = [];
          this.getList();
        }
      },
      getRules(){
        getRules().then(response=>{
          this.ruleList = response.data;
        })
      },
      getList(rule_id){
        getReply(rule_id).then(response=>{
          this.list = response.data;
        })
      },
      createReply(rule_id){
        this.resetForm()
        if(rule_id === 0){
          this.dialogVisible = true;
        }else{
          this.innerVisible = true;
        }
        this.form.rule_id = rule_id;
      },
      resetForm(){
        this.form = {
          id:'',
          rule_id:'',
          type:'1',
          content:''
        };
        this.fileList = [];
      },
      resetForm2(){
        this.formLabelAlign ={
            id:'',
            name:'',
            keyword:'',
        }
      },
      saveReply(type){
        if(this.form.type === '2'){
          if(this.fileList.length > 0){
            this.form.content = this.fileList[0].path;
          }else{
            this.form.content = '';
          }
        }
        if(this.form.content === ''){
          this.$message.error('回复内容不能为空');
          return
        }
        if(type === 2){
          if(this.form.id > 0){
            for (const v of this.list) {
              if (v.id === this.form.id) {
                const index = this.list.indexOf(v);
                this.list.splice(index, 1, this.form);
                break
              }
            }
          }else {
            this.list.push(this.form)
          }
          this.innerVisible = false;
        }else{
          handleReply(this.form).then(response => {
            this.$message.success('操作成功');
            if(this.form.id > 0){
              for (const v of this.list) {
                if (v.id === this.form.id) {
                  const index = this.list.indexOf(v);
                  this.list.splice(index, 1, this.form);
                  break
                }
              }
            }else {
              this.list.push(this.form)
            }
            this.dialogVisible = false;

          })
        }
      },
      updateReply(row,type){
        this.resetForm()
        if(type === 1){
          this.dialogVisible = true;
        }else {
          this.innerVisible = true;
        }
        this.textType = 'edit';
        this.form.id = row.id;
        this.form.type = row.type.toString();
        if(row.type == '1'){
          this.form.content = row.content;
        }else{
          this.fileList.push({url:process.env.VUE_APP_IMAGE_DIR + row.content ,path:row.content})
        }
      },
      deleteReply(row,type){
        if(type === 2 && row.id == ''){
          const index = this.list.indexOf(row);
          this.list.splice(index, 1);
        }else{
          this.$confirm("确定要删除回复么", '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            deleteReply(row.id).then(() => {
              this.$message({
                type: 'success',
                message: '删除回复成功!'
              });
              const index = this.list.indexOf(row);
              this.list.splice(index, 1);
            });
          }).catch(err => { console.error(err) })
        }
      },
      uploadSuccess(res){
        this.fileList.push({url:process.env.VUE_APP_IMAGE_DIR + res.data.path ,path:res.data.path})
      },
      handleExceed(){
          this.$message.error('只能上传一张图片');
      },
      createRule(a){
        this.resetForm2();
        this.list = [];
        this.outerVisible = true;

      },
      updateRule(row){
        this.list = row.list;
        this.formLabelAlign = row
        this.outerVisible = true;
      },
      deleteRule(row){

      },
      saveRule(){
         this.formLabelAlign.list = this.list;
         handleRule(this.formLabelAlign).then(response=>{
           if(this.formLabelAlign.id > 0){
             for (const v of this.ruleList) {
               if (v.id === this.formLabelAlign.id) {
                 const index = this.ruleList.indexOf(v);
                 this.ruleList.splice(index, 1, this.formLabelAlign);
                 break
               }
             }
           }else {
             this.formLabelAlign.id = response.data.id;
             this.ruleList.push(this.formLabelAlign)
           }
           this.outerVisible = false;
         });
      }

    }
  };

</script>
