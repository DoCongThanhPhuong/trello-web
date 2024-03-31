import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'

import {
  DndContext,
  // PointerSensor,
  // MouseSensor,
  // TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  // closestCenter,
  closestCorners,
  pointerWithin,
  // rectIntersection,
  getFirstCollision
} from '@dnd-kit/core'
import { MouseSensor, TouchSensor } from '~/customLibs/DndKitSensors'

import { arrayMove } from '@dnd-kit/sortable'
import { useEffect, useState, useCallback, useRef } from 'react'
import { cloneDeep, isEmpty } from 'lodash'
import { generatePlaceholderCard } from '~/utils/formatters'

import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

function BoardContent({
  board,
  createNewColumn,
  createNewCard,
  moveColumns,
  moveCardInTheSameColumn
}) {
  // const pointerSensor = useSensor(PointerSensor, {
  //   activationConstraint: { distance: 10 }
  // })

  // Yêu cầu chuột di chuyển 10px thì mới kích hoạt event, sửa trường hợp click gọi event
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 10 }
  })

  // Nhấn giữ 250ms và dung sai của cảm ứng 500px thì mới kích hoạt event
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 250, tolerance: 500 }
  })

  // Ưu tiên sử dụng mouse sensor và touch sensor để có trải nghiệm trên mobile tốt nhất, không bị bug
  // const sensors = useSensors(pointerSensor)
  const sensors = useSensors(mouseSensor, touchSensor)

  const [orderedColumns, setOrderedColumns] = useState([])

  // Cùng một thời điểm chỉ có 1 phần tử (card hoặc column) được kéo
  const [activeDragItemId, setActiveDragItemId] = useState([null])
  const [activeDragItemType, setActiveDragItemType] = useState([null])
  const [activeDragItemData, setActiveDragItemData] = useState([null])
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] = useState([
    null
  ])

  // Điểm va chạm cuối cùng trước đó (xử lý thuật toán phát hiện va chạm)
  const lastOverId = useRef(null)

  useEffect(() => {
    // Columns đã được sắp xếp ở component cha cao nhất
    setOrderedColumns(board.columns)
  }, [board])

  const findColumnByCardId = (cardId) => {
    return orderedColumns.find((column) =>
      column?.cards?.map((card) => card._id)?.includes(cardId)
    )
  }

  // Function chung xử lý việc cập nhật lại state trong trường hợp di chuyển Card giữa hai Column khác nhau
  const moveCardBetweenDifferentColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData
  ) => {
    setOrderedColumns((prevColumns) => {
      const overCardIndex = overColumn?.cards?.findIndex(
        // Tìm vị trí (index) của overCard trong column đích (nơi activeCard sắp được thả)
        (card) => card._id === overCardId
      )

      let newCardIndex
      const isBelowOverItem =
        active.rect.current.translated &&
        active.rect.current.translated.top > over.rect.top + over.rect.height

      const modifier = isBelowOverItem ? 1 : 0

      newCardIndex =
        overCardIndex >= 0
          ? overCardIndex + modifier
          : overColumn?.cards?.length + 1

      // Clone mảng cũ ra một cái mới để xử lý data rồi return - Cập nhật lại mảng mới
      const nextColumns = cloneDeep(prevColumns)
      const nextActiveColumn = nextColumns.find(
        (column) => column._id === activeColumn._id
      )
      const nextOverColumn = nextColumns.find(
        (column) => column._id === overColumn._id
      )

      // nextActiveColumn: Column cũ
      if (nextActiveColumn) {
        // Xóa card ở column active
        nextActiveColumn.cards = nextActiveColumn.cards.filter(
          (card) => card._id !== activeDraggingCardId
        )

        // Thêm Placeholder Card nếu Column rỗng (bị kéo hết card bên trong)
        if (isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn)]
        }

        // Cập nhật lại mảng cardOrderIds cho chuẩn theo dữ liệu mới
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(
          (card) => card._id
        )
      }

      // nextOverColumn: Column mới
      if (nextOverColumn) {
        // Kiểm tra đang kéo có tồn tại trong column hay chưa, nếu có thì xóa nó trước
        nextOverColumn.cards = nextOverColumn.cards.filter(
          (card) => card._id !== activeDraggingCardId
        )

        // Phải cập nhật chuẩn dữ liệu columnId trong card sau khi kéo card giữa hai column khác nhau
        const rebuild_activeDraggingCardData = {
          ...activeDraggingCardData,
          columnId: nextOverColumn._id
        }

        // Tiếp theo thêm card đang kéo vào overColumn theo index mới
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(
          newCardIndex,
          0,
          rebuild_activeDraggingCardData
        )

        // Xóa Placeholder Card đi nếu nó đang tồn tại
        nextOverColumn.cards = nextOverColumn.cards.filter(
          (card) => !card.FE_PlaceholderCard
        )

        // Cập nhật lại mảng cardOrderIds cho chuẩn theo dữ liệu mới
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(
          (card) => card._id
        )
      }

      return nextColumns
    })
  }

  const handleDragStart = (event) => {
    // console.log('handleDragStart: ', event)
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(
      event?.active?.data?.current?.columnId
        ? ACTIVE_DRAG_ITEM_TYPE.CARD
        : ACTIVE_DRAG_ITEM_TYPE.COLUMN
    )
    setActiveDragItemData(event?.active?.data?.current)

    // Nếu kéo Card thì mới thực hiện hành động set giá trị oldColumn
    if (event?.active?.data?.current?.columnId) {
      setOldColumnWhenDraggingCard(findColumnByCardId(event?.active?.id))
    }
  }

  const handleDragOver = (event) => {
    // Không làm gì thêm nếu đang kéo Column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return

    // console.log('handleDragOver: ', event)

    // Card
    const { active, over } = event

    // Kiểm tra nếu nếu không tồn tại active hoặc over (kéo ra ngoài phạm vi container) thì return luôn (tránh lỗi crash trang)
    if (!active || !over) return

    // activeDraggingCard là card đang được kéo
    const {
      id: activeDraggingCardId,
      data: { current: activeDraggingCardData }
    } = active
    // overCard là card đang tương tác với card đang kéo
    const { id: overCardId } = over

    // Tìm 2 columns theo cardId
    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)

    // Nếu không tồn tại 1 trong 2 column thì không làm gì hết, tránh crash trang
    if (!activeColumn || !overColumn) return

    // Kiểm tra nếu kéo thả giữa 2 column khác nhau thì xử lý logic còn nếu cùng trong 1 column thì không làm gì
    // Đây là xử lý khi đang kéo sang
    if (activeColumn._id !== overColumn._id) {
      moveCardBetweenDifferentColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData
      )
    }
  }

  const handleDragEnd = (event) => {
    // console.log('handleDragEnd: ', event)

    const { active, over } = event

    // Kiểm tra nếu nếu không tồn tại active hoặc over (kéo ra ngoài phạm vi container) thì return luôn (tránh lỗi crash trang)
    if (!active || !over) return

    // Xử lý kéo thả Cards
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      // activeDraggingCard là card đang được kéo
      const {
        id: activeDraggingCardId,
        data: { current: activeDraggingCardData }
      } = active
      // overCard là card đang tương tác với card đang kéo
      const { id: overCardId } = over

      // Tìm 2 columns theo cardId
      const activeColumn = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId)

      // Nếu không tồn tại 1 trong 2 column thì không làm gì hết, tránh crash trang
      if (!activeColumn || !overColumn) return

      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
        moveCardBetweenDifferentColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData
        )
      } else {
        // Hành động kéo thả Card trong cùng một Column

        // Lấy bị trí cũ từ oldColumnWhenDraggingCard
        const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex(
          (c) => c._id === activeDragItemId
        )
        // Lấy bị trí mới từ overColumn
        const newCardIndex = overColumn?.cards?.findIndex(
          (c) => c._id === overCardId
        )

        // Dùng arrayMove để sắp xếp lại mảng Cards
        const dndOrderedCards = arrayMove(
          oldColumnWhenDraggingCard?.cards,
          oldCardIndex,
          newCardIndex
        )
        const dndOrderedCardIds = dndOrderedCards.map((card) => card._id)

        // Vẫn cập nhật lại state cards ở đây để tránh delay hoặc flickering giao diện lúc kéo thả cần phải chờ API
        setOrderedColumns((prevColumns) => {
          // Clone mảng cũ ra một cái mới để xử lý data rồi return - Cập nhật lại mảng mới
          const nextColumns = cloneDeep(prevColumns)

          // Tìm tới Column đang thả
          const targetColumn = nextColumns.find(
            (column) => column._id === overColumn._id
          )

          // Cập nhật lại 2 giá trị là card và cardOrderIds trong targetColumn
          targetColumn.cards = dndOrderedCards
          targetColumn.cardOrderIds = dndOrderedCardIds

          // Trả về giá trị state mới (chuẩn vị trí)
          return nextColumns
        })

        moveCardInTheSameColumn(
          dndOrderedCards,
          dndOrderedCardIds,
          oldColumnWhenDraggingCard._id
        )
      }
    }

    // Xử lý kéo thả Columns trong một boardContent
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      // Nếu vị trí mới sau khi kéo thả khác vị trí ban đầu
      if (active.id !== over.id) {
        // Lấy bị trí cũ từ active
        const oldColumnIndex = orderedColumns.findIndex(
          (c) => c._id === active.id
        )
        // Lấy bị trí mới từ over
        const newColumnIndex = orderedColumns.findIndex(
          (c) => c._id === over.id
        )

        // Dùng arrayMove để sắp xếp lại mảng Columns
        const dndOrderedColumns = arrayMove(
          orderedColumns,
          oldColumnIndex,
          newColumnIndex
        )

        // Vẫn cập nhật lại state columns ở đây để tránh delay hoặc flickering giao diện lúc kéo thả cần phải chờ API
        setOrderedColumns(dndOrderedColumns)

        moveColumns(dndOrderedColumns)
      }
    }

    // Những giá trị này sau khi kéo thả xong luôn phải đưa về giá trị null mặc định ban đầu
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumnWhenDraggingCard(null)
  }

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5'
        }
      }
    })
  }

  const collisionDetectionStrategy = useCallback(
    (args) => {
      // Trường hợp kéo Column thì dùng thuật toán closestCorners là chuẩn nhất
      if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
        return closestCorners({ ...args })
      }

      // Tìm các điểm giao nhau, va chạm với con trỏ trả về một mảng các va chạm
      const poiterIntersections = pointerWithin(args)

      if (!poiterIntersections?.length) return

      // Thuật toán phát hiện va chạm sẽ trả về một mảng các va chạm ở đây
      // const intersections = !!poiterIntersections?.length
      //   ? poiterIntersections
      //   : rectIntersection(args)

      // Tìm overId đầu tiên trong các poiterIntersections ở trên
      let overId = getFirstCollision(poiterIntersections, 'id')
      if (overId) {
        const checkColumn = orderedColumns.find(
          (column) => column._id === overId
        )

        // Nếu over là column thì sẽ tìm tới cardId gần nhất bên trong khu vực va chạm đó bằng thuật toán closestCorners (sử dụng closestCorners mượt hơn closestCenter)
        if (checkColumn) {
          // console.log('Before:', overId)
          overId = closestCorners({
            ...args,
            droppableContainers: args.droppableContainers.filter(
              (container) => {
                return (
                  container.id !== overId &&
                  checkColumn?.cardOrderIds?.includes(container.id)
                )
              }
            )
          })[0]?.id
          // console.log('After: ', overId)
        }

        lastOverId.current = overId
        return [{ id: overId }]
      }

      // Nếu overId bằng null thì trả về mảng rỗng - tránh bug crash trang
      return lastOverId.current ? [{ id: lastOverId.current }] : []
    },
    [activeDragItemType, orderedColumns]
  )

  return (
    <DndContext
      sensors={sensors}
      // Thuật toán phát hiện va chạm nếu không có thì card lớn sẽ không kéo qua column được
      // collisionDetection={closestCorners}

      // Custom nâng cao thuật toán phát hiện va chạm do sử dụng closestCorners có bug flickering và gây sai lệch dữ liệu
      collisionDetection={collisionDetectionStrategy}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <Box
        sx={{
          bgcolor: (theme) =>
            theme.palette.mode === 'dark' ? '#34495e' : '#1976d2',
          width: '100%',
          height: (theme) => theme.trello.boardContentHeight,
          p: '10px 0'
        }}
      >
        <ListColumns
          columns={orderedColumns}
          createNewColumn={createNewColumn}
          createNewCard={createNewCard}
        />
        <DragOverlay dropAnimation={dropAnimation}>
          {!activeDragItemType && null}

          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && (
            <Column column={activeDragItemData} />
          )}

          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD && (
            <Card card={activeDragItemData} />
          )}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent
