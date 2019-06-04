	//数据提纯
	const fs = require('fs')
	fs.readFile('./goods.json','utf8',(err,data)=>{
		let newData = JSON.parse(data)
		let i = 0
		let pushData = []
		newData.RECORDS.map((value,index)=>{
			if(value.IMAGE1!=null){
				i++
				// console.log(value.NAME)
				pushData.push(value)
				
			}
		})
		fs.writeFile('./newGoods.json',JSON.stringify(pushData),(err)=>{
			if(err) console.log('写入数据失败')
			else console.log('写入数据成功')
		})
	})
	