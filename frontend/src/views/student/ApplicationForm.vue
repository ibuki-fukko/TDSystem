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
        <el-form-item label="批次信息">
          <el-tag type="info">批次ID: {{ batchId }}</el-tag>
        </el-form-item>

        <el-form-item label="学生姓名">
          <el-input v-model="formData.studentName" disabled />
        </el-form-item>

        <el-form-item label="学生学号">
          <el-input v-model="formData.studentId" disabled />
        </el-form-item>

        <el-form-item label="论文标题" prop="thesisTitle">
          <el-input
            v-model="formData.thesisTitle"
            placeholder="请输入论文中文标题"
          />
        </el-form-item>

        <el-form-item label="论文英文标题" prop="englishTitle">
          <el-input
            v-model="formData.englishTitle"
            placeholder="请输入论文英文标题（选填）"
          />
        </el-form-item>

        <el-form-item label="关键词" prop="keywords">
          <el-input
            v-model="formData.keywords"
            placeholder="请输入关键词，多个关键词用逗号分隔"
          />
        </el-form-item>

        <el-form-item label="摘要" prop="abstract">
          <el-input
            v-model="formData.abstract"
            type="textarea"
            :rows="6"
            placeholder="请输入论文摘要"
          />
        </el-form-item>

        <el-form-item label="指导教师" prop="supervisor">
          <el-select
            v-model="formData.supervisor"
            placeholder="请选择指导教师"
            style="width: 100%"
          >
            <el-option
              v-for="teacher in teacherList"
              :key="teacher.id"
              :label="teacher.name"
              :value="teacher.id"
            />
          </el-select>
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

const router = useRouter()
const route = useRoute()
const formRef = ref(null)
const submitting = ref(false)

// 从查询参数获取批次ID
const batchId = ref(route.query.batchId || '')

// 模拟教师列表
const teacherList = ref([
  { id: 1, name: '张教授' },
  { id: 2, name: '李教授' },
  { id: 3, name: '王教授' },
  { id: 4, name: '赵副教授' },
  { id: 5, name: '陈副教授' }
])

// 表单数据
const formData = reactive({
  studentName: 'Student 1',
  studentId: '2024001',
  thesisTitle: '',
  englishTitle: '',
  keywords: '',
  abstract: '',
  supervisor: ''
})

// 表单验证规则
const rules = {
  thesisTitle: [
    { required: true, message: '请输入论文标题', trigger: 'blur' }
  ],
  keywords: [
    { required: true, message: '请输入关键词', trigger: 'blur' }
  ],
  abstract: [
    { required: true, message: '请输入论文摘要', trigger: 'blur' },
    { min: 50, message: '摘要至少需要50个字符', trigger: 'blur' }
  ],
  supervisor: [
    { required: true, message: '请选择指导教师', trigger: 'change' }
  ]
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    
    submitting.value = true
    
    // 模拟API调用
    setTimeout(() => {
      submitting.value = false
      ElMessage.success('申请提交成功！')
      
      // 跳转到我的申请页面
      router.push('/student/my-applications')
    }, 1500)
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

// 取消操作
const handleCancel = () => {
  router.push('/student/batch')
}

onMounted(() => {
  // 检查是否有批次ID
  if (!batchId.value) {
    ElMessage.warning('未指定批次ID，请从批次列表选择')
    router.push('/student/batch')
  }
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

.el-form {
  padding: 20px;
}
</style>
