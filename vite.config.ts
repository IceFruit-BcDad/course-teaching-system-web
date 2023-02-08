import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default ({mode}: any) => {
  const envConfig = loadEnv(mode, "./");

  return defineConfig({
    plugins: [vue()],
    resolve: {
      alias: {
        "@": "/src",
      },
    },
    server: {
      proxy: {
        "/api": {
          target: envConfig.VITE_SERVICE_ADDRESS,
          changeOrigin: true
        },
      },
    },
  });
}
