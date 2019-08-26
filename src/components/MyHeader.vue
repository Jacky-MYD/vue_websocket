<template lang="pug">
    div.myheader
        div.left(@click="goBack")  返回
        div.middle {{text}}
        div.right
</template>
<script>
    export default {
        props: {
            text: {
                type: String,
                default: ''
            },
            backFun: {
                type: Function,
            }
        },
        methods: {
            goBack () {
                if(this.backFun){
                    this.backFun();
                }else{
//                    console.log(this.$route)
                    this.$router.back();
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    .myheader {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 99;
        display: flex;
        padding: 0 15px;
        justify-content: space-between;
        align-items: center;
        height: 44px;
        font-size: 16px;
        background: #f60;
        color: #fff;
        border-bottom: 1px solid #ccc;
    }
</style>