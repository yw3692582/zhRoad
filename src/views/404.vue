<template>
  <div class="box">
    <div>
      <span>404</span>
      <span>找不到此页面...</span>
      <br />
      <span class="span_3" @click="$router.go(-1)">返回上一级</span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  watch: {},
  methods: {},
  mounted() {}
}
</script>

<style scoped>
.box {
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.1);
  display: grid;
  place-items: center;
}

.box div span:nth-child(1) {
  font-size: 200px;
  font-weight: 700;
}

.box div span:nth-child(2) {
  font-size: 80px;
  font-weight: 500;
}

.span_3:hover {
  cursor: pointer;
  color: #409eff;
}
</style>
