const {series,src,dest,watch}=require('gulp');
const htmlClean = require('gulp-htmlclean');//HTML文件压缩插件
const less = require('gulp-less');//转换css代码插件
const cleanCss = require('gulp-clean-css');//压缩css代码插件
const stripDebug=require('gulp-strip-debug');//删除调试注释语句插件
const uglify=require('gulp-uglify');//压缩js代码插件
const imgMin = require('gulp-imagemin');//图片压缩插件
const connect = require('gulp-connect');//服务器插件
//方便修改路径
const folder={
    src:'src/',
    dist:'dist/'
}

function html(){
    return src(folder.src + 'html/*')
        .pipe(htmlClean())
        .pipe(dest(folder.dist + 'html/'))
        .pipe(connect.reload())//重新加载
}
function css(){
    return src(folder.src + 'css/*')
        .pipe(less())
        .pipe(cleanCss())
        .pipe(dest(folder.dist + 'css/'))
        .pipe(connect.reload())//重新加载
}
function js(){
    return src(folder.src + 'js/*')
        // .pipe(stripDebug())
        // .pipe(uglify())
        .pipe(dest(folder.dist + 'js/'))
        .pipe(connect.reload())//重新加载
}
function image(){
    return src(folder.src + 'images/*')
        .pipe(imgMin())
        .pipe(dest(folder.dist + 'images/'))
}
function server(cb){
    connect.server({
        port:1573,
        livereload:true//自动刷新
    });
    cb();
}
// 监听任务
watch(folder.src + 'html/*',function(cb){
    html();
    cb();
})
watch(folder.src + 'css/*',function(cb){
    css();
    cb();
})
watch(folder.src + 'js/*',function(cb){
    js();
    cb();
})
exports.default = series(html,css,js,image,server)