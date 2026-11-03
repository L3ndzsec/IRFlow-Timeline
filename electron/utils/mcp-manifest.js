/**
 * mcp-manifest.js — Writes a live JSON manifest to userData so the standalone
 * IRFlow MCP server can discover the active per-tab SQLite databases without
 * needing any network connection to the running Electron process.
 *
 * Call init() once at startup, then refresh() after any tab open/close.
 */
const fs = require("fs");
const path = require("path");

let _userDataPath = null;

function init(userDataPath) {
  _userDataPath = userDataPath;
}

function refresh(databases, tabMeta) {
  if (!_userDataPath) return;
  const tabs = [];
  for (const [tabId, meta] of databases) {
    if (!meta?.db?.open || !meta.dbPath) continue;
    const tm = tabMeta?.get?.(tabId) || {};
    tabs.push({
      tabId,
      dbPath: meta.dbPath,
      fileName: tm.fileName || (tm.filePath ? path.basename(tm.filePath) : null) || `tab-${tabId}`,
      filePath: tm.filePath || null,
      sourceFormat: tm.sourceFormat || null,
      headers: meta.headers || [],
      rowCount: meta.rowCount || 0,
      tsColumns: meta.tsColumns || [],
      numericColumns: meta.numericColumns || [],
    });
  }
  try {
    fs.writeFileSync(
      path.join(_userDataPath, "mcp-manifest.json"),
      JSON.stringify({ tabs, updatedAt: new Date().toISOString() }, null, 2),
      "utf8"
    );
  } catch (_) {}
}

module.exports = { init, refresh };
