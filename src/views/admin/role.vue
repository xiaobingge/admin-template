<template>
  <div class="app-container">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item><el-button type="primary" icon="el-icon-plus" @click="handleAddRole">添加角色</el-button></el-form-item>
    </el-form>
    <el-table :data="rolesList" style="width: 100%" border  v-loading="listLoading">
      <el-table-column align="center" label="ID" width="50">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column align="center" label="角色名称" width="220">
        <template slot-scope="scope"><el-tag>{{ scope.row.name }}</el-tag></template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">{{ scope.row.created_at }}</template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="success"  size="small" @click="handleUser(scope.row.id)" icon="el-icon-s-custom">授权用户</el-button>
          <el-button type="warning" size="small" @click="handlePermission(scope.row.id)"><svg-icon icon-class="tree" /> 授权菜单</el-button>
          <el-button type="primary" size="small" @click="handleEdit(scope)" icon="el-icon-edit">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="small" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>


    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑角色':'创建角色'">
      <el-form ref="dataForm" :rules="rules" :model="role" label-width="80px" style="margin-left: 50px;" label-position="left">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="role.name" size="medium" style="width: 200px;"  placeholder=""/>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmRole">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogVisible2" :title="'授权菜单'">
      <el-form ref="dataForm2" label-width="100px" style="margin-bottom: 30px;" label-position="left">
        <el-tabs type="border-card" v-model="activeName">
          <el-tab-pane :label=" item.name" v-bind:name="item.name"  v-for="(item,index) in dataModel">
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
        <el-button type="danger" @click="dialogVisible2=false">取消</el-button>
        <el-button type="primary" @click="confirmPermission">确定</el-button>
      </div>
    </el-dialog>


    <el-dialog :visible.sync="dialogVisible3" :title="'批量授权用户'">
      <el-form ref="dataForm2" label-width="100px" style="margin-bottom: 30px;" label-position="left">
        <div style="text-align: center">
        <el-transfer
          style="text-align: left; display: inline-block"
          filterable
          filter-placeholder="请输入用户名"
          :titles="['未授权用户', '已授权用户']"
          v-model="binds"
          :data="users">
        </el-transfer></div>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible3=false">取消</el-button>
        <el-button type="primary" @click="confirmUser">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { deepClone,parseTime } from '@/utils'
  import { getRoles, addRole, deleteRole, updateRole ,getPermission,setPermission,getUsers,bindUsers } from '@/api/role'
  const defaultRole = {
    id: '',
    name: '',
    created_at :''
  };
  export default {
    data() {
      return {
        role: Object.assign({}, defaultRole),
        rolesList: [],
        dialogVisible: false,
        dialogVisible2:false,
        dialogVisible3:false,
        dialogType: 'new',
        listLoading: true,
        rules: {
          name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
        },
        dataModel:[],
        activeName:'',
        role_id:0,
        users: [],
        binds: [],
      }
    },
    computed: {
    },

    created() {
      // Mock: get all routes and roles list from server
      this.getRoles()
    },
    methods: {
      async getRoles() {
        const res = await getRoles();
        this.listLoading = false;
        this.rolesList = res.data;
      },
      handleUser(id){
        this.binds = [];
        this.users = [];
        this.role_id = id;
        getUsers(id).then(response =>{
          this.dialogVisible3 = true;
          let res = response.data.users;
           res.forEach((user) => {
            this.users.push({
              label: user.name,
              key: user.id,
            });
           });
          this.binds = response.data.binds;
        });
      },
      confirmUser(){
        if(this.role_id === 0){
          this.$message.error('角色ID为空');
          return false;
        }
        bindUsers({id:this.role_id,uids:this.binds}).then( response =>{
          this.dialogVisible3 = false;
          this.$notify({
            title: 'Success',
            message: '授权成功',
            type: 'success'
          })
        });
      },
      async handlePermission(id){
        this.role_id = id;
        this.dataModel = [];
        getPermission(id).then( response =>{
          this.dialogVisible2 = true;
          this.dataModel = response.data;
          this.activeName = this.dataModel[0].name;
          for(var i=0;i<this.dataModel.length;i++){
            this.getIsCheckAll(i);
          }
        });
      },
      confirmPermission(){
        if(this.role_id === 0){
            this.$message.error('角色ID为空');
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
        setPermission({role_id:this.role_id,ids:ids}).then( response =>{
          this.dialogVisible2 = false;
          this.$notify({
            title: 'Success',
            message: '授权成功',
            type: 'success'
          })
        });
      },
      handleAddRole() {
        this.role = Object.assign({}, defaultRole)
        this.dialogType = 'new';
        this.dialogVisible = true;
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      handleEdit(scope) {
        this.dialogType = 'edit';
        this.dialogVisible = true;
        this.role = deepClone(scope.row);
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      handleDelete({ $index, row }) {
        this.$confirm('确定要删除'+row.name+'角色吗？', '危险操作', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(async() => {
            await deleteRole(row.id);
            this.rolesList.splice($index, 1);
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          })
          .catch(err => { console.error(err) })
      },
      confirmRole() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const isEdit = this.dialogType === 'edit';
            if (isEdit) {
              updateRole(this.role).then( response =>{
                for (let index = 0; index < this.rolesList.length; index++) {
                  if (this.rolesList[index].id === this.role.id) {
                    this.rolesList.splice(index, 1, Object.assign({}, this.role));
                    break
                  }
                }
                this.dialogVisible = false;
                this.$notify({
                  title: 'Success',
                  message: '编辑成功',
                  type: 'success'
                })
              });
            } else {
              addRole(this.role).then( response => {
                  this.role.id = response.data.id;
                  this.role.created_at = response.data.created_at;
                  this.rolesList.push(this.role);
                this.dialogVisible = false;
                this.$notify({
                  title: 'Success',
                  message: '创建成功',
                  type: 'success'
                })
              });

            }
          }
        });
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
    }
  }
</script>

<style lang="scss" scoped>
  .app-container {
    .roles-table {
      margin-top: 30px;
    }
    .permission-tree {
      margin-bottom: 30px;
    }
  }
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 10px;
  }
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 100%;
  }

  .el-checkbox+.el-checkbox {
    margin-left: 0px;
  }
  .el-checkbox {
    margin-right: 20px;
  }
</style>
