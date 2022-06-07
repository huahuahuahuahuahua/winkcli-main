const path = require('path');
const fs = require('fs');

// process.cwd(): 获取当前输入命令的路径
// fs.realpathSync: 返回解析的路径名，也就是项目的根目录
// 为什么不使用__dirname？因为__dirname获取的是当前文件的路径，我们需要拿到项目的根目录来设置文件的绝对路径
const appDirectory = fs.realpathSync(process.cwd());

const resolveAppPath = (relativePath) => path.resolve(appDirectory, relativePath);

const buildPath = 'dist';
const dllPath = resolveAppPath('dll')
const dllJsonFilename = "dll.manifest.json"
const appTsConfig = resolveAppPath('tsconfig.json')
const dllFilename = 'vendor.dll.js';

module.exports = {
  dotenv: resolveAppPath('.env'),
  appSrc: resolveAppPath('src'),
  appIndexJs: resolveAppPath('src/entrys/Index'),
  appBuildPath: resolveAppPath(buildPath),
  appPublic: resolveAppPath('public'),
  appHtml: resolveAppPath('public/index.ejs'),
  dllPath,
  dllFilename,
  dllFilenPath: `${dllPath}/${dllFilename}`,
  dllJsonFilename,
  dllJsonPath: `${dllPath}/${dllJsonFilename}`,
  appTsConfig,
  isUseTs: fs.existsSync(appTsConfig),
};

