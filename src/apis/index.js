import axios from 'axios'
import { API_ROOT } from '~/utils/constants'

/** Không try catch hay then catch để bắt lỗi trong các function vì sẽ dẫn đến dư thừa code
 * Giải pháp: sử dụng Interceptors của axios để bắt lỗi tập trung
 */
export const fetchBoardDetailsAPI = async (boardId) => {
  const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)
  // Lưu ý: axios sẽ trả kết quả về qua property của nó là data
  return response.data
}
