<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {Grid} from './ts/grid'
import {Snake} from './ts/snake'
onMounted(() => {
  const grid = new Grid(16);
  // const snake = new Snake(grid);
  // grid.snake = snake;
})
// console.log(grid.size)

</script>

<template>
  <div class="app">
    <div class="wrapper">
      <div class="grid"></div>
    </div>
  </div>
</template>
