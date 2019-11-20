<template>
  <el-container style="border: 1px solid #eee">
    <el-main>
      <div class="filter-container">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="">
            <el-select v-model="listQuery.type" style="width: 100px;">
              <el-option label="用户名" value="1"></el-option>
              <el-option label="邮箱" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-input v-model="listQuery.keyword" placeholder=""></el-input>
          </el-form-item>
          <el-form-item>
            <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
          </el-form-item>
          <el-form-item>   <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate('create')">创建用户</el-button></el-form-item>
          <!--<el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出用户</el-button>-->
        </el-form>

      </div>
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%;"
        @sort-change="sortChange"
        height="390"
      >
        <el-table-column label="ID" prop="id" sortable="custom" align="center" width="75">
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="用户名" width="150px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="150px" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status | colorFilter2">{{ scope.row.status | statusFilter  }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="角色" width="220">
          <template slot-scope="scope"><el-tag style="margin-right: 5px;margin-top: 2px;" v-for="item in scope.row.roles">{{ item.name }}</el-tag></template>
        </el-table-column>
        <el-table-column align="center" label="应用" width="220">
          <template slot-scope="scope"><el-tag style="margin-right: 5px;margin-top: 2px;" v-for="item in scope.row.apps">{{ item.app_name }}</el-tag></template>
        </el-table-column>
        <el-table-column label="邮箱" align="center" width="220px">
          <template slot-scope="scope">
            <span>{{ scope.row.email }}</span>
          </template>
        </el-table-column>

        <el-table-column label="创建时间" align="center" width="180px">
          <template slot-scope="scope">
            <span>{{ scope.row.created_at}}</span>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" width="180px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.updated_at}}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" width="360"   fixed="right" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button  size="small" type="success" @click="handleUpdate(scope.row)"><i class="el-icon-edit"></i> 编辑</el-button>
            <el-button type="warning" size="small" @click="handlePermission(scope.row.id)"><svg-icon icon-class="tree" />  用户授权</el-button>
            <el-button  size="small"  :type="scope.row.status | colorFilter " @click="updateStatus(scope)">{{ scope.row.status | textFilter  }}</el-button>
            <el-button  size="small" type="danger" @click="handleDelete(scope)" icon="el-icon-delete">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" >
        <el-form :model="temp" status-icon :rules="rules" ref="dataForm" label-width="100px"  style="width: 400px;" class="demo-ruleForm">
          <el-form-item label="用户名"  prop="name">
            <el-input v-model="temp.name" v-bind:disabled="disabledInput" placeholder="输入账号"></el-input>
          </el-form-item>
          <el-form-item label="邮箱"  prop="email" >
            <el-input v-model="temp.email" v-bind:disabled="disabledInput" placeholder="输入邮箱"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input type="password" v-bind:disabled="disabledInput" :placeholder="msgMap[dialogStatus]"></el-input>
          </el-form-item>
          <el-form-item label="绑定角色">
            <el-select v-model="temp.selected_ids" style="width: 300px;" multiple placeholder="支持绑定多个角色">
              <el-option
                v-for="item in roles"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="绑定应用">
            <el-select v-model="temp.selected_app_ids" style="width: 300px;" multiple placeholder="支持绑定多个应用">
              <el-option
                v-for="item in apps"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="dialogStatus==='create'  ?createData():updateData()">确定</el-button>
        </div>
      </el-dialog>

      <el-dialog :visible.sync="dialogVisible" :title="'用户单独授权'">
        <el-form ref="dataForm2" label-width="100px" style="margin-bottom: 30px;" label-position="left">
          <el-tabs type="border-card" v-model="activeName">
            <el-tab-pane :label=" item.name" v-bind:name="item.name"  v-for="(item,index) in dataModel" >
              <el-card class="box-card">
                <div class="clearfix" >
                  <el-checkbox v-model="item.isIndeterminate" @change="handleCheckAllChange(index,$event)"  style="float: right; padding: 3px 0">全选</el-checkbox>
                </div>
                <div class="text item" v-for="(item2 ,index2)  in  item.menu">
                  <el-checkbox  v-model="item2.checked"  @change="handleCheckedPermissionAllChange(index,index2,$event)"  >{{ item2.name }}</el-checkbox>
                  <div style="margin: 2.5px 0;"></div>
                  <el-checkbox  style="margin-left: 20px;"  @change="handleCheckedPermissionChange(index,index2,index3,$event)" v-model="item3.checked" v-for="(item3 ,index3) in item2['son']" >{{item3.name}}</el-checkbox>
                </div>
              </el-card>
            </el-tab-pane>
          </el-tabs>
        </el-form>
        <div style="text-align:right;">
          <el-button type="danger" @click="dialogVisible=false">取消</el-button>
          <el-button type="primary" @click="confirmPermission">确定</el-button>
        </div>
      </el-dialog>
    </el-main>
  </el-container>
