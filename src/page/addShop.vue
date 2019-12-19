<template>
    <div>
        <head-top></head-top>
        <div class="container">
          <el-row >
            <el-col :offset="4" :span="14">
              <el-form
                :model="addShopForm"
                label-width="100px"
                ref="addShopForm"
                :rules="addShopRules"
              >
                <el-form-item label="店铺名称" prop="name">
                  <el-input v-model="addShopForm.name" placeholder="请输入店铺名称"></el-input>
                </el-form-item>
                <el-form-item label="详细地址" prop="address">
                  <el-autocomplete
                    v-model="addShopForm.address"
                    :fetch-suggestions="querySearchAsync"
                    @select="addressSelect"
                    style="width: 100%;"
                    placeholder="请输入详细地址">
                  </el-autocomplete>
                  当前城市：{{city.name}}
                </el-form-item>
                <el-form-item label="联系电话" prop="phone">
                  <el-input v-model.number="addShopForm.phone" placeholder="请输入联系电话"></el-input>
                </el-form-item>
                <el-form-item label="店铺介绍">
                  <el-input v-model="addShopForm.introduction" placeholder="请输入店铺介绍"></el-input>
                </el-form-item>
                <el-form-item label="店铺标语">
                  <el-input v-model="addShopForm.slogan" placeholder="请输入店铺标语"></el-input>
                </el-form-item>
                <el-form-item label="店铺分类">
                  <el-cascader
                    :options="categoryOptions"
                    v-model="categoryValues"
                    change-on-select
                  ></el-cascader>
                </el-form-item>
                <el-form-item label="店铺特点" style="white-space: nowrap">
                  <span>品牌保证</span>
                  <el-switch on-text="" off-text="" v-model="addShopForm.is_premium"></el-switch>
                  <span>蜂鸟专送</span>
                  <el-switch on-text="" off-text="" v-model="addShopForm.delivery_mode"></el-switch>
                  <span>新开店铺</span>
                  <el-switch on-text="" off-text="" v-model="addShopForm.new"></el-switch>
                </el-form-item>
                <el-form-item label="" style="white-space: nowrap">
                  <span>外卖保</span>
                  <el-switch on-text="" off-text="" v-model="addShopForm.bao"></el-switch>
                  <span>准时达</span>
                  <el-switch on-text="" off-text="" v-model="addShopForm.zhun"></el-switch>
                  <span>开发票</span>
                  <el-switch on-text="" off-text="" v-model="addShopForm.piao"></el-switch>
                </el-form-item>
                <el-form-item label="配送费">
                  <el-input-number v-model="addShopForm.float_delivery_fee" :min="0" :max="20"></el-input-number>
                </el-form-item>
                <el-form-item label="起送价">
                  <el-input-number v-model="addShopForm.float_minimum_order_amount" :min="0" :max="100"></el-input-number>
                </el-form-item>
                <el-form-item label="营业时间" style="white-space: nowrap">
                  <el-time-select
                    v-model="addShopForm.startTime"
                    placeholder="开始时间"
                    :picker-options="{
                    start:'05:30',
                    step:'00:15',
                    end:'23:30'
                    }"
                  >
                  </el-time-select>
                  <span style="color:#999999">~</span>
                  <el-time-select
                    v-model="addShopForm.endTime"
                    placeholder="结束时间"
                    :picker-options="{
                    start:'05:30',
                    step:'00:15',
                    end:'23:30'
                    }"
                  >
                  </el-time-select>
                </el-form-item>
                <el-form-item label="上传店铺头像">
                  <el-upload
                    :action="baseUrl+'v1/addimg/shop'"
                    class="avatar-uploader"
                    :show-file-list="false"
                    :on-success="handleShopAvatarScucess"
                    :before-upload="beforeAvatarUpload"
                  >
                    <img v-if="addShopForm.image_path" :src="baseImgPath + addShopForm.image_path" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </el-form-item>
                <el-form-item label="上传营业执照">
                  <el-upload
                    :action="baseUrl+'v1/addimg/shop'"
                    class="avatar-uploader"
                    :show-file-list="false"
                    :on-success="handleBusinessAvatarScucess"
                    :before-upload="beforeAvatarUpload"
                  >
                    <img v-if="addShopForm.business_license_image" :src="baseImgPath + addShopForm.business_license_image" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </el-form-item>
                <el-form-item label="上传餐饮服务许可证">
                  <el-upload
                    :action="baseUrl+'v1/addimg/shop'"
                    class="avatar-uploader"
                    :show-file-list="false"
                    :on-success="handleServiceAvatarScucess"
                    :before-upload="beforeAvatarUpload"
                  >
                    <img v-if="addShopForm.catering_service_license_image" :src="baseImgPath + addShopForm.catering_service_license_image" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </el-form-item>
                <el-form-item label="优惠活动" >
                  <el-select v-model="activityValue" :placeholder="activityValue" @change="selectActivity">
                    <el-option
                      v-for="(item,index) in activityList"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-table
                  :data="activityTable"
                  style="min-width: 600px;margin-bottom: 20px;"
                  align="center"
                  :row-class-name="tableRowClassName"
                  >
                    <el-table-column label="活动标题" prop="act_title" width="120"></el-table-column>
                    <el-table-column label="活动名称" prop="act_name" width="120"></el-table-column>
                    <el-table-column label="活动详情" prop="act_detail"></el-table-column>
                    <el-table-column label="操作"  width="120">
                      <template slot-scope="scope">
                        <el-button type="danger" size="small" @click="handleDelete(scope.$index)">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-form-item>
                <el-form-item class="button_submit">
                  <el-button type="primary" @click="submitForm('addShopForm')">立即创建</el-button>
                </el-form-item>
              </el-form>
            </el-col>

          </el-row>

        </div>
    </div>
