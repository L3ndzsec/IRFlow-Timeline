const fs = require("fs");

const updateBaseUrlRaw =
  process.env.IRFLOW_UPDATE_BASE_URL ||
  process.env.TLE_UPDATE_BASE_URL ||
  "";

const updateBaseUrl = updateBaseUrlRaw.replace(/\/+$/, "");
const updateChannel =
  process.env.IRFLOW_UPDATE_CHANNEL ||
  process.env.TLE_UPDATE_CHANNEL ||
  "latest";

const extraResources = [];
if (fs.existsSync("hayabusa")) {
  extraResources.push({ from: "hayabusa", to: "hayabusa", filter: ["**/*", "!logs/**"] });
}
if (fs.existsSync("tools/bmc-tools")) {
  extraResources.push({ from: "tools/bmc-tools", to: "tools/bmc-tools", filter: ["**/*"] });
}

const config = {
  appId: "com.dfir.irflow-timeline",
  productName: "IRFlow Timeline",
  // Keep physical artifact names identical to electron-updater's URL-safe
  // names so manual GitHub/S3 uploads cannot publish a broken update feed.
  artifactName: "IRFlow-Timeline-${version}-${arch}.${ext}",
  mac: {
    category: "public.app-category.developer-tools",
    icon: "assets/icon.icns",
    minimumSystemVersion: "12.0",
    // Hayabusa is already universal; @electron/universal refuses identical Mach-O
    // files unless they are explicitly allowed, so copy through while merging.
    x64ArchFiles: "**/{hayabusa/hayabusa}",
    target: [
      {
        target: "dmg",
        arch: ["universal"],
      },
      {
        target: "zip",
        arch: ["universal"],
      },
    ],
    darkModeSupport: true,
    hardenedRuntime: true,
    gatekeeperAssess: false,
    entitlements: "entitlements.mac.plist",
    entitlementsInherit: "entitlements.mac.plist",
  },
  // Notarization hooks are macOS-only — skipped on Windows builds
  ...(process.platform === "darwin" ? {
    afterSign: "scripts/notarize.js",
    afterAllArtifactBuild: "scripts/notarize-dmg.js",
  } : {}),
  win: {
    target: [{ target: "nsis", arch: ["x64"] }],
    // Use the SVG icon; electron-builder will rasterize it for Windows
    icon: "assets/icon.svg",
  },
  nsis: {
    oneClick: false,
    allowElevation: true,
    allowToChangeInstallationDirectory: true,
    createDesktopShortcut: true,
    createStartMenuShortcut: true,
    shortcutName: "IRFlow Timeline",
  },
  electronUpdaterCompatibility: ">=2.16",
  dmg: {
    title: "IRFlow Timeline",
    contents: [
      { x: 130, y: 220 },
      { x: 410, y: 220, type: "link", path: "/Applications" },
    ],
  },
  files: [
    "dist/**/*",
    "electron/**/*",
    "assets/**/*",
  ],
  extraResources,
  asarUnpack: [
    "node_modules/better-sqlite3/**",
  ],
  directories: {
    output: "release",
  },
  fileAssociations: [
    { ext: "csv", name: "CSV File", role: "Viewer" },
    { ext: "tsv", name: "TSV File", role: "Viewer" },
    { ext: "xlsx", name: "Excel File", role: "Viewer" },
    { ext: "plaso", name: "Plaso File", role: "Viewer" },
    { ext: "evtx", name: "EVTX File", role: "Viewer" },
    { ext: "mft", name: "MFT File", role: "Viewer" },
  ],
};

if (updateBaseUrl) {
  config.publish = [
    {
      provider: "generic",
      url: updateBaseUrl,
      channel: updateChannel,
      // AWS S3 supports a single byte range per GET request. The regional
      // virtual-hosted URL does not match electron-updater's built-in
      // s3.amazonaws.com heuristic, so disable multipart ranges explicitly.
      useMultipleRangeRequest: false,
    },
  ];
} else {
  // No update URL configured — set publish to null so electron-builder does
  // not auto-detect the git remote and write a stale app-update.yml into the
  // package. Without this the updater points at the upstream macOS repo and
  // logs a 404 on every launch.
  config.publish = null;
}

module.exports = config;
