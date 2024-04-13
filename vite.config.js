import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import svgr from 'vite-plugin-svgr'
import 'dotenv/config'

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
