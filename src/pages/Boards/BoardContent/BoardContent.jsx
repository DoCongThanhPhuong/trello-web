import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'

import {
  DndContext,
  // PointerSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useEffect, useState } from 'react'
import { cloneDeep } from 'lodash'

import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

function BoardContent({ board }) {
  // const pointerSensor = useSensor(PointerSensor, {
  //   activationConstraint: { distance: 10 }
  // })

  // Yêu cầu chuột di chuyển 10 pixel thì mới kích hoạt event, sửa trường hợp click gọi event
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

  // Cùng một thời điểm chỉ có 1 phần tử(card hoặc column) được kéo
  const [activeDragItemId, setActiveDragItemId] = useState([null])
  const [activeDragItemType, setActiveDragItemType] = useState([null])
  const [activeDragItemData, setActiveDragItemData] = useState([null])

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  const findColumnByCardId = (cardId) => {
    return orderedColumns.find((column) =>
      column?.cards?.map((card) => card._id)?.includes(cardId)
    )
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

    // Kiểm tra 2 column khác nhau thì xử lý logic còn nếu cùng trong 1 column thì không làm gì
    // Đây là xử lý khi đang kéo sang
    if (activeColumn._id !== overColumn._id) {
      setOrderedColumns((prevColumns) => {
        const overCardIndex = overColumn?.cards?.findIndex(
          // Tìm vị trí(index) của overCard trong column đích(nơi activeCard sắp được thả)
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

          // Tiếp theo thêm card đang kéo vào overColumn theo index mới
          nextOverColumn.cards = nextOverColumn.cards.toSpliced(
            newCardIndex,
            0,
            activeDraggingCardData
          )

          // Cập nhật lại mảng cardOrderIds cho chuẩn theo dữ liệu mới
          nextOverColumn.cardOrderIds = nextOverColumn.cards.map(
            (card) => card._id
          )
        }

        return nextColumns
      })
    }
  }

  const handleDragEnd = (event) => {
    // console.log('handleDragEnd: ', event)

    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      // console.log('hành động kéo thả Card - Tạm thời không làm gì cả!')
      return
    }

    const { active, over } = event

    // Kiểm tra nếu nếu không tồn tại active hoặc over (kéo ra ngoài phạm vi container) thì return luôn (tránh lỗi crash trang)
    if (!active || !over) return

    // Nếu vị trí mới sau khi kéo thả khác vị trí ban đầu
    if (active.id !== over.id) {
      // Lấy bị trí cũ từ active
      const oldIndex = orderedColumns.findIndex((c) => c._id === active.id)
      // Lấy bị trí mới từ over
      const newIndex = orderedColumns.findIndex((c) => c._id === over.id)

      // Dùng arrayMove để sắp xếp lại mảng Column
      const dndOrderedColumns = arrayMove(orderedColumns, oldIndex, newIndex)
      // 2 console.log dữ liệu này dùng để xử lý gọi API
      // const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id)
      // console.log(dndOrderedColumns)
      // console.log(dndOrderedColumnsIds)

      // Cập nhật lại state columns ban đầu sau khi đã kéo thả
      setOrderedColumns(dndOrderedColumns)
    }

    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
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

  return (
    <DndContext
      sensors={sensors}
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
        <ListColumns columns={orderedColumns} />
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
