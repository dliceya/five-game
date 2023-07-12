import React, {Component} from 'react'

import { UserOutlined } from '@ant-design/icons';
import { Input, Modal } from 'antd';

import MainContains from "../main/MainContains";
import {websocket_domain, websocket_path} from "../../config/GloableConfig";
import {messageUtil} from "../../utils/Message";

class ClientComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isModalOpen: true,
            userName: '',
        }
    }

    initCollection() {
        const websocket = new WebSocket(websocket_domain + websocket_path + this.state.userName)
        websocket.onmessage = (msg) => {
            const messageBody = JSON.parse(msg.data)

            const msgType = messageBody.messageType + '';
            switch (msgType) {
                case "CommonMessage":
                    const msgCode = messageBody.msgCode + '';
                    switch (msgCode) {
                        case "ConnectionSucceeded":
                            messageUtil.success(messageBody.message)
                            break;
                        case "NameRepeat":
                            messageUtil.error(messageBody.message)
                            this.setState(() => ({
                                isModalOpen: true,
                            }))
                            break;
                        default:
                    }
                    break;
                default:



            }

        };

    }

    handleServerMessage(msg) {
        console.log(msg)
    }

    handleOk() {

        if (this.state.userName === '') {
            messageUtil.info('请输入用户名加入游戏')
            return false;
        }

        this.setState((preState) => ({
            isModalOpen: !preState.isModalOpen,
        }))
        this.initCollection()
    }

    handleCancel() {
        messageUtil.success('请输入用户名加入游戏')
    }

    render(){
        const self = this;
        return(
            <>
                <Modal title="我的信息" open={self.state.isModalOpen} onOk={() => self.handleOk()} onCancel={self.handleCancel}>
                    <Input
                        placeholder="请输入用户名"
                        prefix={<UserOutlined className="site-form-item-icon" />}
                        onChange={(e) => self.setState(() => ({userName: e.target.value}))}
                        allowClear
                    />
                </Modal>
                <MainContains />
            </>
        )
    }
}


export default ClientComponent