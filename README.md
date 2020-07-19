# ecos-v2 Web Client

/**
 * @author chengyibo 1285168104@qq.com
 */
## Environment

`Node >= 6`

## Start

 - Clone or download this repository
 - Enter your local directory, and install dependencies:

``` bash
npm install
```

## Develop

``` bash
# serve with hot reload at localhost:8010
npm run dev
```

## Build

``` bash
# build for production with minification
npm run build
```

## 需要修改的s3 sdk源码

s3验证算法 node_modules\aws-sdk\lib\services\s3.js
v4签名算法 node_modules\aws-sdk\lib\signers\v4.js

## 后续需要优化的点

上传完成与下载完成后的内存释放