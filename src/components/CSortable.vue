<!--
 * @Description: 文件及简介
 * @Author: Cary
 * @Date: 2020-05-29 11:58:10
 * @FilePath: \alien-docsg:\CaryFile\project\project-resources\demandSystemVue\src\components\CSortable.vue
--> 
<template>
  <div class="c-st-contriner">
    <el-popover v-model="isVisable" placement="bottom" width="180">
      <div>
        <el-checkbox
          :indeterminate="isIndeterminate"
          v-model="checkAll"
          @change="handleCheckAllChange">全部</el-checkbox>
        <div class="c-tc-line"></div>
        <el-scrollbar
          ref="scrollbarUpdate"
          tag="div"
          :view-style="{ height: '180px' }"
          :noresize="false">
          <el-checkbox-group 
            v-model="checkedCities"
            @change="handleCheckedCitiesChange">
            <div v-for="(group, gi) in cities" :key="group.id">
              <div v-if="!!group[propChild]">
                <div class="c-st-group">{{ group[propVal] || '' }}</div>
                <div class="c-st-ckeck-box" v-for="item in group[propChild]" :key="item.id">
                  <el-checkbox :label="item[propKey]" >{{ item[propVal] }}</el-checkbox>
                </div>
                <div v-if="gi !== cities.length - 1" class="c-st-group-line"/>
              </div>
              <div v-else class="c-st-ckeck-box">
                <el-checkbox :label="group[propKey]" >{{ group[propVal] }}</el-checkbox>
              </div>
            </div>
          </el-checkbox-group>
        </el-scrollbar>
      </div>
      <div class="c-tc-line"></div>
      <div style="text-align: right; margin: 0">
        <el-button class="s-st-btn" type="text" size="mini" @click="handleQuery">筛选</el-button>
        <el-button class="s-st-btn" type="text" size="mini" @click="handleReset">重置</el-button>
      </div>
      <span slot="reference">
        {{ column['label'] }}
        <i v-show="!isVisable" class="el-icon-arrow-down"/>
        <i v-show="isVisable" class="el-icon-arrow-up"/>
      </span>
    </el-popover>
  </div>
</template>

<script>
const cityOptions = ['上海', '北京北京北京北京北京北京北京', '广州', '深圳'];
export default {
  components: {},
  props: {
    column: Object,
    list: Array,
    propKey: {
      type: String,
      default: 'id'
    },
    propVal: {
      type: String,
      default: 'value'
    },
    propChild: {
      type: String,
      default: 'children'
    }
  },
  watch: {
    list: {
      handler(val) {
        this.cities = val
        this.initListKey()
        this.$nextTick(() => {
          this.$refs['scrollbarUpdate'] && this.$refs['scrollbarUpdate'].update()
        })
      },
      immediate: true
    }
  },
  data() {
    return {
      isVisable: false,
      checkAll: false,
      checkedCities: [],
      cities: this.list,
      isIndeterminate: false,
      listKeys: []
    }
  },
  computed: {},
  mounted() {},
  methods: {
    initListKey() {
      let keys = []
      for (const item of this.cities) {
        if(!!item[this.propChild]) {
          let cs = item[this.propChild].map(e => e[this.propKey])
          keys = keys.concat(cs)
        } else {
          keys.push(item[this.propKey])
        }
      }
      this.listKeys = keys
    },
    handleCheckAllChange(val) {
      let keys = this.listKeys
      this.checkedCities = val ? keys : [];
      this.isIndeterminate = false;
      this.$emit('chagne', this.checkedCities)
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.listKeys.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.listKeys.length;
      this.$emit('chagne', this.checkedCities)
    },
    handleReset() {
      this.isVisable = false
      this.checkedCities = []
      this.$emit('chagne', this.checkedCities = [])
    },
    handleQuery() {
      this.isVisable = false
      this.$emit('chagne', this.checkedCities)
    }
  }
}
</script>

<style lang='scss'>
.c-st-contriner {
  
}
.c-st-ckeck-box {
  margin: 6px 0px;
  overflow: hidden;
}
.s-st-btn {
  padding: 0;
}
.c-tc-line {
  height: 1px;
  background-color: #EBEEF5;
  margin: 6px 0px;
}
.c-st-group {
  font-size: 12px;
  color: #AAB2B7;
  line-height: 30px;
}
.c-st-group-line {
  height: 1px;
  margin-top: 16px;
  margin-bottom: 10px;
  background-color: #f2f2f2;
}
</style>



