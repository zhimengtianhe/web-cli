//引入gulp
var gulp = require('gulp');
var babel = require('gulp-babel');
//引入组件
var jshint = require('gulp-jshint'),
    sass = require('gulp-sass'),
    //var concat = require('gulp-concat');
    uglify = require('gulp-uglify'),
    cssmin = require('gulp-minify-css'),
    clean = require('gulp-clean'),
    rev = require('gulp-rev'),
    useref = require('gulp-useref'),
    revReplace = require('gulp-rev-replace'),
    revCollector = require('gulp-rev-collector'),
    runSequence = require('gulp-sequence'),
    htmlmin = require('gulp-htmlmin'),
    replace = require('gulp-replace'),
    del = require('del'),
    connect = require('gulp-connect'),
    proxy = require('http-proxy-middleware');
    //var rename = require('gulp-rename');
    browserSync = require('browser-sync').create();

var path = {
    sass: 'app/sass/**/*.scss',
    css: 'app/static/css'
};
//清空文件夹，避免资源冗余
gulp.task('clean', function() {
    return gulp.src(['dist'], {
        read: false
    }).pipe(clean());
});

//检查JS脚本
gulp.task('lint', function() {
    gulp.src('app/js/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});
//编译sass 读取 编译 输出到新文件夹中
gulp.task('sass', function() {
    return gulp.src(path.sass)
        .pipe(sass())
        .pipe(gulp.dest(path.css));
});
//合并压缩文件
/*gulp.task('scripts',function(){
    //读取JS文件，合并，输出到新目录，重新命名，压缩，输出
    gulp.src('app/scripts/*.js')
    .pipe(concat('all.js'))
    .pipe(gulp.dest('app/dist'))
    .pipe(rename('all.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('app/dist'));
    //读取CSS文件，合并，输出到新目录，重新命名，压缩，输出
    gulp.src('static/css*.css')
    //.pipe(concat('all.css'))
    //.pipe(gulp.dest('app/dist'))
    //.pipe(rename('all.min.css'))
    .pipe(cssmin())
    .pipe(gulp.dest('static/css*.css'));
});*/
//拷贝images
gulp.task('copyimg', function() {
    return gulp.src('app/static/images/*.*')
        .pipe(gulp.dest('dist/static/images'));
});
/*gulp.task('copyvideo', function() {
    return gulp.src('app/static/video/*.*')
        .pipe(gulp.dest('dist/static/video'));
});
gulp.task('copypdf', function() {
    return gulp.src('app/static/pdf/*.*')
        .pipe(gulp.dest('dist/static/pdf'));
});*/
gulp.task('copyico', function() {
    return gulp.src('app/static/*.ico')
        .pipe(gulp.dest('dist/static'));
});


//css文件压缩，更改版本号，并通过rev.manifest将对应的版本号用json表示出来
gulp.task('cssmin', function() {
    return gulp.src('app/static/css/*.css')
        //.pipe( concat('wap.min.css') )
        .pipe(cssmin())
        .pipe(rev())
        .pipe(gulp.dest('dist/static/css'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('dist/rev/css'))
});

//拷贝js
gulp.task('copyjs', function() {
    return gulp.src([
        'app/static/js/html5.js', 
        'app/static/js/jquery.min.js',
        'app/static/js/axios.min.js',
        'app/static/js/jsencrypt.min.js',
        'app/static/js/qs.min.js'
    ])
    .pipe(gulp.dest('dist/static/js'));
});

gulp.task('jsmin', function() {
    return gulp.src([
        'app/static/js/*.js', 
        '!app/static/js/html5.js', 
        '!app/static/js/jquery.min.js',
        '!app/static/js/axios.min.js',
        '!app/static/js/jsencrypt.min.js',
        '!app/static/js/qs.min.js'
        ])
        //压缩js 
    
    .pipe(babel({
        presets:['es2015'] //es5检查机制
    }))
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest('dist/static/js'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('dist/rev/js'));
});


//通过hash来精确定位到html模板中需要更改的部分,然后将修改成功的文件生成到指定目录
gulp.task('rev', function() {
    return gulp.src(['dist/rev/**/*.json', 'app/**/*.html'])
        .pipe(revCollector())
        .pipe(gulp.dest('dist'));
});
//压缩HTML
gulp.task('htmlmin', function() {
    var options = {
        removeComments: true, //清除HTML注释
        collapseWhitespace: true, //压缩HTML
        collapseBooleanAttributes: true, //省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
        minifyJS: true, //压缩页面JS
        minifyCSS: true //压缩页面CSS
    };
    gulp.src('dist/**/*.html')
        .pipe(htmlmin(options))
        .pipe(gulp.dest('dist'));
});



gulp.task('clean:file', function(cb) {
    del(['dist'], cb)
});


//服务器插件中，监视文件并自动刷新
gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: 'app',
            middleware:proxy('/api', { // 代理解决跨域
                target: 'http://v.juhe.cn',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                },
                logLevel: 'debug'
            })
        },
        port:8050
    });
    gulp.watch(['app/static/js/*.js', path.sass, 'app/*.html'], function() {  // 监听 文件修改 热更新 页面
        gulp.run('lint', 'sass' /*,'scripts'*/ );
        browserSync.reload();
    });
});


//默认行为,直接调用服务器
/*gulp.task('default',function(){
    gulp.run('clean','sass','cssmin','rev','html');
});*/
gulp.task('default', function() {
    gulp.run('sass', 'serve');
});
gulp.task('prod', function(cb) {
    runSequence('clean', 'copyimg', 'copyico', 'copyjs', 'jsmin', 'cssmin', 'rev', 'htmlmin')(cb);
});