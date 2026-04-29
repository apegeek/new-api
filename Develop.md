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
ALTER USER postgres WITH PASSWORD 'moapi@3.14';
\q
exit
```

#### 4. 配置远程访问 (如需)
CentOS/阿里云的 PostgreSQL 配置文件路径与 Ubuntu 不同，通常在 `/var/lib/pgsql/data/`：
```bash
# 1. 编辑 postgresql.conf
vi /var/lib/pgsql/data/postgresql.conf
# 找到 #listen_addresses = 'localhost'，改为 listen_addresses = '*'

# 2. 编辑 pg_hba.conf
vi /var/lib/pgsql/data/pg_hba.conf
# 在末尾添加：
host    all             all             0.0.0.0/0               md5

# 3. 重启生效
systemctl restart postgresql
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
*   **改密码：** 找到 `# requirepass foobared`，去掉 `#`，改为 `requirepass moapi#3.1415`
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