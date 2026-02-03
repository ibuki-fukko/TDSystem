<template>
  <div class="batch-list-container">
    <h2>可报名批次列表</h2>
    
    <div class="filter-area">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索批次名称"
        clearable
        style="width: 200px; margin-right: 10px;"
      />
      <el-select
        v-model="filterStatus"
        placeholder="筛选状态"
        clearable
        style="width: 120px;"
      >
        <el-option label="开放报名" value="open" />
        <el-option label="已关闭" value="closed" />
      </el-select>
    </div>
    
    <el-card>
      <el-table :data="filteredBatches" style="width: 100%">
        <el-table-column prop="id" label="批次ID" width="80" />
        <el-table-column prop="name" label="批次名称" />
        <el-table-column prop="startDate" label="报名开始日期" />
        <el-table-column prop="endDate" label="报名结束日期" />
        <el-table-column prop="defenseStartDate" label="答辩开始日期" />
        <el-table-column prop="defenseEndDate" label="答辩结束日期" />
        <el-table-column prop="status" label="状态">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'open' ? 'success' : 'info'">
              {{ scope.row.status === 'open' ? '开放报名' : '已关闭' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button v-if="scope.row.status === 'open'" type="primary" size="small" @click="handleApply(scope.row)">
              报名
            </el-button>
            <el-button v-else type="info" size="small" disabled>
              已关闭
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
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
const searchKeyword = ref('')
const filterStatus = ref('')
const filteredBatches = computed(() => {
  return batchList.value.filter(batch => {
    // 按批次名称筛选
    const keywordMatch = batch.name.includes(searchKeyword.value)
    // 按状态筛选
    const statusMatch = !filterStatus.value || batch.status === filterStatus.value
    
    return keywordMatch && statusMatch
  })
})

const handleApply = (batch) => {
  router.push(`/student/application?batchId=${batch.id}`)
}
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
.filter-area {
  margin-bottom: 20px;
}
</style>