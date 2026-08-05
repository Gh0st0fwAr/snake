import { createApp } from 'vue'
import Main from './Main.vue'
// Vite 2 не всегда резолвит package exports у @fontsource — явные пути
import '../node_modules/@fontsource/syne/700.css'
import '../node_modules/@fontsource/lexend/500.css'
import '../node_modules/@fontsource/lexend/600.css'
import './scss/main.scss'

createApp(Main).mount('#app')
