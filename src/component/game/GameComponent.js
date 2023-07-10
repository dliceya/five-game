import React, {Component} from 'react'

import FiveComponent from "../board/BoardComponent";
import {message} from "antd";

class GameComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            boardLength: 19,                                            // 决定棋盘大小
            arr: Array(19).fill(null),                 // 用于循环渲染棋盘,
            whiteIsNext: false,                                         // 是否轮到白棋落子
            squares: [{                                                 // 落子历史数据，存放点击过的点坐标，并且标志该棋子是否是白棋
                idx: null,
                idy: null,
                whiteClick: null,
            }],
            webSocket: null,
        }
    }

    handleClick(checkIdx, checkIdy) {
        let state = this.state.squares.findIndex((n) => n.idx === checkIdx && n.idy === checkIdy)
        if (state !== -1) {
            return
        }
        this.setState((preState) => ({
            whiteIsNext: !preState.whiteIsNext,
            squares: preState.squares.concat([{
                idx: checkIdx,
                idy: checkIdy,
                whiteClick: preState.whiteIsNext
            }]),
        }), () => this.calculateWinner(checkIdx, checkIdy))
    }

    back() {
        if (this.state.squares.length === 1) {
            return
        }
        this.state.squares.pop();
        this.setState((preState) => ({
            squares: this.state.squares,
            whiteIsNext: !preState.whiteIsNext,
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

        // 将轮流落子信息转化为空间棋盘(y, x)，便于判断对局是否结束
        let boardArray = this.state.arr.map((ignore, arrKey) => {
            let tmpArray = Array(this.state.boardLength).fill([])
            return tmpArray.map((item, row) => {
                tmpArray[this.state.idx] = this.state.squares.filter((square) => {
                    return arrKey === square.idy && square.idx === row
                })
                return tmpArray[this.state.idx].length > 0 ? tmpArray[this.state.idx][0] : ''
            })
        })

        let columnCount = 0;

        // 列计数
        for (let i = checkIdy + 1; i < this.state.boardLength; i++) {
            if (boardArray[i][checkIdx].whiteClick === !this.state.whiteIsNext) {
                columnCount++;
            } else {
                break;
            }
        }
        for (let i = checkIdy - 1; i >= 0; i--) {
            if (boardArray[i][checkIdx].whiteClick === !this.state.whiteIsNext) {
                columnCount++;
            } else {
                break;
            }
        }
        if (columnCount >= 4) {
            message.success(this.state.whiteIsNext ? '黑棋胜' : '白棋胜');
            return true;
        } else {
            columnCount = 0
        }

        //行计数
        for (let i = checkIdx + 1; i < this.state.boardLength; i++) {
            if (boardArray[checkIdy][i].whiteClick === !this.state.whiteIsNext) {
                columnCount++;
            } else {
                break;
            }
        }
        for (let i = checkIdx - 1; i >= 0; i--) {
            if (boardArray[checkIdy][i].whiteClick === !this.state.whiteIsNext) {
                columnCount++;
            } else {
                break;
            }
        }
        if (columnCount >= 4) {
            message.success(this.state.whiteIsNext ? '黑棋胜' : '白棋胜')
            return true;
        } else {
            columnCount = 0
        }

        //斜行计数-左斜 \
        // 向左上下棋↖
        for (let i = checkIdx + 1, j = checkIdy + 1; i < this.state.boardLength && j < this.state.boardLength; i++, j++) {
            if (boardArray[i][j].whiteClick === !this.state.whiteIsNext) {
                columnCount++;
            } else {
                break;
            }
        }
        // 向左下下棋↘
        for (let i = checkIdx - 1, j = checkIdy - 1; i >= 0 && j >= 0; i--, j--) {
            if (boardArray[j][i].whiteClick === !this.state.whiteIsNext) {
                columnCount++;
            } else {
                break;
            }
        }
        if (columnCount >= 4) {
            message.success(this.state.whiteIsNext ? '黑棋胜' : '白棋胜')
            return true;
        } else {
            columnCount = 0
        }
        //斜行计数-右斜 /
        // 向右上下棋↗
        for (let i = checkIdy + 1, j = checkIdx - 1; i < this.state.boardLength && j >= 0; i++, j--) {
            if (boardArray[i][j].whiteClick === !this.state.whiteIsNext) {
                columnCount++;
            } else {
                break;
            }
        }
        // 向左右下下棋↙
        for (let i = checkIdy - 1, j = checkIdx + 1; i >= 0 && j < this.state.boardLength; i--, j++) {
            if (boardArray[i][j].whiteClick === !this.state.whiteIsNext) {
                columnCount++;
            } else {
                break;
            }
        }
        if (columnCount >= 4) {
            message.success(this.state.whiteIsNext ? '黑棋胜' : '白棋胜')
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