<style lang="less" scope>
  @import '../assets/style/views/login.less';
</style>
<template lang="pug">
    div.login_page
        div.login_form
            div 
                input.username(type="text" placeholder="请输入昵称！" v-model="userName")
            div 
                input.password(type="password" placeholder="请输入密码！" v-model="passWord")
            div 
                button.login(type="button" @click="submit") 登录
</template>
<script>
    export default {
        data() {
            return {
                userName: '',
                passWord: '',
            }
        },
        methods: {
            submit() {
                if (!this.userName) {
                    return
                }
                const userInfo = {
                    email: this.userName,
                    password: this.passWord,
                }
                this.$store.dispatch('login', userInfo).then((res) => {
                    if (res.code === 0) {
                        this.$store.commit('setSelfInfo', res.data)
                        this.$router.replace({
                            name: 'friends',
                        })
                    }
                })
            }
        } 
    }
</script>

