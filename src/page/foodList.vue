<template>
  <div class="fillcontain">
    <headTop></headTop>
    <div class="container">
      <el-table :data="tableData">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="食品名称"><span>{{props.row.name}}</span></el-form-item>
              <el-form-item label="餐馆名称"><span>{{props.row.restaurant_name}}</span></el-form-item>
              <el-form-item label="食品 ID"><span>{{props.row.item_id}}</span></el-form-item>
              <el-form-item label="餐馆 ID"><span>{{props.row.restaurant_id}}</span></el-form-item>
              <el-form-item label="食品介绍"><span>{{props.row.description}}</span></el-form-item>
              <el-form-item label="餐馆地址"><span>{{props.row.restaurant_address}}</span></el-form-item>
              <el-form-item label="食品评分"><span>{{props.row.rating}}</span></el-form-item>
              <el-form-item label="食品分类"><span>{{props.row.category_name}}</span></el-form-item>
              <el-form-item label="月销量"><span>{{props.row.month_sales}}</span></el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="食品名称" prop="name"></el-table-column>
        <el-table-column label="食品介绍" prop="description"></el-table-column>
        <el-table-column label="评分" prop="rating"></el-table-column>
        <el-table-column label="操作" width="160">
          <template slot-scope="scope">
            <el-button size="small" @click="handleEdit(scope.row)">
              编辑
            </el-button>
            <el-button size="small" type="danger" @click="delBtn(scope.$index,scope.row)">
              删除
            </el-button>
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
          :total="count">
        </el-pagination>
      </div>
    </div>
    <el-dialog
      title="修改食品信息"
      v-model="editVisible"
    >
      <el-form :model="editFoodForm" label-width="100px">
        <el-form-item label="食品名称">
          <el-input v-model="editFoodForm.name"></el-input>
        </el-form-item>
        <el-form-item label="食品介绍">
          <el-input v-model="editFoodForm.description"></el-input>
        </el-form-item>
        <el-form-item label="食品分类">
          <el-select v-model="editFoodForm.selectCategory">
            <el-option
              v-for="item in menuOptions"
              :key="item.index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="食品图片">
          <el-upload
            :action="baseUrl+ '/v1/addimg/food'"
            class="avatar-uploader"
            :show-file-list="false"
            :on-success="handleServiceAvatarScucess"
            :before-upload="beforeAvatarUpload">
            <img v-if="editFoodForm.image_path" :src="baseImgPath+editFoodForm.image_path" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <el-table :data="editFoodTable">
        <el-table-column label="规格" prop="specs"></el-table-column>
        <el-table-column label="包装费" prop="packing_fee"></el-table-column>
        <el-table-column label="价格" prop="price"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
            type="danger"
            size="small"
            @click="delSpecs(scope.$index)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row style="width: 100%;text-align: center;margin-top: 20px">
        <el-button type="primary" @click="addSpeVisible =true">
          添加规格
        </el-button>
      </el-row>
      <div slot="footer">
        <el-button @click="editVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="updateFood">
          确定
        </el-button>
      </div>
    </el-dialog>
    <!--添加规格弹窗-->
    <el-dialog
      title="添加规格"
      v-model="addSpeVisible"
    >
      <el-form
        :model="addSpeForm"
        label-width="100px"
        ref="addSpeForm"
        :rules="addSpeRules"
      >
        <el-form-item label="规格" prop="specs">
          <el-input v-model="addSpeForm.specs" placeholder="请输入规格"></el-input>
        </el-form-item>
        <el-form-item label="包装费" >
          <el-input-number v-model="addSpeForm.packing_fee" :min="0" :max="20" placeholder="请输入包装费"></el-input-number>
        </el-form-item>
        <el-form-item label="价格" >
          <el-input-number v-model="addSpeForm.price" :min="0" :max="10000" placeholder="请输入价格"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addSpeVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="addSpecs">
          确定
        </el-button>
      </div>

    </el-dialog>
  </div>
