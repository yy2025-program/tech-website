# AWS免费迁移方案指南

## 🎯 方案选择

### 方案1：S3 + CloudFront（最推荐）
**优势**：
- 完全免费（在免费额度内）
- 高性能CDN加速
- 高可用性和可扩展性
- 简单易管理

**适用场景**：静态网站（你的网站完全适合）

### 方案2：AWS Amplify
**优势**：
- 一键部署
- 自动CI/CD
- 内置域名和SSL
- Git集成

**适用场景**：需要持续集成的项目

## 🔧 方案1实施步骤：S3 + CloudFront

### 步骤1：创建S3存储桶
```bash
# 使用AWS CLI创建存储桶
aws s3 mb s3://your-website-bucket-name --region us-east-1

# 配置静态网站托管
aws s3 website s3://your-website-bucket-name \
    --index-document index.html \
    --error-document error.html
```

### 步骤2：上传网站文件
```bash
# 同步所有文件到S3
aws s3 sync . s3://your-website-bucket-name --delete

# 设置公共读取权限
aws s3api put-bucket-policy --bucket your-website-bucket-name --policy '{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::your-website-bucket-name/*"
        }
    ]
}'
```

### 步骤3：配置CloudFront CDN
```bash
# 创建CloudFront分发
aws cloudfront create-distribution --distribution-config '{
    "CallerReference": "website-'$(date +%s)'",
    "Comment": "Website CDN",
    "DefaultRootObject": "index.html",
    "Origins": {
        "Quantity": 1,
        "Items": [
            {
                "Id": "S3-origin",
                "DomainName": "your-website-bucket-name.s3.amazonaws.com",
                "S3OriginConfig": {
                    "OriginAccessIdentity": ""
                }
            }
        ]
    },
    "DefaultCacheBehavior": {
        "TargetOriginId": "S3-origin",
        "ViewerProtocolPolicy": "redirect-to-https",
        "TrustedSigners": {
            "Enabled": false,
            "Quantity": 0
        },
        "ForwardedValues": {
            "QueryString": false,
            "Cookies": {
                "Forward": "none"
            }
        }
    },
    "Enabled": true
}'
```

## 🔧 方案2实施步骤：AWS Amplify

### 步骤1：安装Amplify CLI
```bash
npm install -g @aws-amplify/cli
amplify configure
```

### 步骤2：初始化项目
```bash
amplify init
# 选择默认配置
# 选择你的AWS配置文件
```

### 步骤3：添加托管
```bash
amplify add hosting
# 选择 "Amazon CloudFront and S3"
# 选择 "DEV (S3 only with HTTP)"或"PROD (S3 with CloudFront using HTTPS)"
```

### 步骤4：部署
```bash
amplify publish
```

## 💰 费用估算

### 免费额度（12个月）：
- **S3**: 5GB存储，20,000 GET请求，2,000 PUT请求
- **CloudFront**: 50GB数据传输，2,000,000 HTTP请求
- **Lambda**: 100万请求，400,000 GB-秒
- **Amplify**: 1000构建分钟，5GB存储，15GB带宽

### 超出免费额度后的费用：
- **S3存储**: $0.023/GB/月
- **S3请求**: $0.0004/1000 GET请求
- **CloudFront**: $0.085/GB（前10TB）
- **Amplify**: $0.01/构建分钟，$0.023/GB存储

### 你的网站预估：
- 网站大小：约50MB
- 月访问量：假设1000次
- **预计费用**: $0（完全在免费额度内）

## 🎯 推荐配置

### 最佳实践配置：
1. **使用S3 + CloudFront**（方案1）
2. **启用HTTPS**（CloudFront免费提供）
3. **配置自定义域名**（可选）
4. **启用Gzip压缩**
5. **设置缓存策略**

### 域名选项：
1. **使用CloudFront域名**：完全免费
2. **使用自定义域名**：需要域名费用（约$12/年）
3. **使用AWS提供的免费子域名**

## 🔄 迁移步骤总结

### 准备阶段：
1. 确保有AWS账户
2. 安装AWS CLI
3. 配置AWS凭证

### 迁移阶段：
1. 创建S3存储桶
2. 上传网站文件
3. 配置静态网站托管
4. 设置CloudFront分发
5. 测试访问

### 优化阶段：
1. 配置缓存策略
2. 启用压缩
3. 设置监控
4. 配置自动部署（可选）

## 📊 GitHub Pages vs AWS对比

| 特性 | GitHub Pages | AWS S3+CloudFront |
|------|-------------|-------------------|
| 费用 | 免费 | 免费（额度内） |
| 性能 | 中等 | 高（全球CDN） |
| 可扩展性 | 有限 | 无限 |
| 自定义域名 | 支持 | 支持 |
| HTTPS | 支持 | 支持 |
| 构建时间 | 有时较慢 | 即时 |
| 存储限制 | 1GB | 5GB（免费） |
| 带宽限制 | 100GB/月 | 50GB/月（免费） |

## 🚀 额外优势

### AWS迁移后的额外功能：
1. **更好的性能**：全球CDN加速
2. **更高的可用性**：99.9%+ SLA
3. **更多集成选项**：Lambda、API Gateway等
4. **更好的监控**：CloudWatch指标
5. **更灵活的配置**：缓存、压缩、安全头等

### 未来扩展可能：
1. **添加后端API**：使用Lambda
2. **数据库集成**：DynamoDB
3. **用户认证**：Cognito
4. **实时功能**：WebSocket API
5. **AI服务集成**：真正的Amazon Q Business API
