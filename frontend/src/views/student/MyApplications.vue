<template>
  <div class="my-applications-container">
    <h2>我的申请记录</h2>
    <el-card>
      <el-table :data="applicationList" style="width: 100%" v-loading="loading">
        <el-table-column prop="batchId" label="批次ID" width="100" />
        <el-table-column prop="thesisTitle" label="论文题目" show-overflow-tooltip />
        <el-table-column prop="advisorName" label="导师" width="100" />
        <el-table-column label="是否重修" width="100">
          <template #default="scope">
            {{ scope.row.isRetake ? '是' : '否' }}
          </template>
        </el-table-column>
        <!-- 接口返回数据中没有明确的 status 字段，根据返回的文件字段推断进度 -->
        <el-table-column label="当前状态" width="150">
          <template #default="scope">
            <el-tag v-if="scope.row.finalFilePath" type="success">终版已提交</el-tag>
            <el-tag v-else-if="scope.row.blindFilePath" type="warning">盲审中</el-tag>
            <el-tag v-else type="info">已报名</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button type="primary" link @click="handleUpload(scope.row)">上传论文</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <div v-if="!loading && applicationList.length === 0" class="empty-state">
        <el-empty description="暂无申请记录" />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getBatches, getMyApplication } from '../../api/student'

const router = useRouter()
const loading = ref(false)
const applicationList = ref([])

const loadData = async () => {
  loading.value = true
  applicationList.value = []
  try {
    // 1. 获取所有批次
    const batches = await getBatches()
    
    // 2. 并发查询每个批次的申请详情
    const promises = batches.map(batch => getMyApplication(batch.id).catch(() => null))
    const results = await Promise.all(promises)
    
    // 3. 过滤掉 null (未申请的批次后端可能报错或返回null)
    applicationList.value = results.filter(item => item !== null)
    
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const handleUpload = (row) => {
  // 跳转到上传页，带上批次ID
  router.push(`/student/thesis/upload?batchId=${row.batchId}`)
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.my-applications-container {
  padding: 20px 0;
}
h2 {
  font-size: 18px;
  color: #1e3c72;
  margin-bottom: 20px;
}
</style>