// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()


// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
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
  return db.collection('todos').add({
    // data 字段表示需新增的 JSON 数据
    data: data
  })
}