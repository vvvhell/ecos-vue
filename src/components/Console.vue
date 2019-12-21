<template>
  <div id="console">
    <el-container style="height:98vh">      
			<el-header style="height:100px">
				<span>ECOS | 管理控制台</span>
				<span style="float:right">
					<el-dropdown @command="handleCommand" trigger=click>
						<span class="el-dropdown-link">
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
        <el-aside width="15vw">
					<el-menu
						default-active="2"
						class="el-menu-vertical-demo"
						@open="handleOpen"
						@close="handleClose"
						background-color="rgb(132, 145, 161)"
						text-color="#fff"
						active-text-color="#ffd04b">
						<el-submenu index="1">
							<template slot="title">
								<i class="el-icon-location"></i>
								<span>导航一</span>
							</template>
							<el-menu-item-group>
								<template slot="title">分组一</template>
								<el-menu-item index="1-1">选项1</el-menu-item>
								<el-menu-item index="1-2">选项2</el-menu-item>
							</el-menu-item-group>
							<el-menu-item-group title="分组2">
								<el-menu-item index="1-3">选项3</el-menu-item>
							</el-menu-item-group>
							<el-submenu index="1-4">
								<template slot="title">选项4</template>
								<el-menu-item index="1-4-1">选项1</el-menu-item>
							</el-submenu>
						</el-submenu>
						<el-menu-item index="2">
							<i class="el-icon-menu"></i>
							<span slot="title">导航二</span>
						</el-menu-item>
						<el-menu-item index="3" disabled>
							<i class="el-icon-document"></i>
							<span slot="title">导航三</span>
						</el-menu-item>
						<el-menu-item index="4">
							<i class="el-icon-setting"></i>
							<span slot="title">导航四</span>
						</el-menu-item>
					</el-menu>
				</el-aside>

        <el-container>
          <el-main>

					</el-main>
          
					<el-footer>北京大学•深圳研究生院</el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data() {
    return {
    };
  },
  methods: {    
		handleCommand(command) {
			if(command ==="about"){
				console.log("about")
			}
			else{
				console.log("logout")
			}
		},
		handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
		handleClose(key, keyPath) {
			console.log(key, keyPath);
		}
  }
};
</script>

<style>
  .el-header {
    background-color: rgb(132, 145, 161);
    color: rgb(255, 255, 255);
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
    background-color: rgb(132, 145, 161);
    color: #333;
    text-align: center;
    line-height: 300px;
  }
  
  .el-main {
    background-color:radial-gradient(
    ellipse at top left,
    rgba(255, 255, 255, 1) 40%,
    rgba(229, 229, 229, 0.9) 100%
  );
    color: #333;
    text-align: center;
    line-height: 160px;
		padding-top: 50px;
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
  
</style>