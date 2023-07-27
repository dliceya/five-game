import React from 'react'

import './ChatComponent.css'
import {List, Avatar, Button, Tooltip} from "antd";
import {qqUtil} from "../../utils/utils";

export default function ChatComponent({currUser, inGame, userList, handelRequestFight, initGame, initRobot}) {

    return (
        <div className='main-chat'>
            <Button onClick={() => initRobot()}>人机对战</Button>
            <Button onClick={() => initGame(0, true)}>自己下</Button>
            <List
                bordered={true}
                dataSource={userList}
                renderItem={(item) => {
                    return (
                        <List.Item>
                            <List.Item.Meta
                                avatar={<Avatar src={qqUtil.getAvatarByQQNumber(item.qqNumber)}/>}
                                title={<Tooltip title={item.userName}>
                                    <div>{item.userName.substr(0, 6)}</div>
                                </Tooltip>
                                }
                                description={currUser === item.userName ? '我自己'.concat('(').concat(item.status).concat(')')  : item.status}
                            />
                            <Button type="dashed" disabled={inGame || item.status !== '空闲中' || currUser === item.userName} onClick={() => handelRequestFight(item.userName)}>邀请对战</Button>
                        </List.Item>
                    )
                }}
            />
        </div>
    )
}
