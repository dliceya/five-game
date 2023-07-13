import './MainContains.css'
import ChatComponent from "../chat/ChatComponent";
import GameComponent from "../game/GameComponent";

export default function MainContains() {
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