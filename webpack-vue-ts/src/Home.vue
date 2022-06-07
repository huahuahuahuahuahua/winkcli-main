// Home.vue
<template>
  <div>
    首页
    <v-button plain hairline type="primary">细边框按钮</v-button>
    <v-button plain hairline type="primary">细边框按钮</v-button>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import { Button } from "vant";
export default defineComponent({
  name: "Home",
  components: {
    "v-button": Button
  }
});
</script>