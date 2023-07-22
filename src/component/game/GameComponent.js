import FiveComponent from "../board/BoardComponent";

export default function GameComponent({gameInfo, handleLocalPlay}) {

    return(
        <>
            {/*<button onClick={() => back()}>撤销</button>*/}
            <FiveComponent gameInfo={gameInfo} onClick = {(idx, idy) => handleLocalPlay(idx, idy)}/>
        </>
    )

    // function back() {
    //     if (state.squares.length === 1) {
    //         return;
    //     }
    //
    //     updateState(draft => {
    //         produce(draft, () => {
    //             let preSquare = draft.squares.pop();
    //             draft.chessBoard[preSquare.idx][preSquare.idy] = 0
    //         })
    //         draft.nextBoard = -state.nextBoard;
    //     })
    // }


}