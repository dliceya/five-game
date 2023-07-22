import {UserOutlined, QqOutlined, ExclamationCircleFilled} from '@ant-design/icons';
import {Input, Modal, Col, Row, Spin, Progress} from 'antd';

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
        isUserModalOpen: true,
        userList: [],
        myBoard: -1,
        inGame: false,
        waitingAgree: false,
        waitingAgreePercent: 100,
        gameInfo: {
            arr: Array(boardLength).fill(null),
            nextBoard: 1,
            test: 1,
            chessBoard: Array.from(new Array(boardLength), () => new Array(boardLength).fill(0)),
            squares: [{            // 落子历史数据，存放点击过的点坐标
                idx: null,
                idy: null,
            }],
            preCheckIdx: -1,
            preCheckIdy: -1,
        }
    })
    function handleLocalPlay(checkIdx, checkIdy, isTargetPlay) {

        if (!isTargetPlay) {
            let alert = 3;
            if (state.myBoard !== 0 && alert++ % 3 ===0 && state.myBoard !== state.gameInfo.nextBoard) {
                messageUtil.info('请等待对方落子')
                return;
            }
        }

        if (state.gameInfo.chessBoard[checkIdx][checkIdy]) {
            return
        }

        let targetPlayBoard;
        console.log(state.gameInfo.test)
        updateState(draft => {
            draft.gameInfo.chessBoard[checkIdx][checkIdy] = draft.gameInfo.nextBoard;
            draft.gameInfo.nextBoard = -draft.gameInfo.nextBoard;
            draft.gameInfo.squares = [...draft.gameInfo.squares, {idx: checkIdx, idy: checkIdy}];
            draft.gameInfo.test = draft.gameInfo.test + 1;
            draft.gameInfo.preCheckIdx = checkIdx;
            draft.gameInfo.preCheckIdy = checkIdy;
            targetPlayBoard = draft.gameInfo.nextBoard;
            console.log(draft.gameInfo.nextBoard)
        })


        if (calculateWinner(checkIdx, checkIdy, targetPlayBoard)) {
            clearBoard(-state.myBoard, true);
        }

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
    }

    function clearBoard(myBoard = 0, inGame = false){
        updateState(draft => {
            draft.myBoard = myBoard;
            draft.inGame = inGame;
            draft.gameInfo.chessBoard = Array.from(new Array(boardLength), () => new Array(boardLength).fill(0));
            draft.gameInfo.squares = [{
                idx: null,
                idy: null,
            }];
            draft.gameInfo.test = 1;
            draft.gameInfo.preCheckIdx = -1;
            draft.gameInfo.preCheckIdy = -1;
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
                    clearBoard(-1, true)
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
                            draft.isUserModalOpen = true
                        })
                        break;
                    default:
                }
                break;
            case "AlertMessage":
                clearBoard(-1, false)
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
            <Modal title="我的信息（QQ号仅用于获取头像）" open={state.isUserModalOpen} onOk={handleOk} onCancel={handleCancel}>
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

            <Spin spinning={state.waitingAgree} delay={200}
                  tip={ <Progress percent={state.waitingAgreePercent}
                                  strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }}
                                  type={'dashboard'}
                                  format={((percent) => {
                      return '等待同意...'
                  })}/> }
            >
                <MainContains myBoard={state.myBoard}
                              gameInfo={state.gameInfo}
                              handleLocalPlay={(idx, idy) => handleLocalPlay(idx, idy, false)}

                              inGame={state.inGame}
                              userList={state.userList}
                              currUser={user.userName}
                              handelRequestFight={(targetUser) => sendRequestFight(user.userName, targetUser, null)}/>
                {contextHolder}
            </Spin>
        </>
    )


    function sendRequestFight(sourceUser, targetUser, ifTargetAgree) {
        const fightRequestMessage = {
            messageType: 'RequestFightMessage',
            ifTargetAgree: ifTargetAgree,
            sourceUser: sourceUser,
            targetUser: targetUser
        }

        if (ifTargetAgree === null) {
            updateState(draft => {
                draft.waitingAgree = true;
            })

            const time = setInterval(() => {
                updateState(draft => {
                    draft.waitingAgreePercent = draft.waitingAgreePercent - 2
                })
            }, 100)

            setTimeout(() => {
                clearInterval(time)
                updateState(draft => {
                    draft.waitingAgree = false;
                    draft.waitingAgreePercent = 100;
                })
            }, 6000)
        }

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
            draft.isUserModalOpen = false;
        })
        initCollection()
    }

    function handleCancel() {
        messageUtil.success('请输入用户名加入游戏')
    }

    function showConfirm(messageBody) {
        let timeout = 6;
        let timeWait = true;
        const instance = modal.confirm({
            duration: 5,
            okText: "接收",
            cancelText: "拒绝",
            title: '五子棋对战邀请',
            icon: <ExclamationCircleFilled />,
            content: '来自' + messageBody.sourceUser + ' ( ' + timeout + ' 秒后自动拒绝)',
            onOk() {
                clearBoard(1, true)
                currentUserContext.targetUser = messageBody.sourceUser;
                sendRequestFight(user.userName, messageBody.sourceUser, true);
                timeWait = false
            },
            onCancel() {
                timeWait = false;
                sendRequestFight(user.userName, messageBody.sourceUser, false);
            },
        });


        const timer = setInterval(() => {
            timeout = timeout - 1;
            instance.update({
                content: '来自' + messageBody.sourceUser + ' ( ' + timeout + ' 秒后自动拒绝)',
            });
        }, 1000)

        setTimeout(() => {
            clearInterval(timer);
            instance.destroy();
            if (timeWait) {
                sendRequestFight(user.userName, messageBody.sourceUser, false);
            }
        }, 5500)
    }

    function calculateWinner(checkIdx, checkIdy, targetPlayBoard) {
        let columnCount = 0;
        // 列计数
        for (let i = checkIdy + 1; i < boardLength; i++) {
            if (state.gameInfo.chessBoard[checkIdx][i] === targetPlayBoard) {
                columnCount++;
            } else {
                break;
            }
        }
        for (let i = checkIdy - 1; i >= 0; i--) {
            if (state.gameInfo.chessBoard[checkIdx][i] === targetPlayBoard) {
                columnCount++;
            } else {
                break;
            }
        }
        if (columnCount >= 4) {
            messageUtil.success(targetPlayBoard === 1 ? '黑棋胜' : '白棋胜')
            return true;
        } else {
            columnCount = 0
        }

        //行计数
        for (let i = checkIdx + 1; i < boardLength; i++) {
            if (state.gameInfo.chessBoard[i][checkIdy] === targetPlayBoard) {
                columnCount++;
            } else {
                break;
            }
        }
        for (let i = checkIdx - 1; i >= 0; i--) {
            if (state.gameInfo.chessBoard[i][checkIdy] === targetPlayBoard) {
                columnCount++;
            } else {
                break;
            }
        }
        if (columnCount >= 4) {
            messageUtil.success(targetPlayBoard === 1 ? '黑棋胜' : '白棋胜')
            return true;
        } else {
            columnCount = 0
        }

        //斜行计数-左斜 \
        // 向左上下棋↖
        for (let i = checkIdx - 1, j = checkIdy - 1; i >= 0 && j >= 0; i--, j--) {
            if (state.gameInfo.chessBoard[i][j] === targetPlayBoard) {
                columnCount++;
            } else {
                break;
            }
        }
        // 向左下下棋↘
        for (let i = checkIdx + 1, j = checkIdy + 1; i < boardLength && j < boardLength; i++, j++) {
            if (state.gameInfo.chessBoard[i][j] === targetPlayBoard) {
                columnCount++;
            } else {
                break;
            }
        }
        if (columnCount >= 4) {
            messageUtil.success(targetPlayBoard === 1 ? '黑棋胜' : '白棋胜')
            return true;
        } else {
            columnCount = 0
        }
        //斜行计数-右斜 /
        // 向右上下棋↗
        for (let i = checkIdx + 1, j = checkIdy - 1; i < boardLength && j >= 0; i++, j--) {
            if (state.gameInfo.chessBoard[i][j] === targetPlayBoard) {
                columnCount++;
            } else {
                break;
            }
        }
        // 向左下下棋↙
        for (let i = checkIdx - 1, j = checkIdy + 1; i >= 0 && j < boardLength; i--, j++) {
            if (state.gameInfo.chessBoard[i][j] === targetPlayBoard) {
                columnCount++;
            } else {
                break;
            }
        }
        if (columnCount >= 4) {
            messageUtil.success(targetPlayBoard === 1 ? '黑棋胜' : '白棋胜')
            return true;
        }
        return false
    }

}
