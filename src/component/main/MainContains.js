import './MainContains.css'
import ChatComponent from "../chat/ChatComponent";
import GameComponent from "../game/GameComponent";
import {Col, Row} from "antd";


export default function MainContains({userList, handelRequestFight}) {

    return(
        <div className='main_back'>
                    {
                        <GameComponent />
                    }
                    {
                        <ChatComponent userList={userList} handelRequestFight = {handelRequestFight}/>
                    }
        </div>
    )
}