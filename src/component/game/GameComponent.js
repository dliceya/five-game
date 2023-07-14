import FiveComponent from "../board/BoardComponent";
import {boardLength} from "../../config/GloableConfig";
import {messageUtil} from "../../utils/utils";
import {useImmer} from "use-immer";
import {produce} from 'immer';


export default function GameComponent() {

    const [state, updateState] = useImmer({
        arr: Array(boardLength).fill(null),
        nextBoard: 1,
        chessBoard: Array.from(new Array(boardLength), () => new Array(boardLength).fill(0)),
        squares: [{            // 落子历史数据，存放点击过的点坐标
            idx: null,
            idy: null,
        }],
    })

    return(
        <>
            <button onClick={() => back()}>撤销</button>
            <FiveComponent arr={state.arr} chessBoard={state.chessBoard} onClick = {(x, y) => handleClick(x, y)}/>
        </>
    )

    function handleClick(checkIdx, checkIdy) {

        if (state.chessBoard[checkIdx][checkIdy]) {
            return
        }

        updateState(draft => {
            draft.chessBoard[checkIdx][checkIdy] = state.nextBoard;
            draft.nextBoard = -state.nextBoard;
            draft.squares = [...state.squares, {idx: checkIdx, idy: checkIdy}]
        })
        calculateWinner(checkIdx, checkIdy)
    }

    function back() {
        if (state.squares.length === 1) {
            return;
        }

        updateState(draft => {
            produce(draft, () => {
                let preSquare = draft.squares.pop();
                draft.chessBoard[preSquare.idx][preSquare.idy] = 0
            })
            draft.nextBoard = -state.nextBoard;
        })
    }

    function calculateWinner(checkIdx, checkIdy) {
        let columnCount = 0;
        // 列计数
        for (let i = checkIdy + 1; i < boardLength; i++) {
            if (state.chessBoard[checkIdx][i] === state.nextBoard) {
                columnCount++;
            } else {
                break;
            }
        }
        for (let i = checkIdy - 1; i >= 0; i--) {
            if (state.chessBoard[checkIdx][i] === state.nextBoard) {
                columnCount++;
            } else {
                break;
            }
        }
        if (columnCount >= 4) {
            messageUtil.success(state.nextBoard === 1 ? '黑棋胜' : '白棋胜')
            return true;
        } else {
            columnCount = 0
        }

        //行计数
        for (let i = checkIdx + 1; i < boardLength; i++) {
            if (state.chessBoard[i][checkIdy] === state.nextBoard) {
                columnCount++;
            } else {
                break;
            }
        }
        for (let i = checkIdx - 1; i >= 0; i--) {
            if (state.chessBoard[i][checkIdy] === state.nextBoard) {
                columnCount++;
            } else {
                break;
            }
        }
        if (columnCount >= 4) {
            messageUtil.success(state.nextBoard === 1 ? '黑棋胜' : '白棋胜')
            return true;
        } else {
            columnCount = 0
        }

        //斜行计数-左斜 \
        // 向左上下棋↖
        for (let i = checkIdx - 1, j = checkIdy - 1; i >= 0 && j >= 0; i--, j--) {
            if (state.chessBoard[i][j] === state.nextBoard) {
                columnCount++;
            } else {
                break;
            }
        }
        // 向左下下棋↘
        for (let i = checkIdx + 1, j = checkIdy + 1; i < boardLength && j < boardLength; i++, j++) {
            if (state.chessBoard[i][j] === state.nextBoard) {
                columnCount++;
            } else {
                break;
            }
        }
        if (columnCount >= 4) {
            messageUtil.success(state.nextBoard === 1 ? '黑棋胜' : '白棋胜')
            return true;
        } else {
            columnCount = 0
        }
        //斜行计数-右斜 /
        // 向右上下棋↗
        for (let i = checkIdx + 1, j = checkIdy - 1; i < boardLength && j >= 0; i++, j--) {
            if (state.chessBoard[i][j] === state.nextBoard) {
                columnCount++;
            } else {
                break;
            }
        }
        // 向左下下棋↙
        for (let i = checkIdx - 1, j = checkIdy + 1; i >= 0 && j < boardLength; i--, j++) {
            if (state.chessBoard[i][j] === state.nextBoard) {
                columnCount++;
            } else {
                break;
            }
        }
        if (columnCount >= 4) {
            messageUtil.success(state.nextBoard === 1 ? '黑棋胜' : '白棋胜')
            return true;
        }
        return false
    }
}