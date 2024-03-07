import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'

import {
  DndContext,
  // PointerSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useEffect, useState } from 'react'

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

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  const handleDragEnd = (event) => {
    // console.log('handleDragEnd: ', event)
    const { active, over } = event

    // Kiểm tra nếu nếu không tồn tại over (kéo linh tinh ra ngoài) thì return luôn tránh lỗi
    if (!over) return

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
  }

  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
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
      </Box>
    </DndContext>
  )
}

export default BoardContent
