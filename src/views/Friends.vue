<style lang="less" scope>
  @import '../assets/style/views/friends.less';
</style>
<template lang="pug">
    div.friends_page
        MyHeader(:text="text")
        div.friends_list
            div.friends(v-for="item in friends" :key="item.id")
                div.friend_item(@click="chatItem(item)")
                    div.avatar
                        img
                        span.reads(v-if="item.reads && item.reads > 0") {{item.reads}}
                    div
                        span.item_name {{item.name}}

</template>
<script>
    export default {
        data() {
            return {
                text: '好友列表',
                friends: [],
            }
        },
        methods: {
            getFriends() {
                this.$store.dispatch('getFriends').then((res) => {
                    if (res.code === 0) {
                        this.friends = res.data.friends
                    }
                })
            },
            chatItem(item) {
                this.$router.push({
                    name: 'chat',
                    query: {
                        friendId: item.id,
                        friendName: item.name,
                        reads: item.reads
                    },
                })
            }
        },
        created() {
            const token = localStorage.getItem('token') || ''
            if (!token) {
                return this.$router.replace({
                    name: 'login',
                })
            }
        },
    }
</script>
