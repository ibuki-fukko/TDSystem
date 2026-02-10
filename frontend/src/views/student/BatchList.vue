<template>
  <div class="batch-list-container">
    <h2>可报名批次列表</h2>
    <el-card>
      <el-table :data="batchList" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="批次ID" width="120" />
        <el-table-column prop="name" label="批次名称" />
        <!-- 接口未返回具体的起止日期，展示创建时间作为参考，或仅展示状态 -->
        <el-table-column prop="createdAt" label="创建时间">
          <template #default="scope">
            {{ formatDate(scope.row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="报名状态" width="120">
          <template #default="scope">
            <el-tag :type="scope.row.isEnrollmentOpen ? 'success' : 'info'">
              {{ scope.row.isEnrollmentOpen ? '开放报名' : '未开放' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-button 
              v-if="scope.row.isEnrollmentOpen" 
              type="primary" 
              size="small" 
              @click="handleApply(scope.row)"
            >
              报名
            </el-button>
            <el-button v-else type="info" size="small" disabled>
              不可报名
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getBatches } from '../../api/student' // 引入接口

const router = useRouter()
const batchList = ref([])
const loading = ref(false)

const formatDate = (isoString) => {
  if (!isoString) return '-'
  return new Date(isoString).toLocaleDateString()
}

const handleApply = (batch) => {
  router.push(`/student/application?batchId=${batch.id}`)
}

const loadData = async () => {
  loading.value = true
  try {
    // 接口文档：GET /batches
    const data = await getBatches()
    batchList.value = data
  } catch (error) {
    console.error('获取批次列表失败', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.batch-list-container {
  padding: 20px 0;
}
h2 {
  font-size: 18px;
  color: #1e3c72;
  margin-bottom: 20px;
}
</style>