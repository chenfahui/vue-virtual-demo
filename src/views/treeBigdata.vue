<template>
  <Tree :data="treeData" show-checkbox multiple></Tree>
</template>
<script>
import { Tree } from 'view-design';
import cityData from "@/assets/city.data.10000";
export default {
  name: 'treeBigdata',
  components: { Tree },
  data () {
    return {
      treeData: cityData
    }
  }
}
</script>
