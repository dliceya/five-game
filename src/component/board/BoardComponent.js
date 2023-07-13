import './BoardComponent.css'

export default function FiveComponent({arr, chessBoard, onClick}) {

    return (
        <div className='main'>
            {
                arr.map((item, boardIdx) => {
                    return (<div className='main-cell' key={boardIdx}>
                        {
                            arr.map((item, boardIdy) => {
                                let className_cellSingle = boardIdx === 0 ? 'main-cell-single-white-x' : boardIdy ===0 ? 'main-cell-single-white-y' : 'main-cell-single';
                                if (boardIdx === 0 && boardIdy ===0) className_cellSingle = 'main-cell-single-white-x-y';
                                let click = chessBoard[boardIdx][boardIdy] === -1 ? 'main-cell-white' : chessBoard[boardIdx][boardIdy] === 1 ? 'main-cell-black' : ''
                                return (<div className={className_cellSingle} key={boardIdy}>
                                    {
                                        <div  className='main-cell-click' onClick={() => onClick(boardIdx, boardIdy)}>
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