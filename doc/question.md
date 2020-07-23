# bug 修改

> 所有 bug
https://docs.qq.com/sheet/DTGxpY2tERVhid0R6?tab=jqgbvv&c=E20A0Z0

## 序号 25 已修改 修改为当前用户名字 4个字限制

## 序号 26 已修改

- 1.未改的内容、默认不折叠、已改的内容 默认折叠起来 
- 2.将 未改、已改的 按钮 移动到时间后面

## 序号 27 已修改 , title 改成当前稿件的 name

## 序号 28 已修改  点击稿件的时候清空意见框内容

## 序号 29 已修改 , 清空中间缩略图


# 2020-05-27 解决 bug

## 序号 33  已修改

- 缩略图 上的关闭 层级提升
- 修改 复制的文字可以粘贴输入框中

## 序号 34 已修改 

- 1.点击复制后需同时复制 项目名称 + 稿件链接  两行信息
- 2.点击稿件链接应进入到对应的 交稿页面中去

* 注意: 复制到的内容 需要把 项目名称删除, 才能进到对应的交稿页面

## 已修改 网页标题为 需求系统


##############################################

aip 文档地址
https://demand.w.eolinker.com/#/home/ams/project/inside/api/list?groupID=-1&projectHashKey=XP6CH5d5d2e351e9a265ba9c99acbb5e56a380f4cc46652&spaceKey=demand

// 蓝湖地址 
https://lanhuapp.com/url/rqmxv-yU2vI

// 链接服务器测试地址 
// http://182.61.171.27:443

http://demo1.99client.com/#/

考拉:
https://lanhuapp.com/url/V29iN-jCPgU
考拉:
另外一个项目的 设计稿


> 2020-05-28 接任务, 完成以下功能, 需求列表, 两个表单, 登录页面

> 开始完成功能

#############################################

# 2020-05-28 已修改 以下内容

- 修改 需求列表页面点击项目名称进入 编辑页面

- 修改 新增需求 删除 对接人选择项

- 登录页面重做

- 添加功能 交稿页面 评分

- 添加功能 交稿页面 项目总结

- 修改 序号30 稿件序号问题 已修改

- 修改 序号 31 添加稿件的时候初始化意见

- 修改 把交稿页面 继续添加 改为 提交意见

做登录页面
两个颜色，最左侧蓝色：#1376A9，最右侧绿色：#7DCFCD


# 2020-05-29 修改内容

- 修改 序号 29 复制 
项目名称 asdfasdf
稿件链接 http://localhost:8000/#/share/manuscript?demand_id=32

- 修改不用登录就能看到 复制交稿页面的连接

- 修改 序号 30 显示多行文字

- 修改 序号 35 复制的时候出现多个提示问题

## 后台看问题

- 序号 31 后台需要修改接口, 添加用户字段

- 序号 32 后台需要修改接口

- 序号 33 后台正在添加

- 序号 37 

- 需要 39

## 暂不修补

- 序号 34 不做修改, 单页应用就是这样的

- 序号 36 可以上传文件, 不知道你测没有测, 我目前可以上传 pdf, 图片类型, txt, excel, word, ppt

- 序号 38 框架, 最优方案

- 需要 39 整体操作问题


# 2020-06-01 开发列表和表单页面

## 列表页面需要添加字段

- 实际耗时

- 备注 

- 获取备注列表

- 添加备注

- 修改备注

## 筛选项的添加功能

### 需求人 筛选项是一个树形结构

> 例如: 
- 植物医生部
  - A甲b_Eva
  - A甲b_芳芳
- 植物医生陈列部
  - A甲b_依依
  - A甲b_蜗牛


### 项目类型列表

- 短图排版

- 长途排版



### 执行人 筛选项是一个树形结构,

> 应该和 需求人一样的吧 

> 例如: 
- 第九工场
  - C乙b_卢梦
  - A甲b_雪男
  - A甲b_依依
  - A甲b_蜗牛


### 项目状态列表

- 等待执行

- 核对需求


## 提交需求这块内容改动

> 提交需求的内容改动的比较多点

- 可以添加多个稿件

- 可以添加多个附件

- 项目修改记录


> 以上这些都是设计图中体现出来的


# 6-2 修改评分




# 2020-06-05 修改

- 序号49 修改顶部导航 1 和 2 处 


-右图所示内容跟设计稿都有区别
1.1和2两处和设计稿位置不一样
2.3区域所有四字文字和设计稿显示不一样
3.项目名称显示位置和设计稿不一致

- 序号50 表格的文字都改成左对齐

> 不知道表格中文件非得表头排两行, 内容四个字排不下咋办........., 设计的一点都不灵活都是死把把的

- 序号51 表头去掉了下边框, 去掉上面间距

- 序号52 点击项目名称,和编号 打开新页面

- 序号54 

1. 定稿时间  改- 交稿时间 
2. 交稿时间  改- 提交时间

- 序号57 已改刷新不会出现那个导航条, 已改文字 上传文稿 改为 上传稿件







## config copy 和 congif_share.vue 对比文件功能差异

## congif_share.vue 差异

- 15 行 需要对接人

  <el-col :span="8">
    <el-form-item label="对接人" prop="reviewer_user">
      <el-select v-model="form.reviewer_user" placeholder="请选择对接人">
        <el-option v-for="(user, index) in userList" :label="user.nickname" :key="index" :value="user.id">
        </el-option>
      </el-select>
    </el-form-item>
  </el-col>

- 74 行 表单 尺寸

  <el-select v-model="form.img_size" placeholder="请选择或输入尺寸">
    <el-option v-for="size in sizeList" :label="size.size" :key="size.id" :value="size.id"></el-option>
  </el-select>

- 83 行 表单 设计分类

  <el-select v-model="form.demand_type" placeholder="请选择或输入设计分类" @change="handleDemandTypeChange">
    <el-option v-for="type in typeList" :label="type.name" :key="type.id" :value="type.id"></el-option>
  </el-select>

- 189 行 表单 添加附件

  <uploadAttachments :ref="`uploadAttachment${index}`" :attachmentData="item" :attachmentIndex="index"
    @deleteAttachment="deleteAttachment" @updateAttachmentInfo="updateAttachmentInfo">
  </uploadAttachments>

- 251 行 表单提交

  <el-button type="primary" :disabled="viewManuscriptDisabled" @click="gotoManuscriptPage">
    查看稿件({{ manuscript_count }})</el-button>
  <el-button type="primary" :disabled="submitDisabled" @click="onSubmit">提交</el-button>

- 273 行 导入公共用户

  import {
    publicLogin
  } from "@/api/api.user";

- 438 行

    mounted() {
      publicLogin().then(response => {
        this.$store.commit("setUserToken", response.data.token);
        this.$store.commit("setUserInfo", response.data.userInfo);
        this.$store.commit("setIsLogin", true);

        // 获取noble信息
        const _this = this;
        _this.init();
        _this.initClipboard();
        if (_this.$route.query.id) {
          _this.isEdit = true;
          _this.form.id = _this.$route.query.id;
          _this.getDemandDetail();
        }
      });
    },