import React, {Component} from 'react'

import FiveComponent from "../board/BoardComponent";
import {message} from "antd";
import {boardLength} from "../../config/GloableConfig";

class GameComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arr: Array(boardLength).fill(null),
            nextBoard: 1,
            chessBoard: Array.from(new Array(boardLength), () => new Array(boardLength).fill(0)),
            squares: [{            // 落子历史数据，存放点击过的点坐标
                idx: null,
                idy: null,
            }],
            webSocket: null,
        }
    }

    handleClick(checkIdx, checkIdy) {

        if (this.state.chessBoard[checkIdx][checkIdy]) {
            return
        }

        const newBoard = this.state.chessBoard;
        newBoard[checkIdx][checkIdy] = this.state.nextBoard;
        this.setState((preState) => ({
            nextBoard: -preState.nextBoard,
            chessBoard: newBoard,
            squares: preState.squares.concat([{
                idx: checkIdx,
                idy: checkIdy,
            }]),
        }), () => this.calculateWinner(checkIdx, checkIdy));
    }

    back() {
        if (this.state.squares.length === 1) {
            return;
        }
        let historySquare = this.state.squares.pop();
        const newBoard = this.state.chessBoard;
        newBoard[historySquare.idx][historySquare.idy] = 0;
        this.setState((preState) => ({
            squares: this.state.squares,
            chessBoard: newBoard,
            nextBoard: -preState.nextBoard,
        }))
    }

    render(){
        const self = this;
        return(
            <>
                <button onClick={() => self.back()}>撤销</button>
                <FiveComponent {...self.state} onClick = {(x, y) => self.handleClick(x, y)}/>
            </>
        )
    }

    calculateWinner(checkIdx, checkIdy) {
        let columnCount = 0;
        // 列计数
        for (let i = checkIdy + 1; i < boardLength; i++) {
            if (this.state.chessBoard[checkIdx][i] === -this.state.nextBoard) {
                columnCount++;
            } else {
                break;
            }
        }
        for (let i = checkIdy - 1; i >= 0; i--) {
            if (this.state.chessBoard[checkIdx][i] === -this.state.nextBoard) {
                columnCount++;
            } else {
                break;
            }
        }
        if (columnCount >= 4) {
            message.success(this.state.nextBoard === -1 ? '黑棋胜' : '白棋胜')
            return true;
        } else {
            columnCount = 0
        }

        //行计数
        for (let i = checkIdx + 1; i < boardLength; i++) {
            if (this.state.chessBoard[i][checkIdy] === -this.state.nextBoard) {
                columnCount++;
            } else {
                break;
            }
        }
        for (let i = checkIdx - 1; i >= 0; i--) {
            if (this.state.chessBoard[i][checkIdy] === -this.state.nextBoard) {
                columnCount++;
            } else {
                break;
            }
        }
        if (columnCount >= 4) {
            message.success(this.state.nextBoard === -1 ? '黑棋胜' : '白棋胜')
            return true;
        } else {
            columnCount = 0
        }

        //斜行计数-左斜 \
        // 向左上下棋↖
        for (let i = checkIdx - 1, j = checkIdy - 1; i >= 0 && j >= 0; i--, j--) {
            if (this.state.chessBoard[i][j] === -this.state.nextBoard) {
                columnCount++;
            } else {
                break;
            }
        }
        // 向左下下棋↘
        for (let i = checkIdx + 1, j = checkIdy + 1; i < boardLength && j < boardLength; i++, j++) {
            if (this.state.chessBoard[i][j] === -this.state.nextBoard) {
                columnCount++;
            } else {
                break;
            }
        }
        if (columnCount >= 4) {
            message.success(this.state.nextBoard === -1 ? '黑棋胜' : '白棋胜')
            return true;
        } else {
            columnCount = 0
        }
        //斜行计数-右斜 /
        // 向右上下棋↗
        for (let i = checkIdx + 1, j = checkIdy - 1; i < boardLength && j >= 0; i++, j--) {
            if (this.state.chessBoard[i][j] === -this.state.nextBoard) {
                columnCount++;
            } else {
                break;
            }
        }
        // 向左下下棋↙
        for (let i = checkIdx - 1, j = checkIdy + 1; i >= 0 && j < boardLength; i--, j++) {
            if (this.state.chessBoard[i][j] === -this.state.nextBoard) {
                columnCount++;
            } else {
                break;
            }
        }
        if (columnCount >= 4) {
            message.success(this.state.nextBoard === -1 ? '黑棋胜' : '白棋胜')
            return true;
        }
        return false
    }
    back2() {
        if (this.state.history.length < 1) {
            return
        }
        this.setState((preState) => ({
            squares: preState.history.pop(),
            history: preState.history,
            whiteIsNext: !preState.whiteIsNext,
        }))
    }
}


export default GameComponent