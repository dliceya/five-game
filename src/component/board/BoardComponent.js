import React, {Component} from 'react'
import './BoardComponent.css'

class FiveComponent extends Component {

    render() {
        const self = this;
        return (
            <div className='main'>
                {
                    self.props.arr.map((item, boardIdx) => {
                        return (<div className='main-cell' key={boardIdx}>
                            {
                                self.props.arr.map((item, boardIdy) => {
                                    let className_cellSingle = boardIdx === 0 ? 'main-cell-single-white-x' : boardIdy ===0 ? 'main-cell-single-white-y' : 'main-cell-single';
                                    if (boardIdx === 0 && boardIdy ===0) className_cellSingle = 'main-cell-single-white-x-y';
                                    let click = self.props.chessBoard[boardIdx][boardIdy] === -1 ? 'main-cell-white' : self.props.chessBoard[boardIdx][boardIdy] === 1 ? 'main-cell-black' : ''
                                    return (<div className={className_cellSingle} key={boardIdy}>
                                        {
                                            <div  className='main-cell-click' onClick={() => self.props.onClick(boardIdx, boardIdy)}>
                                                {
                                                    click === '' ? '' : <div className = {click}/>
                                                }
                                            </div>
                                        }
                                    </div>)
                                })
                            }
                        </div>)
                    })
                }
            </div>
        )
    }
}

export default FiveComponent