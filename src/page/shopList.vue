<template>
  <div class="fillcontain">
    <headTop></headTop>
    <div class="table-container">
      <el-table :data="tableData" border style="width: 100%;">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="店铺名称"><span>{{props.row.name}}</span></el-form-item>
              <el-form-item label="店铺地址"><span>{{props.row.address}}</span></el-form-item>
              <el-form-item label="店铺介绍"><span>{{props.row.desc}}</span></el-form-item>
              <el-form-item label="店铺ID"><span>{{props.row.id}}</span></el-form-item>
              <el-form-item label="联系电话"><span>{{props.row.phone}}</span></el-form-item>
              <el-form-item label="评分"><span>{{props.row.score}}</span></el-form-item>
              <el-form-item label="销售量"><span>{{props.row.recent_order_num}}</span></el-form-item>
              <el-form-item label="分类"><span>{{props.row.category}}</span></el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="店铺名称" property="name"></el-table-column>
        <el-table-column label="店铺地址" property="address"></el-table-column>
        <el-table-column label="店铺介绍" property="desc"></el-table-column>
        <el-table-column label="操作" >
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index,scope.row)">编辑</el-button>
            <el-button size="mini" @click="addFood(scope.$index,scope.row)">添加食品</el-button>
            <el-button type="danger" size="mini" @click="handleDelete(scope.$index,scope.row)">删除</el-button>
          </template>
        </el-table-column>
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
      <!--修改弹窗-->
      <el-dialog title="修改店铺信息" v-model="dialogFormVisible">
        <el-form :model="editForm">
          <el-form-item prop="" label="店铺名称" label-width="110px">
            <el-input v-model="editForm.name" placeholder="请输入店铺名称" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="详细地址" label-width="110px">
            <el-autocomplete
              v-model="address.address"
              placeholder="请输入详细地址"
              :fetch-suggestions="querySearchAsync"
              @select="addressSelect"
              style="width: 100%;"
            >

            </el-autocomplete>
          </el-form-item>
          <el-form-item label="" label-width="110px"  >
            <span>当前城市：{{city.name}}</span>
          </el-form-item>
          <el-form-item label="店铺介绍" label-width="110px">
            <el-input v-model="editForm.desc" auto-complete="off" placeholder="请输入店铺介绍"></el-input>
          </el-form-item>
          <el-form-item label="联系电话" label-width="110px">
            <el-input v-model="editForm.phone" auto-complete="off" placeholder="请输入联系电话"></el-input>
          </el-form-item>
          <el-form-item label="店铺分类" label-width="110px">
            <el-cascader
              :options="categoryOptions"
              v-model="selectedCategory"
              change-on-select
            ></el-cascader>
          </el-form-item>
          <el-form-item label="商铺图片" label-width="110px">
            <el-upload
              :action="baseUrl+ '/v1/addimg/shop'"
              class="avatar-uploader"
              :show-file-list="false"
              :on-success="handleServiceAvatarScucess"
              :before-upload="beforeAvatarUpload">
              <img v-if="editForm.image_path" :src="baseImgPath+editForm.image_path" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="updateShop">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import headTop from '@/components/headTop'
  import {baseUrl,baseImgPath} from '@/config/env'
  import {getResturants,deleteResturant,cityGuess,getResturantsCount,searchplace,foodCategory,updateResturant} from '@/api/getData'
  import $ from 'jquery'
  import ElUpload from "../../node_modules/_element-ui@1.4.13@element-ui/packages/upload/src/index";
  //import  common from '@/js/common'
  export default {
      data(){
          return{
            baseUrl,
            baseImgPath,
            tableData:[],
            offset:0,
            limit:20,
            count:0,
            currentPage:1,
            city:{},
            dialogFormVisible:false,
            editForm:{},
            address: {},
            categoryOptions:[],
            selectedCategory: [],
          }
      },
      components:{
        ElUpload,
        headTop
      },
      mounted(){
          //引用jq插件
         // this.common;
        this.initData();
      },
    methods:{
      async initData(){
              try {
                this.city= await cityGuess();
                const countData = await getResturantsCount();
                if(countData.status ==1){
                    this.count = countData.count
                }else {
                    throw new Error("获取信息失败")
                }
                this.getResturants()
              }catch(err){
                  console.log('数据获取失败',err)
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
      async getResturants(){
        const {latitude, longitude} = this.city;
        const restaurants =await getResturants({latitude:latitude,longitude:longitude,offset:this.offset,limit:this.limit});
        this.tableData = [];
        restaurants.map(item=>{
            let tableData={};
            tableData.id=item.id;
            tableData.name=item.name;
            tableData.address=item.address;
            tableData.desc=item.description;
            tableData.phone=item.phone;
            tableData.score=item.rating;
            tableData.recent_order_num=item.recent_order_num;
            tableData.category=item.category;
            tableData.image_path=item.image_path;
            this.tableData.push(tableData)
        })
      },
      addFood(index,row){
          this.$router.push({path:'addGoods',query:{restaurant_id: row.id}})
      },
      handleEdit(index,row){
        this.editForm=row;
        this.dialogFormVisible=true;
        this.address.address=row.address;
        this.selectedCategory=row.category.split("/");
        if(!this.categoryOptions.length){
            this.getCategory()
        }
      },
      async handleDelete(index,row){
        try{
            const del =await deleteResturant(row.id);
            if(del.status==1){
                this.$message({
                  type:'success',
                  message:'删除成功'
                });
                //从索引index开始删除1个元素
              this.tableData.splice(index,1)
            }else{
              throw new Error(del.message)
            }
        }catch (err){
            this.$message({
              type:'error',
              message:err.message
            })
            console.log('删除失败')
        }
      },
      async querySearchAsync(queryString,cb){
        if(queryString){
            try{
                //queryString为搜索字段
              const cityList = await searchplace(this.city.id, queryString);
              //判断cityList是否输入Array类型
              if(cityList instanceof Array){
                cityList.map(function(item){
                  item.value=item.address;
                  return item
                });
                cb(cityList)
              }
            }catch (err){
                console.log('获取信息错误',err)
            }
        }
      },
      addressSelect(val){
        const {address, latitude, longitude} = val;
        this.address={address, latitude, longitude}
      },
      async getCategory(){
          try{
            const categories = await foodCategory();
            categories.forEach(item =>{
              const addNew={
                value:item.name,
                label:item.name,
                children:[]
              };
              if (item.sub_categories.length) {
                item.sub_categories.forEach((subItem,index)=>{
                    if(index==0){
                        return false
                    }
                  addNew.children.push({
                    value:subItem.name,
                    label:subItem.name
                  });
                })
              }
              this.categoryOptions.push(addNew)
            })

          }catch (err){
              console.log('获取数据失败',err)
          }
      },
      handleServiceAvatarScucess(res,file){
        if(res.status==1){
          this.editForm.image_path = res.image_path
        }else {
            this.$message.error('上传图片失败')
        }
      },
      beforeAvatarUpload(file){
        //上传图片格式为jpeg 或者png
        const isRightType=(file.type==='image/jpg') || (file.type === 'image/png');
        //是否图片小于2M
        const isLt2M = file.size/1024/1024 < 2;
        if(!isRightType){
            this.$message.error('上传头像图片只能是 JPG或PNG 格式!')
        }
        if(!isLt2M){
            this.$message.error('上传头像图片大小不能超过 2MB!')
        }
        return isRightType && isLt2M;
      },
      async updateShop(){
          this.dialogFormVisible = false;
          try{
            //Object.assign从原对象复制到目标对象
            Object.assign(this.editForm,this.address);
            this.editForm.category=this.selectedCategory.join('/');
            const res =await updateResturant(this.editForm);
            if(res.status==1){
                this.$message.success('更新数据成功')
            }else {
                this.$message.error(res.message)
            }
            this.getResturants();
          }catch (err){
              console.log("更新数据失败",err)
          }
      }
    }
  }
</script>

<style lang="less">
  @import '../style/mixin';
  .table-container{
    padding: 20px;
  }
  .demo-table-expand{
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .Pagination{
    display: flex;
    justify-content: flex-start;
    margin-top: 20px;
  }
  .avatar-uploader .el-upload{
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }
  .avatar {
    width: 120px;
    height: 120px;
    display: block;
  }
</style>