</template>
<script>
  import { fetchList, createUser, updateUser, updateStatus,deleteUser,getRoles,getPermission,setPermission } from '@/api/user'
  import waves from '@/directive/waves' // Waves directive
  import { parseTime } from '@/utils'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import Sticky from '@/components/Sticky'

  const textMap = {
    0: '启用',
    1: '禁用'
  };

  const statusMap = {
    0: '禁用',
    1: '正常'
  };
  const colorMap = {
    0: 'primary',
    1: 'danger'
  };
  const colorMap2 = {
    0: 'info',
    1: 'primary'
  };
  export default {
    name: 'User',
    inject: ['reload'],
    components: { Pagination,Sticky},
    directives: { waves },
    filters: {
      statusFilter(status) {
        return statusMap[status]
      },
      TextFilter(status) {
        return textMap[status]
      },
      colorFilter(status) {
        return colorMap[status]
      },
      colorFilter2(status) {
        return colorMap2[status]
      },
    },
    data(){
      return {
        roles:[],
        apps:[],
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10,
          export: undefined,
          type:'1',
          keyword: '',
          sort: '-id'
        },
        textMap: {
          update: '编辑用户',
          create:'创建用户',
        },
        msgMap :{
          update: '',
          create:'不填写密码默认123456',
        },
        rules: {
          name: [{ required: true, message: '用户名称不能为空', trigger: 'blur' }],
          email: [{ required: true, message: '用户邮箱不能为空', trigger: 'blur' }],
        },
        dialogFormVisible:false,
        dialogVisible:false,
        dataModel:[],
        activeName:'',
        user_id:0,
        dialogStatus: '',
        downloadLoading: false,
        disabledSelect:true,
        disabledInput:false,
        temp: {
          id: undefined,
          name: '',
          email:'',
          status:1,
          password:'',
          selected_ids:[],
          selected_app_ids:[],
          create_at:'',
          update_at:''
        },
        formInline: {
          region: '用户名'
        }
      }
    },
    created() {
      this.getList()
    },
    methods: {
      onClick(event, treeId, treeNode){
        this.listQuery.pid = treeNode.id;
        this.listQuery.sort = '+id';
        this.handleFilter();
      },
      getList() {
        this.listLoading = true;
        fetchList(this.listQuery).then(response => {
          this.list = response.data.items;
          this.total = response.data.total;
          this.listLoading = false
        })
      },
      handleFilter() {
        this.listQuery.page = 1;
        this.getList()
      },
      handleModifyStatus(row, status) {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        row.status = status
      },
      sortChange(data) {
        const { prop, order } = data;
        if (prop === 'id') {
          this.sortByID(order)
        }
      },
      sortByID(order) {
        if (order === 'ascending') {
          this.listQuery.sort = '+id'
        } else {
          this.listQuery.sort = '-id'
        }
        this.handleFilter()
      },
      resetTemp() {
        this.temp = {
          id: undefined,
          name: '',
          email:'',
          status:1,
          password:'',
          selected_ids:[],
          selected_app_ids:[],
          create_at:'',
          update_at:''
        }
      },
      resetDisable(){
        this.disabledInput = false;
      },
      handleCreate(a) {
        getRoles().then(response => {
          this.roles = [];
          this.apps = [];
          this.resetTemp();
          this.resetDisable();
          this.dialogStatus = a;
          this.dialogFormVisible = true;
          let role = response.data.roles;
          for (var i=0; i<role.length;i++){
              this.roles.push({'value':role[i]['id'],'label':role[i]['name']})
          }
          let app = response.data.apps;
          for (var j=0; j<app.length;j++){
            this.apps.push({'value':app[j]['id'],'label':app[j]['app_name']})
          }
          this.$nextTick(() => {
            this.$refs['dataForm'].clearValidate()
          })
        });

      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            createUser(this.temp).then( response => {
              this.list.unshift(response.data);
              this.dialogFormVisible = false;
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      },
      handleUpdate(row) {
        getRoles(row.id).then(response => {
          this.roles = [];
          this.apps = [];
          row.selected_ids = [];
          row.selected_app_ids = [];
          this.temp = Object.assign({}, row); // copy obj
          this.dialogStatus = 'update';
          this.disabledInput = true;
          this.dialogFormVisible = true;
          let role = response.data.roles;
          let app = response.data.apps;
          let hasRoles = row.roles;
          let hasApps = row.apps;
          for (var i=0; i<role.length;i++){
            this.roles.push({'value':role[i]['id'],'label':role[i]['name']})
          }
          for (var j=0; j<hasRoles.length;j++){
            this.temp.selected_ids.push(hasRoles[j]['id'])
          }
          for (var k=0; k<app.length;k++){
            this.apps.push({'value':app[k]['id'],'label':app[k]['app_name']})
          }
          for (var m=0; m<hasApps.length;m++){
            this.temp.selected_app_ids.push(parseInt(hasApps[m]['id']));
          }
          this.$nextTick(() => {
            this.$refs['dataForm'].clearValidate()
          })
        });
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp);
            updateUser(tempData).then( response => {
              this.temp.roles = response.data.roles;
              this.temp.apps = response.data.apps;
              for (const v of this.list) {
                if (v.id === this.temp.id) {
                  const index = this.list.indexOf(v);
                  this.list.splice(index, 1, this.temp);
                  break
                }
              }
              this.dialogFormVisible = false;
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      },
      handlePermission(id){
        this.user_id = id;
        this.dataModel = [];
        getPermission(id).then( response =>{
          this.dialogVisible = true;
          this.dataModel = response.data;
          this.activeName = this.dataModel[0].name;
          for(var i=0;i<this.dataModel.length;i++){
            this.getIsCheckAll(i);
          }
        });
      },
      confirmPermission(){
        if(this.user_id === 0){
          this.$message.error('用户ID为空');
          return false;
        }
        var ids = [];
        for(var index = 0;index<this.dataModel.length;index++){
          if(typeof(this.dataModel[index]['menu']) != 'undefined'){
            for(var i = 0; i< this.dataModel[index]['menu'].length ;i++){
              if(this.dataModel[index]['menu'][i].checked === true){
                ids.push(this.dataModel[index]['menu'][i].id);
              }
              if(typeof(this.dataModel[index]['menu'][i]['son']) != 'undefined'){
                for(var j =0; j< this.dataModel[index]['menu'][i]['son'].length;j++){
                  if(this.dataModel[index]['menu'][i]['son'][j].checked === true){
                    ids.push(this.dataModel[index]['menu'][i]['son'][j].id)
                  }
                }
              }
            }
          }
        }
        // if(ids.length === 0){
        //   this.$message.error('请至少选择一个权限');
        //   return false;
        // }
        setPermission({uid:this.user_id,ids:ids}).then( response =>{
          this.dialogVisible = false;
          this.$notify({
            title: 'Success',
            message: '授权成功',
            type: 'success'
          })
        });
      },
      updateStatus({ $index, row }) {
        let type  =  0;
        this.temp = Object.assign({}, row); // copy obj
        this.$confirm('确定要'+textMap[row.status]+row.name+'用户吗？', '确认操作', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(async() => {
            if(row.status === 0)
                type = 1;
            await updateStatus(row.id,type);
            this.temp.status = type;
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v);
                this.list.splice(index, 1, this.temp);
                break
              }
            }
            this.$message({
              type: 'success',
              message: textMap[row.status]+'成功!'
            })
          })
          .catch(err => { console.error(err) })
      },
      handleDelete({ $index, row }) {
        this.$confirm("确定要删除用户么", '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteUser(row.id).then(() => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            const index = this.list.indexOf(row);
            this.list.splice(index, 1);
          });
        }).catch(err => { console.error(err) })
      },
      handleCheckAllChange(index,val) {
        if(val === true){
          if(typeof(this.dataModel[index]['menu']) != 'undefined'){
            for(var i = 0; i< this.dataModel[index]['menu'].length ;i++) {
              this.dataModel[index]['menu'][i].checked = true;
              if(typeof(this.dataModel[index]['menu'][i]['son']) != 'undefined' )
                for(var j =0; j< this.dataModel[index]['menu'][i]['son'].length;j++){
                  this.dataModel[index]['menu'][i]['son'][j].checked = true;
                }
            }
          }
        }else{
          if(typeof(this.dataModel[index]['menu']) != 'undefined'){
            for(var x = 0; x< this.dataModel[index]['menu'].length ;x++) {
              this.dataModel[index]['menu'][x].checked = false;
              if(typeof(this.dataModel[index]['menu'][x]['son']) != 'undefined' )
                for(var y =0; y< this.dataModel[index]['menu'][x]['son'].length;y++){
                  this.dataModel[index]['menu'][x]['son'][y].checked = false;
                }
            }
          }
        }
      },
      handleCheckedPermissionAllChange(index,index2,val){
        if(val === true){
          this.dataModel[index]['menu'][index2].checked = true;
          if(typeof(this.dataModel[index]['menu'][index2]['son']) != 'undefined' ){
            for(var i =0; i< this.dataModel[index]['menu'][index2]['son'].length;i++){
              this.dataModel[index]['menu'][index2]['son'][i].checked = true;
            }
          }

        }else{
          this.dataModel[index]['menu'][index2].checked = false;
          if(typeof(this.dataModel[index]['menu'][index2]['son']) != 'undefined' ){
            for(var j =0; j< this.dataModel[index]['menu'][index2]['son'].length;j++){
              this.dataModel[index]['menu'][index2]['son'][j].checked = false;
            }
          }
        }
        this.getIsCheckAll(index);
      },
      handleCheckedPermissionChange(index,index2,index3,val) {
        this.dataModel[index]['menu'][index2]['son'][index3].checked = val;
        this.getIsCheckAll(index,index2);
      },
      getIsCheckAll(index){
        var total = 0, tickCount = 0, unTickCount = 0;
        var  tickCount2 = 0, unTickCount2 = 0;
        var ArrLength2 = 0;
        var ArrLength = this.dataModel[index]['menu'].length;
        for(var i = 0; i< ArrLength ;i++) {
          if(this.dataModel[index]['menu'][i].checked === true){
            tickCount2++;
          }else{
            unTickCount2++;
          }
          if(typeof(this.dataModel[index]['menu'][i]['son']) != 'undefined' ){
            ArrLength2 = this.dataModel[index]['menu'][i]['son'].length;
            for(var j = 0; j< ArrLength2;j++) {
              if(this.dataModel[index]['menu'][i]['son'][j].checked === true){
                tickCount++;
                this.dataModel[index]['menu'][i].checked = true;
              }else{
                unTickCount++;
              }
            }
          }
          total =  parseInt(total) + parseInt(ArrLength2);
        }
        if(total === 0){
          if(tickCount2 === ArrLength){
            this.dataModel[index].isIndeterminate = true;
          } else if(unTickCount2 === ArrLength){
            this.dataModel[index].isIndeterminate = false;
          }else{
            this.dataModel[index].isIndeterminate = false;
          }
        }else{
          if(tickCount === total){
            this.dataModel[index].isIndeterminate = true;
          } else if(unTickCount === total){
            this.dataModel[index].isIndeterminate = false;
          }else{
            this.dataModel[index].isIndeterminate = false;
          }
        }
      },
      handleDownload() {
        this.downloadLoading = true;
        this.listQuery.export = 1;
        fetchList(this.listQuery).then(response => {
          this.list = response.data.items;
          import('@/vendor/Export2Excel').then(excel => {
            this.downloadLoading = false
          });
        });

      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'menu_type') {
            return typeMap[v[j]]
          }else if(j === 'status'){
            return statusMap[v[j]]
          }else if(j === 'guard_name'){
            return guardMap[v[j]]
          } else {
            return v[j]
          }
        }))
      },
    },
    mounted() {
    }
  };
</script>
<style scoped>
  .edit-input {
    padding-right: 100px;
  }
  .cancel-btn {
    position: absolute;
    right: 15px;
    top: 10px;
  }
  .card-header{
    height: 49px;
    text-indent: 20px;
    line-height: 52px;
    font-size: 14px;
  }
  .components-container div {
    margin: 10px;
  }
  .pagination-container {
    padding:10px;
  }

  .time-container {
    display: inline-block;
  }
</style>
