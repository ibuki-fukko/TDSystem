<template>
  <div class="thesis-list-container">
    <h2>我的论文列表</h2>
    
    <el-card>
      <div style="margin-bottom: 20px;">
        <span>选择批次：</span>
        <el-select v-model="selectedBatchId" placeholder="请选择批次" @change="loadData">
          <el-option v-for="b in batches" :key="b.id" :label="b.name" :value="b.id" />
        </el-select>
      </div>

      <el-table :data="thesisList" style="width: 100%" v-loading="loading">
        <el-table-column prop="typeLabel" label="类型" width="120" />
        <el-table-column prop="fileName" label="文件名" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="100">
          <template #default>
            <el-tag type="success">已上传</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button size="small" type="primary" @click="handleDownload(scope.row)">下载</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getBatches, getMyApplication } from '../../api/student'

const loading = ref(false)
const batches = ref([])
const selectedBatchId = ref('')
const thesisList = ref([])

// 加载批次列表
const loadBatches = async () => {
  try {
    const data = await getBatches()
    batches.value = data
    if (data.length > 0) {
      selectedBatchId.value = data[0].id // 默认选中第一个
      loadData()
    }
  } catch (error) {
    console.error(error)
  }
}

// 加载指定批次的论文信息
const loadData = async () => {
  if (!selectedBatchId.value) return
  loading.value = true
  thesisList.value = []
  
  try {
    const data = await getMyApplication(selectedBatchId.value)
    if (data) {
      // 接口没有直接返回文件列表，而是作为字段返回，需要手动转换
      const list = []
      if (data.blindFilePath) {
        list.push({ typeLabel: '盲审论文', fileName: data.blindFilePath, type: 'blind' })
      }
      if (data.plagiarismFilePath) {
        list.push({ typeLabel: '查重论文', fileName: data.plagiarismFilePath, type: 'plagiarism' })
      }
      if (data.finalFilePath) {
        list.push({ typeLabel: '终版论文', fileName: data.finalFilePath, type: 'final' })
      }
      thesisList.value = list
    }
  } catch (error) {
    // 404 可能表示未申请，忽略错误
  } finally {
    loading.value = false
  }
}

const handleDownload = (row) => {
  // 根据 FileController 接口构造下载地址
  // GET /files/blind?batchId=...&fileName=...
  const baseUrl = `/api/files/${row.type}`
  const url = `${baseUrl}?batchId=${selectedBatchId.value}&fileName=${encodeURIComponent(row.fileName)}`
  window.open(url, '_blank')
}

onMounted(() => {
  loadBatches()
})
</script>

<style scoped>
.thesis-list-container { padding: 20px 0; }
h2 { font-size: 18px; color: #1e3c72; margin-bottom: 20px; }
</style>