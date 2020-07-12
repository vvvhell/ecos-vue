
<template>
  <div id="console" style="width:100%">
    <el-container style="height:100vh">      
			<el-header style="height:130px">
				<span>ECOS | 管理控制台</span>
				<span style="float:right">
					<el-dropdown @command="handleCommand" trigger=click>
						<span class="el-dropdown-link" style="color:#302B43">
							<i class="el-icon-user"></i>
							{{$store.state.username}}<i class="el-icon-arrow-down el-icon--right"></i>
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
						background-color="#99CCFF"
						text-color="#322A54"
						active-text-color="#fff">
						<el-menu-item index="1" v-on:click="openOverview" :disabled="overviewDisabled">
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
											:disabled="overviewDisabled"
											@select="handleSelect"></el-autocomplete>
								</el-menu-item>							
								<el-menu-item class="bucketList" v-for="(bucket) in buckets" v-bind:key="bucket.Name" :disabled='getting(bucket)' @click="handleJump(bucket)" v-on:click="openDetail">									
									<span>• {{bucket.Name}}</span>					
								</el-menu-item>
							</el-menu-item-group>
						</el-submenu>
						<el-menu-item index="3" v-on:click="openUploadlist">
							<i class="el-icon-upload2"></i>
							<span slot="title">上传列表</span>					
						</el-menu-item>
						<el-menu-item index="4" v-on:click="openDownloadlist">
							<i class="el-icon-download"></i>
							<span slot="title">下载列表</span>					
						</el-menu-item>												
					</el-menu>
				</el-aside>

        <el-container>
          <el-main>

						<el-row v-show="overviewvisible"> 
							<el-card>
								<div class="overview"><span><i class="el-icon-monitor"></i>&nbsp; 概览数据</span></div>
								<el-divider></el-divider>
								<el-button type="primary" @click="overviewData()" style="margin-bottom:20px" :loading="iscalculating">计算概览数据</el-button>
								<el-row :gutter="30">
									<el-col :span="7"><el-card v-loading="loading1">Bucket数量
										<div class="subview">{{bucketNum}} 个</div>
										</el-card></el-col>
									<el-col :span="7"><el-card v-loading="loading2" v-if='showOverviewdata'>全部Bucket已用空间
										<div class="subview">{{showVol}} {{unit1}}</div>
										</el-card></el-col>
									<el-col :span="7"><el-card v-loading="loading2" v-if='showOverviewdata'>全部Bucket文件数
										<div class="subview">{{fileNum}} 个</div>
										</el-card></el-col>
								</el-row>
							</el-card>
						</el-row>
						<el-row style="margin-top:25px" v-show="overviewvisible">
							<el-card>
								<div class="overview"><span><i class="el-icon-files"></i>&nbsp; Bucket管理</span></div>
								<el-divider></el-divider>
								<el-button type="primary" @click="createdrawer = true">创建Bucket</el-button>
							</el-card>
						</el-row>

						<el-row v-show="detailvisible"> 
							<el-card>
								<div class="overview"><span><i class="el-icon-monitor"></i>&nbsp; 概览数据</span></div>
								<el-divider></el-divider>
								<el-row :gutter="30">									
									<el-col :span="7"><el-card v-loading="loadingtable">已使用的存储空间
										<div class="subview1">{{bucketVol}} {{unit2}}</div>
										</el-card></el-col>
									<el-col :span="7"><el-card v-loading="loadingtable">已存储的文件数量
										<div class="subview1">{{objectNum}} 个</div>
										</el-card></el-col>
								</el-row>
							</el-card>
						</el-row>
						<el-row style="margin-top:25px" v-show="detailvisible">
							<el-card>
								<el-button type="primary" icon="el-icon-refresh" :loading="loading(bucketName)" @click="refresh" >刷新</el-button>
								<el-button type="primary" icon="el-icon-plus" @click="uploadfile" id="upload" :loading="loading(bucketName)">上传文件</el-button>
								<el-button type="danger" icon="el-icon-delete" @click="handleDeleteBucket" :loading="loading(bucketName)">删除存储桶</el-button>
								<el-table
									v-loading="loadingtable"
									:data="objects"
									height="800"
									stripe
									style="width: 100%">
									<el-table-column prop="Key" label="文件对象名" width="250">
									</el-table-column>
									<el-table-column label="文件大小" width="250">
										<template slot-scope="scope">
											{{(scope.row.Size/1024/1024).toFixed(2)}}&nbsp; MB											
										</template>	
									</el-table-column>
									<el-table-column label="操作" width="350">
										<template slot-scope="scope">											
											<el-button
												type="primary"
												size="mini"
												@click="handleDownload(scope)">下载
												<!-- <a :href="getHref(scope)" :download="getDownloadname(scope)" target="_blank" style='text-decoration:none;color:white' type="video">下载</a> -->
											</el-button>
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
									<el-table-column label="修改时间">
										<template slot-scope="scope">
										{{scope.row.LastModified}}
										</template>
									</el-table-column>
								</el-table>
							</el-card>
						</el-row>
					
					  <template v-for="(upload) in uploadlist" >
						<el-card class="uploadlist" v-show="uploadlistvisible" v-bind:key="upload.Key" v-if="upload.isActive">
							<div>
								<span><i class="el-icon-document"></i>&nbsp; {{upload.Key}}</span>
								<el-button style="margin-left: 15px" type="primary" circle v-if="upload.isPaused && upload.percent1!=100" :disabled="getPauseload(upload)" @click="continueUpload(upload)">
									<svg class="icon" aria-hidden="true"><use xlink:href="#el-icon-myzanting" ></use></svg>
								</el-button>
								<el-button style="margin-left: 15px" type="warning" circle v-if="!upload.isPaused && upload.percent!=100" :disabled="getPauseload(upload)" @click="pauseUpload(upload)">
									<svg class="icon" aria-hidden="true"><use xlink:href="#el-icon-myzanting_huaban" ></use></svg>
								</el-button>
								<el-button style="float: right" type="danger" icon="el-icon-delete" circle @click="cancelUpload(upload)"></el-button>
								<div style="margin-top: 10px">
									<el-progress :stroke-width="8" :percentage="parseFloat((upload.percent1).toFixed(2))" :color="customColors"></el-progress>
								</div>
							</div>
					  </el-card>
					  </template>

						<template v-for="(download) in downloadlist">
						<el-card class="downloadlist" v-show="downloadlistvisible" v-bind:key="download.name" v-if="download.isActive">
							<div>
								<span><i class="el-icon-document"></i>&nbsp; {{download.name}}</span>
								<el-button style="margin-left: 15px" type="primary" circle v-if="download.isdownloadPaused && download.percent2!=100" :disabled="getPauseload(download)" @click="continueDownload(download)">
									<svg class="icon" aria-hidden="true"><use xlink:href="#el-icon-myzanting" ></use></svg>
								</el-button>
								<el-button style="margin-left: 15px" type="warning" circle v-if="!download.isdownloadPaused && download.percent!=100" :disabled="getPauseload(download)" @click="pauseDownload(download)">
									<svg class="icon" aria-hidden="true"><use xlink:href="#el-icon-myzanting_huaban" ></use></svg>
								</el-button>
								<el-button style="float: right" type="danger" icon="el-icon-delete" circle @click="cancelDownload(download)"></el-button>
								<div style="margin-top: 10px">
									<el-progress :stroke-width="8" :percentage="parseFloat((download.percent2).toFixed(2))" :color="customColors"></el-progress>
								</div>
							</div>							
					  </el-card>
						</template>

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

					<el-dialog
						title="提示"
						:visible.sync="deleteallvisible"
						width="30%">
						<span>此操作将删除存储桶及其中所有文件，是否继续？</span>
						<span slot="footer" class="dialog-footer">
							<el-button @click="deleteallvisible = false">取 消</el-button>
							<el-button type="primary" @click="deleteAll()">确 定</el-button>
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
						<div class="drawer-title">权限控制</div>
						<el-select v-model="Acl" placeholder="请选择" style="width:90%" @change="selectAcl()">
							<el-option
								v-for="item in options"
								:key="item.value"
								:label="item.label"
								:value="item.value">
							</el-option>
						</el-select>
						<div class="drawer-body">
							<el-button @click="handleCancel">取 消</el-button><el-button type="primary" @click="handleCreate">创 建</el-button>
						</div>
					</el-drawer>

					<el-drawer	class="detaildrawer" :with-header="false" :visible.sync="detaildrawer">
						<div class="drawer-title">文件详情</div>
						<div style="margin-bottom:20px"><span style="display: inline-block; width: 100px">文件名:</span>{{objectName}}</div>
						<div style="margin-bottom:20px"><span style="display: inline-block; width: 100px">ETag:</span>{{ETag}}</div>
						<div><span style="display: inline-block; width: 100px">修改时间:</span>{{LastModified}}</div>
					</el-drawer>

					<el-dialog :visible.sync="uploadvisible" style="width: 40vx, text-align:center">
						<el-upload
							class="uploadfile"
							drag
							action="doUpload" 
							multiple
							:show-file-list="false"
							:auto-upload="false"
							:on-change="onUploadChange"
							style="text-align:center">
							<i class="el-icon-upload"></i>
							<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
							<div class="el-upload__text">文件名请勿包含空格</div>
							<div slot="tip" class="el-upload__tip">选择的文件将自动开始上传</div>
						</el-upload>
						<div class="drawer-title" style="text-align:center"><div style="margin-bottom:20px">权限控制</div>
							<el-select v-model="Acl" placeholder="请选择" style="width:40%" @change="selectAcl()">
							<el-option
								v-for="item in options"
								:key="item.value"
								:label="item.label"
								:value="item.value">
							</el-option>
						</el-select>	
						</div>					
						<div slot="footer" class="dialog-footer">
							<el-button @click="uploadvisible = false">取 消</el-button>
							<el-button type="primary" @click="submitUpload">确 定</el-button>
						</div>
					</el-dialog>　　

        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script type="text/ecmascript-6">
