import {UserOutlined, QqOutlined, ExclamationCircleFilled} from '@ant-design/icons';
import {Input, Modal, Col, Row} from 'antd';

import MainContains from "../main/MainContains";
import {boardLength, websocket_domain, websocket_path} from "../../config/GloableConfig";
import {messageUtil} from "../../utils/utils";
import {useImmer} from "use-immer";

import {createContext} from "react";
import {produce} from "immer";
export const currentUserContext = createContext({
    socket : undefined,
    user: '',
    targetUser: '',
});

export default function ClientComponent() {
    const [modal, contextHolder] = Modal.useModal();

    const [user, updateUser] = useImmer({
        userName: '',
        qqNumber: ''
    })

    const [state, updateState] = useImmer({
        isModalOpen: true,
        userList: [],
        myBoard: -1,
        inGame: false,
        waitingAgree: false,
        gameInfo: {
            arr: Array(boardLength).fill(null),
            nextBoard: 1,
            chessBoard: Array.from(new Array(boardLength), () => new Array(boardLength).fill(0)),
            squares: [{            // 落子历史数据，存放点击过的点坐标
                idx: null,
                idy: null,
            }],
        }
    })
    function handleLocalPlay(checkIdx, checkIdy, isTargetPlay) {

        if (!isTargetPlay) {
            if (state.myBoard !== 0 && state.myBoard !== state.gameInfo.nextBoard) {
                messageUtil.info('请等待对方落子')
                return;
            }
        }

        if (state.gameInfo.chessBoard[checkIdx][checkIdy]) {
            return
        }

        updateState(draft => {
            produce(draft, () => {
                draft.gameInfo.chessBoard[checkIdx][checkIdy] = draft.gameInfo.nextBoard;
                draft.gameInfo.nextBoard = -draft.gameInfo.nextBoard;
                draft.gameInfo.squares = [...draft.gameInfo.squares, {idx: checkIdx, idy: checkIdy}]
            })
        })

        if (!isTargetPlay) {
            const playInfo = {
                messageType: 'BattleMessage',
                idx: checkIdx,
                idy: checkIdy,
                sourceUser: currentUserContext.user,
                targetUser: currentUserContext.targetUser
            }
            currentUserContext.socket.send(JSON.stringify(playInfo))
        }

        calculateWinner(checkIdx, checkIdy)
    }

    function clearBoard(){
        updateState(draft => {
            draft.gameInfo = {
                arr: Array(boardLength).fill(null),
                    nextBoard: 1,
                    chessBoard: Array.from(new Array(boardLength), () => new Array(boardLength).fill(0)),
                    squares: [{            // 落子历史数据，存放点击过的点坐标
                    idx: null,
                    idy: null,
                }],
            }
        })
    }


    function handleServerMessage(msg) {
        const messageBody = JSON.parse(msg.data)
        const msgType = messageBody.messageType + '';
        switch (msgType) {
            case "RequestFightMessage":
                if (messageBody.ifTargetAgree == null) {
                    showConfirm(messageBody)
                } else if (messageBody.ifTargetAgree) {
                    updateState(draft => {
                        draft.inGame = true;
                        draft.waitingAgree = false;
                    })
                    clearBoard()
                    currentUserContext.targetUser = messageBody.sourceUser
                    messageUtil.success(messageBody.sourceUser + '已同意您的对战请求')
                } else if (!messageBody.ifTargetAgree){
                    updateState(draft => {
                        draft.waitingAgree = false;
                    })
                    messageUtil.success(messageBody.sourceUser + '拒绝了您的对战请求')
                }
                break
            case "BattleMessage":
                handleLocalPlay(messageBody.idx, messageBody.idy, true)
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
            case "AlertMessage":
                clearBoard()
                updateState(draft => {
                    draft.inGame = false;
                })
                messageUtil.info(messageBody.message)
                break
            default:
        }
    }

    return (
        <>
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

            <MainContains myBoard={state.myBoard}
                          gameInfo={state.gameInfo}
                          handleLocalPlay={(idx, idy) => handleLocalPlay(idx, idy, false)}

                          inGame = {state.inGame}
                          userList={state.userList}
                          handelRequestFight={(targetUser) => sendRequestFight(user.userName, targetUser, null)}/>
            {contextHolder}
        </>
    )


    function sendRequestFight(sourceUser, targetUser, ifTargetAgree) {
        const fightRequestMessage = {
            messageType: 'RequestFightMessage',
            ifTargetAgree: ifTargetAgree,
            sourceUser: sourceUser,
            targetUser: targetUser
        }

        updateState(draft => {
            draft.waitingAgree = true;
        })

        currentUserContext.socket.send(JSON.stringify(fightRequestMessage))
    }

    function initCollection() {

        currentUserContext.socket = new WebSocket(websocket_domain + websocket_path + user.userName + "Number" + user.qqNumber)
        currentUserContext.socket.onmessage = (msg) => handleServerMessage(msg)

    }

    function handleOk() {

        if (user.userName === '') {
            messageUtil.info('请输入用户名加入游戏')
            return false;
        }

        currentUserContext.user = user.userName
        updateState(draft => {
            draft.isModalOpen = false;
        })
        initCollection()
    }

    function handleCancel() {
        messageUtil.success('请输入用户名加入游戏')
    }

    function showConfirm(messageBody) {
        modal.confirm({
            duration: 5,
            okText: "接收",
            cancelText: "接受",
            title: '五子棋对战邀请',
            icon: <ExclamationCircleFilled />,
            content: '来自' + messageBody.sourceUser,
            onOk() {
                updateState(draft => {
                    draft.myBoard = 1;
                    draft.inGame = true;
                })
                currentUserContext.targetUser = messageBody.sourceUser;
                sendRequestFight(user.userName, messageBody.sourceUser, true);
            },
            onCancel() {
                sendRequestFight(user.userName, messageBody.sourceUser, false);
            },
        });
    }

    function calculateWinner(checkIdx, checkIdy) {
        console.log(state.gameInfo.nextBoard)
        console.log(checkIdx, checkIdy)
        let columnCount = 0;
        // 列计数
        for (let i = checkIdy + 1; i < boardLength; i++) {
            if (state.gameInfo.chessBoard[checkIdx][i] === state.gameInfo.nextBoard) {
                columnCount++;
            } else {
                break;
            }
        }
        for (let i = checkIdy - 1; i >= 0; i--) {
            if (state.gameInfo.chessBoard[checkIdx][i] === state.gameInfo.nextBoard) {
                columnCount++;
            } else {
                break;
            }
        }
        if (columnCount >= 4) {
            messageUtil.success(state.gameInfo.nextBoard === 1 ? '黑棋胜' : '白棋胜')
            return true;
        } else {
            columnCount = 0
        }

        //行计数
        for (let i = checkIdx + 1; i < boardLength; i++) {
            if (state.gameInfo.chessBoard[i][checkIdy] === state.gameInfo.nextBoard) {
                columnCount++;
            } else {
                break;
            }
        }
        for (let i = checkIdx - 1; i >= 0; i--) {
            if (state.gameInfo.chessBoard[i][checkIdy] === state.gameInfo.nextBoard) {
                columnCount++;
            } else {
                break;
            }
        }
        if (columnCount >= 4) {
            messageUtil.success(state.gameInfo.nextBoard === 1 ? '黑棋胜' : '白棋胜')
            return true;
        } else {
            columnCount = 0
        }

        //斜行计数-左斜 \
        // 向左上下棋↖
        for (let i = checkIdx - 1, j = checkIdy - 1; i >= 0 && j >= 0; i--, j--) {
            if (state.gameInfo.chessBoard[i][j] === state.gameInfo.nextBoard) {
                columnCount++;
            } else {
                break;
            }
        }
        // 向左下下棋↘
        for (let i = checkIdx + 1, j = checkIdy + 1; i < boardLength && j < boardLength; i++, j++) {
            if (state.gameInfo.chessBoard[i][j] === state.gameInfo.nextBoard) {
                columnCount++;
            } else {
                break;
            }
        }
        if (columnCount >= 4) {
            messageUtil.success(state.gameInfo.nextBoard === 1 ? '黑棋胜' : '白棋胜')
            return true;
        } else {
            columnCount = 0
        }
        //斜行计数-右斜 /
        // 向右上下棋↗
        for (let i = checkIdx + 1, j = checkIdy - 1; i < boardLength && j >= 0; i++, j--) {
            if (state.gameInfo.chessBoard[i][j] === state.gameInfo.nextBoard) {
                columnCount++;
            } else {
                break;
            }
        }
        // 向左下下棋↙
        for (let i = checkIdx - 1, j = checkIdy + 1; i >= 0 && j < boardLength; i--, j++) {
            if (state.gameInfo.chessBoard[i][j] === state.gameInfo.nextBoard) {
                columnCount++;
            } else {
                break;
            }
        }
        if (columnCount >= 4) {
            messageUtil.success(state.gameInfo.nextBoard === 1 ? '黑棋胜' : '白棋胜')
            return true;
        }
        return false
    }

}
