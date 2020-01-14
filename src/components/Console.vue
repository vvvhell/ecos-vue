<template>
  <div id="console">
    <el-container style="height:98vh">      
			<el-header style="height:130px">
				<span>ECOS | 管理控制台</span>
				<span style="float:right">
					<el-dropdown @command="handleCommand" trigger=click>
						<span class="el-dropdown-link" style="color:#302B43">
							<i class="el-icon-user"></i>
							username<i class="el-icon-arrow-down el-icon--right"></i>
						</span>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item command="about">关于</el-dropdown-item>
							<el-dropdown-item command="handleLogout">退出</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</span>
			</el-header>

			<el-container>
        <el-aside width="350px">
					<el-menu
						default-active="2-0"
						class="el-menu"
						@open="handleOpen"
						@close="handleClose"
						background-color="#a6a5c4"
						text-color="#322A54"
						active-text-color="#fff"
						:router="true">
						<el-menu-item index="1">
							<i class="el-icon-view"></i>
							<span slot="title">概览</span>					
						</el-menu-item>
						<el-submenu index="2">
							<template slot="title">
								<i class="el-icon-coin"></i>
								<span style="font-size:20px">Bucket列表</span>
							</template>
							<el-menu-item-group>
								<el-menu-item index="2-0">
										<el-autocomplete 
											type="text"
											class="select" 
											v-model="state" 
											placeholder="请输入Bucket名称"
											prefix-icon="el-icon-search"
											:fetch-suggestions="querySearch"
											@select="handleSelect"></el-autocomplete>
								</el-menu-item>								
								<el-menu-item v-for="(bucket) in buckets" v-bind:key="bucket.Name" @click="handleJump(bucket)">									
									<span>• {{bucket.Name}}</span>
									<el-button
										class="deleteicon" 
										size="small" 
										circle
										@click="handleDeleteBucket(bucket)">
										<i class="el-icon-delete" ></i>
									</el-button>					
								</el-menu-item>

							</el-menu-item-group>
						</el-submenu>						
					</el-menu>
				</el-aside>

        <el-container>
          <el-main>

						<!-- <el-row> 
							<el-card>
								<div class="overview"><span><i class="el-icon-monitor"></i>&nbsp; 概览数据</span></div>
								<el-divider></el-divider>
								<el-row :gutter="30">
									<el-col :span="7"><el-card>Bucket数量
										<div class="subview">{{bucketNum}} 个</div>
										</el-card></el-col>
									<el-col :span="7"><el-card>全部Bucket已用空间
										<div class="subview">{{totalVol}} G</div>
										</el-card></el-col>
									<el-col :span="7"><el-card>全部Bucket文件数
										<div class="subview">{{fileNum}} 个</div>
										</el-card></el-col>
								</el-row>
							</el-card>
						</el-row>
						<el-row style="margin-top:25px">
							<el-card>
								<div class="overview"><span><i class="el-icon-files"></i>&nbsp; Bucket管理</span></div>
								<el-divider></el-divider>
								<el-button type="primary" @click="createdrawer = true">创建Bucket</el-button>
							</el-card>
						</el-row> -->

						<el-row> 
							<el-card>
								<div class="overview"><span><i class="el-icon-monitor"></i>&nbsp; 概览数据</span></div>
								<el-divider></el-divider>
								<el-row :gutter="30">									
									<el-col :span="7"><el-card>已使用的存储空间
										<div class="subview1">{{bucketVol}} MB</div>
										</el-card></el-col>
									<el-col :span="7"><el-card>已存储的文件数量
										<div class="subview1">{{objectNum}} 个</div>
										</el-card></el-col>
								</el-row>
							</el-card>
						</el-row>
						<el-row style="margin-top:25px">
							<el-card>
								<el-button type="primary" icon="el-icon-plus" @click="uploadfile">上传文件</el-button>
								<el-table
									:data="tableData"
									height="380"
									stripe
									style="width: 100%">
									<el-table-column prop="Key" label="文件对象名" width="250">
									</el-table-column>
									<el-table-column label="文件大小" width="250">
										<template slot-scope="scope">
											{{scope.row.Size}}&nbsp; KB
										</template>	
									</el-table-column>
									<el-table-column label="操作">
										<template slot-scope="scope">											
											<el-button
												type="primary"
												size="mini"
												@click="handleDownload(scope)">下载</el-button>
											<el-button 
												type="info"
												size="mini"
												@click="handleInfo(scope)">详情</el-button>
											<el-button 
												size="mini"
												type="danger"
												@click="handlescope(scope)">删除</el-button>

											
      							</template>
									</el-table-column>
								</el-table>
							</el-card>
						</el-row>


					
					</el-main>
          
					<el-footer>北京大学•深圳研究生院</el-footer>

					<el-dialog
						title="提示"
						:visible.sync="deletevisible"
						width="30%">
						<span>确定删除文件吗？</span>
						<span slot="footer" class="dialog-footer">
							<el-button @click="deletevisible = false">取 消</el-button>
							<el-button type="primary" @click="handleDeleteObj(scope)">确 定</el-button>
						</span>
					</el-dialog>

					<el-drawer	class="about" :with-header="false" :visible.sync="drawer" >
						<div class="drawer-title">关于</div>
						<div style="margin-bottom:5px">拟态对象存储系统 | ECOS</div><div style="margin-bottom:5px">版本号：V2.0</div><div>版权所有：北京大学深圳研究生院•未来网络实验室</div>
					</el-drawer>

					<el-drawer class="createbucket" :with-header="false" :visible.sync="createdrawer" :show-close="true">
						<div class="drawer-title">创建Bucket</div>
						<div style="width:90%">
							<el-input placeholder="请输入创建的Bucket名称" v-model='newBucketName' :clearable="true"></el-input>
						</div>
						<div class="drawer-body">
							<el-button @click="handleCancel">取 消</el-button><el-button type="primary" @click="handleCreate">创 建</el-button>
						</div>
					</el-drawer>

					<el-drawer	class="detaildrawer" :with-header="false" :visible.sync="detaildrawer">
						<div class="drawer-title">文件详情</div>
						<div style="margin-bottom:20px"><span style="display: inline-block; width: 100px">文件名:</span>{{objectName}}</div>
						<div style="margin-bottom:20px"><span style="display: inline-block; width: 100px">Etag:</span>{{Etag}}</div>
						<div><span style="display: inline-block; width: 100px">修改时间:</span>{{LastModified}}</div>
					</el-drawer>

        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script type="text/ecmascript-6">
