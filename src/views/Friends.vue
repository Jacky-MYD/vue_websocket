<style lang="less" scope>
  @import '../assets/style/views/friends.less';
</style>
<template lang="pug">
    div.friends_page
        MyHeader(:text="text")
        div.banner
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
            this.getFriends()
            const jse = new this.$jsEncrypt()
            jse.setPublicKey('MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCHlKo7VQCB5eKBAlrN1BqHrAcITrQBVgaAXi+oin/E2kBGuQMNTx22qhFUc+GbT1ehNUK1i5rFWplxSoA8LqSNK/YUpLg1htu6Iv2W7qgE4ZnhlIMvwIf0Y0IXv9SJWeqPmsC18R0Jwn2Dc3EhT8pyVuTwK2GJ7kkxe42TZyPedQIDAQAB')
            const encrypted = jse.encrypt('Hello, world')
            // let test = 'RzGU6W/+ZOMB+rYBN0vDoqxQon5RORmth0ve+qHYFK2hZmUDViAV81ChJOkuWMadxGyJ3t5HBffudwiaoYtl+HkyKinuX0i2Kyq5g3U/a9bZmBUDqPs/1iPX30P1ZDB1abl74EOUJd4vOyCVTTmuj6Mbs2ZHiQRVJF7I3dAW76A='
            // let asaa = 'fUVDzsQIk1c1vFx2uMTiCz4qDpRKA732k2qn4xUXAWfBI0aBNXzDruM9hNscTxrRKjo9KDxW1+X09TPbBaZ2uzYoH1DN9uqH1ezAYI075Zldi0+O+HED/o88sUcDEQWNS3DvuU0HR//hnrF1KPX5bhBbc1agmqId5LW2Vh/2Tz8='
            jse.setPrivateKey('MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBAIeUqjtVAIHl4oECWs3UGoesBwhOtAFWBoBeL6iKf8TaQEa5Aw1PHbaqEVRz4ZtPV6E1QrWLmsVamXFKgDwupI0r9hSkuDWG27oi/ZbuqAThmeGUgy/Ah/RjQhe/1IlZ6o+awLXxHQnCfYNzcSFPynJW5PArYYnuSTF7jZNnI951AgMBAAECgYA00VKb+JpRAHiD36H2S2nmbrryno57csLnoUmZtBLgYlHl+09YEPk3XvuPVfGO6pLtx2zsgq1RsuDSBL7+MwGBNSVDcH2qz837iK0q1rI6hh8P3i2+Mems23uztFjZhQ8oKJ+5w+FPwXU4RpKLufm6T3bixlnphqCqKxkLEv7axQJBAOaaGu6W+MHdRix3dngdkIOMGuDFUqv4/NyNKEg7CtJy0LGxmHeLLftp+kBi2LvbLba74WaaeBleWnMQpQ7tTxMCQQCWg2fmoSYsg9lhNuh7yMfEyOuzDb7DFITn2l/cEJi7D19LfEkWHGVCsJJldBMrMBHjDwkAMN20sEYvZAg+duVXAkEAu7TBK2jUf+l/z35GfquCELIgxsmX68g2+8gi+/ijbH5tBddMBjLScQ3o2DQdu3xDj7ULWptuGyhEc9keojHk5QJAL5mDJGbWYcGY36uzvmHy+4LnN4sjRyKYHZLsOfZttsrXwlGd84YrZ/nbcoZRAZmELqC0ogDSPLB6ocYq7UZApQJBAMsy8U4OD52RGq5E0Q31nzRG1X35N7YFh6i12dWiW+WZzUuPNj94jovO550+gKwqy10mk5gGJUimrdzzJjIOpUo=')
            const decrypted = jse.decrypt(encrypted)
            console.log(33, decrypted)
        },
    }
</script>
