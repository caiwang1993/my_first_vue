<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="table_container">
          <el-table :data="tableData">
            <el-table-column label="姓名" prop="name"></el-table-column>
            <el-table-column label="注册日期" prop="register_date"></el-table-column>
            <el-table-column label="地址" prop="address"></el-table-column>
            <el-table-column label="权限" prop="auth"></el-table-column>
          </el-table>
          <div class="Pagination">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-size="limit"
              layout="total, prev, pager, next"
              :total="count"
            >
            </el-pagination>
          </div>
        </div>
    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import {adminList, adminCount} from '@/api/getData'
    export default {
        data(){
            return {
                tableData: [],
                currentRow: null,
                offset: 0,
                limit: 20,
                count: 0,
                currentPage: 1,
            }
        },
    	components: {
    		headTop,
    	},
        created(){
          this.initData()
        },
        methods: {
          async initData(){
              try {
                const countData = await adminCount();
                this.count=countData.count;
                const result = await adminList({offset:this.offset,limit:this.limit});
                if(result.status ==1){
                  this.tableData=[];
                  result.data.map(item =>{
                        this.tableData.push({
                          name:item.user_name,
                          register_date:item.create_time,
                          address:item.city,
                          auth:item.admin
                        })
                    })
                }else {
                    this.$message.error({
                      message:adminList.message
                    })
                }
              }catch (err){
                  console.log(err)
              }
          },
          handleSizeChange(val){
            console.log(`每页 ${val} 条`)
          },
          handleCurrentChange(val){
            this.currentPage=val;
            this.offset=(val-1)*this.limit;
            this.getResturants()
          },
        },
    }
</script>

<style lang="less">
	@import '../style/mixin';
    .table_container{
        padding: 20px;
    }
</style>


