module.exports = {
    devServer: {
        hot: true,//自动保存
        open: true,//自动启动
    },
    chainWebpack : config => {
        config.plugin('html').tap(args => {
            args[0].title = ''
            return args
        }) 
    }
} 