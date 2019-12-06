<template>
  <div class="fillcontain">
    <headTop></headTop>
    <div class="container">
      <el-row style="width: 100%">
        <el-col :span="14" :offset="5">
          <header class="form-header">选择食品种类</header>
          <el-form :model="categoryForm" label-width="100px" class="form">
            <el-row style="padding: 10px 50px 10px 0">
              <el-form-item label="食品种类" >
                <el-select v-model="categoryForm.category"  :placeholder="selectValue.label"  style="width: 100%">
                  <el-option
                  v-for="item in categoryForm.categoryList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-row>
            <template >
              <el-row class="add_category_row"  :class="visibleMore?'showEdit':''" style="background: #f9fafc;padding: 0 50px 0 0;overflow: hidden;box-sizing: border-box">
                <el-form-item label="食品种类" style="margin-top: 10px"><el-input v-model="categoryForm.name"></el-input></el-form-item>
                <el-form-item label="种类描述"><el-input v-model="categoryForm.description" ></el-input></el-form-item>
                <el-form-item label=""><el-button type="primary" @click="addCategory">提交</el-button></el-form-item>
              </el-row>
            </template>
            <div class="add_category_button" @click="handleShow">
              <i v-if="visibleMore" class="el-icon-caret-top icon" style="transition: all 400ms;margin-right: 10px"></i>
              <i v-else class="el-icon-caret-bottom icon" style="transition: all 400ms;margin-right: 10px"></i>
              <span class="category_button">添加食品种类</span>
            </div>
          </el-form>
          <header class="form-header">添加食品</header>
          <el-form :model="addFoodsForm" :rules="foodRules" label-width="100px" class="form" ref="addFoodsForm">
            <el-row style="padding: 10px 10px 10px 0">
              <el-form-item label="食品名称" prop="name"><el-input v-model="addFoodsForm.name"></el-input></el-form-item>
              <el-form-item label="食品活动"><el-input v-model="addFoodsForm.activity"></el-input></el-form-item>
              <el-form-item label="食品详情"><el-input v-model="addFoodsForm.detail"></el-input></el-form-item>
              <el-form-item label="商铺图片">
                <el-upload
                  :action="baseUrl+ '/v1/addimg/food'"
                  class="avatar-uploader"
                  :show-file-list="false"
                  :on-success="handleServiceAvatarScucess"
                  :before-upload="beforeAvatarUpload">
                  <img v-if="addFoodsForm.image_path" :src="baseImgPath+addFoodsForm.image_path" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-form-item>
              <el-form-item label="食品特点">
                <el-select v-model="addFoodsForm.attributes">
                  <el-option
                  v-for="item in attributes"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="食品规格">
                <el-radio v-model="foodSpecs" label="one">单规格</el-radio>
                <el-radio v-model="foodSpecs" label="more">多规格</el-radio>
              </el-form-item>
              <template v-if="foodSpecs == 'one'">
                <el-form-item label="包装费">
                  <el-input-number v-model="addFoodsForm.specs[0].packing_fee" :min="0" :max="100"></el-input-number>
                </el-form-item>
                <el-form-item label="价格">
                  <el-input-number v-model="addFoodsForm.specs[0].price" :min="0" :max="100000"></el-input-number>
                </el-form-item>
              </template>
              <el-row v-else style="margin-bottom: 20px;padding: 0 10px;width: 100%;text-align: center">
                <el-button type="primary" @click="addSpeVisible = true" style="margin-bottom: 20px">添加规格</el-button>
                <el-table :data="addFoodsForm.specs"  :row-class-name="tableRowClassName">
                  <el-table-column prop="specs" label="规格"></el-table-column>
                  <el-table-column prop="packing_fee" label="包装费"></el-table-column>
                  <el-table-column prop="price" label="价格"></el-table-column>
                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <el-button type="danger" size="small" @click="delSpecs(scope.$index)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-row>
              <el-form-item><el-button type="primary" @click="addFood('addFoodsForm')">确认添加食品</el-button></el-form-item>
            </el-row>
          </el-form>
        </el-col>
      </el-row>
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
  </div>