</template>

<script>
    import headTop from '@/components/headTop'
    import {cityGuess, addShop, searchplace, foodCategory} from '@/api/getData'
    import {baseUrl, baseImgPath} from '@/config/env'
    import ElUpload from "../../node_modules/_element-ui@1.4.13@element-ui/packages/upload/src/index";
    export default {
    	data(){
    		return {
    		    baseUrl,
          baseImgPath,
    			city: {
    			    name:''
          },
          addShopForm:{
            latitude: '',
            longitude: '',
            image_path:'',
            business_license_image:'',
            catering_service_license_image:'',
            is_premium: true,
            delivery_mode: true,
            new: true,
            bao: true,
            zhun: true,
            piao: true,
            name:'',
            address:'',
            phone:'',
            introduction:'',
            slogan:'',
            categoryValue:'',
            startTime:'',
            endTime:'',
            float_delivery_fee:5,
            float_minimum_order_amount:20,
          },
          addShopRules:{
    		        name:[
                  {required:true,message:'请输入店铺名称',trigger:'blur'}
                ],
            address:[
              {required:true,message:'请输入详细地址',trigger:'blur'}
            ],
            phone:[
              {required:true,message:'请输入联系电话'},
              {type:'number',message:'电话号码必须是数字'}
            ]
          },
          categoryList:[{
            label:'',
            value:''
            }
          ],
          activityList:[{
            label:'满减优惠',
            value:'满减优惠'
          },{
            label:'优惠大酬宾',
            value:'优惠大酬宾'
          },{
            label:'新用户立减',
            value:'新用户立减'
          },{
            label:'进店领卷',
            value:'进店领卷'
          }],
          activityValue: '满减优惠',
          activityTable:[{
              act_title:'减',
              act_name:'满减优惠',
              act_detail:'满30减5，满60减8'
            }],
          categoryValues:['快餐便当', '简餐'],
          categoryOptions:[]
				}
    	},
    	components: {
        ElUpload,
        headTop,
    	},
      created(){
        this.initData()
      },
    	mounted(){

    	},
    	methods: {
        async initData(){
          this.city = await cityGuess();
          const category = await foodCategory();
            category.map( item =>{
              const childrenList =[];
              item.sub_categories.map(item2 =>{
                childrenList.push({
                  label:item2.name,
                  value:item2.name,
                });
              });
              this.categoryOptions.push({
                label:item.name,
                value:item.name,
                children:childrenList
              })
            })
        },
        async querySearchAsync(queryString,cb){
          try {
            const addressList = await searchplace(this.city.id,queryString);
            if(addressList instanceof Array){
              addressList.map(item =>{
                item.value = item.address;
                return item;
              });
              cb(addressList)
            }
          }catch (err){
              this.$message.error({
                message:err
              })
          }
        },
        addressSelect(address){
          this.addShopForm.latitude = address.latitude;
          this.addShopForm.longitude = address.longitude;
          console.log(this.addShopForm.latitude, this.addShopForm.longitude)
        },
        selectActivity(){
          this.$prompt('请输入活动详情','提示',{
            confirmButtonText:'确定',
            cancelButtonText:'取消',
          }).then(({value})=>{
            if(value == null){
                this.$message({
                  type:'info',
                  message:'请输入活动详情'
                });
              return
            }
            let newObj = {};
            switch(this.activityValue){
              case '满减优惠':
                newObj= {
                  act_title: '减',
                  act_name: '满减优惠',
                  act_detail: value,
                }
                break;
              case '优惠大酬宾':
                newObj= {
                  act_title: '特',
                  act_name: '优惠大酬宾',
                  act_detail: value,
                }
                break;
              case '新用户立减':
                newObj= {
                  act_title: '新',
                  act_name: '新用户立减',
                  act_detail: value,
                }
                break;
              case '进店领卷':
                newObj= {
                  act_title: '领',
                  act_name: '进店领卷',
                  act_detail: value,
                }
                break;
            }
            this.activityTable.push(newObj);
          }).catch(() =>{
              this.$message({
                type:'info',
                message:'取消输入'
              })
          })
        },
        handleDelete(index){
          this.activityTable.splice(index,1)
        },
			handleShopAvatarScucess(res, file) {
				if (res.status == 1) {
					this.addShopForm.image_path = res.image_path;
				}else{
					this.$message.error('上传图片失败！');
				}
			},
			handleBusinessAvatarScucess(res, file) {
				if (res.status == 1) {
					this.addShopForm.business_license_image = res.image_path;
				}else{
					this.$message.error('上传图片失败！');
				}
			},
			handleServiceAvatarScucess(res, file) {
				if (res.status == 1) {
					this.addShopForm.catering_service_license_image = res.image_path;
				}else{
					this.$message.error('上传图片失败！');
				}
			},
			beforeAvatarUpload(file) {
				const isRightType = (file.type === 'image/jpeg') || (file.type === 'image/png');
				const isLt2M = file.size / 1024 / 1024 < 2;

				if (!isRightType) {
					this.$message.error('上传头像图片只能是 JPG 格式!');
				}
				if (!isLt2M) {
					this.$message.error('上传头像图片大小不能超过 2MB!');
				}
				return isRightType && isLt2M;
			},
			tableRowClassName(row, index) {
		        if (index === 1) {
		        	return 'info-row';
		        } else if (index === 3) {
		        	return 'positive-row';
		        }
		        return '';
		    },
        submitForm(formName){
          this.$refs[formName].validate(async (valid) =>{
              if(valid){
                Object.assign(this.addShopForm,{activities:this.activityTable},{category:this.categoryValues.join('/')});
                try{
                    let result = await addShop(this.addShopForm);
                  if (result.status == 1) {
                    this.$message({
                      type: 'success',
                      message: '添加成功'
                    });
                    this.addShopForm={
                      latitude: '',
                        longitude: '',
                        image_path:'',
                        business_license_image:'',
                        catering_service_license_image:'',
                        is_premium: true,
                        delivery_mode: true,
                        new: true,
                        bao: true,
                        zhun: true,
                        piao: true,
                        name:'',
                        address:'',
                        phone:'',
                        introduction:'',
                        slogan:'',
                        categoryValue:'',
                        startTime:'',
                        endTime:'',
                        float_delivery_fee:5,
                        float_minimum_order_amount:20,
                    };

                      this.activityTable=[{
                      act_title:'减',
                      act_name:'满减优惠',
                      act_detail:'满30减5，满60减8'
                    }];
                      this.categoryValues=['快餐便当', '简餐'];
                  }else{
                    this.$message({
                      type: 'error',
                      message: result.message
                    });
                  }
                  console.log(result)
                }catch (err){
                  console.log(err)
                }

              }else {
                  this.$notify.error({
                    title:'错误',
                    message:'请检查输入是否正确',
                    offset:100
                  })
              }
          })
        }
		}
    }
</script>

<style lang="less">
	@import '../style/mixin';
	.button_submit{
		text-align: center;
	}
  .container{margin: 20px}
	.avatar-uploader .el-upload {
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
	.el-table .info-row {
	    background: #c9e5f5;
	}

	.el-table .positive-row {
	    background: #e2f0e4;
	}
</style>
