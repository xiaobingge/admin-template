<template>
  <el-container style="border: 1px solid #eee">
    <el-main>
      <div class="filter-container">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="">
            <el-select v-model="listQuery.type" style="width: 100px;">
              <el-option label="标签名" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-input v-model="listQuery.keyword" placeholder=""></el-input>
          </el-form-item>
          <el-form-item>
            <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
          </el-form-item>
          <el-form-item>   <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate('create')">创建标签</el-button></el-form-item>
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
      >
        <el-table-column label="ID" prop="id"  align="center" width="75">
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="标签名" width="150px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="权重" width="150px" sortable="custom" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="150px" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status | colorFilter2">{{ scope.row.status | statusFilter  }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" width="180px">
          <template slot-scope="scope">
            <span>{{ scope.row.created_at}}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" width="360"   fixed="right" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button  size="small" type="success" @click="handleUpdate(scope.row)"><i class="el-icon-edit"></i> 编辑</el-button>
            <el-button  size="small" type="danger" @click="handleDelete(scope)" icon="el-icon-delete">删除</el-button>
          </template>
        </el-table-column>
      </el-table>


      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" >
        <el-form :model="temp" status-icon  ref="dataForm" label-width="100px"  style="width: 400px;" class="demo-dynamic">
          <el-form-item label="标签名"  prop="name">
            <el-input v-model="temp.name" v-bind:disabled="disabledInput" placeholder="输入标签"></el-input>
          </el-form-item>
          <el-form-item label="类型">
            <el-select v-model="temp.type" style="width: 300px;"  placeholder="选择类型">
              <el-option
                v-for="(item,index) in types"
                :key="index"
                :label="item"
                :value="index  + 1">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="尺寸">
            <el-select v-model="temp.type" style="width: 300px;"  placeholder="选择尺寸">
              <el-option
                v-for="(item,index) in sizes"
                :key="index"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="样式">
            <el-select v-model="temp.type" style="width: 300px;"  placeholder="选择样式">
              <el-option
                v-for="(item,index) in css"
                :key="index"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="标签颜色" prop="name">
           <el-color-picker  v-model="temp.color"></el-color-picker>
          </el-form-item>
          <el-form-item label="字体颜色" prop="name">
            <el-color-picker  v-model="temp.color"></el-color-picker>
          </el-form-item>
          <el-form-item label="权重" prop="weight">
            <el-input-number v-model="temp.weight"  :min="1" :max="10000" label="描述文字"></el-input-number>
          </el-form-item>
          <el-form-item label="是否可关闭" prop="delivery">
            <el-switch v-model="temp.delivery"></el-switch>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="dialogStatus==='create'  ?createData():updateData()">确定</el-button>
        </div>
      </el-dialog>

    </el-main>
  </el-container>
</template>
<style>

</style>
<script>
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
    name: 'labels',
    inject: ['reload'],
    components: { Pagination, Sticky },
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
      getAvatarUrl(url) {
        return process.env.VUE_APP_IMAGE_DIR + url;
      },
    },
    data() {
      return {
        types: ['primary' ,'success' ,'danger' ,'warning'],
        sizes:['large', 'medium'],
        css: ['plain' , 'round' ,  'mark' ],
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: false,
        listQuery: {
          page: 1,
          limit: 5,
          export: undefined,
          type: '1',
          keyword: '',
          sort: '-id'
        },
        textMap: {
          update: '编辑标签',
          create: '创建标签',
        },
        dialogFormVisible: false,
        dialogVisible: false,
        dataModel: [],
        activeName: '',
        user_id: 0,
        dialogStatus: '',
        downloadLoading: false,
        disabledSelect: true,
        disabledInput: false,
        temp: {
          id: undefined,
          color: '#409EFF',
          weight: 1,
          name: '',
          email: '',
          avatar: '',
          status: 1,
          create_at: '',
          update_at: ''
        },
      }
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
          color: '#409EFF',
          weight: 1,
          email:'',
          avatar:'',
          status:1,
          password:'',
          selected_ids:[],
          selected_app_ids:[],
          create_at:'',
          update_at:''
        };
        this.avatarUrl = ''
      },
      resetDisable(){
        this.disabledInput = false;
      },
      handleCreate(a) {
          this.resetTemp();
          this.resetDisable();
          this.dialogStatus = a;
          this.dialogFormVisible = true;
          this.$nextTick(() => {
            this.$refs['dataForm'].clearValidate()
          })

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
          // if(this.temp.avatar)
          //   this.avatarUrl =  process.env.VUE_APP_IMAGE_DIR + this.temp.avatar;
          // else
          //   this.avatarUrl = '';
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
    }
  }
</script>
