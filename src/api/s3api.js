var AWS = require("aws-sdk");
AWS.config.update({
		accessKeyId :'AKIAX4SGBFHBY7F6646P', secretAccessKey:'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',
});
// 连接亚马逊s3
// var ep = new AWS.Endpoint('https://s3.amazonaws.com');
// 连接ECOS服务器
// const ep = new AWS.Endpoint('http://219.223.195.242:8082');
const ep = new AWS.Endpoint('http://219.223.198.111:8082');
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
		return [];
	}
}

export function createBucket(name){
	var params = {
		Bucket:""
	};
	params.Bucket = name;
	s3.createBucket(params,function(err,data){
		if(err) console.log(err,err.stack);
		else console.log(data);
	})
}

export function deleteBucket(name){
	var params = {
		Bucket:""
	};
	params.Bucket = name;
	s3.deleteBucket(params,function(err,data){
		if(err) console.log(err,err.stack);
		else console.log(data);
	})
}