</template>
<script>
  import headTop from '@/components/headTop'
  import {baseUrl,baseImgPath} from '@/config/env'
  import {getCategory,addCategory,addFood} from '@/api/getData'
  import ElUpload from "../../node_modules/_element-ui@1.4.13@element-ui/packages/upload/src/index";
  export default{
      data(){
          return{
            baseUrl,
            baseImgPath,
              categoryForm:{
                categoryList:[],
                category:'',
                name: '',
                description: '',
              },
            addFoodsForm:{
              name:'',
              activity:'',
              detail:'',
              image_path: '',
              attributes:'',
              specs:[{
                specs:'默认',
                packing_fee:0,
                price:20
              }]
            },
            addSpeForm:{
              specs:'',
              packing_fee: 0,
              price: 20,
            },
            foodRules:{
                 name:[
                   {
                     required:true,
                     message:'食物名称不能为空',
                     trigger:'blur'
                   }
                 ]
            },
            addSpeRules:{
                specs:[{
                  required:true,
                  message:'规格不能为空',
                  trigger:'blur'
                }]
            },
            visibleMore:false,
            attributes:[
              {
                label:"新品",
                value:'新品'
              },
              {
                label:"招牌",
                value:'招牌'
              }
            ],
            foodSpecs:"one",
            addSpeVisible:false,
            restaurant_id:1
          }
      },
    components:{
      ElUpload,
      headTop
    },
    created(){
        if(this.$route.query.restaurant_id){
          this.restaurant_id=this.$route.query.restaurant_id
        }else {
          this.restaurant_id=Math.ceil(Math.random()*10);
          this.$msgbox({
            title:'提示',
            message:'添加食品需要选择一个商铺，先去就去选择商铺吗？',
            showCancelButton:true,
            confirmButtonText:'确定',
            cancelButtonText:'取消',
            beforeClose:(action,instance,done)=>{
              if(action === 'confirm'){
                this.$router.push('/shopList');
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
        }
        this.initData()
    },
    computed: {
      selectValue: function (){
        return this.categoryForm.categoryList[this.categoryForm.category]||{}
      }
    },
    methods:{
      async initData(){
          try {
            const result= await getCategory(this.restaurant_id);
            if(result.status == 1){
              this.categoryForm.categoryList=[];
              result.category_list.map((item,index) =>{
                let list= {};
                list.label=item.name;
                list.value=index;
                list.id=item.id
                this.categoryForm.categoryList.push(list)
              });
            }else {
                this.$message({
                  type:'error',
                  message:result.msg
                })
            }
          }catch (err){
              console.log('获取数据错误',err)
          }
        },
      async addCategory(){
          try {
            const result= await addCategory({name:this.categoryForm.name,description:this.categoryForm.description,restaurant_id:this.restaurant_id});
            if(result.status ==1){
              this.$message({
                type:'success',
                message:"添加成功"
              });
              this.visibleMore=false;
              this.categoryForm.name="";
              this.categoryForm.description="";
              this.initData()
            }else {
                this.$message({
                  type:'error',
                  message:result.msg
                })
            }
          }catch (err){
              console.log("数据添加失败",'err')
          }

      },
      handleShow(){
          this.visibleMore =!this.visibleMore
      },
      addFood(addFoodsForm){
        this.$refs[addFoodsForm].validate(async (valid) =>{
          if(valid){
            const params = {
              ...this.addFoodsForm,
              restaurant_id:this.restaurant_id,
              category_id:this.selectValue.id
            };
            console.log(params.category_id)
            try {
              let result= await addFood(params);
              if(result.status == 1){
                  this.$message.success({
                    message:'新增成功'
                  });
                  //解构赋值
                this.addFoodsForm={
                  name:'',
                    activity:'',
                    detail:'',
                    image_path: '',
                    attributes:'',
                    specs:[{
                    specs:'默认',
                    packing_fee:0,
                    price:20
                  }]
                }
              }else{
                this.$message.error({
                  message:result.message
                })
              }
            }catch(err) {
              console.log('错误',err)
            }

          }else {
              this.$notify.error({
                title:'错误',
                message:'请检查输入内容',
                offset:100
              })
          }
        })
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
      addSpecs(){
        this.addFoodsForm.specs.push({...this.addSpeForm});
        this.addSpeForm.specs = '';
        this.addSpeForm.packing_fee = 0;
        this.addSpeForm.price = 20;
        this.addSpeVisible = false
      },
      delSpecs(index){
        this.addFoodsForm.specs.splice(index,1)
      },
      tableRowClassName({row, rowIndex}) {
        if (rowIndex === 1) {
          return 'warning-row';
        } else if (rowIndex === 3) {
          return 'success-row';
        }
        return '';
      }
    }

  }
</script>
<style lang="less"  type="text/less">
  @import "../style/mixin.less";
  .container{padding: 20px}
  .form-header{
    text-align: center;
    margin-bottom: 10px;
  }
  .form{
    min-width: 400px;
    margin-bottom: 30px;
    border: 1px solid #eaeefb;
    border-top-right-radius: 6px;
    border-top-left-radius: 6px;
    &:hover{
       box-shadow: 0 0 8px 0 rgba(232,237,250,.6), 0 2px 4px 0 rgba(232,237,250,.5);
       border-radius: 6px;
       transition: all 400ms;
     }
  }
  .form_header{
    text-align: center;
    margin-bottom: 10px;
  }
  .add_category_row{
    height: 0;
    transition: all 400ms;
  }
  .showEdit{
    height: 185px;
  }
  .add_category_button{
    display: flex;align-items: center;justify-content: center;width: 100%;height: 40px;
    span,.icon{
      color: #999;
    }
  &:hover{
    span,.icon{
      color: #20a0ff;
    }
  }
  }
  .category_button{
    font-size: 14px;
    color: #999;
    transition: all 400ms;
    &:hover{
      color: #20a0ff;
    }
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
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
</style>
