var AWS = require("aws-sdk");
AWS.config.update({
		//accessKeyId:'AKIAX4SGBFHBY7F6646P', secretAccessKey:'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',
		accessKeyId:'AKIAIUXLGRW5TS4O42GQ', secretAccessKey:'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',
		s3ForcePathStyle: true,	

});
// 连接亚马逊s3
const ep = new AWS.Endpoint('https://s3.amazonaws.com');
// 连接ECOS服务器
// const ep = new AWS.Endpoint('http://219.223.197.224:8082');
const s3 = new AWS.S3({endpoint: ep});		

export async function listBuckets(){
	try {
		const data = await s3.listBuckets().promise();
		return data.Buckets;
	} catch (e) {
		console.log(e);
		return [];
	}
}

export async function listObjects(bucket) {
	const param = {
		Bucket: bucket,
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
		Bucket: name
	};
	try {
		const data = await s3.createBucket(param).promise();
		console.log(data);
		return data.Location;
	} catch (e) {
		console.log(e);
		return [];
	}
}

export function deleteBucket(name){
	const param = {
		Bucket: name
	};
	try {
		const data = s3.deleteBucket(param).promise();
		console.log(data);
		return data.Contents;
	} catch (e) {
		console.log(e);
		return [];
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
		return [];
	}
}

export async function getObject(bucket, key){
	const params = {
		Bucket: bucket,
		Key: key
	};
	try {
		const data = await s3.getObject(params).promise();
		console.log(data);
		return data.Body;
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
		return data.DeleteMarker;
	} catch (e) {
		console.log(e);
		return [];
	}
}

