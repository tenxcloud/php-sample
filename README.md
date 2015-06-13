#IBOS系统
1.把文件夹放到一台装有docker的系统内

2.用终端进入该文件夹目录下

3.输入命令： `sudo docker build -t <image name>` . 等待构建

4.屏幕输出 Successfully built 4d35ffbf1d48 表示构建成功

5.终端输入 `sudo docker run -p 8080:80 <image name>` 启动IBOS项目

6.打开浏览器输入 ip:8080/upload 进入安装目录

Q&A

1.如果系统源文件有改动，想重新构建，只需要将upload目录更新即可
