<template>
  <div class="application-form-container">
    <h2>答辩申请</h2>
    <el-card>
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="120px"
        style="max-width: 800px"
      >
        <el-form-item label="批次ID">
          <el-tag type="info">{{ batchId }}</el-tag>
        </el-form-item>

        <el-form-item label="学生姓名">
          <el-input v-model="userInfo.realname" disabled />
        </el-form-item>

        <el-form-item label="学生学号">
          <el-input v-model="userInfo.username" disabled />
        </el-form-item>

        <el-form-item label="论文题目" prop="thesisTitle">
          <el-input v-model="formData.thesisTitle" placeholder="请输入论文题目" />
        </el-form-item>

        <el-form-item label="是否重修" prop="isRetake">
          <el-switch v-model="formData.isRetake" active-text="是" inactive-text="否" />
        </el-form-item>

        <!-- 接口文档未提供获取导师列表接口，改为手动输入 -->
        <el-form-item label="导师工号" prop="advisorId">
          <el-input v-model="formData.advisorId" placeholder="请输入导师工号" />
        </el-form-item>

        <el-form-item label="导师姓名" prop="advisorName">
          <el-input v-model="formData.advisorName" placeholder="请输入导师姓名" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit" :loading="submitting">
            提交申请
          </el-button>
          <el-button @click="handleCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { submitApplication, getUserProfile } from '../../api/student'

const router = useRouter()
const route = useRoute()
const formRef = ref(null)
const submitting = ref(false)
const batchId = ref(route.query.batchId ? Number(route.query.batchId) : '')

const userInfo = ref({
  realname: '',
  username: ''
})

const formData = reactive({
  thesisTitle: '',
  isRetake: false,
  advisorId: '',
  advisorName: ''
})

const rules = {
  thesisTitle: [{ required: true, message: '请输入论文题目', trigger: 'blur' }],
  advisorId: [{ required: true, message: '请输入导师工号', trigger: 'blur' }],
  advisorName: [{ required: true, message: '请输入导师姓名', trigger: 'blur' }]
}

const loadUserInfo = async () => {
  try {
    const data = await getUserProfile()
    userInfo.value = data
  } catch (error) {
    console.error('获取用户信息失败', error)
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    submitting.value = true
    
    // 构造接口所需的 JSON Body
    const payload = {
      batchId: batchId.value,
      thesisTitle: formData.thesisTitle,
      isRetake: formData.isRetake,
      advisorId: formData.advisorId,
      advisorName: formData.advisorName
      // studentId 和 studentName 后端可从 token 解析，不传或选传
    }

    await submitApplication(payload)
    ElMessage.success('申请提交成功')
    router.push('/student/my-applications')
  } catch (error) {
    console.error(error)
  } finally {
    submitting.value = false
  }
}

const handleCancel = () => {
  router.push('/student/batch')
}

onMounted(() => {
  if (!batchId.value) {
    ElMessage.warning('未指定批次ID')
    router.push('/student/batch')
    return
  }
  loadUserInfo()
})
</script>

<style scoped>
.application-form-container {
  padding: 20px 0;
}
h2 {
  font-size: 18px;
  color: #1e3c72;
  margin-bottom: 20px;
}
</style>