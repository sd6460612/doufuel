<!--
列表表格组件

参数：
表格相关参数、事件直接写在组件上，具体参见@see https://element.eleme.io/#/zh-CN/component/table
分页相关参数写在pagination内，具体参见@see https://element.eleme.io/#/zh-CN/component/pagination
以下参数为本组件设置
data  静态数据（和fetch冲突）
paged 静态数据是否是分页控制过的数据，需要data不为空，默认false
fetch 获取数据方法（和data冲突），data不为空时失效
param 获取数据方法参数，实际执行时会加上分页相关参数
page  当前页数，默认1，支持.sync
rows  每页条数，默认10，支持.sync
sidx  排序字段
sord  排序规则，asc，desc
select  是否有多选框，默认true
index 是否显示序号，默认true
pagination  分页相关参数以json形式写这里，其中事件监听写{events:{xxx}}里

常用方法
fetchData 重新获取数据
getTable 获取table的组件
getPagination  获取pagination的组件

事件
page  页码改变后
-->
<template>
  <div>
    <el-table
      ref="table"
      :data="ddata"
      v-bind="$attrs"
      v-on="$listeners"
      v-loading="listLoading"
    >
      <el-table-column
        align="center"
        show-overflow-tooltip
        type="selection"
        width="50"
        v-if="select"
      ></el-table-column>
      <el-table-column
        align="center"
        type="index"
        label="序号"
        width="50"
        v-if="index"
        :index="handleIndex">
      </el-table-column>
      <slot></slot>
    </el-table>
    <el-pagination
      ref="pagination"
      :v-bind="pagination"
      v-on="pagination.events"
      :current-page.sync="dpagenum"
      :page-size.sync="dpagesize"
      :total="pagination&&pagination.total?pagination.total:dtotal"
      background
      :layout="pagination.layout?pagination.layout:'total, sizes, prev, pager, next, jumper'"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    >
    </el-pagination>
  </div>
</template>
<script>
  import ajaxData from "./modes/ajaxData";
  import completeData from "./modes/completeData";
  import pagedData from "./modes/pagedData";

  export default {
    name: 'ElDoufugrid',
    props: {
      'data': {type: Array, default: null},
      'paged': {default: false},
      'param': {type: Object, default: () => ({})},
      'fetch': {
        type: Function, default: () => {
        }
      },
      'page': {type: Number, default: 1},
      'rows': {type: Number, default: 10},
      'sidx': {type: String, default: ""},
      'sord': {type: String, default: ""},
      'select': {default: true},
      'index': {default: true},
      'pagination': {type: Object, default: () => ({})}
    },
    data() {
      return {
        ddata: [],
        dpagenum: 1,
        dpagesize: 10,
        dtotal: 0,
        dsidx: "",
        dsord: "",
        dparam: {},
        listLoading:false,
      }
    },
    created() {
      this.init();
    },
    computed:{
      mode(){
        if (this.data) {
          if (this.paged) {
            // console.log(1);
            return pagedData;
          } else {
            // console.log(2);
            return completeData;
          }
        } else {
          // console.log(3);
          return ajaxData;
        }
      }
    },
    watch:{
      data:{
        immediate: true,
        handler() {
          this.mode.watch_data(this);
        }
      },
      param:{
        immediate: false,
        deep:true,
        handler() {
          this.fetchData();
        }
      }
    },
    methods: {
      async init(){
        this.listLoading = true;
        this.dpagenum = this.page&&this.page.page?this.page.page:1;
        this.dpagesize = this.page&&this.page.rows?this.page.rows:10;
        await this.mode.init(this);
        this.listLoading = false;
      },
      handleIndex(i){
        return i+1+ (this.dpagenum-1) * this.dpagesize ;
      },
      async fetchData() {
        this.listLoading = true;
        await this.mode.fetchData(this);
        this.listLoading = false;
      },
      handleSizeChange(val) {
        if (this.pagination.events&&this.pagination.events['size-change']) {
          const f = pagination.events['size-change'](val);
          if (!f) {
            return;
          }
        }
        this.dpagesize = val;
        this.dpagenum = 1;
        this.fetchData();
        this.$emit("update:page",1);
        this.$emit("update:rows",val);
        this.$emit("page",{page:1,rows:val});
      },
      handleCurrentChange(val) {
        if (this.pagination.events&&this.pagination.events['current-change']) {
          const f = this.pagination.events['current-change'](val);
          if (!f) {
            return;
          }
        }
        this.dpagenum = val;
        this.fetchData();
        this.$emit("update:page",val);
        this.$emit("page",{page:val,rows:this.dpagesize});
      },
      handleQuery() {
        this.dpagenum = 1
      },
      getTable(){
        return this.$refs.table;
      },
      getPagination(){
        return this.$refs.pagination;
      }
    },
  }
</script>
