<style lang="less" scope>
  @import '../assets/style/views/chat.less';
</style>
<template lang="pug">
  div.home(ref="home")
    MyHeader(:text="friendName")
    div.chat_window(ref="msgWin")
        div.mescroll(ref="mescroll")
            div.message(v-for="(item, index) in msgs")
                div.myself(v-if="item.my_send")
                    //- div.name {{item.name}}
                    div.my_msg
                    p.msg {{item.msg}}
                    div.avatar
                        img
                        span.triangle_right
                div.friend(v-else)
                    //- div.name {{item.name}}
                    div.friend_msg
                    div.avatar
                        img
                        span.triangle_left
                    p.msg {{item.msg}}
    div.message_footer
      input(type="text" placeholder="请输入内容！" v-model="value")
      button.send(@click="send") send
</template>
<script>
    import MeScroll from 'mescroll.js';
    import 'mescroll.js/mescroll.min.css'
    import io from 'socket.io-client'
    export default {
        data() {
            return {
                friendName: '',
                friendId: '',
                msgs: [],
                myName: '',
                value: '',
                reads: 0,
                socket: null,
                mescroll: null
            }
        },
        methods: {
            downCallback() {
                this.mescroll.endSuccess()
            },
            mescrollInit() {
                this.mescroll = new MeScroll(this.$refs.mescroll, {
                    down: {
                        textInOffset: 'pull to refresh',
                        textOutOffset: 'Release the update',
                        textLoading: 'loading...',
                        callback: this.downCallback,
                        empty: {
                            icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCA2NCA0MSIgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAxKSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgIDxlbGxpcHNlIGZpbGw9IiNGNUY1RjUiIGN4PSIzMiIgY3k9IjMzIiByeD0iMzIiIHJ5PSI3Ii8+CiAgICA8ZyBmaWxsLXJ1bGU9Im5vbnplcm8iIHN0cm9rZT0iI0Q5RDlEOSI+CiAgICAgIDxwYXRoIGQ9Ik01NSAxMi43Nkw0NC44NTQgMS4yNThDNDQuMzY3LjQ3NCA0My42NTYgMCA0Mi45MDcgMEgyMS4wOTNjLS43NDkgMC0xLjQ2LjQ3NC0xLjk0NyAxLjI1N0w5IDEyLjc2MVYyMmg0NnYtOS4yNHoiLz4KICAgICAgPHBhdGggZD0iTTQxLjYxMyAxNS45MzFjMC0xLjYwNS45OTQtMi45MyAyLjIyNy0yLjkzMUg1NXYxOC4xMzdDNTUgMzMuMjYgNTMuNjggMzUgNTIuMDUgMzVoLTQwLjFDMTAuMzIgMzUgOSAzMy4yNTkgOSAzMS4xMzdWMTNoMTEuMTZjMS4yMzMgMCAyLjIyNyAxLjMyMyAyLjIyNyAyLjkyOHYuMDIyYzAgMS42MDUgMS4wMDUgMi45MDEgMi4yMzcgMi45MDFoMTQuNzUyYzEuMjMyIDAgMi4yMzctMS4zMDggMi4yMzctMi45MTN2LS4wMDd6IiBmaWxsPSIjRkFGQUZBIi8+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4K',
                            tip: 'no data'
                        },
                    },
                    up: {

                    }
                })
            },
            scrollTo() {
                this.$nextTick(() => {
                    this.mescroll.scrollTo(this.$refs.mescroll.scrollHeight, 0)
                    console.log(this.$refs.mescroll.scrollHeight, this.$refs.msgWin.scrollHeight, this.$refs.home.scrollHeight)
                })
            },
                        
            getMsg(id) {
                const param = {
                    id,
                    reads: this.reads,
                }
                this.$store.dispatch('getMsg', param).then((res) => {
                    if (res.code === 0) {
                        res.data.forEach((item) => {
                            if (item.send_id === id) {
                                item.my_send = false
                                item.name = this.friendName
                            } else {
                                item.my_send = true
                                item.name = this.myName
                            }
                            this.msgs.push(item)
                        })
                        this.scrollTo()
                    }
                })
            },
            send() {
                const txt = this.value.trim()
                if (!txt) {
                    return
                }
                this.socket.emit('send', this.friendId, txt)
                this.value = ''
            }
       
        },
       updated(){
            this.$refs.mescroll.scrollTop = this.$refs.mescroll.scrollHeight;
        },
        mounted() {
            const token = localStorage.getItem('token') || ''
            if (!token) {
                return this.$router.replace({
                    name: 'login',
                })
            }
            document.onkeydown = (e) => {
                if (e.keyCode === 13) {
                    this.send();
                }
            }
            this.selfInfo = localStorage.getItem('user')
            this.myName = localStorage.getItem('user')
            this.friendName = this.$route.query.friendName
            this.friendId = this.$route.query.friendId
            this.reads = this.$route.query.reads
            // 建立websocket连接
            this.socket = io('http://localhost:3004?token=' + token)
            const rooms = []
            this.socket.emit('sign', { user: JSON.parse(this.selfInfo), rooms }, () => {
                // 收到server的连接确认
                this.socket.on('open', () => {
                    window.console.log('socket io is open !')
                })
                // 接收聊天信息
                this.socket.on('reply', (user, data) => {
                    const newMsg = {
                        msg: '',
                        name: JSON.parse(this.myName).userName,
                        my_send: true,
                    }
                    newMsg.msg = data.msg
                    if (!user.self) {
                        newMsg.my_send = false
                        newMsg.name = this.friendName
                    }
                    this.msgs.push(newMsg)
                })
            })
            this.getMsg(this.friendId)
            this.mescrollInit()
        },
        beforeDestroy() {
            this.socket.close()
        }
    }
</script>
