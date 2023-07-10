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
                                    return (<div className={className_cellSingle} key={boardIdy}>
                                        {
                                            self.props.squares.map((items, squareKey) => {
                                                return (<div key={squareKey} className='main-cell-click'
                                                             onClick={() => self.props.onClick(boardIdx, boardIdy)}>
                                                    {
                                                        !items.whiteClick && items.idx === boardIdx && items.idy === boardIdy
                                                            ? <div className='main-cell-black'/>
                                                            : items.whiteClick && items.idx === boardIdx && items.idy === boardIdy ?
                                                                <div className='main-cell-white'/>
                                                                : ''
                                                    }
                                                </div>)
                                            })
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