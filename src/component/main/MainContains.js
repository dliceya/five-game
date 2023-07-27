import React from "react";

import './MainContains.css'
import ChatComponent from "../chat/ChatComponent";
import GameComponent from "../game/GameComponent";
import {Col, Row} from "antd";


export default function MainContains({myBoard, gameInfo,handleLocalPlay,
                                         currUser, inGame, userList, handelRequestFight, initGame, initRobot}) {

    return (
        <Row className='main_back' gutter={[{xs: 8, sm: 16, md: 24, lg: 32}, {xs: 8, sm: 16, md: 24, lg: 32}]}>
            <Col>
                {<GameComponent myBoard={myBoard} gameInfo={gameInfo} handleLocalPlay={(idx, idy) => handleLocalPlay(idx, idy)}/>}
            </Col>
            <Col>
                { <ChatComponent
                    currUser ={currUser}
                    inGame={inGame}
                    userList={userList}
                    handelRequestFight={handelRequestFight}
                    initGame={(myBoard, inGame) => initGame(myBoard, inGame)}
                    initRobot={() => initRobot()}
                /> }
            </Col>
        </Row>
    )


}