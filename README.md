# Thesis Defense System

## 整体架构

```
+---------------------------------------------+
|                前端层 (Vue 3)                |
|                                             |
| +---------+ +---------+ +---------+ +-------+ |
| | 学生端  | | 教师端  | | 教秘端  | | 管理端 | |
| +---------+ +---------+ +---------+ +-------+ |
|                                             |
+---------------------------------------------+
                      |
                      v
             HTTP + RESTful API
                      |
                      v
+---------------------------------------------+
|             Spring Boot单体应用              |
|                                             |
| +-----------------------------+             |
| |       控制层（Controller）      |             |
| +-----------------------------+             |
| |       业务层（Service）         |             |
| +-----------------------------+             |
| |      数据访问层（Mapper）       |             |
| +-----------------------------+             |
|                                             |
| +---------+ +---------+ +---------+ +-------+ |
| | MySQL   | | Redis   | | MinIO   | | 日志  | |
| | 8.0     | | 缓存    | | 文件存储| |       | |
| +---------+ +---------+ +---------+ +-------+ |
|                                             |
+---------------------------------------------+
```

## 开发运维工具

- **Git**：版本控制
- **Docker**：容器化
- **Docker Compose**：多容器管理
- **Nginx**：Web 服务器和反向代理
- **Postman**：API 测试工具
- **IDEA/VSCode**：集成开发环境

## 克隆代码

```bash
git clone https://gitee.com/the-dawn-of-light/thesis-defense-system-frontend.git
cd thesis-defense-system
```

## Docker 与 Docker Compose 使用指南

### 1. 安装 Docker 和 Docker Compose

#### Windows
1. 下载并安装 [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop)
2. 安装完成后，启动 Docker Desktop
3. 验证安装成功：
   ```bash
   docker --version
   docker-compose --version
   ```

#### macOS
1. 下载并安装 [Docker Desktop for Mac](https://www.docker.com/products/docker-desktop)
2. 安装完成后，启动 Docker Desktop
3. 验证安装成功：
   ```bash
   docker --version
   docker-compose --version
   ```

#### Linux
1. 安装 Docker：
   ```bash
   # Ubuntu/Debian
   sudo apt update
   sudo apt install docker.io docker-compose
   
   # CentOS/RHEL
   sudo yum install docker docker-compose
   
   # 启动 Docker 服务
   sudo systemctl start docker
   sudo systemctl enable docker
   ```
2. 验证安装成功：
   ```bash
   docker --version
   docker-compose --version
   ```

### 2. 项目结构

```
thesis-defense-system/
 ├── docker/                   # Docker相关配置
 │   ├── nginx/
 │   │   └── nginx.conf      # Nginx配置
 ├── docker-compose.yml       # Docker Compose配置
 └── README.md                # 项目说明
```

### 3. Docker Compose 配置

项目使用 `docker-compose.yml` 文件来配置和管理容器，当前配置包含以下服务：

- **MySQL 8.0.36**：数据库服务
- **Redis 7.2-alpine**：缓存服务
- **Nginx 1.28-alpine**：Web 服务器

### 4. 启动容器

在项目根目录执行以下命令：

```bash
docker-compose up -d
```

这将启动所有配置的容器，并在后台运行。

### 5. 查看容器状态

```bash
docker-compose ps
```

### 6. 停止容器

```bash
docker-compose down
```

### 7. 容器连接信息

#### MySQL
- **主机**：localhost
- **端口**：3306
- **用户名**：root
- **密码**：123456
- **数据库**：thesis_defense_system

#### Redis
- **主机**：localhost
- **端口**：6379
- **密码**：空

#### Nginx
- **访问地址**：http://localhost

### 8. 具体使用方法

#### 连接 MySQL

使用 MySQL 客户端连接：

```bash
# 使用 mysql 命令行工具
mysql -h localhost -P 3306 -u root -p123456 thesis_defense_system

# 使用 MySQL Workbench
# 主机：localhost
# 端口：3306
# 用户名：root
# 密码：123456
```

#### 连接 Redis

使用 Redis 客户端连接：

```bash
# 使用 redis-cli
redis-cli -h localhost -p 6379

# 使用 Redis Desktop Manager
# 主机：localhost
# 端口：6379
# 密码：（留空）
```

#### 访问 Nginx

在浏览器中访问：
```
http://localhost
```

### 9. 常见问题及解决方案

#### 端口占用问题

如果启动容器时遇到端口占用错误，可以修改 `docker-compose.yml` 文件中的端口映射：

```yaml
# 例如修改 MySQL 端口
mysql:
  ports:
    - "3307:3306"  # 将宿主机端口改为 3307
```

#### 容器启动失败

查看容器日志以了解失败原因：

```bash
docker-compose logs [服务名]
# 例如查看 MySQL 日志
docker-compose logs mysql
```

#### 数据持久化

MySQL 数据已配置持久化到 `mysql-data` 卷中，即使容器重启，数据也不会丢失。

### 10. 高级操作

#### 构建并启动容器

```bash
docker-compose up -d --build
```

#### 查看容器详细信息

```bash
docker-compose inspect [服务名]
```

#### 进入容器内部

```bash
docker-compose exec [服务名] /bin/bash
# 例如进入 MySQL 容器
docker-compose exec mysql /bin/bash
```

## 注意事项

- 确保 Docker Desktop（Windows/Mac）或 Docker 服务（Linux）已启动
- 首次启动可能需要较长时间，因为需要下载镜像
- 如需修改配置，请编辑 `docker-compose.yml` 文件后重新启动容器

