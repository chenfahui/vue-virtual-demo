<template>
    <div style="padding:30px;">
        <!-- <Tabs v-model="current" @on-click="handleTab">
            <TabPane label="treeDefault" name="treeDefault">4284条数据、Tree组件</TabPane>
            <TabPane label="treeBigdata" name="treeBigdata">10000条数据、Tree组件</TabPane>
            <TabPane label="tableDefault" name="tableDefault">20条数据、Table组件</TabPane>
            <TabPane label="tableBigdata" name="tableBigdata">10000条数据、Table组件</TabPane>
            <TabPane label="virtualScrolling" name="virtualScrolling">10000条数据、虚拟滚动</TabPane>
        </Tabs> -->
        <keep-alive>
            <router-view></router-view>
        </keep-alive>
    </div>
</template>
<script>
// import {Tabs, TabPane} from 'view-design';
export default {
    name: 'layout',
    // components: {Tabs, TabPane},
    data () {
        return {
            current: this.$route.name
        }
    },
    methods: {
        handleTab (name) {
            this.current = name;
            this.$router.push(name);
        }
    }
}
</script>
