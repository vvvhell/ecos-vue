import store from '../store/index'


var AWS = require("aws-sdk");
//更新AWS配置
AWS.config.update({

	accessKeyId:'d18f4b611f2f71296e532eb30521c67e',
	secretAccessKey:'c285c6d63b13c0843e8d337e0c591177',
	s3ForcePathStyle: true,
	signatureVersion:'v4',
	region:'us-east-1',

});
// 连接亚马逊s3
//const ep = new AWS.Endpoint('https://s3.amazonaws.com');
// 连接ECOS服务器
let ep = new AWS.Endpoint(store.state.interfaceIp);
let s3 = new AWS.S3({endpoint: ep});
let iam = new AWS.IAM({endpoint: ep});
//设置AWS服务IP地址
export function InitAWS(ip){
	s3.endpoint = ip;
	iam.endpoint = ip;
}
//配置s3的AccessKey
export function ConfigKey(AccessKeyId,SecretAccessKey){
	s3.config.update({
		accessKeyId:AccessKeyId,
		secretAccessKey:SecretAccessKey
	})
}
//从iam服务创建用户
export async function createUser(name){
	const params = {
		UserName:name,
	}
	try {
		const data = await iam.createUser(params).promise();
		console.log(data);
		return data;
	} catch (e) {
		console.log(e);
		return 0;
	}
}
//通过用户名创建AccessKey
export async function createKey(name){
	const params = {
		UserName:name,
	}
	try {
		const data = await iam.createAccessKey(params).promise();
		console.log(data);
		return data.AccessKey;
	} catch (e) {
		console.log(e);
		return 0;
	}
}

export async function listBuckets(){
	try {
		const data = await s3.listBuckets().promise();
		return data.Buckets;
	} catch (e) {
		console.log(e);
		return 0;
	}
}

export async function listObjects(bucket, signal, marker ) {
	const params = {
		Bucket: bucket + '/',
		MaxKeys:1000,
		Marker:marker
	};
	let abortsignal = signal;	
	try {		
		var request = s3.listObjects(params);
		var data = request.promise();
		if(abortsignal == false){
			return data;
		}else{
			console.log("abort",params);
			request.abort.bind(request);
			return 0;
		}			
	} catch (e) {
		console.log(e);
		return 0;
	}
}

export async function createBucket(name, acl){
	const param = {
		Bucket: name + '/',
		ACL: acl
	};
	try {
		await s3.createBucket(param).promise();
		var response = '';
		function success(callback){
			var value = s3.createBucket(param).onAsync("httpHeaders",(200));
			callback(value);
		};
		success(value=>{
			response = 'OK'
		})
		console.log(response);
		return response;
	} catch (e) {
		console.log(e);
		return 0;
	}
}

export async function deleteBucket(name){
	const params = {
		Bucket: name + '/'
	};
	try {
		const data = await s3.deleteBucket(params).promise();
		console.log(data);
		return data.Contents;
	} catch (e) {
		console.log(e);
		return e;
	}
}

export async function putObject(data, bucket, key, acl){
	const params = {
		Body: data,
		Bucket: bucket,
		Key: key,
		ACL: acl
	};
	try {
		const data = await s3.putObject(params).promise();
		console.log(data);
		return data.ETag;
	} catch (e) {
		console.log(e);
		return 0;
	}
}

export async function getObject(bucket, key, range){
	const params = {
		Bucket: bucket,
		Key: key,
		Range: range,
	};
	try {
		var request = s3.getObject(params);
		console.log(request);

		const data = await s3.getObject(params).promise();
		return data.Body;
	} catch (error) {
		console.log(error);
		return 0;
	}
}

export async function getUploadID(bucket, key, acl){
	const params = {
		Bucket: bucket,
		Key: key,
		ACL: acl
	};
	try {
		const data = await s3.createMultipartUpload(params).promise();
		console.log(data);
		return data.UploadId;
	} catch (e) {
		console.log(e);
		return 0;
	}
}
//上传文件分片
export async function uploadPart(body, bucket, key, partnumber, uploadID){
	const params = {
		Body: body,
		Bucket: bucket,
		Key: key,
		PartNumber: partnumber,
		UploadId: uploadID
	};
	try {
		//ETag暂时不做校验，校验时从响应header中获取ETag字段
    await s3.uploadPart(params).promise()
		var response = '';
		function success(callback){
			var value = s3.uploadPart(params).on("httpHeaders",(200));
			callback(value);
		};
		success(value=>{
			console.log("success");
			response = 'OK'
		})
		return response;
	} catch (e) {
		console.log(e);
		return 0;
	}
}
//获取已上传的分片
export async function uploadedParts(bucket, key, uploadID){
	const params = {
		Bucket: bucket,
		Key: key,
		UploadId: uploadID
	};
	try {
		const data = await s3.listParts(params).promise();
		console.log(data);
		return data.Parts;
	} catch (e) {
		console.log(e);
		return 0;
	}
}
//取消分片上传
export async function abortUpload(bucket, key, uploadID){
	const params = {
		Bucket: bucket,
		Key: key,
		UploadId: uploadID
	};
	try {
		console.log(params.Bucket);
		const data = await s3.abortMultipartUpload(params).promise();
		return data;
	} catch (e) {
		console.log(e);
		return 0;
	}
}
//完成分片上传
export async function completeUpload(bucket, key, uploadID, parts){
	const params = {
		Bucket: bucket,
		Key: key,
		UploadId: uploadID,
		MultipartUpload: {
			Parts: parts
		},
	};
	try {
		const data = await s3.completeMultipartUpload(params).promise();
		console.log(data);
		return data.Location;
	} catch (e) {
		console.log(e);
		return 0;
	}
}

export async function deleteObject(bucket, key){
	const params = {
		Bucket: bucket,
		Key: key 
	};
	try {
		const data = await s3.deleteObject(params).promise();
		console.log(data);
		return data;
	} catch (e) {
		console.log(e);
		return e;
	}
}
//列出桶内未完成的分片上传任务
export async function listMultipartUploads(bucket){
	const params = {
		Bucket: bucket + '/',
	};
	try {
		const data = await s3.listMultipartUploads(params).promise();
		console.log(data.Uploads);
		return data.Uploads;
	} catch (e) {
		console.log(e);
		return e;
	}
}



