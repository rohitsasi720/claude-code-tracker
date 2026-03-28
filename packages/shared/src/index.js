// Shared types and utilities for claude-code-tracker

/**
 * @typedef {Object} HistoryEntry
 * @property {string} prompt - The user prompt text
 * @property {string} timestamp - ISO timestamp
 * @property {string} projectPath - Path to the project
 * @property {string} sessionId - Session identifier
 */

/**
 * @typedef {Object} Session
 * @property {string} id
 * @property {string} projectPath
 * @property {string} projectName
 * @property {string} summary
 * @property {number} messageCount
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {string} gitBranch
 * @property {string[]} leafMessageIds
 */

/**
 * @typedef {Object} DayActivity
 * @property {string} date - YYYY-MM-DD
 * @property {number} sessions
 * @property {number} prompts
 */

/**
 * @typedef {Object} ProjectStats
 * @property {string} name
 * @property {string} path
 * @property {number} sessionCount
 * @property {number} promptCount
 * @property {string} lastActive
 */

/**
 * @typedef {Object} DashboardData
 * @property {HistoryEntry[]} history
 * @property {Session[]} sessions
 * @property {DayActivity[]} activity
 * @property {ProjectStats[]} projects
 * @property {Object} meta
 */

module.exports = {};
