cd D:\Workspace\Go\new-api-customize
$env:NODE_TYPE="slave"
$env:FRONTEND_BASE_URL="http://localhost:3002"
go run main.go


cd /mnt/d/Workspace/Go/new-api-customize/web-customize
bun install
bun run dev -- --port 3002



### 一、 PostgreSQL 安装与配置 (CentOS/阿里云 Linux)

#### 1. 安装命令
```bash
# 安装 PostgreSQL
yum install postgresql-server postgresql-contrib -y

# ！！！注意：红帽系系统安装完必须先初始化数据库！！！
postgresql-setup --initdb
```

#### 2. 启动并设置开机自启
```bash
systemctl start postgresql
systemctl enable postgresql
```

#### 3. 修改密码
```bash
su - postgres
psql
ALTER USER postgres WITH PASSWORD 'moapi3.14';
\q
exit
```

#### 4. 配置远程访问 (如需)
CentOS/阿里云的 PostgreSQL 配置文件路径与 Ubuntu 不同，通常在 `/var/lib/pgsql/data/`：
```bash
# 1. 编辑 postgresql.conf
vi /var/lib/pgsql/data/postgresql.conf
# 找到 #listen_addresses = 'localhost'，改为 listen_addresses = '*'
# port 24359
# 2. 编辑 pg_hba.conf
vi /var/lib/pgsql/data/pg_hba.conf
# 在末尾添加：
host    all             all             0.0.0.0/0               md5

# 3. 重启生效
systemctl restart postgresql

su - postgres
psql -U postgres -p 24359

psql -h localhost -p 24359 -U postgres -d postgres -W
# 输入密码，能连上就 OK

```
*(提示：使用 `vi` 编辑器时，按 `i` 键进入编辑模式，改完后按 `Esc`，输入 `:wq` 并回车保存退出)*



---

### 二、 Redis 安装与配置 (CentOS/阿里云 Linux)

#### 1. 安装命令
在某些比较老的 CentOS 上，Redis 需要先安装 EPEL 扩展源，建议一并执行：
```bash
# 安装 epel 扩展源（如果有提示已安装忽略即可）
yum install epel-release -y

# 安装 Redis
yum install redis -y
```

#### 2. 启动并设置开机自启
```bash
systemctl start redis
systemctl enable redis
```

#### 3. 修改密码与配置
CentOS 下 Redis 的配置文件默认直接在 `/etc/redis.conf`。
```bash
vi /etc/redis.conf
```
*   **改密码：** 找到 `# requirepass foobared`，去掉 `#`，改为 `requirepass moapi3.1415`
*   **外网访问：** 找到 `bind 127.0.0.1`，改为 `bind 0.0.0.0`（如果只在本地用，千万别改！）
*   ****: port: 7368
    firewall-cmd --zone=public --add-port=7368/tcp --permanent
    firewall-cmd --reload

*   **保存并重启：**
```bash
systemctl restart redis
```

---

### 三、 Nginx 安装与配置 (CentOS/阿里云 Linux)

#### 1. 安装命令
```bash
yum install nginx -y
```

#### 2. 启动并设置开机自启
```bash
systemctl start nginx
systemctl enable nginx
```

#### 3. 配置文件路径
*   Nginx 的主配置文件在：`/etc/nginx/nginx.conf`
*   如果你要加自定义站点的配置，建议进入 `/etc/nginx/conf.d/` 目录，新建以 `.conf` 结尾的文件（例如 `vi /etc/nginx/conf.d/myweb.conf`）。

每次改完 Nginx 配置，记得测试并重载：
```bash
nginx -t          # 测试配置有没有语法错误
nginx -s reload   # 平滑重启生效
```

---

### 四、Go安装

#### 1. 安装命令

```bash
yum install go
```
#### 2. 配置环境变量
```bash
go env -w GO111MODULE=on
go env -w GOPROXY=https://proxy.golang.org,direct
```
（可选）设置一下 Go 的拉取代理

### Node 安装与配置

#### 1. 安装命令
# 1. 下载并安装 nvm

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# 2. 刷新环境变量让 nvm 命令生效
source ~/.bashrc

# 3. 安装 Node.js 最新长期支持版
nvm install --lts
```

### 五、Git安装与配置
#### 1. 安装命令
```bash
yum install git -y
```

#### 2. 配置环境变量
```bash
git config --global user.name "apegeek"
git config --global user.email "daijiang@apegeek.com"
```

#### 3. SSH秘钥
```bash
ssh-keygen -t rsa -b 4096 -C "daijiang@apegeek.com"
```

#### 4. 获取秘钥
```bash
cat ~/.ssh/id_rsa.pub
```


### 六、安装Bun
#### 1. 安装命令
```bash
```

#### 2. 刷新配置
```bash
source /root/.bash_profile 
```

### 七、项目构建

#### 1、前端构建
```bash
cd web-customize
# 使用 bun 安装前端依赖
bun install

