yarn install 

gulp  //运行 如报错 全局 安装 gulp

gulp prod  //打包


文件夹说明 

app  // 项目文件

dist // 打包生产后的文件包

base—>__redefine.scss  // 通用样式
helpers -> _mixins.scss  //通用变量方法设置
layout -> 通用组件样式
static // 静态文件夹

view 放置页面


@include border-radius(50%); //sass 通用变量方法
color:$whiteColor;  //sass 通用颜色变量方法

scss 写在 sass文件夹根目录下 例如(index.scss)
@charset "utf-8"; 必写



