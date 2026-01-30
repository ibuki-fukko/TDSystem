<template>
  <div class="batch-management-container">
    <h2>答辩批次管理</h2>
    <el-card>
      <el-button type="primary" @click="handleCreateBatch">
        <el-icon><Plus /></el-icon>
        创建批次
      </el-button>
      <el-table :data="batchList" style="width: 100%; margin-top: 20px">
        <el-table-column prop="id" label="批次ID" width="80" />
        <el-table-column prop="name" label="批次名称" />
        <el-table-column prop="startDate" label="报名开始日期" />
        <el-table-column prop="endDate" label="报名结束日期" />
        <el-table-column prop="defenseStartDate" label="答辩开始日期" />
        <el-table-column prop="defenseEndDate" label="答辩结束日期" />
        <el-table-column prop="status" label="状态">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleEditBatch(scope.row)">
              编辑
            </el-button>
            <el-button type="info" size="small" @click="handleViewBatch(scope.row)">
              查看
            </el-button>
            <el-button type="warning" size="small" @click="handleChangeStatus(scope.row)">
              切换状态
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const batchList = ref([
  {
    id: 1,
    name: '2026年春季答辩批次',
    startDate: '2026-01-01',
    endDate: '2026-01-31',
    defenseStartDate: '2026-02-15',
    defenseEndDate: '2026-02-20',
    status: 'open'
  },
  {
    id: 2,
    name: '2025年秋季答辩批次',
    startDate: '2025-09-01',
    endDate: '2025-09-30',
    defenseStartDate: '2025-10-15',
    defenseEndDate: '2025-10-20',
    status: 'closed'
  }
])

const getStatusType = (status) => {
  const typeMap = {
    open: 'success',
    closed: 'info',
    pending: 'warning'
  }
  return typeMap[status] || 'info'
}

const getStatusText = (status) => {
  const textMap = {
    open: '开放报名',
    closed: '已关闭',
    pending: '待开始'
  }
  return textMap[status] || '未知状态'
}

const handleCreateBatch = () => {
  ElMessage.info('创建批次功能开发中')
}

const handleEditBatch = (batch) => {
  ElMessage.info(`编辑批次 ${batch.name}`)
}

const handleViewBatch = (batch) => {
  ElMessage.info(`查看批次 ${batch.name}`)
}

const handleChangeStatus = (batch) => {
  ElMessage.info(`切换批次 ${batch.name} 状态`)
}

onMounted(() => {
  // 模拟从后端获取批次列表
  setTimeout(() => {
    // 实际项目中这里会调用API获取真实数据
  }, 500)
})
</script>

<style scoped>
.batch-management-container {
  padding: 20px 0;
}

h2 {
  font-size: 18px;
  color: #1e3c72;
  margin-bottom: 20px;
}
</style>