import { S3 } from 'aws-sdk';
import '../api/s3api'
import '../assets/iconfont'
import router from 'vue-router'
import {throttle} from 'lodash'
import { listBuckets, createBucket, listObjects, abortlist, deleteBucket, deleteObject, getObject, putObject, getUploadID, uploadPart, uploadedParts, completeUpload, abortUpload, listMultipartUploads, createUser, createKey, ConfigKey, InitAWS } from '../api/s3api';
export default {
  data() {

    return {
			buckets:[],
			state:'',
			bucketNum: '',
			totalVol: 0,
			showVol: 0,
			unit1: 'B',
			fileNum: 0,
			newBucketName:"",
			showOverviewdata: false,
			overviewDisabled: false,

			drawer: false,
			createdrawer: false,
			detaildrawer: false,
			deleteallvisible: false,
			deletevisible: false,
			overviewvisible: true,
			detailvisible: false,
			uploadvisible: false,
			loading1: true,
			loading2: true,
			loadingtable: true,
			uploadlistvisible: false,
			downloadlistvisible: false,

			bucketName: '',
			objectName: '',
			ETag: '',
			LastModified: '',

			objects:[],
			objectNum:'',
			bucketVol:'',
			unit2:'B',
			scope:[],

			uploadlist:[],
			downloadlist:[],
			downloadnum:[],
			downloadtemp:[],

			iscalculating:false,

			options:[
				{
					value:'private',
					label:'私有'
				},
				{
					value:'public-read',
					label:'所有用户只读'
				},
				{
					value:'public-read-write',
					label:'所有用户读写'
				},
			],
			Acl:'',

			customColors: [
				{color: '#f56c6c', percentage: 20},
				{color: '#e6a23c', percentage: 40},
				{color: '#5cb87a', percentage: 60},
				{color: '#1989fa', percentage: 80},
				{color: '#6f7ad3', percentage: 100}
			]



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
				this.$store.dispatch('logoutAct');
				this.$router.replace({path:'/LoginPage'})
			}
		},
		//左侧栏列表功能
		handleOpen(key, keyPath) {
        console.log(key, keyPath);
    },
		handleClose(key, keyPath) {
			console.log(key, keyPath);
		},

		//打开概览界面
		openOverview(){
			console.log("概览");
			this.$data.overviewvisible = true;
			this.$data.detailvisible = false;
			this.$data.uploadlistvisible = false;
			this.$data.downloadlistvisible = false;
			this.loadAll();
		},
		//listBuckets
		async loadAll(){
			console.log("loadAll");
			this.loading1 = true;
			this.loading2 = false;
			this.buckets = await listBuckets();
			this.bucketNum = this.buckets.length;				
			this.loading1 = false;
			if(this.bucketNum == 0){
				this.totalVol = 0;
				this.fileNum = 0;
				this.loading2 = false;
			}else{
				for(var i=0;i<this.bucketNum;i++){
					console.log(this.buckets[i].Name);
					this.$set(this.buckets[i],'isActive', true);
					this.$set(this.buckets[i],'getting', false);
				}
			}			
			return this.buckets;
		},		
		//计算概览数据
		async overviewData(){
			this.showOverviewdata = true;
			var allObjects = [];			
			var that = this;
			async function loadpiece(bucket, marker){
				console.log(bucket, marker);
				that.iscalculating = true;
				var data = await listObjects(bucket, false, marker);
				allObjects = allObjects.concat(data.Contents);
				if(data.NextMarker != ""){
					loadpiece(bucket, data.NextMarker)
				}else{
					that.iscalculating = false;
					that.fileNum = allObjects.length;
					var Vol = 0;
					for(var k=0;k<that.fileNum;k++){
						Vol += allObjects[k].Size;
					}
				}
			};
			for(var i=0;i<this.bucketNum;i++){
				this.iscalculating = true;				
				var value = await listObjects(this.buckets[i].Name, false, '');
				allObjects = allObjects.concat(value.Contents);
				if(value.IsTruncated == true){						
					loadpiece(this.buckets[i].Name, value.NextMarker);
				}else{
					this.iscalculating = false;
					this.fileNum = allObjects.length;
					var Vol = 0;
					for(var j=0;j<this.fileNum;j++){
						Vol += allObjects[j].Size;
					}
					this.totalVol = Vol;					
				}
			};
			if(this.totalVol<1024){
				this.showVol = this.totalVol.toFixed(2);
				this.unit1 = "B";
			}
			if(1024<=this.totalVol<1024*1024){
				this.showVol = (this.totalVol/1024).toFixed(2);
				this.unit1 = "KB";
			}
			if(1024*1024<=this.totalVol<1024*1024*1024){
				this.showVol = (this.totalVol/1024/1024).toFixed(2);
				this.unit1 = "MB";
			}
			if(this.totalVol>=1024*1024*1024){
				this.showVol = (this.totalVol/1024/1024/1024).toFixed(2);
				this.unit1 = "GB";
			}
		},
		
		//获取Object列表
		handleJump(bucket){
			console.log(bucket.Name, "jump");
			var param = bucket.Name;
			this.$data.bucketName = param;
			this.objects = this.loadObjects(param);							
		},
		refresh(){
			this.objects = this.loadObjects(this.bucketName);
		},
		loading(bucketName){
			for(var i=0;i<this.buckets.length;i++){
				if(this.buckets[i].Name == bucketName){
					return this.buckets[i].getting;
				}
			}
		},
		getting(bucket){
			for(var i=0;i<this.buckets.length;i++){
				if(this.buckets[i].Name == bucket.Name){
					return this.buckets[i].getting;
				}
			}
		},
		loadObjects(param){
			this.iscalculating = false;			
			for(var i=0;i<this.buckets.length;i++){	
				if(this.buckets[i].Name == param){
					this.buckets[i].isActive = true;
					this.buckets[i].getting = true;
				}else{
					this.buckets[i].isActive =false;
					this.buckets[i].getting = false;
				}										
			}
			console.log(this.buckets);
			this.objects = [];
			this.objectNum = 0;
			var that = this;
			function fn2(callback){
				let bucket = param;
				listObjects(bucket, false, '').then(function(value){
					callback(value);
				});									
			};
			this.loadingtable = true;
			async function loadpiece(param, marker){
				for(var i=0;i<that.buckets.length;i++){	
					if(that.buckets[i].Name == param && that.buckets[i].isActive == true){
						var data = await listObjects(param, false, marker);
						if(that.buckets[i].isActive == false){
							data = {Contents:[]};
						}
						that.objects = that.objects.concat(data.Contents);
						that.objectNum += data.Contents.length;
						if(data.NextMarker != "" ){
							loadpiece(param, data.NextMarker)
						}else{
							for(var i=0;i<that.buckets.length;i++){
								if(that.buckets[i].Name == param){
									that.buckets[i].getting = false;
								}
							};
							var Vol = 0;
							for(var i=0; i<that.objectNum; i++){
								Vol += that.objects[i].Size;
								that.$set(that.objects[i],'Bucket',that.bucketName);
							};
							if(Vol<1024){
								that.bucketVol = Vol.toFixed(2);
								that.unit2 = 'B'
							}
							if(Vol>=1024){
								that.bucketVol = (Vol/1024).toFixed(2);
								that.unit2 = "KB"	
							}
							if(Vol>=1024*1024){
								that.bucketVol = (Vol/1024/1024).toFixed(2);
								that.unit2 = "MB"
							}
							if(Vol>=1024*1024*1024){
								that.bucketVol = (Vol/1024/1024/1024).toFixed(2);
								that.unit2 = "GB"
							}	
							that.loadingtable = false;
						}
					}				
				}
			}
			fn2(value => {
				console.log(value);				
				if(value.IsTruncated == true){
					this.objects = value.Contents;
					this.objectNum = this.objects.length;	
					loadpiece(param, value.NextMarker);
				}else{
					for(var i=0;i<this.buckets.length;i++){
						if(this.buckets[i].Name == param){
							this.buckets[i].getting = false;
						}
					};		
					this.objects = value.Contents;
					this.objectNum = this.objects.length;					
					console.log('objects',this.objects);					
					var Vol = 0;
					for(var i=0; i<this.objectNum; i++){
						Vol += this.objects[i].Size;
						this.$set(this.objects[i],'Bucket',this.bucketName);
					};
					if(Vol<1024){
						this.bucketVol = Vol.toFixed(2);
						this.unit2 = 'B'
					}
					if(Vol>=1024){
						this.bucketVol = (Vol/1024).toFixed(2);
						this.unit2 = "KB"	
					}
					if(Vol>=1024*1024){
						this.bucketVol = (Vol/1024/1024).toFixed(2);
						this.unit2 = "MB"
					}
					if(Vol>=1024*1024*1024){
						this.bucketVol = (Vol/1024/1024/1024).toFixed(2);
						this.unit2 = "GB"
					}	
					this.loadingtable = false;					
				}				
			})				
			return this.objects;																
		},		

		//管理创建Bucket抽屉
		handleCancel() {
			this.$data.newBucketName = "";
			this.$data.createdrawer = false;
		},
		handleCreate() {
			if(this.$data.newBucketName !== ""){
				var existed = 0;
				var i = 0;
				for(i=0;i<this.$data.bucketNum;i++){
					if(this.$data.newBucketName == this.$data.buckets[i].Name){
						existed += 1;						
					}
				}
				if(existed == 0){
					if(this.Acl == ''){
						this.$notify({
							title: "温馨提示",
							message: "请选择Bucket权限",
							duration: 2000,
							offset: 300,
							type: "warning"
						});
					}else{
						this.$data.createdrawer = false;
						this.buildBucket(this.newBucketName, this.Acl);
					}					
				}else{
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
				this.$notify({
							title: "温馨提示",
							message: "Bucket名称为空",
							duration: 2000,
							offset: 200,
							type: "warning"
						});
			}
		},
		buildBucket(name, acl){
			function fn4(callback){
				createBucket(name, acl).then(function(value){
					callback(value);
				});
			};
			fn4(value => {
				console.log(value);
				var result1 = this.newBucketName;
				if(value == "OK"){
					this.$notify({
						title: "温馨提示",
						message: "Bucket创建成功",
						duration: 5000,
						offset: 50,
						type: "success"
					});
					this.loadAll();
				}else{
					this.$notify({
						title: "温馨提示",
						message: "Bucket创建失败",
						duration: 5000,
						offset: 50,
						type: "error"
					});
				}
			})
		},

		//权限控制选项
		selectAcl(){
			console.log(this.Acl);
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
			this.objects = this.loadObjects(item.value);
			this.overviewvisible = false;
			this.detailvisible = true;
		},

		//删除bucket
		async handleDeleteBucket(){
			this.overviewDisabled = true;
			for(var i=0;i<this.bucketNum;i++){
				this.buckets[i].getting = true;
			};
			console.log("delete",this.bucketName, this.objectNum);
			//object数量不为0
			if(this.objectNum != 0){				
				await this.deleteAll();
				await this.deleteUpload();
				for(var i=0;i<this.bucketNum;i++){
					if(this.buckets[i].Name == this.bucketName){
						this.buckets[i].getting = false;
					}
				};
				this.overviewDisabled = false;
			}else{		//object数量为0
				await this.deleteUpload();
				this.overviewDisabled = false;
			}
		},
		//删除未完成上传的分片
		async deleteUpload(){
			var list = await listMultipartUploads(this.bucketName);
			console.log("list",list);
			if(list.length == 0){
				await deleteBucket(this.bucketName);
				this.$notify({
						title: "温馨提示",
						message: "Bucket删除成功",
						duration: 5000,
						offset: 50,
						type: "success"
					});
				this.openOverview();
			}else{
				for(var i = 0;i<list.length;i++){
					let Bucket = this.bucketName;
					let Key = list[i].Key;
					let UploadId = list[i].UploadId;
					var data = await abortUpload(Bucket, Key, UploadId);
				}
				await deleteBucket(this.bucketName);
				this.$notify({
						title: "温馨提示",
						message: "Bucket删除成功",
						duration: 5000,
						offset: 50,
						type: "success"
					});
				this.openOverview();
			}								
		},
		//删除某个bucket及其中所有文件
		async deleteAll(){
			//删除文件
			for(var i=0;i<this.objects.length;i++){
				var msg = await deleteObject(this.bucketName, this.objects[i].Key);
			}						
		},

		//打开详情页面
		openDetail(){
			console.log("详情");
			this.$data.overviewvisible = false;
			this.$data.detailvisible = true;
			this.$data.uploadlistvisible = false;
			this.$data.downloadlistvisible = false;
		},

		//打开上传列表
		openUploadlist(){
			console.log("上传列表",this.uploadlist);
			this.$data.overviewvisible = false;
			this.$data.detailvisible = false;
			this.$data.uploadlistvisible = true;
			this.$data.downloadlistvisible = false;
		},

		//打开下载列表
		openDownloadlist(){
			console.log("下载列表",this.downloadlist);
			this.$data.overviewvisible = false;
			this.$data.detailvisible = false;
			this.$data.uploadlistvisible = false;
			this.$data.downloadlistvisible = true;
		},

		//上传文件
		uploadfile(){
			console.log("uploadfile to:", this.bucketName);
			this.$data.uploadvisible = true;
		},
		//选择文件并上传
		onUploadChange(file){
			if(this.Acl == ''){
				this.$notify({
					title: "温馨提示",
					message: "请先选择文件权限",
					duration: 5000,
					offset: 50,
					type: "error"
				})
				return;
			};
			console.log("文件：", file);
			this.file = file.raw;
			this.fileName = file.raw.name;
			var name = this.bucketName;
			var key = this.fileName;
			var size = this.file.size;
			var fileReader = new FileReader();
			var tempobj = {
				File: this.file,
				Bucket: this.bucketName,
				key: key,
				Key: key,
				Size: size,
				percent1: 0,
				UploadID: "",
				parts: [],
				isPaused: false,
				isActive: true,
				loading: false
			};
			for(var i=0;i<this.uploadlist.length;i++){
				if(tempobj.Bucket == this.uploadlist[i].Bucket && tempobj.key == this.uploadlist[i].key){
					console.log(tempobj.Bucket,this.uploadlist[i].Bucket,tempobj.key,this.uploadlist[i].key);
					this.$notify({
						title: "温馨提示",
						message: key+"\n已在上传列表中，请勿重复上传",
						duration: 5000,
						offset: 50,
						type: "error"
					});
					return;
				}else{
					continue;
				}
			}
			for(var i=0;i<this.downloadlist.length;i++){
				if(tempobj.Bucket == this.downloadlist[i].Bucket && tempobj.key == this.downloadlist[i].Key){
					this.$notify({
						title: "温馨提示",
						message: key+"\n正在下载中，请勿上传同名文件",
						duration: 5000,
						offset: 50,
						type: "error"
					});
					return;
				}else{
					continue;
				}
			}
			if(this.uploadlist.length>0){
				var num = 0;
				for(var i=0;i<this.uploadlist.length;i++){
					if(this.uploadlist[i].key == key){
						num += 1;
					}
				}
				if(num>0){
					tempobj.Key = key + '('+num+')'	
				}	
			}
			this.uploadlist.push(tempobj);				
			//载入文件
			fileReader.readAsArrayBuffer(this.file);
			this.$notify({
				title: "温馨提示",
				message: "开始上传\n"+key,
				duration: 5000,
				offset: 50,
				type: "info"
			});
			var that = this;
			//文件载入成功
			fileReader.onload = async function(){
				//读取完成后，数据保存在对象的result属性中
				console.log(this.result);
				var blob = new Blob([this.result]);
				//小于15MB的文件
				if(size<15*1024*1024){
					var msg = await putObject(blob, name, key, that.Acl);
					if(msg != 0){
						that.$notify({
							title: "温馨提示",
							message: key+"\n上传成功",
							duration: 5000,
							offset: 50,
							type: "success"
						});
						var index = 0;
						for(var i=0;i<that.uploadlist.length;i++){
							if(that.uploadlist[i].Key == tempobj.Key){
								index = i;
								break;
							}
						}
						that.uploadlist[index].percent1 = 100;
					}else{
						that.$notify({
							title: "温馨提示",
							message: key+"\n上传失败",
							duration: 5000,
							offset: 50,
							type: "error"
						});
						var index = 0;
						for(var i=0;i<that.uploadlist.length;i++){
							if(that.uploadlist[i].Key == tempobj.Key){
								index = i;
								break;
							}
						}
						that.cancelUpload(that.uploadlist[index]);
					}
				}else{   //大于15MB的文件
					await that.putBigobj(blob, name, key, size, tempobj.Key);
				}				
			}		
		},
		getPauseload(data){
			return data.loading;
		},
		//分片上传大文件
		async putBigobj(blob, name, key, size, Key){
			var uploadID = await getUploadID(name, key, this.Acl);
			if(uploadID == 0){
				console.log('delete');
				this.$notify({
					title: "温馨提示",
					message: key+"\n上传失败",
					duration: 5000,
					offset: 50,
					type: "error"
				});
				var index1 = 0;
				for(var i=0;i<this.uploadlist.length;i++){
					if(this.uploadlist[i].Key == Key){
						index1 = i;
						break;
					}
				}				
				this.cancelUpload(this.uploadlist[index1]);
				return;
			}else{
				var sliceSize= 10*1024*1024;
				var slice = Math.ceil(size/sliceSize);
				var parts = [];
				for(var a=0; a<slice;a++){
					var index2 = 0;
					for(var j=0;j<this.uploadlist.length;j++){
						if(this.uploadlist[j].Key == Key){
							index2 = j;
							break;
						}
					}
					console.log(this.uploadlist[index2].Key,this.uploadlist[index2].isActive);
					if(this.uploadlist[index2].isActive == true && this.uploadlist[index2].isPaused == false){
						this.uploadlist[index2].UploadID = uploadID;
						var partobj = {
							ETag: "",
							PartNumber: 1
						}
						var start = a*sliceSize;
						var end = start + sliceSize;
						if(a == slice-1){
							end = size-1;
						}
						console.log("range:", start, end);
						var chunk = blob.slice(start, end);
						var partnumber = a+1;
						var msg = await uploadPart(chunk, name, key, partnumber, uploadID);					
						var index3 = 0;
						for(var k=0;k<this.uploadlist.length;k++){
							if(this.uploadlist[k].Key == Key){
								index3 = k;
								break;
							}
						}
						if(this.uploadlist[index3].isPaused == true){
							msg = 'abort';
							this.uploadlist[index3].loading = false;
						}						
						if(msg !== 0){
							partobj.ETag = msg;
							partobj.PartNumber = partnumber;
							parts.push(partobj);
							this.uploadlist[index3].parts.push(partobj);
							if(msg == 'abort' ){
								console.log('point')								
							}else{
								this.uploadlist[index3].percent1 = (a+1)/slice*100;
								//this.uploadlist[index3].loading = false;
							}
							console.log("percent", this.uploadlist[index3].percent1);
						}else if(msg == 0){
							this.$notify({
								title: "温馨提示",
								message: key+"\n上传失败",
								duration: 5000,
								offset: 50,
								type: "error"
							});
							this.cancelUpload(this.uploadlist[index3]);
							return;
						}
					}else if(this.uploadlist[index2].isActive == false || this.uploadlist[index2].isPaused == true){
						return;
					}				
				}
				var index4 = 0;
				for(var m=0;m<this.uploadlist.length;m++){
					if(this.uploadlist[m].Key == Key){
						index4 = m;
						break;
					}
				}
				if(this.uploadlist[index4].isActive == true && this.uploadlist[index4].isPaused == false){
					console.log(parts);
					if(parts.length == slice){
						var completemsg = await completeUpload(name, key, uploadID, parts);
						if(completemsg != 0){
							this.$notify({
								title: "温馨提示",
								message: key+"\n上传成功",
								duration: 5000,
								offset: 50,
								type: "success"
							});
						}				
					}else{
						this.$notify({
							title: "温馨提示",
							message: key+"\n上传失败",
							duration: 5000,
							offset: 50,
							type: "error"
						});
						this.cancelUpload(this.uploadlist[index4]);
					}
				}				
			}			
		},
		//暂停上传
		pauseUpload(upload){
			var index = 0;
			for(var i=0;i<this.uploadlist.length;i++){
				if(this.uploadlist[i].Key == upload.Key){
					console.log(this.uploadlist[i].Key);
					index = i;
					break;
				}
			};
			this.uploadlist[index].isPaused = true;
			this.uploadlist[index].loading = true;
		},
		//继续上传
		continueUpload(upload){
			var index = 0;
			for(var i=0;i<this.uploadlist.length;i++){
				if(this.uploadlist[i].Key == upload.Key){
					console.log(this.uploadlist[i].Key);
					index = i;
					break;
				}
			};
			this.uploadlist[index].isPaused = false;
			//重新读取文件
			let fileReader = new FileReader();
			fileReader.readAsArrayBuffer(upload.File);
			var that = this;
			fileReader.onload = async function(){
				console.log(this.result);
				var blob = new Blob([this.result]);
				var sliceSize= 10*1024*1024;
				var slice = Math.ceil(upload.File.size/sliceSize);
				//获取已上传信息
				var uploaded = await uploadedParts(upload.Bucket, upload.key, upload.UploadID);
				var len = uploaded.length;
				console.log('len',len);
				//继续分片上传
				for(var i=len; i<slice ;i++){
					var index1 = 0;
					for(var j=0;j<that.uploadlist.length;j++){
						if(that.uploadlist[j].Key == upload.Key){
							index1 = j;
							break;
						}
					}
					if(that.uploadlist[index1].isActive == true && that.uploadlist[index1].isPaused == false){
						var partobj = {
							ETag: "",
							PartNumber: 1
						}
						var start = i*sliceSize;
						var end = start + sliceSize;
						if(i == slice-1){
							end = upload.File.size-1;
						}
						console.log("range", start, end);
						var chunk = blob.slice(start, end);
						console.log("chunksize: ",chunk.size);
						var partnumber = i+1;
						//if(that.uploadlist[index1].isPaused == false){
							var msg = await uploadPart(chunk, upload.Bucket, upload.key, partnumber, upload.UploadID);
							if(that.uploadlist[index1].isPaused == true){
								msg = 'abort';
								that.uploadlist[index1].loading = false;
							}
						//}
							if(msg != 0){
								var index2 = 0;
								for(var j=0;j<that.uploadlist.length;j++){
									if(that.uploadlist[j].Key == upload.Key){
										index2 = j;
										break;
									}
								}								
								partobj.ETag = msg;
								partobj.PartNumber = partnumber;
								that.uploadlist[index2].parts.push(partobj);
								if(msg == 'abort'){
									console.log('point');
								}else{
									that.uploadlist[index2].percent1 = (i+1)/slice*100;
									//that.uploadlist[index2].loading = false;
								}
								console.log("percent", that.uploadlist[index2]);
							}else if(msg == 0){
								that.$notify({
									title: "温馨提示",
									message: upload.key+"\n上传失败",
									duration: 5000,
									offset: 50,
									type: "error"
								});
								fileReader = null;
								that.cancelUpload(upload);
								return;
							}					
					}else if(that.uploadlist[index1].isActive == true && that.uploadlist[index1].isPaused == true){
						// console.log(fileReader);
						// fileReader = null;
						// console.log(fileReader);
						that.uploadlist[index1].loading = false;
						return;
					}
				}
				//完成上传
				var index3 = 0;
				for(var j=0;j<that.uploadlist.length;j++){
					if(that.uploadlist[j].Key == upload.Key){
						index3 = j;
						break;
					}
				}
				if(that.uploadlist[index3].isActive == true && that.uploadlist[index3].isPaused == false){
					console.log(upload.parts);
					if(upload.parts.length == slice){
						var completemsg = await completeUpload(upload.Bucket, upload.key, upload.UploadID, upload.parts);
						if(completemsg != 0){
							that.$notify({
								title: "温馨提示",
								message: upload.key+"\n上传成功",
								duration: 5000,
								offset: 50,
								type: "success"
							});
						}else{
							that.$notify({
								title: "温馨提示",
								message: upload.key+"\n上传失败",
								duration: 5000,
								offset: 50,
								type: "error"
							});
							that.cancelUpload(upload);
							return;
						}				
					}else{
						that.$notify({
							title: "温馨提示",
							message: upload.key+"\n上传失败",
							duration: 5000,
							offset: 50,
							type: "error"
						});
						that.cancelUpload(upload);
						return;
					}

				}				
			}		
		},
		submitUpload(){
			console.log("上传：", this.fileName);
			if(this.fileName == undefined){
				this.$message.warning('请选择要上传的文件！')
				return false
			}else{
				this.$data.uploadvisible = false;
			}
			
		},
		//取消上传
		async cancelUpload(upload){
			var index = 0;
			for(var i=0;i<this.uploadlist.length;i++){
				if(this.uploadlist[i].Key == upload.Key){
					console.log("取消上传",this.uploadlist[i].Key);
					index = i;
					break;
				}
			};
			this.uploadlist[index].isActive = false;
			console.log(this.uploadlist[i].Key,this.uploadlist[index].isActive);									
			if(this.uploadlist[index].Size >= 15*1024*1024 && this.uploadlist[index].percent1 < 100){
				this.uploadlist.splice(index,1);				
				let bucket = upload.Bucket;
				let key = upload.key;
				let uploadId = upload.UploadID;
				await abortUpload(bucket, key, uploadId);
				console.log("abort");								
			}else{
				this.uploadlist.splice(index,1);
			}
			
		},

		//下载文件
		//使用a标签下载
		// getDownloadname(scope){
		// 	var name = scope.row.Key;
		// 	return name;
		// },
		// getHref(scope){
		// 	var href = this.$store.state.interfaceIp + '/' + this.bucketName + '/' + scope.row.Key;
		// 	return href; 
		// },
		//不使用a标签下载
		handleDownload(scope){
			console.log("下载",scope.row.Key);
			var bucket = this.$data.bucketName;
			//this.loadObjects(bucket);		//防止下载列表名称变化，原理未解决
			var key = scope.row.Key;
			var size = scope.row.Size;
			//重复下载计数表
			if(this.downloadnum.length==0){
				var a ={
					Key:key,
					num:1,
				}
				this.downloadnum.push(a);
			}else{
				for(var i=0;i<this.downloadnum.length;i++){
					if(this.downloadnum[i].Key == key){
						this.downloadnum[i].num += 1;
						break;
					}else{
						var a ={
							Key:key,
							num:1,
						}
						this.downloadnum.push(a);
					}
				}	
			}		
			//处理重复下载情况
			var index = 0;
			for(var i=0;i<this.objects.length;i++){
				if(this.objects[i].Key == key){
					index = i;
					break;
				}
			}
			var index2 = 0;
			for(var i=0;i<this.downloadnum.length;i++){
				if(this.downloadnum[i].Key == key){
					index2 = i;
					break;
				}
			}
			var renameobj = this.objects[index];
			for(var i=0;i<this.downloadlist.length;i++){
				if(renameobj.Bucket == this.downloadlist[i].Bucket && renameobj.Key == this.downloadlist[i].Key){
					this.$notify({
						title: "温馨提示",
						message: key+"\n已在下载列表中，请勿重复下载",
						duration: 5000,
						offset: 50,
						type: "error"
					});
					return;
				}else{
					continue;
				}
			};
			this.$notify({
				title: "温馨提示",
				message: "开始下载\n"+key,
				duration: 5000,
				offset: 50,
				type: "info"
			});
			this.$set(renameobj,'isActive',true);
			this.$set(renameobj,'percent2',0);
			this.$set(renameobj,'isdownloadPaused',false);
			this.$set(renameobj,'start',0);
			this.$set(renameobj,'loading',false);
			var num = this.downloadnum[index2].num -1;
			console.log('num',num);
			if(num>0){
				renameobj.name=renameobj.Key+'('+num+')';	//在下载列表中的名字
			}else{
				renameobj.name=renameobj.Key
			}
			this.downloadlist.push(renameobj);
			console.log(this.downloadlist);
			//开始下载
			var baseSize= 10*1024*1024;
			if(size>baseSize){
				this.downloadBigobj(bucket, size, renameobj.name);
			}else{
				this.downloadObj(bucket, renameobj.name);
			}
		},
		downloadObj(bucket, name){
			var key = '';
			var index = 0;
			for(var i=0;i<this.downloadlist.length;i++){
				if(this.downloadlist[i].name == name){
					index = i;
					key = this.downloadlist[i].Key
					break;
				}
			}
			function fn3(callback){
				getObject(bucket, key).then(function(value){
				callback(value);
				})
			};
			fn3(value =>{
				var content = value;
				if(value == 0){
					this.$notify({
						title: "温馨提示",
						message: key+"\n下载失败",
						duration: 5000,
						offset: 50,
						type: "error"
					});
					var index0 = 0;
					for(var i=0;i<this.downloadlist.length;i++){
						if(this.downloadlist[i].name == name){
							index0 = i;
							break;
						}
					}
					this.cancelDownload(this.downloadlist[index0]);
				}else{
					var blob = new Blob([content], {type:"stream"})
					console.log("blob", blob);
					var saveData = (function(blob, key) {
						var a = document.createElement("a");
						document.body.appendChild(a);
						a.style = "display: none";
						return function (blob, key) {
							var url = window.URL.createObjectURL(blob);
							a.href = url;
							a.download = key;
							a.click();
							window.URL.revokeObjectURL(url);
						};
					}());				
					var index1 = 0;
					for(var i=0;i<this.downloadlist.length;i++){
						if(this.downloadlist[i].name == name){
							index1 = i;
							break;
						}
					}
					if(this.downloadlist[index1].isActive == true){
						saveData(blob, key);
						this.downloadlist[index1].percent2 = 100;
						this.$notify({
							title: "温馨提示",
							message: key+"\n下载成功",
							duration: 5000,
							offset: 50,
							type: "success"
						});
					}
				}
			})					
		},
		//分片下载大文件
		async downloadBigobj(bucket, size, name){
			var sliceSize= 10*1024*1024;
			var slice = Math.ceil(size/sliceSize);
			var content = new Uint8Array([]);
			var range = "";
			for(var i=0;i<=slice-1;i++){
				var key = '';
				var index = 0;
				for(var j=0;j<this.downloadlist.length;j++){
					if(this.downloadlist[j].name == name){
						index = j;
						key = this.downloadlist[j].Key
						break;
					}
				}
				if(this.downloadlist[index].isActive == true && this.downloadlist[index].isdownloadPaused == false){
					var start = i*sliceSize;
					var end = start + sliceSize -1;
					this.downloadlist[index].start = i*sliceSize;
					range = "bytes=" + start + "-" + end;
					var part = await getObject(bucket, key, range);
					if(part == 0){
						this.$notify({
							title: "温馨提示",
							message: key+"\n下载失败",
							duration: 5000,
							offset: 50,
							type: "error"
						});
						this.cancelDownload(this.downloadlist[index]);
						break;
					}else{
						let buffer = Buffer.from(part);
						let buff = Buffer.from(content);
						content = Buffer.concat([buff,buffer]);
						//异步操作后重新获取下载内容的index
						var index2 = 0;
						for(var k=0;k<this.downloadlist.length;k++){
							if(this.downloadlist[k].name == name){
								index2 = k;
								key = this.downloadlist[k].Key
								break;
							}
						}
						this.downloadlist[index2].percent2 = (i+1)/slice*100;
						this.downloadlist[index2].loading = false;
						console.log(this.downloadlist[index2].percent2);				
					}					
				}else if(this.downloadlist[index].isActive == true && this.downloadlist[index].isdownloadPaused == true){
					if(this.downloadtemp.length==0){
						var temp ={
							Name:name,
							Content:content,
						}
						this.downloadtemp.push(temp);
						console.log("缓存1",name,temp.Content);
					}else{
						for(var i=0;i<this.downloadtemp.length;i++){
							if(this.downloadtemp[i].Name == name){
								this.downloadtemp[i].Content = content;
								console.log("缓存2",name,this.downloadtemp[i].Content);
								break;
							}else{
									var temp ={
									Name:name,
									Content:content,
								}
								this.downloadtemp.push(temp);
								console.log("缓存3",name,temp.Content);
								break;
							}
						}	
					}
					console.log("stop");
					break;					
				}else{
					break;
				}				
			}
			//异步操作后重新获取下载内容的index
				var index3 = 0;
				for(var h=0;h<this.downloadlist.length;h++){
					if(this.downloadlist[h].name == name){
						index3 = h;
						key = this.downloadlist[h].Key
						break;
					}
				}
			if(this.downloadlist[index3].isActive == true && this.downloadlist[index3].isdownloadPaused == false){
				console.log("content", content);
				var blob = new Blob([content]);
				var saveData = (function(blob, key) {
					var a = document.createElement("a");
					document.body.appendChild(a);
					a.style = "display: none";
					return function (blob, key) {
						var url = window.URL.createObjectURL(blob);
						a.href = url;
						a.download = key;
						a.click();
						window.URL.revokeObjectURL(url);
					};
				}());
				saveData(blob, key);
				this.$notify({
					title: "温馨提示",
					message: key+"\n下载成功",
					duration: 5000,
					offset: 50,
					type: "success"
				});
			}
		},
		//暂停下载
		pauseDownload(download){
			var index = 0;
			for(var i=0;i<this.downloadlist.length;i++){
				if(this.downloadlist[i].name == download.name){
					index = i;
					break;
				}
			}
			var range = "bytes=" + download.start + "-" + (download.start+10*1024*1024-1);
			this.downloadlist[index].isdownloadPaused = true;
			this.downloadlist[index].loading = true;
		},
		//继续下载
		async continueDownload(download){
			var index = 0;
			for(var i=0;i<this.downloadlist.length;i++){
				if(this.downloadlist[i].name == download.name){
					index = i;
					break;
				}
			}
			this.downloadlist[index].isdownloadPaused = false;
			var sliceSize= 10*1024*1024;
			var slice = Math.ceil(this.downloadlist[index].Size/sliceSize);
			//获取缓存的index
			var index1 = 0;
			for(var i=0;i<this.downloadtemp.length;i++){
				if(this.downloadtemp[i].Name == download.name){
					index1 = i;
					console.log('index1',index1);
					break;
				}
			}
			var content = this.downloadtemp[index1].Content;
			console.log('继续 缓存1',download.name,content);
			var range = "";
			var begin = Math.ceil(slice*(this.downloadlist[index].percent2/100));
			console.log("begin",begin);
			for(var i=begin;i<=slice-1;i++){
				if(this.downloadlist[index].isActive == true && this.downloadlist[index].isdownloadPaused == false){
					var start = i*sliceSize;
					var end = start + sliceSize -1;
					this.downloadlist[index].start = i*sliceSize
					range = "bytes=" + start + "-" + end;
					console.log(range);
					var part = await getObject(download.Bucket, download.Key, range);
					if(part == 0){
						this.$notify({
							title: "温馨提示",
							message: key+"\n下载失败",
							duration: 5000,
							offset: 50,
							type: "error"
						});
						this.cancelDownload(this.downloadlist[index]);
						break;
					}else{
						let buffer = Buffer.from(part);
						let buff = Buffer.from(content);
						content = Buffer.concat([buff,buffer]);
						//异步操作后重新获取下载内容的index
						var index2 = 0;
						for(var k=0;k<this.downloadlist.length;k++){
							if(this.downloadlist[k].name == download.name){
								index2 = k;
								break;
							}
						}
						this.downloadlist[index2].percent2 = (i+1)/slice*100;
						this.downloadlist[index2].loading = false;
						console.log(this.downloadlist[index2].percent2);
					}				
				}else if(this.downloadlist[index].isActive == true && this.downloadlist[index].isdownloadPaused == true){
					for(var i=0;i<this.downloadtemp.length;i++){
						if(this.downloadtemp[i].Name == download.name){
							this.downloadtemp[i].Content = content;
							console.log('继续 缓存2',download.name,this.downloadtemp[i].Content);
							break;
						}
					}
					break;
				}else{
					break;
				}				
			}
			//异步操作后重新获取下载内容的index
			var index3 = 0;
			for(var h=0;h<this.downloadlist.length;h++){
				if(this.downloadlist[h].name == download.name){
					index3 = h;
					break;
				}
			}
			if(this.downloadlist[index3].isActive == true && this.downloadlist[index3].isdownloadPaused == false){
				console.log("content", content);
				var blob = new Blob([content]);
				var key = download.Key;
				var saveData = (function(blob, key) {
					var a = document.createElement("a");
					document.body.appendChild(a);
					a.style = "display: none";
					return function (blob, key) {
						var url = window.URL.createObjectURL(blob);
						a.href = url;
						a.download = key;
						a.click();
						window.URL.revokeObjectURL(url);
					};
				}());
				saveData(blob, key);				
				this.$notify({
					title: "温馨提示",
					message: key+"\n下载成功",
					duration: 5000,
					offset: 50,
					type: "success"
				});			
			}
		},
		//取消下载
		cancelDownload(download){
			var index = 0;
			for(var i=0;i<this.downloadlist.length;i++){
				if(this.downloadlist[i].name == download.name){
					console.log(this.downloadlist[i].name);
					index = i;
					break;
				}
			};
			this.downloadlist[index].isActive = false;			
			this.downloadlist.splice(index,1);
			//清空缓存
			if(this.downloadlist.length==0){
				this.downloadnum=[];
				this.downloadtemp = [];
			}
		},

		//文件详情
		handleInfo(scope){
			this.$data.detaildrawer = true;
			this.$data.objectName = scope.row.Key;			
			this.$data.ETag = scope.row.ETag;
			this.$data.LastModified = scope.row.LastModified;
			console.log("详情",scope.row.Key);
		},

		//删除文件
		handlescope(scope){
			this.$data.deletevisible = true;
			this.$data.scope = scope;
		},
		async handleDeleteObj(){
			let scope = this.$data.scope;
			console.log("删除",scope.row.Key);
			let bucket = this.$data.bucketName;
			let key = scope.row.Key;
			this.$data.deletevisible = false;
			var msg = await deleteObject(bucket, key);
			if(msg.err == null){
				this.$message({
					showClose: true,
					message: "删除成功",
					type: 'success'
				});
				this.objects = this.loadObjects(bucket);
			}else{
				this.$message({
					showClose: true,
					message: "删除失败",
					type: 'error'
				});
				this.objects = this.loadObjects(bucket);
			}			
		},

		//获取AccessKey
		async getKey(name){
			var data = await createKey(name);
			if(data != 0 ){
				var AccessKeyId = data.AccessKeyId;
				var SecretAccessKey = data.SecretAccessKey;
				ConfigKey(AccessKeyId, SecretAccessKey);
				this.buckets = this.loadAll();
			}else{
				this.$message.error('获取AccessKey失败！')
			}				
		}
	},
	mounted(){
		var name = this.$store.state.username;
		console.log(name);
		InitAWS(this.$store.state.interfaceIp);
		this.getKey(name);		
	}
};
</script>

<style>
*{
	padding: 0;
	margin: 0;
}
  .el-main{
		padding-bottom: 0;
	}
  .el-header {
    background-color: rgb(134, 191, 248);
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
    background-color: #99CCFF;
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
	.uploadlist{
		width: 60%;
		margin-bottom: 20px;
		margin-left: 20%;
	}
	.downloadlist{
		width: 60%;
		margin-bottom: 20px;
		margin-left: 20%;
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

	.icon {
		width: 1em;
		height: 1em;
		vertical-align: -0.15em;
		fill: currentColor;
		overflow: hidden;
	}

  
</style>