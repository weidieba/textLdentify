// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()


// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  console.log('create', event)
  try {
    addCollection(event).then(res => {
      return res.errMsg;
    })
    .catch(console.error);
  } catch (error) {
    console.error(error)
  }
  
}

function addCollection (data) {
    console.log('data数据', data)
    let collection = 'todos_' + data.openid
    return db.collection(collection).add({
        // data 字段表示需新增的 JSON 数据
        data: data
    })
}