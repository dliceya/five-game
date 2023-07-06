import React, {Component} from 'react'
import './MainContains.css'
import ChatComponent from "../chat/ChatComponent";
import GameComponent from "../game/GameComponent";

class MainContains extends Component{
    render(){
        return(
            <div className='main_back'>
                {
                    <GameComponent />
                }
                {
                    <ChatComponent />
                }
            </div>
        )
    }
}

export default MainContains