<template>
  <div class="thesis-upload-container">
    <h2>论文上传</h2>
    
    <el-card class="upload-card">
      <el-form :model="uploadForm" label-width="120px">
        <el-form-item label="批次ID">
          <el-input v-model="batchId" disabled style="width: 200px" />
        </el-form-item>
        
        <el-form-item label="学生学号">
          <el-input v-model="userInfo.username" disabled style="width: 200px" />
        </el-form-item>

        <el-form-item label="论文类型" required>
          <el-select v-model="uploadForm.type" placeholder="请选择论文类型">
            <el-option label="盲审论文" value="blind" />
            <el-option label="查重论文" value="plagiarism" />
            <el-option label="终版论文" value="final" />
          </el-select>
        </el-form-item>
        
        <el-form-item v-if="uploadForm.type === 'plagiarism'" label="查重率" required>
          <el-input-number 
            v-model="uploadForm.plagiarismRate" 
            :precision="3" 
            :step="0.001" 
            :max="1" 
            placeholder="如 0.056"
          />
          <span class="tip-text"> (请输入小数，如 5.6% 填 0.056)</span>
        </el-form-item>
        
        <el-form-item v-if="['blind', 'plagiarism'].includes(uploadForm.type)" label="论文题目" required>
           <el-input v-model="uploadForm.thesisTitle" placeholder="请确认论文题目" />
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
            <div class="el-upload__text">拖拽文件到此处或 <em>点击上传</em></div>
          </el-upload>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="submitUpload" :loading="uploading">提交上传</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { UploadFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { getUserProfile, uploadBlindThesis, uploadPlagiarismThesis, uploadFinalThesis } from '../../api/student'

const route = useRoute()
const batchId = ref(route.query.batchId ? Number(route.query.batchId) : '')
const userInfo = ref({ username: '' })

const uploadForm = ref({
  type: 'blind',
  plagiarismRate: 0,
  thesisTitle: ''
})
const fileList = ref([])
const uploading = ref(false)

const handleFileChange = (file) => {
  fileList.value = [file]
}

const loadUserInfo = async () => {
  try {
    const data = await getUserProfile()
    userInfo.value = data
  } catch (error) {
    console.error(error)
  }
}

const submitUpload = async () => {
  if (fileList.value.length === 0) {
    ElMessage.warning('请选择文件')
    return
  }
  if (!batchId.value) {
    ElMessage.error('缺少批次ID')
    return
  }

  uploading.value = true
  const file = fileList.value[0].raw
  const studentId = userInfo.value.username

  try {
    const formData = new FormData()
    formData.append('batchId', batchId.value)
    formData.append('studentId', studentId)
    formData.append('file', file)

    if (uploadForm.value.type === 'blind') {
      formData.append('thesisTitle', uploadForm.value.thesisTitle)
      await uploadBlindThesis(formData)
    } else if (uploadForm.value.type === 'plagiarism') {
      formData.append('plagiarismRate', uploadForm.value.plagiarismRate)
      await uploadPlagiarismThesis(formData)
    } else if (uploadForm.value.type === 'final') {
      await uploadFinalThesis(formData)
    }
    
    ElMessage.success('上传成功')
    fileList.value = [] // 清空文件
  } catch (error) {
    console.error(error)
  } finally {
    uploading.value = false
  }
}

onMounted(() => {
  loadUserInfo()
})
</script>

<style scoped>
.thesis-upload-container { padding: 20px 0; }
.tip-text { margin-left: 10px; color: #909399; font-size: 12px; }
</style>