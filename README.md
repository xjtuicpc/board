# Board
the source of XJTU ACM Board

自动更新到 https://board.xjtuicpc.com

有问题请私戳周品良。

如果你不幸丢失了该网页数据，可以查看网页快照重新搭建 https://web.archive.org/web/20231002083701/https://board.xjtuicpc.com/
## About
这是一块基于 Hexo 框架和 Next 主题搭建的西安交通大学 ACM 校队信息板。

## Introduce
- **.github/workflows:** github action. 在 master 分支进行 push 操作后，自动触发并更新网页端的内容。
- **source:** 存放 .md 的地方
  - **_posts:** 各种日志。
  - **images:** 存放照片。
  - **about:** "关于" 部分。
  - **categories:** "分类" 部分。
  - **honor:** "获奖" 部分。
  - **tags:** "标签" 部分。
- **themes/next:** 主题渲染部分。
  - **_config.yml:** 负责控制网页页面布局。
- **_config.yml:** hexo 配置部分。
- **package.json:** node.json 配置部分。
  
## Start
使用 hexo 从头开始搭建博客，如果不感兴趣，请跳过。

参考文档：https://hexo.io/docs/

1. 按照文档中 OverView 部分配置 node.js 和 git 环境
2. 按照文档中 Setup 部分初始化你的项目，更改你的 _config.yml 配置，使用 hexo new 来生成文章。
3. 选择你想要的主题和渲染，git clone $THEME_URI themes/$THEME_NAME，hexo config theme $THEME_NAME
4. hexo generate 生成 ./public 的静态文件，你可以使用 hexo server 来进行本地测试，也可以选择配置 nginx 来部署到服务器上
5. 如果你选择配置 nginx 来部署到服务器上，配置 /etc/nginx/sites-available/board.xjtuicpc.com，将 location 挂在 /public 上
```bash
server {
    server_name board.xjtuicpc.com;

    location / {
        root /opt/board-new/public; //改这里
        index index.html;
        try_files $uri $uri/ =404;
    }

    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/board.xjtuicpc.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/board.xjtuicpc.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}
```

在 /etc/nginx/site-enabled/ 里创建一个软链，并重启 nginx 服务。
```bash
sudo ln -s /etc/nginx/sites-available/xjtuicpc.com /etc/nginx/sites-enabled/
sudo systemctl reload nginx
```
6. 如果你选择使用 github pages 来搭建网页

参考：https://hexo.io/docs/github-pages

在 Settings-Pages 配置 source 为 action

按照步骤来，即可访问 https://xjtuicpc.github.io/board

注意 _config.yml 中 root: /board/

如果你想将 board.xjtuicpc.com 定向到该网页，在 github Settings-Pages 添加 CNAME 网址 board.xjtuicpc.com，并在相应的域名解析中增添 CNAME 定向到 https://xjtuicpc.github.io/board/

如果通过 board.xjtuicpc.com 来访问，记得改成 _config.yml 中 root: /

## Reference
- https://hexo.io/docs/
- https://github.com/hexojs/hexo/
- https://github.com/theme-next/hexo-theme-next
- https://hexo.io/themes/#minimal
- https://fontawesome.com/search?o=r&ip=sharp-duotone%2Cduotone
- https://theme-next.js.org/
