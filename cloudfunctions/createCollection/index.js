// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    console.log('clound',event)
    try {
        createCollection(event).then(res => {
            return res.errMsg;
        })
        .catch(console.error);
    } catch (error) {
        console.error(error)
    }
}
function createCollection (data) {
    console.log('data数据', data)
    let collection = 'todos_' + data.openid
    return db.createCollection(collection)
}