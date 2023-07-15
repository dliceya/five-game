import React from "react";

import './MainContains.css'
import ChatComponent from "../chat/ChatComponent";
import GameComponent from "../game/GameComponent";
import {Col, Row} from "antd";


export default function MainContains({userList, handelRequestFight}) {

    return (
        <Row className='main_back' gutter={[{xs: 8, sm: 16, md: 24, lg: 32}, {xs: 8, sm: 16, md: 24, lg: 32}]}>
            <Col>
                {<GameComponent/>}
            </Col>
            <Col>
                { <ChatComponent userList={userList} handelRequestFight={handelRequestFight}/> }
            </Col>
        </Row>
    )


}