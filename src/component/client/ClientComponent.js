import {UserOutlined, QqOutlined} from '@ant-design/icons';
import {Input, Modal, Col, Row} from 'antd';


import MainContains from "../main/MainContains";
import {websocket_domain, websocket_path} from "../../config/GloableConfig";
import {messageUtil} from "../../utils/utils";
import {useImmer} from "use-immer";
import {produce} from "immer";

export default function ClientComponent() {
    const [modal, contextHolder] = Modal.useModal();

    const [state, updateState] = useImmer({
        isModalOpen: true,
        userList: [],
        websocket: null,
    })

    const [user, updateUser] = useImmer({
        userName: '',
        qqNumber: ''
    })

    function requestFight(targetUser) {
        const fightRequestMessage = {
            messageType: 'RequestFightMessage',
            ifTargetAgree: false,
            sourceUser: user.userName,
            targetUser: targetUser
        }

        state.websocket.send(JSON.stringify(fightRequestMessage))
    }

    function initCollection() {

        const socket = new WebSocket(websocket_domain + websocket_path + user.userName + "Number" + user.qqNumber)
        socket.onmessage = (msg) => handleServerMessage(msg)

        updateState(draft => {
            produce(draft, () => {
                draft.websocket = socket
            })
        })
    }

    const handelRequest = (messageBody) => {

        modal.mask = false
        const instance = modal.success({
            title: '对战邀请',
            content: `收到来自` + messageBody.sourceUser + '的对战邀请',
        });

        setTimeout(() => {
            instance.destroy();
        }, 6000);
    };


    function handleServerMessage(msg) {
        const messageBody = JSON.parse(msg.data)
        const msgType = messageBody.messageType + '';
        switch (msgType) {
            case "RequestFightMessage":
                handelRequest(messageBody)
                break
            case "BattleMessage":
                break
            case "UserListUpdateMessage":
                console.log(messageBody.userList)
                updateState(draft => {
                    draft.userList = messageBody.userList;
                })
                break
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
    }

    function handleOk() {

        if (user.userName === '') {
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

    return (
        <>
            {contextHolder}
            <Modal title="我的信息（QQ号仅用于获取头像）" open={state.isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Row gutter={[16, 16]}>
                    <Col>
                        <Input
                            placeholder="请输入用户名"
                            prefix={<UserOutlined/>}
                            onChange={(e) => updateUser(draft => {
                                draft.userName = e.target.value
                            })}
                            allowClear
                        />
                    </Col>
                    <Col>
                        <Input
                            placeholder="请输入QQ号"
                            prefix={<QqOutlined/>}
                            onChange={(e) => updateUser(draft => {
                                draft.qqNumber = e.target.value
                            })}
                            allowClear
                        />
                    </Col>
                </Row>
            </Modal>
            <MainContains userList={state.userList} handelRequestFight={(targetUser) => requestFight(targetUser)}/>
        </>
    )
}
