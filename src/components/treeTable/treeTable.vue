<template>
  <div style="position:relative">
    <Spin fix v-if="loading"></Spin>

    <div :id="`${caseId}treeTable`" class="tree-table">
      <!-- 渲染表头 -->
      <div class="thead" ref="thead">
        <div class="tr" :style="{width: this.realTrWidth}">
          <template v-for="col in columns">
            <div
              class="td"
              :key="col.key"
              :style="buildTdStyle(col)">
              <span>{{ col.title }}</span>
            </div>
          </template>
        </div>
      </div>

      <div class="scroll-view" ref="scrollView" :style="{'max-height':maxHeight+'px'}">
        <!-- 渲染主体 body -->
        <div :id="`${caseId}tbody`" class="tbody" :style="tbodyStyle">
          <!-- 扩展高度 -->
          <div class="tr-expand" :style="`height:${getExpandHeight}px; z-index:${loading?'11':'9'};`"></div>
          <!-- 无数据时显示 -->
          <div class="table-box" v-if="dataSource.length===0">
            <div class="ivu-table">
              <div class="ivu-table-tip"><table cellspacing="0" cellpadding="0" border="0"><tbody><tr><td style="width: 1109px;"><span>暂无数据</span></td></tr></tbody></table></div>
            </div>
          </div>

          <!-- 动态生成tr -->
          <template v-for="(row, rowIndex) in dataSource">
            <!-- tr 只加载可见的和预加载的数据 -->
            <div
              v-if="
              rowIndex >= parseInt(`${scrollTop / rowHeight}`) &&
              rowIndex < (parseInt(`${scrollTop / rowHeight}`) + Math.ceil(maxHeight / rowHeight))"
              class="tr"
              :id="`${caseId}tbody-tr-${rowIndex}`"
              :style="buildTrStyle(rowIndex)"
              :key="rowIndex">
              <div
                class="td"
                v-for="col in columns"
                @click="handleCellClick(row, col, row[col.key])"
                :key="col.key"
                :style="buildTdStyle(col)">
                <!-- 此 v-for 只是为了拼接 id 字符串 -->
                <template v-for="(id,i) in [`${col.key}${row.id}`]">
                  <span :key="i" v-bind="buildProps(row,col)">
                    <template v-if="col.tree">
                      <template v-if="row.level">
                        <div class="cell-tree cell-tree-empty" v-for="level of Number(row.level)" :key="level"></div>
                      </template>
                      <div class="cell-tree" v-if="row.children && row.children.length">
                        <i class="cell-tree-fold" v-if="!row.unfold" @click="handleChildrenUnFold(row, row.children)"></i>
                        <i class="cell-tree-unfold" v-else @click="handleChildrenFold(row, row.children)"></i>
                      </div>
                    </template>
                    <table-expand
                      v-if="col.render"
                      :row="row"
                      :column="col"
                      :index="rowIndex"
                      :render="col.render">
                    </table-expand>
                    <template v-else>
                      {{ row[col.key] || "-" }}
                    </template>

                  </span>
                </template>
              </div>
            </div>
            <!-- -- tr end -- -->
          </template>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
    import TableExpand from './expand.js';
  /**
   * 随机生成字符串
   * @param length 字符串的长度
   * @param chats 可选字符串区间（只会生成传入的字符串中的字符）
   * @return string 生成的字符串
   */
  function randomString(length, chats) {
    if (!length) length = 1
    if (!chats) chats = '0123456789qwertyuioplkjhgfdsazxcvbnm'
    let str = ''
    for (let i = 0; i < length; i++) {
      let num = randomNumber(0, chats.length - 1)
      str += chats[num]
    }
    return str
  }

  /**
   * 随机生成数字
   *
   * 示例：生成长度为 12 的随机数：randomNumber(12)
   * 示例：生成 3~23 之间的随机数：randomNumber(3, 23)
   *
   * @param1 最小值 | 长度
   * @param2 最大值
   * @return int 生成后的数字
   */
  function randomNumber() {
    // 生成 最小值 到 最大值 区间的随机数
    const random = (min, max) => {
      return Math.floor(Math.random() * (max - min + 1) + min)
    }
    if (arguments.length === 1) {
      let [length] = arguments
    // 生成指定长度的随机数字，首位一定不是 0
      let nums = [...Array(length).keys()].map((i) => (i > 0 ? random(0, 9) : random(1, 9)))
      return parseInt(nums.join(''))
    } else if (arguments.length >= 2) {
      let [min, max] = arguments
      return random(min, max)
    } else {
      return Number.NaN
    }
  }

  // 行高，需要在实例加载完成前用到
  let rowHeight = 40

  export default {
    name: 'treeTable',
    components: {
      TableExpand
    },
    props: {
      // 列信息
      columns: {
        type: Array,
        required: true
      },
      // 数据源
      dataSource: {
        type: Array,
        required: true,
        default: () => []
      },
      // 页面是否在加载中
      loading: {
        type: Boolean,
        default: false
      },
      // 页面最大高度
      maxHeight: {
        type: Number,
        default: 400
      },
      // 是否禁用全部组件
      disabled: {
        type: Boolean,
        default: false
      },
      rowHeight: {
        type: Number,
        default: 40
      },
      rowKey: {
        type: String,
        default: "areaCode"
      }
    },
    data() {
      return {
        // caseId，用于防止有多个实例的时候会冲突
        caseId: `_lw-${randomString(6)}-`,
        // 存储document element 对象
        el: {
          treeTable: null,
          tbody: null
        },
        // 存储各个div的style
        style: {
          // 'max-height': '400px'
          tbody: { left: '0px' },
          // 左侧固定td的style
          tdLeft: { 'min-width': '4%', 'max-width': '45px' },
          tdLeftDs: { 'min-width': '30px', 'max-width': '35px' },
        },
        // 行数据
        rows: [],
        // 滚动条顶部距离
        scrollTop: 0,

      }
    },
    created() {
    },
    // 计算属性
    computed: {
      // expandHeight = rows.length * rowHeight
      getExpandHeight() {
        return this.rows.length * this.rowHeight
      },
      tbodyStyle() {
        let style = Object.assign({}, this.style.tbody)
        // style['max-height'] = `${this.maxHeight}px`
        style['width'] = this.realTrWidth
        return style
      },
      realTrWidth() {
        let calcWidth = 'calc('
        this.columns.forEach((column, i) => {
          let { width } = column
          if (typeof width === 'number') {
            calcWidth += width + 'px'
          } else if (typeof width === 'string') {
            calcWidth += width
          } else {
            calcWidth += '120px'
          }

          if (i < this.columns.length - 1) {
            calcWidth += ' + '
          }
        })
        calcWidth += ')'
        // console.log('calcWidth: ', calcWidth)
        return calcWidth
      }
    },
    // 侦听器
    watch: {
      dataSource: {
        immediate: true,
        handler: function (newValue) {
          // 兼容IE
          this.getElementPromise('tbody').then(() => {

            let rows = []

            newValue.forEach((data) => {
              let value = { id: this.caseId + data.id }
              let row = { id: value.id }
              this.columns.forEach(column => {
                // let inputId = column.key + value.id
                let sourceValue = (data[column.key] == null ? '' : data[column.key]).toString()
                
                value[column.key] = sourceValue

              })
              rows.push(row)
            })
            this.rows = rows

          })
        }
      }
    },
    mounted() {
      let vm = this
      /** 监听滚动条事件 */
      this.getElement('treeTable').onscroll = function (event) {
        vm.syncScrollBar(event.target.scrollLeft)
      }

      let { thead, scrollView } = this.$refs
      scrollView.onscroll = function (event) {

        thead.scrollLeft = event.target.scrollLeft
        vm.recalcTrHiddenItem(event.target.scrollTop)

      }

    },
    methods: {

      getElement(id, noCaseId = false) {
        if (!this.el[id]) {
          this.el[id] = document.getElementById((noCaseId ? '' : this.caseId) + id)
        }
        return this.el[id]
      },

      getElementPromise(id, noCaseId = false) {
        return new Promise((resolve) => {
          let timer = setInterval(() => {
            let element = this.getElement(id, noCaseId)
            if (element) {
              clearInterval(timer)
              resolve(element)
            }
          }, 10)
        })
      },

      /** 初始化列表 */
      initialize() {
        this.rows = []
        this.scrollTop = 0
        this.$nextTick(() => {
          this.getElement('tbody').scrollTop = 0
        })
      },      
      /** 重新计算需要隐藏或显示的tr */
      recalcTrHiddenItem(top) {
        let diff = top - this.scrollTop
        if (diff < 0) {
          diff = this.scrollTop - top
        }
        // 只有在滚动了百分之三十的行高的距离时才进行更新
        if (diff >= this.rowHeight * 0.3) {
          this.scrollTop = top
        }
      },
      /** 滚动到指定位置 */
      scrollToId(id) {
        var element = document.getElementById(id)
        if (element != null) {
          this.resetScrollTop(element.offsetTop);
          this.getElement('tbody').scrollTop = element.offsetTop
        }
      },
      /** 重置滚动条位置，参数留空则滚动到上次记录的位置 */
      resetScrollTop(top) {
        let { scrollView } = this.$refs
        if (top != null && typeof top === 'number') {
          scrollView.scrollTop = top
        } else {
          scrollView.scrollTop = this.scrollTop
        }
      },
      /** 辅助方法：替换${...}变量 */
      replaceProps(col, value) {
        if (value && typeof value === 'string') {
          value = value.replace(/\${title}/g, col.title)
          value = value.replace(/\${key}/g, col.key)
          value = value.replace(/\${defaultValue}/g, col.defaultValue)
        }
        return value
      },
      /** view辅助方法：构建 tr style */
      buildTrStyle(index) {
        return {
          'top': `${rowHeight * index}px`
        }
      },
      /** view辅助方法：构建 td style */
      buildTdStyle(col) {
        const isEmptyWidth = (column) => (column.width === '0px' || column.width === '0' || column.width === 0)

        let style = {}
        // 计算宽度
        if (col.width) {
          style['width'] = col.width + 'px'
        } else if (this.columns) {
          style['width'] = `${(120 - 4 * 2) / (this.columns.filter(column => !isEmptyWidth(column))).length}%`
        } else {
          style['width'] = '120px'
        }
        if (isEmptyWidth(col)) {
          style['padding-left'] = '0'
          style['padding-right'] = '0'
        }
        return style
      },
      /** view辅助方法：构造props */
      buildProps(row, col) {
        let props = {}
        // 解析props
        if (typeof col.props === 'object') {
          for (let prop in col.props) {
            if (Object.prototype.hasOwnProperty.call(col.props, prop)) {
              props[prop] = this.replaceProps(col, col.props[prop])
            }
          }
        }
        return props
      },

      // 展开节点
      handleChildrenUnFold(parent, children){
        parent.unfold = !parent.unfold;
        var level = parent.level || 0;
        if (!children || !children.length) return;
        for(var i = 0; i < this.dataSource.length; i++) {
          if (this.dataSource[i][this.rowKey] == parent[this.rowKey]) { // 在父级节点后面加入
            level ++;
            for (var j = 0; j < children.length; j++) {
              children[j].level = level;
              this.dataSource.splice(i+j+1, 0, children[j]);
            }
            break;
          }

        }
      },
      // 折叠节点
      handleChildrenFold(parent, children) {
        parent.unfold = false;
        if (!children || !children.length) return;
        for(var i = 0; i < this.dataSource.length; i++) {
          for (var j = 0; j < children.length; j++) {
            children[j].unfold = false;
            if (this.dataSource[i][this.rowKey] == children[j][this.rowKey]) {
              this.dataSource.splice(i, 1);
            }
            if (this.dataSource[i] && children[j].children && children[j].children.length) {
              for (var k = 0; k < children[j].children.length; k++) {
                if (this.dataSource[i][this.rowKey] == children[j].children[k][this.rowKey]) {
                  this.dataSource.splice(i, 1);
                }
              }
            }
          }
        }
      },

      // 格子事件
      handleCellClick(row, column, data) {
        this.$emit("on-cell-click", row, column, data);
      }

    }
  }
