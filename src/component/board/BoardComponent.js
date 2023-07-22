import './BoardComponentTest.scss'

export default function FiveComponent({gameInfo, onClick}) {

    function handleClick(boardIdx, boardIdy) {
        onClick(boardIdx, boardIdy)
    }

    return (
        <div className='main'>
            {
                gameInfo.arr.map((item, boardIdx) => {
                    return (
                        <div className='main-cell' key={boardIdx}>
                        {
                            gameInfo.arr.map((item, boardIdy) => {
                                let className_cellSingle = boardIdx === 0 ? 'main-cell-single-white-x' : boardIdy ===0 ? 'main-cell-single-white-y' : 'main-cell-single';
                                if (boardIdx === 0 && boardIdy ===0) className_cellSingle = 'main-cell-single-white-x-y';
                                let click = gameInfo.chessBoard[boardIdx][boardIdy] === -1 ? 'main-cell-white' : gameInfo.chessBoard[boardIdx][boardIdy] === 1 ? 'main-cell-black' : ''
                                if (gameInfo.preCheckIdx === boardIdx && gameInfo.preCheckIdy === boardIdy) click = gameInfo.chessBoard[boardIdx][boardIdy] === -1 ? 'main-cell-white-pre' : gameInfo.chessBoard[boardIdx][boardIdy] === 1 ? 'main-cell-black-pre' : ''
                                return (<div className={className_cellSingle} key={boardIdy}>
                                    {
                                        <div  className='main-cell-click' onClick={() => handleClick(boardIdx, boardIdy)}>
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