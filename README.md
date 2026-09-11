```
██╗██████╗ ███████╗██╗      ██████╗ ██╗    ██╗
██║██╔══██╗██╔════╝██║     ██╔═══██╗██║    ██║
██║██████╔╝█████╗  ██║     ██║   ██║██║ █╗ ██║
██║██╔══██╗██╔══╝  ██║     ██║   ██║██║███╗██║
██║██║  ██║██║     ███████╗╚██████╔╝╚███╔███╔╝
╚═╝╚═╝  ╚═╝╚═╝     ╚══════╝ ╚═════╝  ╚══╝╚══╝

████████╗██╗███╗   ███╗███████╗██╗     ██╗███╗   ██╗███████╗
╚══██╔══╝██║████╗ ████║██╔════╝██║     ██║████╗  ██║██╔════╝
   ██║   ██║██╔████╔██║█████╗  ██║     ██║██╔██╗ ██║█████╗
   ██║   ██║██║╚██╔╝██║██╔══╝  ██║     ██║██║╚██╗██║██╔══╝
   ██║   ██║██║ ╚═╝ ██║███████╗███████╗██║██║ ╚████║███████╗
   ╚═╝   ╚═╝╚═╝     ╚═╝╚══════╝╚══════╝╚═╝╚═╝  ╚═══╝╚══════╝
```

**DFIR Forensic Timeline Analysis — Windows Edition**

> Windows port of [IRFlow Timeline](https://github.com/r3nzsec/irflow-timeline) — a high-performance forensic timeline viewer built on Electron + SQLite. Handles 30GB+ files and 150M+ rows without breaking a sweat.

---

## Features

- **Raw NTFS Artifact Import** — Direct ingestion of `$MFT` and `$UsnJrnl` (`$J`) with full path reconstruction, SI/FN timestamps, and change reason mapping
- **EVTX Analysis** — Windows Event Log parsing with full field extraction, provider resolution, and PayloadData mapping
- **Sigma Detection** — Dual-engine rule-based detection: bundled Hayabusa over raw `.evtx` folders + in-app JS Sigma engine for imported timelines
- **Process Inspector** — Parent-child process trees from Sysmon EID 1 and Security 4688 with 340+ MITRE ATT&CK chain rules
- **Lateral Movement Tracker** — Force-directed graph of logon events (4624/4625/4648) and RDP sessions
- **Persistence Analyzer** — 30+ persistence techniques with PowerShell 4104 script block reassembly and 0–10 risk scoring
- **NTFS Analysis Suite** — Ransomware Analytics, Timestomping (SI vs FN), File Activity Heatmap, ADS Analyzer, USN Journal Rewind, Resident Data Extraction
- **RDP Bitmap Cache Recovery** — Recover `bcache*.bmc` / `cache????.bin` artifacts with tile/collage previews
- **IOC Matching & VirusTotal Enrichment** — 17+ indicator types, auto-defanging, cached verdict badges, relationship pivoting
- **Conditional Formatting** — Color-code rows by any column value with custom rule sets
- **Sessions** — Save/restore your entire workspace: tabs, filters, tags, bookmarks, column layout

## Supported Formats

| Format | Description |
|---|---|
| CSV / TSV / TXT / LOG | Auto-delimiter detection, streaming import for multi-GB files |
| XLSX / XLS / XLSM | Streaming XLSX reader, SheetJS for legacy XLS, multi-sheet picker |
| EVTX | Windows Event Log binary — native parsing with full field extraction |
| $MFT | Raw NTFS Master File Table — path reconstruction, dual SI/FN timestamps |
| $J / $UsnJrnl | Raw USN Change Journal — change reason mapping, path resolution |
| Plaso | log2timeline/Plaso SQLite output — all event sources preserved |

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl+K` | Command palette |
| `Ctrl+O` | Open file |
| `Ctrl+E` | Export filtered view |
| `Ctrl+S` | Save session |
| `Ctrl+Shift+O` | Open session |
| `Ctrl+W` | Close tab |
| `Ctrl+Shift+Q` | Close all tabs |
| `Ctrl+F` | Focus search |
| `Ctrl+Shift+F` | Find in all tabs |
| `F3` / `Ctrl+→` | Next search match |
| `Shift+F3` / `Ctrl+←` | Previous search match |
| `Ctrl+B` | Toggle bookmarked only |
| `Ctrl+Shift+R` | Generate report |
| `Ctrl+Shift+C` | Column Manager |
| `Ctrl+Shift+L` | Conditional Formatting |
| `Ctrl+R` | Reset column widths |
| `Ctrl++` / `Ctrl+-` | Font size increase / decrease |
| `Ctrl+Shift+1–9` | Apply palette tag to selection |
| `Ctrl+C` | Copy selected rows |
| `Shift+F10` | Context menu (keyboard) |
| `Ctrl+/` | Shortcuts reference |

## Requirements

- Windows 10 / Windows Server 2019 or later (x64)
- No additional runtime required — the installer is fully self-contained

## Installation

Download the latest installer from [Releases](../../releases) and run it. Windows SmartScreen may prompt on first launch — click **More info → Run anyway**.

## Building from Source

**Prerequisites:**
- Node.js 20.x or 22.x
- Windows 10/11 x64 (for native module compilation)

```powershell
# Install dependencies (downloads the Electron-specific SQLite prebuilt automatically)
npm install

# Start dev server
npm run dev

# Build Windows installer
npm run dist:win:smoke
```

> **Note:** The project path must not contain spaces, or native module compilation will fail silently. If your path has spaces, create a junction:
> ```powershell
> cmd /c "mklink /j C:\irl ""D:\My Project\IRFlow-Timeline"""
> cd C:\irl
> npm install
> ```

## Tech Stack

- **Electron 30.5.1** — app shell (embeds Node.js v20.16.0)
- **React 18** — UI
- **Vite 6** — bundler
- **better-sqlite3 v12.11.1** — SQLite backend (Electron prebuilt, no compilation needed)
- **electron-builder 26** — installer packaging

## License

Apache License 2.0 — see [LICENSE](LICENSE) for details.

Original project by [r3nzsec](https://github.com/r3nzsec/irflow-timeline). Windows port maintained separately.