</template>
<script>
  import headTop from '@/components/headTop'
  import {baseUrl,baseImgPath} from '@/config/env'
  import {getFoods, getFoodsCount, getMenu, updateFood, deleteFood, getResturantDetail, getMenuById} from '@/api/getData'
  export default{
    data(){
      return{
        baseUrl,
        baseImgPath,
        offset:0,
        limit:20,
        count:0,
        currentPage:1,
        restaurant_id:null,
        tableData:[],
        editVisible:false,
        addSpeVisible:false,
        editFoodForm:{
        },
        menuOptions: [],
        addSpeForm:{
          specs:'',
          packing_fee: 0,
          price: 20,
        },
        addSpeRules:{
          specs:[{
            required:true,
            message:'规格不能为空',
            trigger:'blur'
          }]
        },
      }
    },
    components:{
      headTop
    },
    created(){
      this.restaurant_id = this.$route.query.restaurant_id;
      this.initData()
    },
    computed: {
      editFoodTable: function (){
        let specs = [];
        if (this.editFoodForm.specfoods) {
          this.editFoodForm.specfoods.forEach(item => {
            specs.push({
              specs: item.specs_name,
              packing_fee: item.packing_fee,
              price: item.price,
            })
          })
        }
        return specs
      }
    },
    methods:{
      async initData(){
        try{
          const countData = await getFoodsCount({restaurant_id: this.restaurant_id});
          if (countData.status == 1) {
            this.count = countData.count;
          }else{
            throw new Error('获取数据失败');
          }
          this.getFoods();
        }catch(err){
          console.log('获取数据失败', err);
        }
      },
      async getFoods(){
        const Foods = await getFoods({offset: this.offset, limit: this.limit, restaurant_id: this.restaurant_id});
        this.tableData = [];
        Foods.forEach((item, index) => {
          const tableData = {};
          tableData.name = item.name;
          tableData.item_id = item.item_id;
          tableData.description = item.description;
          tableData.rating = item.rating;
          tableData.month_sales = item.month_sales;
          tableData.restaurant_id = item.restaurant_id;
          tableData.category_id = item.category_id;
          tableData.image_path = item.image_path;
          tableData.specfoods = item.specfoods;
          tableData.index = index;
          this.tableData.push(tableData);
        })
      },
      delBtn(index,row){
        this.$msgbox({
          title:'提示',
          message:'确认要删除本数据吗？',
          showCancelButton:true,
          confirmButtonText:'确定',
          cancelButtonText:'取消',
          beforeClose:(action,instance,done)=>{
            if(action === 'confirm'){
              this.handleDel(index,row)
              done()
            }else {
              this.$message({
                type:'info',
                message:'取消'
              });
              done()
            }
          }
        })
      },
      async handleDel(index,row){
          try{
            const result = await deleteFood(row.item_id);
            if(result.status == 1){
              this.$message.success({
                message:'删除成功'
              });
              this.tableData.splice(index,1)
            }else {
                this.$message.error({
                  message:result.message
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
        this.getFoods()
      },
      handleServiceAvatarScucess(res,file){
        if(res.status==1){
          console.log(res.image_path);
          this.addFoodsForm.image_path = res.image_path
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
      tableRowClassName({row, rowIndex}) {
        if (rowIndex === 1) {
          return 'warning-row';
        } else if (rowIndex === 3) {
          return 'success-row';
        }
        return '';
      },
      async getMenu(){
        this.menuOptions = [];
        try{
          const menu = await getMenu({restaurant_id: this.editFoodForm.restaurant_id, allMenu: true});
          menu.forEach((item, index) => {
            this.menuOptions.push({
              label: item.name,
              value: item.id,
              index,
            })
          })
        }catch(err){
          console.log('获取食品种类失败', err);
        }
      },
      async handleEdit(row){
          try{
              this.editVisible = true;
            /*const restaurant = await getResturantDetail(row.restaurant_id);*/
            const category = await getMenuById(row.category_id);
            this.editFoodForm={...row, ...{ selectCategory: category.name}};
            console.log(this.editFoodForm)

            this.getMenu();
          }catch (err){
              console.log(err)
          }
      },
      addSpecs(){
        this.editFoodTable.push({...this.addSpeForm});
        this.addSpeForm.specs = '';
        this.addSpeForm.packing_fee = 0;
        this.addSpeForm.price = 20;
        this.addSpeVisible = false
      },
      delSpecs(index){
        this.editFoodTable.splice(index,1)
      },
      async updateFood(){
        this.editVisible = false;
        try {
          const res = await updateFood({...this.editFoodForm,specs: this.editFoodTable});
          if (res.status == 1) {
            this.$message({
              type: 'success',
              message: '更新食品信息成功'
            });
            this.getFoods();
          }else{
            this.$message({
              type: 'error',
              message: res.message
            });
          }
        }catch (err){
            console.log(err)
        }
      }
    }

  }
</script>
<style lang="less" type="text/less">
  @import "../style/mixin.less";
  .container{padding: 20px}
  .demo-table-expand{
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand{
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
  .el-form--inline .el-form-item{
    width:50%;
    margin-right: 0;
    margin-bottom: 0;
  }
  .avatar-uploader{
    .el-upload{
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
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
  .cell{
    text-align: center;
  }
</style>
