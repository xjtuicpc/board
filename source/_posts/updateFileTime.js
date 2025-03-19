#!/usr/bin/env node
/*
批量更新修改时间
博客自动更新文章的修改时间
*/

console.log('脚本开始运行..');
var fs = require("fs"); //请求文件系统
var file = "./txt"; //设置读取和写入的文件，当前目录下的test文件
var RegExp=/(updated:\s*)((\d{2}(([02468][048])|([13579][26]))[\-\/\s]?((((0?[13578])|(1[02]))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(3[01])))|(((0?[469])|(11))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(30)))|(0?2[\-\/\s]?((0?[1-9])|([1-2][0-9])))))|(\d{2}(([02468][1235679])|([13579][01345789]))[\-\/\s]?((((0?[13578])|(1[02]))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(3[01])))|(((0?[469])|(11))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(30)))|(0?2[\-\/\s]?((0?[1-9])|(1[0-9])|(2[0-8]))))))(\s((([0-1][0-9])|(2?[0-3]))\:([0-5]?[0-9])((\s)|(\:([0-5]?[0-9])))))/g;

fs.readdir("./",function(err,files){
	var len=files.length;
	var file=null;
	for(var i=0;i<len;i++){
		file=files[i];
		//console.log("读取文件：",file);
		if(file.indexOf(".md")>-1){
			console.log("正在处理文件：",file);
			writeFileTime(file,fs);
		}
	}
});


const { execSync } = require('child_process');

function getGitLastCommitTime(filePath) {
  try {
    const timestamp = execSync(`git log -1 --format=%ct ${filePath}`).toString().trim();
	
    const commitTime = new Date(parseInt(timestamp) * 1000);
	const formaltime = commitTime.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai', hour12: false });
	//console.log(`Last commit time for ${filePath}: ${formaltime}`);
    return formaltime;
  } catch (err) {
    console.error(`Error executing git log: ${err}`);
    return null;
  }
}

/*
file:读取时间的文件以及写入内容的文件
fs: 文件系统
*/
function writeFileTime(file,fs){
	fs.readFile(file, 'utf8',function(err, data) { //读取文件内容
		if (err) return console.log("读取文件内容错误：",err);
		//console.log("文件"+file+"的内容：",data);
		if(RegExp.test(data)){ //如果匹配到`updated`字段
			fs.stat(file,function(err, stats) { //读取文件信息，创建时间等
				if (err) return console.log("读取文件信息错误：",err);
				var updateds=data.match(RegExp);
				//console.log("updated数组:",updateds);
				if(updateds.length>1) console.log("文件"+file+"匹配到多处update字段");
				var updated=updateds[0].replace("updated: ","").replace(/-/g,"/");  //时间格式化为2018/01/29 21:33:30
				//console.log("updated:",updated);
				var git_latest_update = getGitLastCommitTime(file)
				//console.log("updated:", git_latest_update, updated, stats.atime, stats.mtime);
				if(new Date(Date.parse(git_latest_update))-new Date(Date.parse(updated))>1000*60*5){ // 只要修改时间和文章内updated时间差大于1000毫秒*60*5=5分钟就触发更新
					var result= data.replace(RegExp,"updated: "+ git_latest_update.replace(/\//g, '-')); //替换更新时间
					fs.writeFile(file, result, 'utf8',function(err) { //写入新的文件内容
						if (err) return console.log("写文件错误：",err);
						fs.utimes(file,new Date(stats.atime),new Date(stats.mtime),function(err){  //还原访问时间和修改时间
							if (err) return console.log("修改时间失败：",err);
							console.log(file,"成功更新时间");
						});
					});
				}
			});
		}	
	});
}
