import { UserOutlined } from '@ant-design/icons';
import { Input, Modal } from 'antd';

import MainContains from "../main/MainContains";
import {websocket_domain, websocket_path} from "../../config/GloableConfig";
import {messageUtil} from "../../utils/Message";
import {useImmer} from "use-immer";

export default function ClientComponent() {

    const [state, updateState] = useImmer({
        isModalOpen: true,
        userName: '',
    })

    function initCollection() {
        const websocket = new WebSocket(websocket_domain + websocket_path + state.userName)
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
                            updateState(draft => {
                                draft.isModalOpen = true
                            })
                            break;
                        default:
                    }
                    break;
                default:

            }

        };
    }

    function handleServerMessage(msg) {
        console.log(msg)
    }

    function handleOk() {

        if (state.userName === '') {
            messageUtil.info('请输入用户名加入游戏')
            return false;
        }

        updateState(draft => {
            draft.isModalOpen = false;
        })
        initCollection()
    }

    function handleCancel() {
        messageUtil.success('请输入用户名加入游戏')
    }

    return(
        <>
            <Modal title="我的信息" open={state.isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Input
                    placeholder = "请输入用户名"
                    prefix = {<UserOutlined className="site-form-item-icon" />}
                    onChange = {(e) => updateState(draft => {draft.userName = e.target.value})}
                    allowClear
                />
            </Modal>
            <MainContains />
        </>
    )
}
