import Container from '@mui/material/Container'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  createNewCardAPI,
  createNewColumnAPI,
  deleteColumnDetailsAPI,
  moveCardToDifferentColumnAPI,
  updateBoardDetailsAPI,
  updateColumnDetailsAPI
} from '~/apis'
import AppBar from '~/components/AppBar/AppBar'
import Loading from '~/components/Loading/Loading'
import {
  fetchBoardDetailsAPI,
  selectCurrentActiveBoard,
  updateCurrentActiveBoard
} from '~/redux/activeBoard/activeBoardSlice'
import { generatePlaceholderCard } from '~/utils/formatters'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'

function Board() {
  const dispatch = useDispatch()
  const board = useSelector(selectCurrentActiveBoard)
  const param = useParams()

  useEffect(() => {
    const { id: boardId } = param
    dispatch(fetchBoardDetailsAPI(boardId))
  }, [dispatch, param])

  // Func này có nhiệm vụ gọi API tạo mới Column và làm mới dữ liệu State Board
  const createNewColumn = async (newColumnData) => {
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id
    })

    // Thêm Placeholder Card cho Column vừa được tạo
    createdColumn.cards = [generatePlaceholderCard(createdColumn)]
    createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn)._id]

    // Cập nhật state Board
    const newBoard = { ...board }
    newBoard.columns.push(createdColumn)
    newBoard.columnOrderIds.push(createdColumn._id)
    dispatch(updateCurrentActiveBoard(newBoard))
  }

  // Func này có nhiệm vụ gọi API tạo mới Card và làm mới dữ liệu State Board
  const createNewCard = async (newCardData) => {
    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id
    })

    // Cập nhật state Board
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(
      (column) => column._id === createdCard.columnId
    )
    if (columnToUpdate) {
      if (columnToUpdate.cards.some((card) => card.FE_PlaceholderCard)) {
        columnToUpdate.cards = [createdCard]
        columnToUpdate.cardOrderIds[createdCard._id]
      } else {
        columnToUpdate.cards.push(createdCard)
        columnToUpdate.cardOrderIds.push(createdCard._id)
      }
    }
    dispatch(updateCurrentActiveBoard(newBoard))
  }

  /** Func này có nhiệm vụ gọi API và xử lý sau khi kéo thả Columns
   * Chỉ cần gọi API để cập nhật mảng columnOrderIds trong Boars chứa nó
   */
  const moveColumns = (dndOrderedColumns) => {
    // Cập nhật cho chuẩn dữ liệu state Board
    const dndOrderedColumnIds = dndOrderedColumns.map((c) => c._id)
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnIds
    dispatch(updateCurrentActiveBoard(newBoard))

    // Gọi API cập nhật Board
    updateBoardDetailsAPI(newBoard._id, {
      columnOrderIds: dndOrderedColumnIds
    })
  }

  /** Khi di chuyển Card trong cùng một Column:
   * Chỉ cần gọi API để cập nhật mảng cardOrderIds của Column chứa nó
   */
  const moveCardInTheSameColumn = (
    dndOrderedCards,
    dndOrderedCardIds,
    columnId
  ) => {
    // Cập nhật cho chuẩn dữ liệu state Board
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(
      (column) => column._id === columnId
    )
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardIds
    }
    dispatch(updateCurrentActiveBoard(newBoard))

    // Gọi API cập nhật Column
    updateColumnDetailsAPI(columnId, { cardOrderIds: dndOrderedCardIds })
  }

  /** Khi di chuyển Card sang Column khác:
   * B1: Cập nhật mảng cardOrderIds của Column cũ (Xóa _id của Card trong mảng cardOrderIds cũ)
   * B2: Cập nhật mảng cardOrderIds của Column mới (Thêm _id của Card vào mảng cardOrderIds mới)
   * B3: Cập nhật lại trường columnId của Card di chuyển
   * => Tạo một API support riêng
   */
  const moveCardToDifferentColumn = (
    currentCardId,
    prevColumnId,
    nextColumnId,
    dndOrderedColumns
  ) => {
    // Cập nhật cho chuẩn dữ liệu state Board
    const dndOrderedColumnIds = dndOrderedColumns.map((c) => c._id)
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnIds
    dispatch(updateCurrentActiveBoard(newBoard))

    // Gọi API xử lý phía BE
    let prevCardOrderIds = dndOrderedColumns.find(
      (c) => c._id === prevColumnId
    )?.cardOrderIds
    // Xử lý vấn đề khi kéo Card cuối cùng ra khỏi Column, Column rỗng sẽ có placeholder card (cần phải xóa đi trước khi gửi dữ liệu lên cho phía BE)
    if (prevCardOrderIds[0].includes('placeholder-card')) prevCardOrderIds = []
    moveCardToDifferentColumnAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndOrderedColumns.find((c) => c._id === nextColumnId)
        ?.cardOrderIds
    })
  }

  // Xử lý xóa một Column và Cards bên trong nó
  const deleteColumnDetails = (columnId) => {
    // Cập nhật cho chuẩn dữ liệu state Board
    const newBoard = { ...board }
    newBoard.columns = newBoard.columns.filter(
      (column) => column._id !== columnId
    )
    newBoard.columnOrderIds = newBoard.columnOrderIds.filter(
      (_id) => _id !== columnId
    )
    dispatch(updateCurrentActiveBoard(newBoard))

    // Gọi API xử lý phía BE
    deleteColumnDetailsAPI(columnId).then((res) => {
      toast.success(res?.deleteResult)
    })
  }

  // Xử lý cập nhật title của một Column
  const updateColumnTitle = (columnId, newTitle) => {
    // Cập nhật cho chuẩn dữ liệu state Board
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(
      (column) => column._id === columnId
    )
    if (columnToUpdate) {
      columnToUpdate.title = newTitle
    }
    dispatch(updateCurrentActiveBoard(newBoard))

    // Gọi API xử lý phía BE
    updateColumnDetailsAPI(columnId, { title: newTitle })
  }

  if (!board) {
    return <Loading />
  }

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
        moveColumns={moveColumns}
        moveCardInTheSameColumn={moveCardInTheSameColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
        deleteColumnDetails={deleteColumnDetails}
        updateColumnTitle={updateColumnTitle}
      />
    </Container>
  )
}

export default Board
