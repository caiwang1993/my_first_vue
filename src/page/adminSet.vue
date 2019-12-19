<template>
    <div class="fillcontain">
        <head-top></head-top>
        <header class="admin_title">管理员信息</header>
        <div class="admin_set">
            <p> 姓名:  {{adminInfo.user_name}}</p>
          <p> 创建时间:  {{adminInfo.create_time}}</p>
          <p> 管理员权限:  {{adminInfo.admin}}</p>
          <p> 管理员ID:  {{adminInfo.id}}</p>
          <p> 更换头像:
            <el-upload
              :action="baseUrl+ '/admin/update/avatar/' + adminInfo.id"
              class="avatar-uploader"
              :show-file-list="false"
              :on-success="uploadImg"
              :before-upload="beforeImgUpload">
              <img v-if="adminInfo.avatar" :src="baseImgPath+adminInfo.avatar" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </p>
          <div style="width: 100%;text-align: center;margin: 20px 0">
            <el-button type="primary">提交</el-button>
          </div>
        </div>
    </div>
</template>

<script>
	import headTop from '../components/headTop'
    import {mapState} from 'vuex'
    import {baseUrl, baseImgPath} from '@/config/env'
  import ElUpload from "../../node_modules/_element-ui@1.4.13@element-ui/packages/upload/src/index";

    export default {
        data(){
            return {
                baseUrl,
                baseImgPath,
            }
        },
    	components: {
        ElUpload,
        headTop,
    	},
        computed: {
          ...mapState(['adminInfo']),
        },
        methods: {
            uploadImg(res, file) {
                if (res.status == 1) {
                    this.adminInfo.avatar = res.image_path;
                }else{
                    this.$message.error('上传图片失败！');
                }
            },
            beforeImgUpload(file) {
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
        },
    }
</script>

<style lang="less">
	@import '../style/mixin';
	.explain_text{
		margin-top: 20px;
		text-align: center;
		font-size: 20px;
		color: #333;
	}
    .admin_set{
        width: 60%;
        background-color: #F9FAFC;
        min-height: 400px;
        margin: 20px auto 0;
        border-radius: 10px;
      padding-left: 30px;
        ul > li{
            padding: 20px;
            span{
                color: #666;
            }
        }
       p {
         padding: 20px;
         color: #666;
         margin-top: 20px;
         text-align: left;
       }
    }
    .admin_title{
        margin-top: 20px;
        .sc(24px, #666);
        text-align: center;
    }
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        margin-top: 10px;
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