import { S3 } from 'aws-sdk';
import '../api/s3api'
import { listBuckets, createBucket, listObjects, deleteBucket } from '../api/s3api';
export default {
  data() {

    return {
			buckets:[],
			state:'',
			bucketNum: '',
			totalVol: 10,
			fileNum: 100,
			newBucketName:"",

			drawer: false,
			createdrawer: false,
			detaildrawer: false,
			deletevisible: false,

			bucketName: '',
			objectName: '',
			Etag: '',
			LastModified: '',

			objects:[],
			objectNum:'',
			bucketVol:'',
			scope:[],

			tableData: [{
          Key: "file1.jpg",
          Size: 1024,
        }, {
  				Key: "file2.jpg",
          Size: 15641,
        }, {
 					Key: "file3.jpg",
          Size: 489615,
        }, {
 					Key: "file4.jpg",
          Size: 7489845,
        },{
 					Key: "file5.jpg",
          Size: 611,
        },{
  				Key: "file6.jpg",
          Size: 47891,
        },{
  				Key: "file7.jpg",
          Size: 1331,
        },{
  				Key: "file8.jpg",
          Size: 1000,
        }]
    };
  },
  methods: {    
		//右上角设置选项
		handleCommand(command) {
			if(command ==="about"){
				this.$data.drawer = true;					
				console.log("about")
			}
			else{
				console.log("logout")
			}
		},
		//左侧栏列表功能
		handleOpen(key, keyPath) {
        console.log(key, keyPath);
    },
		handleClose(key, keyPath) {
			console.log(key, keyPath);
		},
		//listObjects获取Object列表
		handleJump(bucket){
			console.log(bucket.Name, "jump");
			var param = bucket.Name;
			this.objects = this.loadObjects(param);
			this.objectNum = this.tableData.length;
			var Vol = 0;
			for(var i=0; i<this.objectNum; i++){
				Vol += this.tableData[i].Size;
			};
			Vol = Vol/1024
			this.bucketVol = Vol.toFixed(2);			
		},
		//管理创建Bucket抽屉
		handleCancel() {
			this.$data.newBucketName = "";
			this.$data.createdrawer = false;
		},
		handleCreate() {
			if(this.$data.newBucketName !== ""){
				console.log("1");
				var existed = 0;
				var i = 0;
				for(i=0;i<this.$data.bucketNum;i++){
					if(this.$data.newBucketName == this.$data.buckets[i].Name){
						existed += 1;						
					}
				}
				if(existed == 0){
					console.log("创建bucket");
					createBucket(this.newBucketName);
					this.$data.createdrawer = false;
					this.$notify({
							title: "温馨提示",
							message: "Bucket创建成功",
							duration: 5000,
							offset: 50,
							type: "success"
						});
				}else{
					console.log("Bucket已存在");
						this.$notify({
							title: "温馨提示",
							message: "Bucket名称已存在",
							duration: 2000,
							offset: 200,
							type: "warning"
						});
				}
			}
			else{
				console.log("5");
				this.$notify({
							title: "温馨提示",
							message: "Bucket名称为空",
							duration: 2000,
							offset: 200,
							type: "warning"
						});
			}
		},
		//搜索框功能
		querySearch(queryString, cb) {
			var buckets = [];
			for(var i=0;i<this.buckets.length;i++){
				buckets.push({value:this.buckets[i].Name});
				console.log(buckets)
			}
			var results = queryString ? buckets.filter(this.createFilter(queryString)) : buckets;
			// 调用 callback 返回建议列表的数据
			cb(results);
		},
		createFilter(queryString) {
			return (bucket) => {
				return (bucket.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
			};
		},		
		//搜索框中选择
		handleSelect(item){
			console.log(item);
		},
		//管理删除bucket
		handleDeleteBucket(bucket){
			console.log("delete",bucket.Name);
			if(this.$data.objectNum !==0){
				this.$message({
						showClose: true,
						message: 'Bucket内容不为空，删除失败',
						type: 'error'
					});
			}else{
				var name = bucket.Name;
				deleteBucket(name);
			}			
		},
		//上传文件
		uploadfile(){
			console.log("uploadfile")
		},
		//下载文件
		handleDownload(scope){
			console.log("下载",scope.row.Key);
		},
		//文件详情
		handleInfo(scope){
			this.$data.detaildrawer = true;
			this.$data.objectName = scope.row.Key;
			this.$data.Etag = scope.row.Size;
			this.$data.LastModified = scope.row.Key;
			// this.$data.Etag = scope.row.Etag;
			// this.$data.LastModified = scope.row.LastModified;
			console.log("详情",scope.row.Key);
		},
		//删除文件
		handlescope(scope){
			this.$data.deletevisible = true;
			this.$data.scope = scope;
		},
		handleDeleteObj(){
			let scope = this.$data.scope;
			console.log("删除",scope.row.Key);
			this.$data.deletevisible = false;
		},
		//listBuckets
		loadAll(){
			function fn1(callback){
				listBuckets().then(function(value){
					callback(value);
				});
			};
			fn1(value => {
				console.log(value);
				this.buckets = value;
				this.bucketNum = this.buckets.length;
			})
			return this.buckets;
		},
		//listObjects
		loadObjects(param){
			function fn2(callback){
				let bucket = param;
				listObjects(bucket).then(function(value){
					callback(value);
				});
			};
			fn2(value => {
				console.log(value);
				this.objects = value;
				// this.objectNum = this.objects.length;
			})
			console.log(this.objects)
			return this.objects;
		},

	},
	mounted(){		
		this.buckets = this.loadAll();
	}
};
</script>

<style>
  .el-header {
    background-color: #a6a5c4;
    color: #322A54;
    text-align: left;
		font-size: xx-large;
		padding-top: 40px;
  }

	.el-footer {
    background-color: rgb(236, 239, 243);
    color: #333;
    text-align: center;
    line-height: 60px;
  }
  
  .el-aside {
    background-color: #a6a5c4;
    color: #322a54;
    text-align: left;
		padding-top: 50px;
		font-family:"Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  }
	.el-menu{
		border-right: 0px;
	}
	.el-menu-item{
		font-size: 20px;
	}
	.el-autocomplete{
		line-height: 1px;
		width: 265px;
	}
	.deleteicon{
		float: right;
		height:44px;
		width: 44px;
		margin-top: 3px;
	  
	}
  
  .el-main {
    background-color:#eaedf7;
  }
	.overview{
		color: #333;
    text-align: left;
		font-size: x-large
	}
	.subview{
		text-align: center;
		font-size: 50px;
		padding-top: 50px;
		height: 100px;
	}
  .subview1{
		text-align: center;
		font-size: 30px;
		padding-top: 15px;
		height: 40px;
	}

  body > .el-container {
    margin-bottom: 40px;
  }

	.el-dropdown-link {
    cursor: pointer;
    color: rgb(255, 255, 255);
		font-size:larger;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }

	.el-card,.el-button,.el-input__inner{
		border-radius: 0;
	}

	.el-drawer{
		font-size: 18px;
		padding-left: 40px;
		background-color:#eaedf7;
		font-family:"Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
	}
	.drawer-title{
		font-size: 20px;
		padding-top: 30px;
    margin-bottom: 20px;
	}
	.drawer-body{
		width: 90%;
		padding-top: 30px;
		text-align: right
	}

  
</style>