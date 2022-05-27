<template>
  <Tree :data="treeData" show-checkbox multiple></Tree>
</template>
<script>
import { Tree } from 'view-design';
import cityData from "@/assets/city.data.4284";
export default {
  name: 'treeDefault',
  components: { Tree },
  data () {
    return {
      treeData: cityData
    }
  }
}
</script>