bun run build
```

#### 2. 复制定制前端
```bash
cp -r web-customize/dist web/dist
```

#### 3. 编译服务
```bash
cd 应用目录
go build -o new-api

# port: 3000
firewall-cmd --zone=public --add-port=3000/tcp --permanent
firewall-cmd --reload

./new-api

```

### 八、TLS 配置

#### 1.1 准备工作（必须先确认）
1. **域名已解析**：确保你在买域名的平台，已经把 `你的域名.com`（A 记录）指向了这台新加坡服务器的公网 IP。
2. **放行 443 端口**：
   * **去阿里云网页控制台**：实例 -> 安全组 -> 规则配置 -> 入方向，添加一条允许 TCP **443** 端口的规则（源IP填 `0.0.0.0/0`）。
   * **在服务器命令行**执行以下命令，确保内部防火墙也放行：
     ```bash
     firewall-cmd --zone=public --add-port=443/tcp --permanent
     firewall-cmd --reload
     ```

---

#### 1.2 写一个基础的 Nginx 配置文件 (80端口)
Certbot 会去读取 Nginx 的配置，寻找你的域名，所以我们需要先配一个简单的 HTTP 站点。

**1. 新建/编辑 Nginx 配置文件：**
```bash
vim /etc/nginx/conf.d/myweb.conf
```

**2. 写入以下内容（必须把 `你的域名.com` 换成你真实的域名）：**
```nginx
server {
    listen 80;
    server_name 你的域名.com; # 填你的真实域名，如果有www，写成：你的域名.com www.你的域名.com

    location / {
        root /usr/share/nginx/html; # 这里写你前端项目的打包目录
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }
}
```

**3. 保存退出，并重载 Nginx 使其生效：**
```bash
nginx -t          # 检查刚才写的有没有语法错误
systemctl reload nginx  # 重启生效
```

---

#### 1.3 安装 Certbot 工具

因为你的系统是基于红帽系的 Aliyun Linux 3，执行以下命令安装 Certbot 及其 Nginx 专属插件：

```bash
# 1. 安装 EPEL 扩展源
yum install epel-release -y

# 2. 安装 Certbot 和 Nginx 插件
yum install certbot python3-certbot-nginx -y
```

---

#### 1.4 一键自动生成并配置 HTTPS（见证奇迹）

安装完成后，执行这句“魔法命令”（注意替换你的域名）：

```bash
certbot --nginx -d 你的域名.com
```
*(如果你想同时让 `www.你的域名.com` 也支持，可以写成：`certbot --nginx -d 你的域名.com -d www.你的域名.com`)*

**执行后，屏幕上会依次跳出几个英文提示让你输入，按照以下说明回答：**

1. `Enter email address (used for urgent renewal and security notices)`
   👉 **输入你的真实邮箱**（然后回车）。
2. `Please read the Terms of Service at...` (同意服务条款)
   👉 输入大写字母 **`Y`**（然后回车）。
3. `Would you be willing, once your first certificate is successfully issued, to share your email...` (是否愿意分享邮箱发广告)
   👉 输入大写字母 **`N`**（然后回车）。
4. `Please choose whether or not to redirect HTTP traffic to HTTPS, removing HTTP access.` (是否自动把 HTTP 重定向到 HTTPS)
   👉 **这一步非常重要！强烈建议选择 `Redirect`（通常输入数字 `2` 然后回车）**。这样只要有人访问 80 端口，就会被自动强行跳转到安全的 443 端口。*(注：最新版本的 Certbot 可能会默认直接帮你做重定向而不再询问)*

---

#### 1.5 验证成果

如果屏幕最后显示：
🎉 **Congratulations! You have successfully enabled https://你的域名.com**
就说明大功告成了！

**你可以做两件事来检查：**
1. 打开浏览器，输入 `http://你的域名.com`，看看是不是自动跳到了 `https://`，并且地址栏左边出现了一把安全小锁 🔒。
2. 回到服务器，执行 `cat /etc/nginx/conf.d/myweb.conf` 看看。你会惊奇地发现，Certbot 已经像个机器人一样，帮你把里面的配置改头换面了：加上了 `listen 443 ssl`，自动填好了证书路径，并且帮你写好了 80 转 443 的跳转代码。你什么都不用操心。

---

#### 💡 终身免维护说明 (自动续期)

Let's Encrypt 证书有效期是 90 天，但 Certbot 安装时已经在你的 Linux 系统里注册了一个定时任务。它会每天偷偷醒来检查一次，只要发现证书寿命不足 30 天，就会自动续签，并自动帮你 `nginx -s reload`。

你可以运行这条命令，模拟一次续期测试：
```bash
certbot renew --dry-run
```
如果输出显示 `Congratulations, all simulated renewals succeeded`，这就意味着：**只要这台服务器不关机，你的网站一辈子都会拥有免费且自动更新的 HTTPS 证书！**