</script>

<style lang="less" scoped>

  /* 设定边框参数 */
  @borderColor: #e8e8e8;
  @border: 1px solid @borderColor;
  /* tr & td 之间的间距 */
  @spacing: 4px;

  .tree-table {
    max-width: 100%;
    overflow-x: hidden;
    overflow-y: hidden;
    position: relative;
    border: @border;

    .thead, .tbody {

      .tr, .td {
        display: flex;
      }

      .td {

        /*border-right: 1px solid red;*/
        /*color: white;*/
        /*background-color: black;*/
        /*margin-right: @spacing !important;*/

        padding-left: @spacing;
        border-right: @border;
        flex-direction: column;
        font-size: 14px;

        &.td-cb, &.td-num {
          min-width: 4%;
          max-width: 45px;
          margin-right: 0;
          padding-left: 0;
          padding-right: 0;
          justify-content: center;
          align-items: center;
        }

        &.td-ds {
          margin-right: 0;
          padding-left: 0;
          padding-right: 0;
          justify-content: center;
          align-items: center;

          .td-ds-icons {
            position: relative;
            cursor: move;
            width: 100%;
            /*padding: 25% 0;*/
            height: 100%;

            .anticon-align-left,
            .anticon-align-right {
              position: absolute;
              top: 30%;
            }

            .anticon-align-left {
              left: 25%;
            }

            .anticon-align-right {
              right: 25%;
            }
          }


        }

      }
      .cell-tree {
        display: inline-block;
        width: 17px;
        height: 17px;
        border: 1px solid #dcdee2;
        border-radius: 2px;
        background-color: #fff;
        line-height: 12px;
        cursor: pointer;
        vertical-align: middle;
        transition: color .2s ease-in-out,border-color .2s ease-in-out;
      }
      .cell-tree-empty {
        cursor: default;
        color: transparent;
        background-color: transparent;
        border-color: transparent;
      }
      .cell-tree-fold, .cell-tree-unfold {
        display: inline-block;
        height:17px;
        width:17px;
        position: relative;
        &:before{
          content: '';
          position: absolute;
          left:50%;
          top:50%;
          border-left:1px solid @borderColor;
          width: 10px;
          height:10px;
          margin-top: -6px;
          margin-left: -2px;
        }
        &:after{
          content: '';
          position: absolute;
          left:50%;
          top:50%;
          border-top:1px solid @borderColor;
          width: 10px;
          height:10px;
          margin-top: -2px;
          margin-left: -6px;
        }
      }
      .cell-tree-unfold::before{
        content:none;
      }

    }

    .thead {
      // overflow-y: scroll;
      overflow-x: hidden;
      border-bottom: @border;
      background-color: #f2f3f5;
      font-size:14px;
      font-weight: 700;

      /** 隐藏thead的滑块   */

      &::-webkit-scrollbar-thumb {
        box-shadow: none !important;
        background-color: transparent !important;
      }

      .tr {
        min-width: 100%;
        overflow-y: scroll;
      }

      .td {
        /*flex: 1;*/
        padding: 6px @spacing;
        justify-content: center;
      }

    }

    .tbody {
      position: relative;
      top: 0;
      left: 0;
      overflow-x: hidden;
      overflow-y: hidden;
      min-height: 36px;
      /*max-height: 400px;*/
      min-width: 100%;

      .tr-nodata {
        color: #999;
        line-height: 36px;
        text-align: center;
      }

      .tr {
        /*line-height: 50px;*/

        border-bottom: @border;
        transition: background-color 300ms;
        width: 100%;
        position: absolute;
        left: 0;
        z-index: 10;

        &.tr-checked {
          background-color: #fafafa;
        }

        &:hover {
          background-color: #E6F7FF;
        }

      }

      .tr-expand {
        position: relative;
        z-index: 9;
        background-color: white;
      }

      .td {
        padding: 5px @spacing;
        height: 39px;
        justify-content: center;

        &:last-child {
          padding-right: @spacing;
        }

        input {
          font-variant: tabular-nums;
          box-sizing: border-box;
          margin: 0;
          list-style: none;
          position: relative;
          display: inline-block;
          padding: 4px 11px;
          width: 100%;
          height: 32px;
          font-size: 14px;
          line-height: 1.5;
          color: rgba(0, 0, 0, 0.65);
          background-color: #fff;
          border: 1px solid #d9d9d9;
          border-radius: 4px;
          transition: all 0.3s;
          outline: none;

          &:hover {
            border-color: #4D90FE
          }

          &:focus {
            border-color: #40a9ff;
            box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
            border-right-width: 1px !important;
          }

          &:disabled {
            color: rgba(0, 0, 0, 0.25);
            background: #f5f5f5;
            cursor: not-allowed;
          }

          /* 设置placeholder的颜色 */

          &::-webkit-input-placeholder { /* WebKit browsers */
            color: #ccc;
          }

          &:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
            color: #ccc;
          }

          &::-moz-placeholder { /* Mozilla Firefox 19+ */
            color: #ccc;
          }

          &:-ms-input-placeholder { /* Internet Explorer 10+ */
            color: #ccc;
          }

        }

      }

    }

    .scroll-view {
      overflow: auto;
      overflow-y: scroll;
    }

    .thead, .thead .tr, .scroll-view {
      @scrollBarSize: 6px;
      /* 定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/

      &::-webkit-scrollbar {
        width: @scrollBarSize;
        height: @scrollBarSize;
        background-color: transparent;
      }

      /* 定义滚动条轨道 */

      &::-webkit-scrollbar-track {
        background-color: #f0f0f0;
      }

      /* 定义滑块 */

      &::-webkit-scrollbar-thumb {
        background-color: #eee;
        box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);

        &:hover {
          background-color: #bbb;
        }

        &:active {
          background-color: #888;
        }
      }

    }

    .thead .tr {

      &::-webkit-scrollbar-track {
        background-color: transparent;
      }

      /* IE模式下隐藏 */
      -ms-overflow-style: none;
      -ms-scroll-chaining: chained;
      -ms-content-zooming: zoom;
      -ms-scroll-rails: none;
      -ms-content-zoom-limit-min: 100%;
      -ms-content-zoom-limit-max: 500%;
      -ms-scroll-snap-type: proximity;
      -ms-scroll-snap-points-x: snapList(100%, 200%, 300%, 400%, 500%);
    }

  }

</style>