import {message} from "antd";

export const messageUtil = {
    info: function (msg) {
        message.info(msg).then(() => {})
    },
    success: function (msg) {
        message.success(msg).then(() => {})
    },
    error: function (msg) {
        message.error(msg).then(() => {})
    },

}

export const qqUtil = {
    getAvatarByQQNumber : function (qqNumber) {
        if (!qqNumber) {
            qqNumber = '1767953212'
        }
        return 'https://q1.qlogo.cn/g?b=qq&nk='+ qqNumber + '&s=100'
    }
}