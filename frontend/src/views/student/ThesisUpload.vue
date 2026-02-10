<template>
  <div class="thesis-upload-container">
    <h2>论文上传</h2>
    
    <el-card class="upload-card">
      <template #header>
        <div class="card-header">
          <span>上传新论文</span>
        </div>
      </template>
      
      <el-form :model="uploadForm" label-width="120px">
        <el-form-item label="论文类型" required>
          <el-select v-model="uploadForm.type" placeholder="请选择论文类型">
            <el-option label="盲审论文" value="blind" />
            <el-option label="查重论文" value="check" />
            <el-option label="终版论文" value="final" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="文件上传" required>
          <el-upload
            class="upload-demo"
            drag
            action="#"
            :auto-upload="false"
            :on-change="handleFileChange"
            :limit="1"
            v-model:file-list="fileList"
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
              拖拽文件到此处或 <em>点击上传</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                支持 PDF/Word 格式，文件大小不超过 50MB
              </div>
            </template>
          </el-upload>
        </el-form-item>
        
        <el-form-item v-if="uploadProgress > 0">
          <el-progress :percentage="uploadProgress" :status="uploadStatus" />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="submitUpload" :loading="uploading">提交上传</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    
    <el-card class="history-card">
      <template #header>
        <div class="card-header">
          <span>上传记录</span>
        </div>
      </template>
      
      <el-table :data="uploadHistory" style="width: 100%">
        <el-table-column prop="fileName" label="文件名" />
        <el-table-column prop="type" label="类型">
          <template #default="scope">
            <el-tag>{{ getTypeName(scope.row.type) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="uploadTime" label="上传时间" />
        <el-table-column prop="status" label="状态">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'success' ? 'success' : 'danger'">
              {{ scope.row.status === 'success' ? '上传成功' : '上传失败' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { UploadFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const uploadForm = ref({
  type: ''
})
const fileList = ref([])
const uploading = ref(false)
const uploadProgress = ref(0)
const uploadStatus = ref('')
const uploadHistory = ref([
  {
    fileName: '张三_盲审论文_v1.pdf',
    type: 'blind',
    uploadTime: '2026-03-15 14:30:00',
    status: 'success'
  }
])

const handleFileChange = (file) => {
  fileList.value = [file]
}

const getTypeName = (type) => {
  const map = {
    'blind': '盲审论文',
    'check': '查重论文',
    'final': '终版论文'
  }
  return map[type] || type
}

const submitUpload = () => {
  if (!uploadForm.value.type) {
    ElMessage.warning('请选择论文类型')
    return
  }
  if (fileList.value.length === 0) {
    ElMessage.warning('请选择文件')
    return
  }
  
  uploading.value = true
  uploadProgress.value = 0
  
  // 模拟上传过程
  const interval = setInterval(() => {
    uploadProgress.value += 10
    if (uploadProgress.value >= 100) {
      clearInterval(interval)
      uploading.value = false
      uploadStatus.value = 'success'
      ElMessage.success('上传成功')
      
      // 添加到记录
      uploadHistory.value.unshift({
        fileName: fileList.value[0].name,
        type: uploadForm.value.type,
        uploadTime: new Date().toLocaleString(),
        status: 'success'
      })
      
      // 重置表单
      fileList.value = []
      uploadForm.value.type = ''
      setTimeout(() => {
        uploadProgress.value = 0
      }, 2000)
    }
  }, 200)
}
</script>

<style scoped>
.thesis-upload-container {
  padding: 20px 0;
}
h2 {
  font-size: 18px;
  color: #1e3c72;
  margin-bottom: 20px;
}
.upload-card {
  margin-bottom: 20px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>