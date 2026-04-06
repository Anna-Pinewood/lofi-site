import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

function scanMp4(subdir: string): string[] {
  const dir = path.resolve(__dirname, 'public/videos', subdir)
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.mp4'))
    .map(f => `/videos/${subdir}/${f}`)
}

function videoListPlugin() {
  const virtualId = 'virtual:video-list'
  const resolvedId = '\0' + virtualId

  return {
    name: 'video-list',
    resolveId(id: string) {
      if (id === virtualId) return resolvedId
    },
    load(id: string) {
      if (id !== resolvedId) return
      const data = { day: scanMp4('day'), night: scanMp4('night') }
      return `export default ${JSON.stringify(data)}`
    },
  }
}

export default defineConfig({
  base: '/lofi-site/',
  plugins: [react(), videoListPlugin()],
})
