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
            v-loading="listLoading"
            style="width: 100%">
            <el-table-column
              label="回复类型" align="center">
              <template slot-scope="scope">
              {{ scope.row.type | TextFilter  }}
              </template>
            </el-table-column>
            <el-table-column
              label="回复内容" align="center">
              <template slot-scope="scope">
                <el-image v-if="scope.row.type == '2' " :src="scope.row.content | getPicUrl" style="width: 100px" ></el-image><span v-else>{{ scope.row.content }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="操作" align="center">
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
              <el-button type="primary" :disabled="disable1" @click="saveReply(1)">确 定</el-button>
            </div>
          </el-dialog>

        </el-tab-pane>
        <el-tab-pane label="扫描二维码" name="second">
          <div class="filter-container">
            <el-form :inline="true" class="demo-form-inline">
              <el-form-item label="">
                <el-input v-model="listQuery.name" placeholder="请输入规则名"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button  class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
              </el-form-item>
              <el-form-item>
                <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="createRule(1)">添加规则</el-button>
              </el-form-item>
            </el-form>
            <el-table
              :data="ruleList"
              v-loading="ruleLoading"
              style="width: 100%">
              <!--<el-table-column-->
                <!--label="规则序号" align="center" width="100px">-->
                <!--<template slot-scope="scope" >-->
                  <!--{{ scope.row.id }}-->
                <!--</template>-->
              <!--</el-table-column>-->
              <el-table-column
                label="规则名" align="center">
                <template slot-scope="scope">
                  {{ scope.row.name }}
                </template>
              </el-table-column>
              <el-table-column
                label="回复内容" align="center">
                <template slot-scope="scope">
                  {{ scope.row.remark }}
                </template>
              </el-table-column>
              <el-table-column
                label="二维码" align="center">
                <template slot-scope="scope">
                  <a title="点击下载" :href="scope.row.qr_code | getPicUrl" download=""> <el-image v-if="scope.row.qr_code" :src="scope.row.qr_code | getPicUrl" style="width: 100px" ></el-image></a>
                </template>
              </el-table-column>
              <el-table-column
                label="标识">
                <template slot-scope="scope">
                  {{ scope.row.keyword }}
                </template>
              </el-table-column>
              <el-table-column
                label="操作" align="center">
                <template slot-scope="scope">
                  <el-button  size="small" type="success" @click="updateRule(scope.row)"><i class="el-icon-edit"></i> 编辑</el-button>
                  <el-button  size="small" type="danger" @click="deleteRule(scope.row)" icon="el-icon-delete">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getRules" />
          </div>

          <el-dialog :title="statusMap2[textType]" :visible.sync="outerVisible1">
            <el-form label-position="right" label-width="80px" :model="formLabelAlign">
              <el-form-item label="规则名称">
                <el-input v-model="formLabelAlign.name" style="width:60%;" placeholder="填写规则名"></el-input>
              </el-form-item>
              <el-form-item label="KEY标识">
                <el-input v-model="formLabelAlign.keyword" style="width: 60%;"  placeholder="小写英文字母"></el-input>
              </el-form-item>
              <el-form-item label="回复方式">
                <el-radio v-model="formLabelAlign.reply_mode" label="1">回复全部</el-radio>
                <el-radio v-model="formLabelAlign.reply_mode" label="2">随机回复一条</el-radio>
              </el-form-item>
              <el-form-item label="回复内容">
                <el-form-item>
                  <el-button class="filter-item" style="margin-left: 10px;" icon="el-icon-plus" @click="createReply(formLabelAlign.id,formLabelAlign.type)" circle></el-button>
                </el-form-item>
              </el-form-item>
            </el-form>
            <el-table
              :data="list"
              v-loading="listLoading"
              style="width: 100%">
              <el-table-column
                label="回复类型" align="center">
                <template slot-scope="scope">
                  {{ scope.row.type | TextFilter  }}
                </template>
              </el-table-column>
              <el-table-column
                label="回复内容" align="center">
                <template slot-scope="scope">
                  <el-image v-if="scope.row.type == '2'" :src="scope.row.content | getPicUrl" style="width: 100px" ></el-image><span v-else>{{ scope.row.content }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="操作" align="center">
                <template slot-scope="scope">
                  <el-button  size="small" type="danger" @click="deleteReply(scope.row,2)" icon="el-icon-delete">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-dialog
              width="35%"
              title="添加回复"
              :visible.sync="innerVisible1"
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
                <el-button @click="innerVisible1 = false">取 消</el-button>
                <el-button type="primary" :disabled="disable1" @click="saveReply(2)">确 定</el-button>
              </div>
            </el-dialog>
            <div slot="footer" class="dialog-footer">
              <el-button @click="outerVisible1 = false">取 消</el-button>
              <el-button type="primary" :disabled="disable2" @click="saveRule()">保 存</el-button>
            </div>
          </el-dialog>
        </el-tab-pane>
        <el-tab-pane label="关键词回复" name="three">
          <div class="filter-container">
            <el-form :inline="true" class="demo-form-inline">
              <el-form-item label="">
                <el-input v-model="listQuery.name" placeholder="请输入规则名"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button  class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
              </el-form-item>
              <el-form-item>
                <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="createRule(2)">添加规则</el-button>
              </el-form-item>
            </el-form>
            <el-table
              :data="ruleList"
              v-loading="ruleLoading"
              style="width: 100%">
              <!--<el-table-column-->
                <!--label="规则序号" align="center" width="100px">-->
                <!--<template slot-scope="scope" >-->
                  <!--{{ scope.row.id }}-->
                <!--</template>-->
              <!--</el-table-column>-->
              <el-table-column
                label="规则名" align="center">
                <template slot-scope="scope">
                  {{ scope.row.name }}
                </template>
              </el-table-column>
              <el-table-column
                label="关键词">
                <template slot-scope="scope">
                  {{ scope.row.keyword }}
                </template>
              </el-table-column>
              <el-table-column
                label="匹配度">
                <template slot-scope="scope">
                  <el-tag>{{ scope.row.match | MatchFilter }}</el-tag>
                </template>
              </el-table-column>

              <el-table-column
                label="回复内容" align="center">
                <template slot-scope="scope">
                  {{ scope.row.remark }}
                </template>
              </el-table-column>
              <el-table-column
                label="操作" align="center">
                <template slot-scope="scope">
                  <el-button  size="small" type="success" @click="updateRule(scope.row)"><i class="el-icon-edit"></i> 编辑</el-button>
                  <el-button  size="small" type="danger" @click="deleteRule(scope.row)" icon="el-icon-delete">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getRules" />
          </div>
          <el-dialog :title="statusMap2[textType]" :visible.sync="outerVisible2">
            <el-form label-position="right" label-width="120px" :model="formLabelAlign">
              <el-form-item label="规则名称">
                <el-input v-model="formLabelAlign.name" style="width:60%;" placeholder="填写规则名"></el-input>
              </el-form-item>
              <el-form-item label="关键词">
                <el-input v-model="formLabelAlign.keyword" style="width:60%;"  placeholder="填写关键词" class="input-with-select">
                  <el-select v-model="formLabelAlign.match" style="width: 100px;" slot="prepend" placeholder="请选择">
                    <el-option label="全匹配" value="1"></el-option>
                    <el-option label="半匹配" value="2"></el-option>
                  </el-select>
                </el-input>
              </el-form-item>
              <el-form-item label="回复方式">
                <el-radio v-model="formLabelAlign.reply_mode" label="1">回复全部</el-radio>
                <el-radio v-model="formLabelAlign.reply_mode" label="2">随机回复一条</el-radio>
              </el-form-item>
              <el-form-item label="回复内容">
                <el-form-item>
                  <el-button class="filter-item" style="margin-left: 10px;" icon="el-icon-plus" @click="createReply(formLabelAlign.id,formLabelAlign.type)" circle></el-button>
                </el-form-item>
              </el-form-item>
            </el-form>
            <el-table
              :data="list"
              v-loading="listLoading"
              style="width: 100%">
              <el-table-column
                label="回复类型" align="center">
                <template slot-scope="scope">
                  {{ scope.row.type | TextFilter  }}
                </template>
              </el-table-column>
              <el-table-column
                label="回复内容" align="center">
                <template slot-scope="scope">
                  <el-image v-if="scope.row.type == '2'" :src="scope.row.content | getPicUrl" style="width: 100px" ></el-image><span v-else>{{ scope.row.content }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="操作" align="center">
                <template slot-scope="scope">
                  <el-button  size="small" type="danger" @click="deleteReply(scope.row,2)" icon="el-icon-delete">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-dialog
              width="35%"
              title="添加回复"
              :visible.sync="innerVisible2"
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
                <el-button @click="innerVisible2 = false">取 消</el-button>
                <el-button type="primary" :disabled="disable1" @click="saveReply(2)">确 定</el-button>
              </div>
            </el-dialog>
            <div slot="footer" class="dialog-footer">
              <el-button @click="outerVisible2 = false">取 消</el-button>
              <el-button type="primary" :disabled="disable2" @click="saveRule()">保 存</el-button>
            </div>
          </el-dialog>
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>

</template>

<script>
  import {getReply,getReplyDetail,handleReply,deleteReply,handleRule,deleteRule,getRules} from '@/api/reply'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  const textMap = {
    1: '文本',
    2: '图片'
  };
  const matchMap = {
    1:'全匹配',
    2:'半匹配'
  }
  export default {
    components: {Pagination},
    filters: {
      TextFilter(status) {
        return textMap[status]
      },
      MatchFilter(match){
        return matchMap[match];
      },
      getPicUrl(url) {
        return process.env.VUE_APP_IMAGE_DIR + url;
      },
    },
    data() {
      return {
        disable1:false,
        disable2:false,
        listLoading:true,
        ruleLoading:false,
        total:0,
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
          type:'',
          name:'',
          reply_mode:'1',
          match:'1',
          keyword:'',
          qr_code:''
        },
        textType:'create',
        dialogVisible: false,
        outerVisible1: false,
        innerVisible1: false,
        outerVisible2: false,
        innerVisible2: false,
        activeName: 'first',
        listQuery: {
          page: 1,
          limit: 5,
          type: 1,
          name: ''
        },
        list: [],
        ruleList: [],
      };
    },
    created(){
      this.getList();
    },
    methods: {
      handleFilter() {
        this.listQuery.page = 1;
        this.getRules()
      },
      checkTab(){
        if(this.activeName === 'first'){
          this.list = [];
          this.getList();
        }else if(this.activeName === 'second'){
          this.resetQurey();
          this.listQuery.type = 1;
          this.getRules();
        }else if(this.activeName === 'three'){
          this.resetQurey();
          this.listQuery.limit =10;
          this.listQuery.type = 2;
          this.getRules();
        }
      },
      getRules(){
        this.ruleLoading = true;
        getRules(this.listQuery).then(response=>{
          this.ruleList = response.data.items;
          this.total = response.data.total;
          this.ruleLoading = false;
        })
      },
      getList(rule_id){
        this.listLoading = true;
        getReply(rule_id).then(response=>{
          this.list = response.data;
          this.listLoading = false;
        })
      },
      createReply(rule_id,type=1){
        this.resetForm();
        if(rule_id === 0){
          this.dialogVisible = true;
        }else{
          if(type == 1){
            this.innerVisible1 = true;
          }else{
            this.innerVisible2 = true;
          }

        }
        this.form.rule_id = rule_id;
      },
      resetForm(){
        this.fileList = [];
        this.form = {
          id:'',
          rule_id:'',
          type:'1',
          content:''
        };
      },
      resetForm2(){
        this.formLabelAlign ={
          id:'',
          type:'',
          name:'',
          reply_mode:'1',
          match:'1',
          keyword:'',
          qr_code:''
        }
      },
      resetQurey(){
        this.ruleList = [];
        this.total = 0;
        this.listQuery = {
          page: 1,
          limit: 5,
          type: 0,
          name: ''
        };
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
          this.innerVisible1 = false;
          this.innerVisible2 = false;
        }else{
          this.disable1 = true;
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
            this.disable1 = false
            this.dialogVisible = false;
          }).catch(err=>{
            this.disable1 = false;
            console.error(err)
          });
        }
      },
      updateReply(row,type){
        this.resetForm();
        if(type === 1){
          this.dialogVisible = true;
        } else {
          this.innerVisible1 = true;
          this.innerVisible2 = true;
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
      createRule(type){
        this.textType = 'create';
        this.resetForm2();
        this.formLabelAlign.type = type;
        this.list = [];
        if(type == 1){
          this.outerVisible1  = true;
        }else{
          this.outerVisible2  = true;
        }
      },
      updateRule(row){
        this.textType = 'edit';
        this.list = row.list;
        this.formLabelAlign = row
        this.formLabelAlign.match = row.match.toString();
        this.formLabelAlign.reply_mode = row.reply_mode.toString();
        if(row.type == 1){
          this.outerVisible1  = true;
        }else{
          this.outerVisible2  = true;
        }
      },
      deleteRule(row){
        this.$confirm("确定要删除规则么", '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteRule(row.id).then(() => {
            this.$message({
              type: 'success',
              message: '删除规则成功!'
            });
            const index = this.ruleList.indexOf(row);
            this.ruleList.splice(index, 1);
          });
        }).catch(err => { console.error(err) })
      },
      saveRule(){
         this.disable2 = true;
         this.formLabelAlign.list = this.list;
         handleRule(this.formLabelAlign).then(response=>{
           this.$message.success('操作成功');
           if(this.formLabelAlign.type == 1){
             this.formLabelAlign.qr_code = response.data.qr_code;
           }
           this.formLabelAlign.remark = response.data.remark;
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
             this.ruleList.unshift(this.formLabelAlign)
           }
           this.disable2 = false;
           this.outerVisible1 = false;
           this.outerVisible2 = false;
         }).catch(err =>{
           this.disable2 = false;
           console.error(err)
         });
      },
      handleRemove(){
          this.fileList = [];
      }
    }
  };

</script>
