import { ElMessage } from 'element-plus'

// 模拟延迟函数，模拟网络请求耗时
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// 1. 获取可报名批次列表
export async function getOpenBatches() {
  await delay(500)
  // 返回接口文档中的“获取所有批次列表”模拟数据
  return [
    {
      id: 202506,
      name: "2025年6月答辩批次",
      isEnrollmentOpen: true,
      allowBlindUpload: true,
      allowPlagiarismUpload: true,
      allowFinalUpload: false,
      isGroupingVisible: false,
      isActive: true,
      createdAt: "2025-01-15T10:30:00",
      // 为了兼容表格显示，这里转换一下字段名或保持原样，
      // 只要BatchList.vue里的prop对应上即可。
      // 假设BatchList.vue用的是 startDate/endDate，这里做个转换演示，
      // 或者您可以直接修改BatchList.vue适配下面的字段。
      startDate: "2025-01-01", 
      endDate: "2025-01-31",
      defenseStartDate: "2025-06-15",
      defenseEndDate: "2025-06-20",
      status: 'open' 
    },
    {
      id: 202412,
      name: "2024年12月答辩批次",
      isEnrollmentOpen: false,
      allowBlindUpload: false,
      allowPlagiarismUpload: false,
      allowFinalUpload: false,
      isGroupingVisible: true,
      isActive: false,
      createdAt: "2024-09-01T09:00:00",
      startDate: "2024-08-01",
      endDate: "2024-08-31",
      defenseStartDate: "2024-12-15",
      defenseEndDate: "2024-12-20",
      status: 'closed'
    }
  ]
}

// 2. 提交答辩申请
export async function submitApplication(data) {
  await delay(800)
  // 模拟成功响应
  return {
    code: 200,
    message: "success",
    data: "申请提交成功"
  }
}

// 3. 获取我的申请记录
export async function getMyApplications() {
  await delay(600)
  // 返回接口文档中的“学生获取自己的申请信息”模拟数据
  // 注意：文档返回的是单条对象，这里列表页可能需要数组。
  // 我们手动构造成数组格式。
  return [
    {
      id: 1,
      batchId: 202506,
      batchName: "2025年6月答辩批次", // 前端需要展示批次名
      studentId: "BY2506123",
      studentName: "张三",
      thesisTitle: "基于深度学习的图像识别算法研究",
      advisorName: "王教授", // 对应列表页的 supervisor
      supervisor: "王教授", // 兼容字段
      submissionTime: "2025-03-15 10:00:00",
      isRetake: false,
      status: 'pending' // 模拟状态
    },
    {
      id: 2,
      batchId: 202412,
      batchName: "2024年12月答辩批次",
      studentId: "BY2506123",
      studentName: "张三",
      thesisTitle: "旧的论文题目",
      advisorName: "李教授",
      supervisor: "李教授",
      submissionTime: "2024-09-10 09:00:00",
      status: 'approved' // 模拟状态
    }
  ]
}

// 4. 获取申请详情
export async function getApplicationDetail(id) {
  await delay(400)
  return {
    id: 1,
    batchId: 202506,
    studentId: "BY2506123",
    studentName: "张三",
    thesisTitle: "基于深度学习的图像识别算法研究",
    englishTitle: "Research on ...", 
    keywords: "深度学习, 图像识别",
    abstract: "本文研究了...",
    advisorName: "王教授",
    supervisor: 1, // 假设 1 是王教授的ID
    isRetake: false
  }
}

// 5. 取消申请
export async function cancelApplication(id) {
  await delay(500)
  return {
    code: 200,
    message: "success",
    data: "已取消"
  }
}

// 6. 获取指导教师列表
export async function getTeacherList() {
  await delay(300)
  return [
    { id: 1, name: '王教授' },
    { id: 2, name: '李教授' },
    { id: 3, name: '张教授' }
  ]
}

// 7. 论文上传
export async function uploadThesis(data) {
  await delay(1500) // 模拟上传慢
  return {
    code: 200,
    message: "success",
    data: "上传成功"
  }
}

// 8. 获取我的论文列表
export async function getMyTheses() {
  await delay(500)
  // 模拟数据
  return [
    {
      id: 1,
      title: "基于深度学习的图像识别算法研究",
      type: "blind",
      version: "v1.0",
      submitTime: "2025-04-10 14:00:00",
      status: "submitted",
      url: "https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf" // 测试PDF
    },
    {
      id: 2,
      title: "基于深度学习的图像识别算法研究",
      type: "check",
      version: "v1.0",
      submitTime: "2025-04-12 09:30:00",
      status: "submitted",
      url: "https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf"
    }
  ]
}