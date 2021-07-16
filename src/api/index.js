import req from '../utils/request'

export default {
  // restful api请求范例
  getData: (p) => req.get('/getData', { params: p }),
  postData: (p) => req.post('/postData', p),
  putData: (p) => req.put('/putData', p),
  deleteData: (id) => req.delete(`/deleteData/${id}`),
}