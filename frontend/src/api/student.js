import request from '../utils/request'

// === 批次相关 (DefenseBatchController) ===

// 1. 获取所有批次列表 (公开接口)
export function getBatches() {
  return request({
    url: '/batches',
    method: 'get'
  })
}

// === 申请相关 (DefenseApplicationController) ===

// 2. 学生申请答辩
export function submitApplication(data) {
  return request({
    url: '/application/apply',
    method: 'post',
    data // JSON Body: { batchId, thesisTitle, isRetake, advisorId, advisorName ... }
  })
}

// 3. 学生获取自己的申请信息 (查询指定批次)
export function getMyApplication(batchId) {
  return request({
    url: '/application/my',
    method: 'get',
    params: { batchId } // Query Parameters
  })
}

// 4. 上传盲审论文 (Form Data)
export function uploadBlindThesis(data) {
  return request({
    url: '/application/upload/blind',
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data // FormData: { batchId, studentId, thesisTitle, file }
  })
}

// 5. 上传查重论文 (Form Data)
export function uploadPlagiarismThesis(data) {
  return request({
    url: '/application/upload/plagiarism',
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data // FormData: { batchId, studentId, plagiarismRate, file }
  })
}

// 6. 上传终版论文 (Form Data)
export function uploadFinalThesis(data) {
  return request({
    url: '/application/upload/final',
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data // FormData: { batchId, studentId, file }
  })
}

// === 分组相关 (DefenseGroupController) ===

// 7. 学生查询自己的分组
export function getMyGroup(batchId) {
  return request({
    url: '/groups/my',
    method: 'get',
    params: { batchId }
  })
}

// === 题目变更相关 (DefenseTopicRequestController) ===

// 8. 提交题目变更申请
export function submitTopicChange(data) {
  return request({
    url: '/topic-requests/apply',
    method: 'post',
    data // { batchId, newTitle, reason }
  })
}

// 9. 查询自己的题目变更申请记录
export function getTopicChangeHistory(batchId) {
  return request({
    url: '/topic-requests/my',
    method: 'get',
    params: { batchId }
  })
}

// === 用户信息 (UserController) ===

// 10. 获取个人信息
export function getUserProfile() {
  return request({
    url: '/users/profile',
    method: 'get'
  })
}