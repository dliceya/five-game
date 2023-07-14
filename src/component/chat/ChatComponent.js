import React from 'react'

import './ChatComponent.css'
import {List, Avatar, Button, Tooltip} from "antd";
import {qqUtil} from "../../utils/utils";

export default function ChatComponent ({userList, handelRequestFight}) {

    return(
        <div className='main-chat'>
        <List
            bordered = {true}
            dataSource={userList}
            renderItem={(item) => {
                return (
                    <List.Item>
                        <List.Item.Meta
                            avatar={<Avatar src = {qqUtil.getAvatarByQQNumber(item.qqNumber)}/>}
                            title={<Tooltip title={item.userName}><div>{item.userName.substr(0, 6)}</div></Tooltip>
                            }
                        />
                        <Button type="dashed" onClick={() => handelRequestFight(item.userName)}>邀请对战</Button>
                    </List.Item>
                )
            }}
        />
        </div>
    )
}
