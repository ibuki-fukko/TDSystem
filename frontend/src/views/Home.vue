<template>
  <div class="home-container">
    <div class="home-header">
      <h1>欢迎使用本研教育管理系统</h1>
    </div>
    
    <div class="home-stats">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-icon blue">
                <el-icon><Calendar /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-number">{{ stats.batchCount }}</div>
                <div class="stat-label">答辩批次</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-icon green">
                <el-icon><User /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-number">{{ stats.studentCount }}</div>
                <div class="stat-label">学生人数</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-icon orange">
                <el-icon><Avatar /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-number">{{ stats.teacherCount }}</div>
                <div class="stat-label">教师人数</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-icon purple">
                <el-icon><Document /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-number">{{ stats.paperCount }}</div>
                <div class="stat-label">论文数量</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    
    <div class="home-recent">
      <h2>最近活动</h2>
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in recentActivities"
          :key="index"
          :timestamp="activity.time"
          :type="activity.type"
        >
          <el-card>
            <h4>{{ activity.title }}</h4>
            <p>{{ activity.description }}</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
    
    <div class="home-upcoming">
      <h2>即将到来的答辩</h2>
      <el-table :data="upcomingDefenses" style="width: 100%">
        <el-table-column prop="batchName" label="答辩批次" width="200" />
        <el-table-column prop="date" label="答辩日期" width="150" />
        <el-table-column prop="time" label="答辩时间" width="150" />
        <el-table-column prop="location" label="答辩地点" width="200" />
        <el-table-column prop="status" label="状态">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'pending' ? 'warning' : 'success'">
              {{ scope.row.status === 'pending' ? '待进行' : '已完成' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Calendar, User, Avatar, Document } from '@element-plus/icons-vue'

const userName = ref('管理员')

// 统计数据
const stats = ref({
  batchCount: 5,
  studentCount: 200,
  teacherCount: 50,
  paperCount: 180
})

// 最近活动
const recentActivities = ref([
  {
    title: '系统更新',
    description: '系统已更新至最新版本，新增了盲审分配功能',
    time: '2026-01-29 10:00',
    type: 'primary'
  },
  {
    title: '答辩批次创建',
    description: '创建了2026年春季答辩批次',
    time: '2026-01-28 15:30',
    type: 'success'
  },
  {
    title: '报名审核',
    description: '审核通过了100名学生的答辩报名',
    time: '2026-01-27 09:15',
    type: 'info'
  },
  {
    title: '盲审分配',
    description: '完成了2026年春季批次的盲审分配',
    time: '2026-01-26 14:20',
    type: 'warning'
  }
])

// 即将到来的答辩
const upcomingDefenses = ref([
  {
    batchName: '2026年春季答辩批次',
    date: '2026-02-15',
    time: '09:00-12:00',
    location: '教一101',
    status: 'pending'
  },
  {
    batchName: '2026年春季答辩批次',
    date: '2026-02-15',
    time: '14:00-17:00',
    location: '教一102',
    status: 'pending'
  },
  {
    batchName: '2026年春季答辩批次',
    date: '2026-02-16',
    time: '09:00-12:00',
    location: '教一101',
    status: 'pending'
  }
])

onMounted(() => {
  // 模拟从后端获取数据
  setTimeout(() => {
    // 实际项目中这里会调用API获取真实数据
  }, 500)
})
</script>

<style scoped>
.home-container {
  padding: 20px 0;
}

.home-header {
  margin-bottom: 30px;
}

.home-header h1 {
  font-size: 24px;
  color: #1e3c72;
  margin-bottom: 10px;
}

.home-header p {
  font-size: 14px;
  color: #606266;
  margin: 0;
}

.home-stats {
  margin-bottom: 30px;
}

.stat-card {
  height: 120px;
}

.stat-content {
  display: flex;
  align-items: center;
  height: 100%;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  margin-right: 20px;
}

.stat-icon.blue {
  background: rgba(103, 194, 237, 0.2);
  color: #67c2ed;
}

.stat-icon.green {
  background: rgba(104, 195, 163, 0.2);
  color: #68c3a3;
}

.stat-icon.orange {
  background: rgba(230, 162, 60, 0.2);
  color: #e6a23c;
}

.stat-icon.purple {
  background: rgba(160, 132, 255, 0.2);
  color: #a084ff;
}

.stat-info {
  flex: 1;
}

.stat-number {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: #606266;
}

.home-recent {
  margin-bottom: 30px;
}

.home-recent h2,
.home-upcoming h2 {
  font-size: 18px;
  color: #1e3c72;
  margin-bottom: 15px;
}

.home-upcoming {
  margin-top: 30px;
}

@media (max-width: 768px) {
  .el-col {
    flex: 100%;
    max-width: 100%;
  }
  
  .stat-card {
    margin-bottom: 20px;
  }
}
</style>