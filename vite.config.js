import react from '@vitejs/plugin-react-swc'
import 'dotenv/config'
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  // Cho phép Vite sử dụng process.env, mặc định là không được mà phải sử dụng import.meta.env
  define: {
    'process.env': process.env
  },
  plugins: [react(), svgr()],
  resolve: {
    alias: [{ find: '~', replacement: '/src' }]
  }
})
