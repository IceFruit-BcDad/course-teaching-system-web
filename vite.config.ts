import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';

// https://vitejs.dev/config/
export default ({mode}: any) => {
  const envConfig = loadEnv(mode, "./");

  return defineConfig({
    plugins: [
        vue(),
        Components({
          resolvers: [AntDesignVueResolver()],
        })
    ],
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
