<template>

  <div
    class="login_page fillcontain">
    <transition
      name="form-fade"
      mode="in-out">
      <section
        class="form_contianer"
        v-show="showLogin">
        <div
          class="manage_tip">
          <p>
            elm后台管理系统</p>
        </div>
        <el-form
          :model="loginForm"
          :rules="rules"
          ref="loginForm">
          <el-form-item
            prop="username">
            <el-input
              v-model="loginForm.username"
              placeholder="用户名"></el-input>
          </el-form-item>
          <el-form-item
            prop="password">
            <el-input
              v-model="loginForm.password"
              placeholder="密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="submitForm('loginForm')"
              class="submit_btn">
              登录
            </el-button>
          </el-form-item>

        </el-form>
        <p
          class="tip">
          温馨提示：</p>
        <p
          class="tip">
          未登录过的新用户，自动注册</p>
        <p
          class="tip">
          注册过的用户可凭账号密码登录</p>
      </section>
    </transition>
  </div>
</template>

<script>
  import {
    login,
    getAdminInfo
  } from '@/api/getData'
  //vuex是一个专门为vue.js应用程序开发是状态管理模式
  import {
    mapActions,
    mapState
  } from 'vuex'

  export default {
    //state,驱动应用的数据源
    data(){
      return {
        loginForm: {
          username: '',
          password: ''
        },
        rules: {
          username: [
            {
              required: true,
              message: '请输入用户名',
              trigger: 'blur'
            }
          ],
          password: [
            {
              required: true,
              message: '请输入密码',
              trigger: 'blur'
            }
          ]

        },
        showLogin: false
      }
    },
    //mounted为html加载完成后执行。执行顺序：子组件-父组件
    mounted(){
      this.showLogin = true;
      if (!this.adminInfo.id) {
        this.getAdminData()
      }
    },
    //created为html加载完成之前执行。执行顺序：父组件-子组件
    created(){
    },
    //计算属性 通过计算属性把数据进行运算
    //当一个组件需要获取多个状态的时候，将这些状态声明为计算属性会有些重复和冗余。
    //为了解决这个问题，我们可以使用mapState辅助函数帮助我们生成计算属性
    //对象中的扩展运算符(...)用于取出参数对象中的所有可遍历属性，拷贝到当前对象之中
    computed: {
      ...mapState(['adminInfo'])
    },
    methods: {
      ...mapActions(['getAdminData']),
      async submitForm(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            const res =await login({user_name:this.loginForm.username,password:this.loginForm.password});
            if(res.status==1){
                this.$message({
                  type:'success',
                  message:'登录成功'
                });
              this.$router.push('manage')
            }else {
              this.$message({
                type:'error',
                message:res.message
              })
            }
          } else {
                this.$notify.error({
                  title:'错误',
                  message:'请输入正确的用户名密码',
                  offset:100
                })
          }
        });
      },
    },
    //使用watch的作用可以监控一个值的变换，并调用因为变化需要执行的方法。可以通过watch动态改变关联的状态
    watch:{
      adminInfo:function (newValue) {
        if(newValue.id){
            this.$message({
              type:'success',
              message:'检查到您之前登陆过，将自动登录'
            });
            this.$router.push('manage')
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '../style/mixin.less';

  .login_page {
    background-color: #324057;
  }

  .manage_tip {
    position: absolute;
    width: 100%;
    top: -100px;
    left: 0;
    p {
      font-size: 34px;
      color: #333;
    }
  }

  .form_contianer {
    .wh(320px, 210px);
    .ctp(320px, 210px);
    padding: 25px;
    border-radius: 5px;
    text-align: center;
    background-color: #fff;
    .submit_btn {
      width: 100%;
      font-size: 16px;
    }
  }

  .tip {
    font-size: 12px;
    color: red;
  }

  .form-fade-enter-active, .form-fade-leave-active {
    transition: all 1s;
  }

  .form-fade-enter, .form-fade-leave-active {
    transform: translate3d(0, -50px, 0);
    opacity: 0;
  }
</style>
