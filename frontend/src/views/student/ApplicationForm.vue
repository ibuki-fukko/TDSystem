<template>
  <div class="application-form-container">
    <h2>{{ isViewMode ? '查看申请' : isEditMode ? '编辑申请' : '答辩申请' }}</h2>
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
            :disabled="isViewMode"
          />
        </el-form-item>

        <el-form-item label="论文英文标题" prop="englishTitle">
          <el-input
            v-model="formData.englishTitle"
            placeholder="请输入论文英文标题（选填）"
            :disabled="isViewMode"
          />
        </el-form-item>

        <el-form-item label="关键词" prop="keywords">
          <el-input
            v-model="formData.keywords"
            placeholder="请输入关键词，多个关键词用逗号分隔"
            :disabled="isViewMode"
          />
        </el-form-item>

        <el-form-item label="摘要" prop="abstract">
          <el-input
            v-model="formData.abstract"
            type="textarea"
            :rows="6"
            placeholder="请输入论文摘要"
            :disabled="isViewMode"
          />
        </el-form-item>

        <el-form-item label="指导教师" prop="supervisor">
          <el-select
            v-model="formData.supervisor"
            placeholder="请选择指导教师"
            style="width: 100%"
            :disabled="isViewMode"
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
          <el-button 
            v-if="!isViewMode" 
            type="primary" 
            @click="handleSubmit" 
            :loading="submitting"
          >
            {{ isEditMode ? '更新申请' : '提交申请' }}
          </el-button>
          <el-button @click="handleCancel">{{ isViewMode ? '返回' : '取消' }}</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const formRef = ref(null)
const submitting = ref(false)

// 从查询参数获取批次ID
const batchId = ref(route.query.batchId || '')
// 获取应用ID和模式
const applicationId = ref(route.query.id || '')
const mode = ref(route.query.mode || 'create') // 'create', 'view', or 'edit'
const isViewMode = computed(() => mode.value === 'view')
const isEditMode = computed(() => mode.value === 'edit')
const isCreateMode = computed(() => mode.value === 'create')

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
      if (isEditMode.value) {
        ElMessage.success('申请更新成功！')
      } else {
        ElMessage.success('申请提交成功！')
      }
      
      // 跳转到我的申请页面
      router.push('/student/my-applications')
    }, 1500)
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

// 取消操作
const handleCancel = () => {
  if (isViewMode.value || isEditMode.value) {
    router.push('/student/my-applications')
  } else {
    router.push('/student/batch')
  }
}

onMounted(() => {
  // 检查是否有批次ID（仅在创建模式下需要）
  if (isCreateMode.value && !batchId.value) {
    ElMessage.warning('未指定批次ID，请从批次列表选择')
    router.push('/student/batch')
    return
  }
  
  // 如果是查看或编辑模式，加载现有申请数据
  if ((isViewMode.value || isEditMode.value) && applicationId.value) {
    loadApplicationData(applicationId.value)
  }
})

// 加载申请数据（模拟API调用）
const loadApplicationData = (id) => {
  // 模拟从后端获取数据
  const mockData = {
    1001: {
      batchId: '2026-spring',
      studentName: 'Student 1',
      studentId: '2024001',
      thesisTitle: '基于深度学习的图像识别系统研究与实现',
      englishTitle: 'Research and Implementation of Image Recognition System Based on Deep Learning',
      keywords: '深度学习,图像识别,卷积神经网络,计算机视觉',
      abstract: '本文研究了基于深度学习的图像识别系统，采用卷积神经网络架构，实现了高精度的图像分类与识别功能。系统能够自动提取图像特征，通过多层神经网络进行特征学习和分类决策。实验结果表明，该系统在多个标准数据集上取得了优异的性能表现。',
      supervisor: 1
    },
    1002: {
      batchId: '2025-autumn',
      studentName: 'Student 1',
      studentId: '2024001',
      thesisTitle: '分布式系统中的一致性协议研究',
      englishTitle: 'Research on Consistency Protocols in Distributed Systems',
      keywords: '分布式系统,一致性协议,Raft算法,共识机制',
      abstract: '本文深入研究了分布式系统中的一致性协议，重点分析了Raft共识算法的原理和实现。通过理论分析和实验验证，证明了该协议在保证数据一致性方面的有效性。本研究为构建高可用的分布式系统提供了理论基础和实践指导。',
      supervisor: 2
    }
  }
  
  // Convert id to number for lookup
  const data = mockData[Number(id)]
  if (data) {
    batchId.value = data.batchId
    formData.studentName = data.studentName
    formData.studentId = data.studentId
    formData.thesisTitle = data.thesisTitle
    formData.englishTitle = data.englishTitle
    formData.keywords = data.keywords
    formData.abstract = data.abstract
    formData.supervisor = data.supervisor
  }
}
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
