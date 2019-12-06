<template>
  <div class="dashboard-editor-container">
    <div class=" clearfix">
      <github-corner style="position: absolute; margin-top:0; border: 0; right: 0;"/>
      <div class="info-container">
      </div>
    </div>
      <tools />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import PanThumb from '@/components/PanThumb'
import GithubCorner from '@/components/GithubCorner'
import Tools from '@/components/Tools'
export default {
  name: 'Dashboard',
  components: {PanThumb, GithubCorner, Tools },
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style lang="scss" scoped>
  .emptyGif {
    display: block;
    width: 45%;
    margin: 0 auto;
  }
  .dashboard-editor-container {
    /*background-color: #e3e3e3;*/
    min-height: 80vh;
    padding: 10px 60px 0px;
    .pan-info-roles {
      font-size: 12px;
      font-weight: 700;
      color: #333;
      display: block;
    }
    .info-container {
      position: relative;
      /*height: 150px;*/
      /*line-height: 200px;*/
      .display_name {
        font-size: 48px;
        line-height: 48px;
        color: #212121;
        position: absolute;
        top: 25px;
      }
    }
  }
</style>
