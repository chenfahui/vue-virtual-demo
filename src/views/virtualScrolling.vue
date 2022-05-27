<template>
  <div>
    <tree-table
      :maxHeight="500"
      :rowHeight="40"
      :columns="tableColumns"
      :data-source="tableData"
      row-key="value">
    </tree-table>
  </div>
</template>
<script>
import treeTable from "@/components/treeTable";
import cityData from "@/assets/city.data.10000";
export default {
  name: "virtualScrolling",
  components: { treeTable },
  data() {
    return {
      tableData: cityData,
      tableColumns: [
        {
          title: "区域",
          key: "title",
          tree: true
        },
        {
          title: "邮编",
          key: "value"
        // },
        // {
        //   title: "输入框",
        //   render: (h, params) => {
        //     return h("input", {
        //       domProps: {
        //         value: params.row.value,
        //       },
        //       on: {
        //         input: function (event) {
        //           params.row.value = event.target.value;
        //         }
        //       }
        //     });
        //   }
        }
      ]
    };
  },
  mounted () {
    let list = [];
    for (let i = 0; i < 2000; i++) {
      list.push({
        value: "110120",
        title: "中关村科技园区" + i
      });
    }
    console.log(list);
  },
  methods: {}
};
</script>
