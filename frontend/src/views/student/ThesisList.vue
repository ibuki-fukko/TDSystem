<template>
  <div class="thesis-list-container">
    <h2>我的论文列表</h2>
    
    <el-card>
      <el-table :data="thesisList" style="width: 100%">
        <el-table-column prop="title" label="论文题目" />
        <el-table-column prop="type" label="类型" width="120">
          <template #default="scope">
            <el-tag>{{ getTypeName(scope.row.type) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="version" label="版本" width="80" />
        <el-table-column prop="submitTime" label="提交时间" width="180" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag type="success">已提交</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250">
          <template #default="scope">
            <el-button size="small" @click="handlePreview(scope.row)">在线预览</el-button>
            <el-button size="small" type="primary" plain @click="handleDownload(scope.row)">下载</el-button>
            <el-button size="small" type="warning" plain @click="handleUpdate(scope.row)">替换/补充</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 预览对话框 -->
    <el-dialog v-model="previewVisible" title="论文预览" width="80%">
      <div class="preview-content">
        <p>此处为 PDF 预览区域（集成 PDF.js）</p>
        <p>当前预览文件：{{ currentThesis?.title }}</p>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const previewVisible = ref(false)
const currentThesis = ref(null)

const thesisList = ref([
  {
    id: 1,
    title: '基于深度学习的图像识别系统研究与实现',
    type: 'blind',
    version: 'v1.0',
    submitTime: '2026-03-15 14:30:00',
    status: 'submitted'
  },
  {
    id: 2,
    title: '基于深度学习的图像识别系统研究与实现',
    type: 'check',
    version: 'v1.0',
    submitTime: '2026-03-20 09:15:00',
    status: 'submitted'
  }
])

const getTypeName = (type) => {
  const map = {
    'blind': '盲审论文',
    'check': '查重论文',
    'final': '终版论文'
  }
  return map[type] || type
}

const handlePreview = (row) => {
  currentThesis.value = row
  previewVisible.value = true
}

const handleDownload = (row) => {
  ElMessage.success(`开始下载：${row.title}`)
}

const handleUpdate = (row) => {
  // 跳转到上传页面
  router.push('/student/thesis/upload')
}
</script>

<style scoped>
.thesis-list-container {
  padding: 20px 0;
}
h2 {
  font-size: 18px;
  color: #1e3c72;
  margin-bottom: 20px;
}
.preview-content {
  height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
  color: #909399;
}
</style>