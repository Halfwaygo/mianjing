<template>
    <div class="not-data-common">
        <span>
            <div class="no-data-stone-png"></div>
            <div class="tro">一个石头都没有</div>
        </span>
    </div>
</template>
<script>
export default {
    name: 'Modal'
}
</script>
<style lang="scss">
  .not-data-common {
      padding-top: 20%;
      width: 100%;
      height: 100%;
      display: table;
      text-align: center;
      span {
          vertical-align: middle;
        //   display: table-cell;
          .no-data-stone-png {
              margin: 0 auto;
              width: 129px;
              height: 121px;
          }
          .tro {
            color: #9A9A9A;
            font-size: 16px;
          }
      }
  }
</style>
