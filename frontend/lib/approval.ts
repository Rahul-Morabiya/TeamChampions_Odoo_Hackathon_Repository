// Approval logic helpers
import type { ApprovalRule, Expense } from "./types"
import { db } from "./db"

export function getRuleForUser(userId: string): ApprovalRule | undefined {
  return db.rules.find((r) => r.userId === userId)
}

export function advanceStatus(expense: Expense, decision: "approve" | "reject", byUserId: string) {
  const rule = getRuleForUser(expense.employeeId)
  expense.approvals.push({ approverId: byUserId, decision, at: new Date().toISOString() })
  if (decision === "reject") {
    expense.status = "rejected"
    return
  }
  if (!rule || rule.type === "sequential") {
    // Approve when all approvers approved in order
    const seq = (rule?.approvers || []).sort((a, b) => a.sequence - b.sequence)
    const approvedIds = new Set(expense.approvals.filter((a) => a.decision === "approve").map((a) => a.approverId))
    const allApproved = seq.every((a) => approvedIds.has(a.userId))
    expense.status = allApproved ? "approved" : "waiting"
    return
  }
  if (rule.type === "percentage" || rule.type === "hybrid") {
    const approvers = rule.approvers.map((a) => a.userId)
    const approvals = expense.approvals.filter((a) => a.decision === "approve" && approvers.includes(a.approverId))
    const percent = Math.round((approvals.length / Math.max(approvers.length, 1)) * 100)
    const required = rule.requiredPercent ?? 100
    if (percent >= required) expense.status = "approved"
    else expense.status = "waiting"
    return
  }
}
