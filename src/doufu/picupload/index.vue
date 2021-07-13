<!--
单图片上传组件
参数不推荐修改，具体详见el-upload组件，https://element.eleme.io/#/zh-CN/component/upload

参数
src 图片url，不包括前缀部分
baseUrl 图片url前缀，默认/RESOURCE
size 图片尺寸，默认长宽150

常用方法
getFile 返回el-upload组件

事件
upload-success  上传完成
-->
<template>
  <el-upload
    ref="pic"
    class="upload-demo"
    action="/api/annex/upload"
    name="Attachment"
    accept="image/gif,image/jpeg,image/jpg,image/png,image/svg"
    :data="{ path: 'pic' }"
    :limit="1"
    :on-change="handleChange"
    :on-remove="handleRemove"
    :before-remove="beforeRemove"
    :on-success="handleSuccess"
    :on-exceed="handleExceed"
    :auto-upload="false"
    :show-file-list="false"

    v-bind="$attrs"
    v-on="$listeners"
  >
    <img v-if="pic" :src="pic" class="avatar" :style="{'max-height':size, 'max-width':size}"/>
    <i v-else class="el-icon-plus avatar-uploader-icon" :style="{'height':size, 'width':size, 'line-height':size}"></i>
    <div slot="tip" class="el-upload__tip">
      只能上传jpg/png等图片格式文件，且不超过500kb
    </div>
  </el-upload>
</template>
<script>
  export default {
    name: 'ElDoufuPicupload',
    props:{
      src:{type:String},
      baseUrl:{type:String, default:"/RESOURCE"},
      size:{type:String, default:"150px"},
    },
    data() {
      return {
        pic:"",
      }
    },
    created(){
      this.init();
    },
    watch:{
      src(){
        this.init();
      }
    },
    methods: {
      init(){
        if (this.src) {
          this.pic = this.baseUrl + "/" + this.src;
        } else {
          this.pic = "";
        }
      },
      handleChange(file) {
        this.pic = URL.createObjectURL(file.raw)
      },
      handleRemove(file, fileList) {
      },
      handlePreview(file) {
      },
      handleSuccess(file, fileList) {
        if (file.success) {
          const f = file.data.items[0];
          // this.form.picname = f.file_name;
          // this.form.picurl = f.file_path;
          // console.log(f);
          this.pic = this.baseUrl + "/" + f.file_path + "/" + f.file_name;
          this.$emit("upload-success", {
            picname:f.file_name,picurl:f.file_path,oldname:f.old_name
          });
        }
      },
      handleExceed(files, fileList) {
        this.$set(fileList[0], 'raw', files[0]);
        this.$set(fileList[0], 'name', files[0].name);
        this.$refs['pic'].clearFiles(); //清除文件
        this.$refs['pic'].handleStart(files[0]); //选择文件后的赋值方法
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${file.name}？`)
      },
      getFile(){
        return this.$refs['pic'];
      }
    },
  }

</script>
<style lang="scss" scoped>
  ::v-deep {
    .el-form-item__content {
      .el-rate {
        display: inline-block;
        font-size: 0;
        line-height: 1;
        vertical-align: middle;
      }

      .el-transfer__buttons {
        padding: 10px 10px 0 10px;
      }
    }
    .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .el-upload:hover {
      border-color: #409eff;
    }
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    /*width: 150px;*/
    /*height: 150px;*/
    /*line-height: 150px;*/
    text-align: center;
  }

  .avatar {
    /*max-width: 150px;*/
    /*max-height: 150px;*/
    display: block;
  }
</style>
