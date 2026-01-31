<template>
  <div class="my-applications-container">
    <h2>我的申请</h2>
    <el-card>
      <el-table :data="applicationList" style="width: 100%">
        <el-table-column prop="id" label="申请ID" width="100" />
        <el-table-column prop="batchName" label="批次名称" width="200" />
        <el-table-column prop="thesisTitle" label="论文标题" min-width="250" />
        <el-table-column prop="supervisor" label="指导教师" width="120" />
        <el-table-column prop="submissionTime" label="提交时间" width="180" />
        <el-table-column prop="status" label="状态" width="120">
          <template #default="scope">
            <el-tag
              :type="getStatusType(scope.row.status)"
            >
              {{ getStatusLabel(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              @click="handleView(scope.row)"
            >
              查看
            </el-button>
            <el-button
              v-if="scope.row.status === 'pending'"
              type="warning"
              size="small"
              @click="handleEdit(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              v-if="scope.row.status === 'pending'"
              type="danger"
              size="small"
              @click="handleCancel(scope.row)"
            >
              取消报名
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div v-if="applicationList.length === 0" class="empty-state">
        <el-empty description="暂无申请记录">
          <el-button type="primary" @click="handleGoToBatchList">去报名</el-button>
        </el-empty>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()

// 申请列表
const applicationList = ref([
  {
    id: 1001,
    batchName: '2026年春季答辩批次',
    thesisTitle: '基于深度学习的图像识别系统研究与实现',
    supervisor: '张教授',
    submissionTime: '2026-01-25 14:30:00',
    status: 'pending'
  },
  {
    id: 1002,
    batchName: '2025年秋季答辩批次',
    thesisTitle: '分布式系统中的一致性协议研究',
    supervisor: '李教授',
    submissionTime: '2025-09-15 10:20:00',
    status: 'approved'
  }
])

// 获取状态标签类型
const getStatusType = (status) => {
  const statusMap = {
    pending: 'warning',
    approved: 'success',
    rejected: 'danger',
    cancelled: 'info'
  }
  return statusMap[status] || 'info'
}

// 获取状态标签文本
const getStatusLabel = (status) => {
  const statusMap = {
    pending: '待审核',
    approved: '已通过',
    rejected: '已驳回',
    cancelled: '已取消'
  }
  return statusMap[status] || '未知'
}

// 查看申请详情
const handleView = (application) => {
  ElMessage.info(`查看申请 #${application.id}`)
  // 实际项目中这里会跳转到详情页面
  // router.push(`/student/application/${application.id}`)
}

// 编辑申请
const handleEdit = (application) => {
  ElMessage.info(`编辑申请 #${application.id}`)
  // 实际项目中这里会跳转到编辑页面
  // router.push(`/student/application/edit/${application.id}`)
}

// 取消申请
const handleCancel = async (application) => {
  try {
    await ElMessageBox.confirm(
      'Are you sure you want to cancel this application?',
      '确认取消',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 更新申请状态
    const app = applicationList.value.find(item => item.id === application.id)
    if (app) {
      app.status = 'cancelled'
    }
    ElMessage.success('申请已取消')
  } catch (error) {
    // 用户点击取消，不做任何操作
  }
}

// 前往批次列表
const handleGoToBatchList = () => {
  router.push('/student/batch')
}

onMounted(() => {
  // 模拟从后端获取申请列表
  setTimeout(() => {
    // 实际项目中这里会调用API获取真实数据
  }, 500)
})
</script>

<style scoped>
.my-applications-container {
  padding: 20px 0;
}

h2 {
  font-size: 18px;
  color: #1e3c72;
  margin-bottom: 20px;
}

.empty-state {
  padding: 40px 0;
  text-align: center;
}
</style>
