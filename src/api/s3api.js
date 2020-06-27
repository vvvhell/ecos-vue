import store from '../store/index'

var AWS = require("aws-sdk");
AWS.config.update({

		accessKeyId:'d18f4b611f2f71296e532eb30521c67e',
		secretAccessKey:'c285c6d63b13c0843e8d337e0c591177',
		s3ForcePathStyle: true,
		signatureVersion:'v4',
		region:'us-east-1'

});
// 连接亚马逊s3
//const ep = new AWS.Endpoint('https://s3.amazonaws.com');
// 连接ECOS服务器

export function InitAWS(ip){
	return ip;
}

const ep = new AWS.Endpoint(InitAWS(ip));
const s3 = new AWS.S3({endpoint: ep});
const iam = new AWS.IAM({endpoint: ep});

export function ConfigKey(AccessKeyId,SecretAccessKey){
	AWS.config.update({
		accessKeyId:AccessKeyId,
		secretAccessKey:SecretAccessKey
	})
}

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

export async function createKey(name){
	const params = {
		UserName:name,
	}
	try {
		const data = await iam.createAccessKey(params).promise();
		console.log(data);
		return data;
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

export async function listObjects(bucket) {
	const param = {
		Bucket: bucket + '/',
	};	
	try {
		const data = await s3.listObjects(param).promise();
		return data.Contents;
	} catch (e) {
		console.log(e);
		return e;
	}
}

export async function createBucket(name){
	const param = {
		Bucket: name + '/'
	};
	try {
		await s3.createBucket(param).promise();
		var response = '';
		function success(callback){
			var value = s3.createBucket(param).onAsync("httpHeaders",(200));
			callback(value);
		};
		success(value=>{
			console.log("value",value);
			response = 'OK'
		})
		console.log(response);
		return response;
	} catch (e) {
		console.log(e);
		return [];
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

export async function putObject(data, bucket, key){
	const params = {
		Body: data,
		Bucket: bucket,
		Key: key
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
		const data = await s3.getObject(params).promise();
		return data.Body;
	} catch (error) {
		console.log(error);
		return 0;
	}
}
//暂停后取消未下载完成的分片
export function abortDownload(bucket, key, range){
	const params = {
		Bucket: bucket,
		Key: key,
		Range: range,
	};
	try {
		s3.getObject(params).abort();
		console.log('abort',params.Range);
	} catch (e) {
		console.log(e);
		return e;
	}
}

export async function getUploadID(bucket, key){
	const params = {
		Bucket: bucket,
		Key: key,
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
			console.log("value",value.httpResponse);
			response = 'OK'
		})
		return response;
	} catch (e) {
		console.log(e);
		return 0;
	}
}

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

export async function abortUpload(bucket, key, uploadID){
	const params = {
		Bucket: bucket,
		Key: key,
		UploadId: uploadID
	};
	try {
		console.log(params.Bucket);
		const data = await s3.abortMultipartUpload(params).promise();
		console.log(data);
		return data;
	} catch (e) {
		console.log(e);
		return e;
	}
}

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

export async function listMultipartUploads(bucket, key){
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



