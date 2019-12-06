<template>
  <div>
    <h2 style="color: #333333;">常用工具栏</h2>
    <el-form  :model="tools" :inline="true" label-position="right" label-width="110px">
    <el-col :span="12"><div class="grid-content bg-purple">
        <el-form-item label="ID：">
          <el-input placeholder="ID"  v-model="tools.id" ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="onSubmit('encrypt','id')">加密</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('decrypt','id')">解密</el-button>
        </el-form-item>
    </div></el-col>
    <el-col :span="12">
      <div class="grid-content bgMD-purple-light">
        <el-form-item label="MD5：">
          <el-input placeholder="请输入想要转换的字符" v-model="tools.md5"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="onSubmit('encrypt','md5')">加密</el-button>
        </el-form-item>
    </div></el-col>

    <el-col :span="12"><div class="grid-content bg-purple">
        <el-form-item label="URL编码转换：">
          <el-input  placeholder="请输入想要转换的字符" v-model="tools.url"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="onSubmit('encrypt','url')">编码</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('decrypt','url')">解码</el-button>
        </el-form-item>
    </div></el-col>
    <el-col :span="12"><div class="grid-content bg-purple-light">
        <el-form-item label="BASE64：">
          <el-input  placeholder="请输入想要转换的字符" v-model="tools.base64"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="onSubmit('encrypt','base64')">加密</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('decrypt','base64')">解密</el-button>
        </el-form-item>
    </div></el-col>
    <div class="grid-content bg-purple">
        <el-form-item label="时间转换：">
          <el-input  placeholder="请输入想要转换的字符" v-model="tools.time"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('decrypt','time')">时间戳转字符串</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="onSubmit('encrypt','time')">字符串转时间戳</el-button>
        </el-form-item>
    </div>
    <div class="grid-content bg-purple">
        <el-form-item label="二维码：">
          <el-input  placeholder="请输入地址" v-model="tools.code"></el-input>
        </el-form-item>
        <el-form-item  prop="name">
          <el-input v-model="tools.size"></el-input>
        </el-form-item>
        <el-form-item>
          <el-popover
            placement="right"
            :width="size"
            trigger="click">
            <img alt=""  v-if="image" :src="image | getImageUrl" />
            <el-button   slot="reference" type="primary" @click="onSubmit('encrypt','code')">生成</el-button>
          </el-popover>
        </el-form-item>
    </div>
    </el-form>
  </div>
</template>

<script>
  import { getData } from '@/api/tools'
  export default {
    name: 'tools',
    filters:{
      getImageUrl(url) {
        var myDate = new Date();
        return process.env.VUE_APP_IMAGE_DIR + url + '?ts=' +  myDate.getTime() ;
      },
    },
    data() {
      return {
        image:'',
        size:'',
        tools:{
          id:'',
          md5:'',
          url:'',
          base64:'',
          time:'',
          code:'',
          size:'200x200'
        }
      }
    },
    methods: {
      onSubmit(a,b) {
        this.tools.way = a;
        this.tools.type = b;
        this.image = '';
        this.size = '';
        getData(this.tools).then(response => {
            if(b  !== 'code'){
              this.tools[b] = response.data;
            }else{
              let a = this.tools.size.split('x');
              this.size = a[0];
              this.image = response.data;
            }

          })
        }
    }
  }
</script>
