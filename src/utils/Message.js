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