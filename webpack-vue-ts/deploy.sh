let client = require('scp2');
const ora = require('ora');
const chalk = require('chalk');
const spinner = ora(chalk.green('正在发布到服务器...'))

spinner.start()
client.scp('./dist', { // 本地打包的路径
    'host': 'xxx.xxx.x.xxx', // 服务器的IP地址
    'post': '22', // 服务器的IP地址
    'username': 'xxxx', // 用户名
    'password': '*****', // 密码
    'path': '/opt/stu_app_website' // 项目需要部署到服务器的位置
}, err => {
    spinner.stop();
    if(!err) {
        console.log(chalk.green('项目发布完毕'))
    } else {
        console.log('err', err)
    }
})