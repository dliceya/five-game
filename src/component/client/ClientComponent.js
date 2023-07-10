import React, {Component} from 'react'

import { message, Input, Modal } from 'antd';

import MainContains from "../main/MainContains";

class ClientComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isModalOpen: true,
            userName: '',
        }
    }

    initCollection() {
        const websocket = new WebSocket("ws://192.168.2.154:8080/websocket/" + this.state.userName)
        websocket.onmessage = (msg) => {
            let messageBody = JSON.parse(msg.data)
            console.log(messageBody.message)
            if (messageBody.message === '当前用户名已存在，请换一个吧') {
                message.success(messageBody.message)
                this.setState(() => ({
                    isModalOpen: true,
                }))
            }

            console.log(msg.data)
        };

        message.success(this.state.userName + ",  您已成功加入服务器，选择玩家开始对战吧").then(() => {})
    }

    handleServerMessage(msg) {
        console.log(msg)
    }





    handleOk() {

        if (this.state.userName === '') {
            message.success('请输入用户名加入游戏')
            return false;
        }

        this.setState((preState) => ({
            isModalOpen: !preState.isModalOpen,
        }))
        this.initCollection()
    }

    handleCancel() {
        message.success('请输入用户名加入游戏')
    }

    render(){
        const self = this;
        return(
            <>
                <Modal title="请输入用户名" open={self.state.isModalOpen} onOk={() => self.handleOk()} onCancel={self.handleCancel}>
                    <Input placeholder="Basic usage" onChange={(e) => self.setState(() => ({userName: e.target.value}))} allowClear/>
                </Modal>
                <MainContains />
            </>
        )
    }
}


export default ClientComponent