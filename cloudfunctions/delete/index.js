// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  // let test = db.collection('todos').where({_id: _.in(event.checkVal)}).get();
  // test.then(res=> {
  //   console.log("res",res)
  // })
  try {
    deleteData(event).then(res => {
      console.log(res)
      return res;
    })
    .catch(console.error);
  } catch (error) {
    console.error(error)
  }
  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}

function deleteData(event) {
  return db.collection('todos').where({_id: _.in(event.checkVal)}).remove();
}