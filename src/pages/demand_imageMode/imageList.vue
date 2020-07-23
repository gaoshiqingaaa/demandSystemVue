<template>

  <div class="container-water-fall">
    <div class="filter" style="margin-left:10px">
      <el-select v-model="filter_type" placeholder="类型筛选">
        <el-option label="所有类型" value="all"></el-option>
        <el-option
          v-for="item in filterList.typeList"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>

      <el-select v-model="filter_executor" placeholder="执行人筛选">
        <el-option label="全部执行人" value="all"></el-option>
        <el-option
          v-for="item in filterList.userList"
          :key="item.id"
          :label="item.username"
          :value="item.id">
        </el-option>
      </el-select>

      <el-select v-model="filter_demand_user" placeholder="需求人筛选">
        <el-option label="全部需求人" value="all"></el-option>
        <el-option
          v-for="item in filterList.userList"
          :key="item.id"
          :label="item.username"
          :value="item.id">
        </el-option>
      </el-select>

      <el-select v-model="filter_rate" placeholder="评分筛选">
        <el-option label="全部评分" value="all"></el-option>
        <el-option label="优秀" value="0"></el-option>
        <el-option label="合格" value="1"></el-option>
        <el-option label="凑合" value="2"></el-option>
      </el-select>

      <el-date-picker
        style="margin-top:10px;"
        v-model="filter_timeRange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>

      <el-button type="primary" style="    padding: 10px 40px!important;" v-on:click="search()">查询</el-button>

    </div>
    <div class="masonry">
      <div v-for="item in data" :key="item.url" v-on:click="goToManuscript(item)" class="item">
        <div class="item_content content-mid">
          <div class="imageBox">
            <img :src="item.url" style="width:100%">
            <div style="margin-top: 10px">
              <img :src="item.executor.headimgurl" class="headImg" style="width:100%">
              <div>
                <span class="namebar">设计师  -  {{item.executor.nickname}}</span><br>
                <span class="namebar">项目名称  -  {{item.demandName}}</span><br>
                <span class="namebar">提交时间{{item.submitTime}}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<script>
  import vueWaterfallEasy from 'vue-waterfall-easy'

  import { getImageModeGetList,getFilter } from "@/api/api.manuscript.js"
  export default {
    components:{
      vueWaterfallEasy
    },
    data(){
      return{
        filter_type:null,
        filter_rate:null,
        filter_executor:null,
        filter_demand_user:null,
        filter_timeRange:null,

        data:[],
        options:[],
        filterList:[],
        filter:{
          companyID:null
        }

      }
    },
    mounted(){

      this.getImageList({companyID : this.$route.query.demand_company})
      this.getFilter()
    },
    computed:{
    },
    methods:{
      goToManuscript(data){
        console.log(data.demandID)
        console.log('asd',data)
        this.$router.push({name:'manuscript',query:{
            selectOssID:data.ossid,
            demand_id:data.demandID
          }})
      },
      search(){
        // console.log(this.filter_type)
        // console.log(this.filter_rate)
        // console.log(this.filter_executor)
        // console.log(this.filter_demand_user)
        let filter = {}
        if(this.filter_type !== null && this.filter_type !== 'all'){
          filter.filter_type = this.filter_type
        }

        if(this.filter_rate !== null && this.filter_rate !== 'all'){
          filter.filter_rate = this.filter_rate
        }

        if(this.filter_executor !== null && this.filter_executor !== 'all'){
          filter.filter_executor = this.filter_executor
        }

        if(this.filter_demand_user !== null && this.filter_demand_user !== 'all'){
          filter.filter_demand_user = this.filter_demand_user
        }

        if(this.filter_timeRange !== null){
          console.log()
          filter.timeRange = {
            startTime:new Date(this.filter_timeRange[0]).getTime(),
            endTime:new Date(this.filter_timeRange[1]).getTime()
          }
        }

        filter.companyID = this.$route.query.demand_company;


        this.getImageList(filter)

      },
      getNickName(data){
        if(data.nickname == null){
          return data.username
        }
        return data.nickname
      },
      async getFilter(){
        let result = await getFilter();

        this.filterList = result
      },
      async getImageList(filter){

        console.log('filter',filter)

        let result = await getImageModeGetList(filter)
        console.log(result)
        this.data = result
        console.log(this.data)
      },
    }
  }
</script>

<style>
  .imageBox{
    /*width: 30%;*/
    padding: 10px;
    background: #fff;
    border-radius: 10px;
    margin-left: 10px;
    overflow-x: hidden;
    /*float: left;*/
    margin-top: 20px;
  }
  .imageBox img{
    width:100%;
  }
  .headImg{
    float: left;
    width: 40px!important;
    height: 40px;
    border-radius: 50px;
  }
  .namebar{
    /*line-height: 40px;*/
    margin-left: 10px;
  }


  .masonry {
    margin-top: 10px;
    -moz-column-count:3; /* Firefox */
    -webkit-column-count:3; /* Safari 和 Chrome */
    column-count:3;
    width: 100%;
    /*margin:2em auto;*/
  }
  .item {
    /*padding: 2em;*/
    /*margin-bottom: 2em;*/
    -moz-page-break-inside: avoid;
    -webkit-column-break-inside: avoid;
    break-inside: avoid;
    /*background: #f60;*/
  }
</style>
