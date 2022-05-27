<template>
  <div>
    <Table
      :maxHeight="500"
      :columns="tableColumns"
      :data="tableData"
      :load-data="handleLoadData"
      row-key="value">
    </Table>
  </div>
</template>
<script>
import { Table } from "view-design";
import cityData from "@/assets/city.data.4284";
export default {
  name: "tableBigdata",
  components: {Table},
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
        }
      ]
    };
  },
  methods: {
    handleLoadData (item, callback) {
      setTimeout(() => {
        const data = [
          {
            id: '10100',
            name: 'John Brown',
            age: 18,
            address: 'New York No. 1 Lake Park'
          },
          {
            id: '10101',
            name: 'Joe Blackn',
            age: 30,
            address: 'Sydney No. 1 Lake Park'
          }
        ];
        callback(data);
      }, 2000);
    }
  }
};
</script>
