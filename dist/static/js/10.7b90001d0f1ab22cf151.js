webpackJsonp([10],{QSR2:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=a("fZjL"),s=a.n(r),n=a("7lgi"),o={inject:["reload"],data:function(){return{dialogFormVisible:!1,getSearchInfo:[],searchTableInfo:"",search:"",pagesize:Object(n.a)(),currpage:1,form:{id:""},reset:!1,old_name:"",username:"",formLabelWidth:"120px",options:[],btn:!0,btn1:!0,btn3:!0}},computed:{tableData:function(){var e=this.searchTableInfo;return e?this.getSearchInfo.filter(function(t){return s()(t).some(function(a){return String(t[a]).toLowerCase().indexOf(e)>-1})}):this.getSearchInfo}},watch:{username:function(e,t){e==this.old_name?this.btn1=!0:this.btn1=!1},reset:function(e,t){this.btn3=0==e}},methods:{getRowClass:function(e){e.row,e.column,e.rowIndex,e.columnIndex;return"background:#f1f3fa;color:rgba(0,0,0,85);"},handleEdit:function(e,t){this.dialogFormVisible=!0,this.username=t.user_name,this.old_name=t.user_name.concat(),this.reset=!1,this.btn=!0,this.id=t.id},edit:function(){var e=this;this.username==this.old_name&&(this.username=""),0==this.reset?this.reset="":this.reset="123456";var t=this.$ajax.defaults.headers.common;t.token=localStorage.getItem("token"),t.username=localStorage.getItem("user_name"),this.$ajax.post("/modify_user",{id:this.id,user_name:encodeURI(this.username),service_code:"",password:this.reset}).then(function(t){switch(t.data.code){case 0:e.reload(),e.$message({type:"error",message:"修改失败"});break;case 1:e.reload(),e.$message({type:"success",message:"编辑信息成功"});break;case 2:e.$message({type:"warning",message:"用户名已存在"});break;case-1:alert("登录已失效,请重新登录!"),localStorage.clear(),e.$router.push("/")}}).catch(function(t){e.$message({type:"error",message:"修改信息失败"}),e.reload()}),0==this.reset?this.reset=!1:this.reset=!0},handleDelete:function(e,t){var a=this;this.id=t.id,this.$confirm("此操作将永久删除该用户信息, 是否继续?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){var e=a.$ajax.defaults.headers.common;e.token=localStorage.getItem("token"),e.username=localStorage.getItem("user_name"),a.$ajax.post("/delete_user",{id:a.id,service_code:""}).then(function(e){switch(e.data.code){case 0:a.$message({type:"error",message:"删除失败!"});break;case-1:alert("登录已失效,请重新登录!"),localStorage.clear(),a.$router.push("/");break;default:a.$message({type:"success",message:"删除成功!"})}a.reload()})}).catch(function(){a.$message({type:"info",message:"已取消删除"})})},handleCurrentChange:function(e){this.currpage=e},formatter:function(e,t){var a=e[t.property];return void 0==a?"":moment(1e3*a).format("YYYY-MM-DD HH:mm:ss")},users:function(){var e=this,t=this.$ajax.defaults.headers.common;t.token=localStorage.getItem("token"),t.username=localStorage.getItem("user_name"),this.$ajax.post("/user_list").then(function(t){if(-1==t.data.code)return alert("登录已失效,请重新登录!"),localStorage.clear(),void e.$router.push("/");var a=t.data.user;e.getSearchInfo=a}).catch(function(t){e.$message({type:"error",message:"获取用户信息失败"})})}},mounted:function(){this.users()}},i={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("div",[a("el-button",{staticClass:"header-tip",staticStyle:{"margin-bottom":"10px"},attrs:{type:"primary"},on:{click:function(t){return e.$router.push("/registered")}}},[e._v("新建用户")])],1),e._v(" "),a("div",{staticClass:"table-wrapper"},[a("el-table",{staticStyle:{width:"100%","font-size":"16px"},attrs:{border:"",data:e.tableData.slice((e.currpage-1)*e.pagesize,e.currpage*e.pagesize),"row-style":e.getRowClass,"header-row-style":e.getRowClass,"header-cell-style":e.getRowClass}},[a("el-table-column",{attrs:{label:"用户名称",prop:"user_name",align:"center","min-width":"185px"}}),e._v(" "),a("el-table-column",{attrs:{label:"创建时间",prop:"create_time",align:"center",formatter:e.formatter,"min-width":"185px"}}),e._v(" "),a("el-table-column",{attrs:{align:"center","min-width":"185px"},scopedSlots:e._u([{key:"header",fn:function(t){return[a("el-input",{attrs:{size:"mini","prefix-icon":"el-icon-search",placeholder:"请输入内容搜索"},model:{value:e.searchTableInfo,callback:function(t){e.searchTableInfo=t},expression:"searchTableInfo"}})]}},{key:"default",fn:function(t){return[a("el-link",{attrs:{type:"primary"},on:{click:function(a){return e.handleEdit(t.$index,t.row)}}},[e._v("编辑")]),e._v(" "),a("el-link",{attrs:{type:"danger"},on:{click:function(a){return e.handleDelete(t.$index,t.row)}}},[e._v("删除")])]}}])})],1),e._v(" "),a("el-pagination",{attrs:{background:"",layout:"total, prev, pager, next, jumper",total:e.tableData.length},on:{"current-change":e.handleCurrentChange}})],1),e._v(" "),a("div",{staticClass:"edit_dia"},[a("el-dialog",{attrs:{"close-on-click-modal":!1,title:"编辑信息",visible:e.dialogFormVisible},on:{"update:visible":function(t){e.dialogFormVisible=t}}},[a("el-form",{attrs:{model:e.form}},[a("el-form-item",{attrs:{label:"用户名称","label-width":e.formLabelWidth}},[a("el-input",{staticStyle:{width:"217px"},attrs:{autocomplete:"off"},model:{value:e.username,callback:function(t){e.username="string"==typeof t?t.trim():t},expression:"username"}})],1),e._v(" "),a("el-form-item",[a("el-switch",{staticStyle:{display:"block"},attrs:{"active-color":"#13ce66","inactive-color":"#ff4949","active-text":"重置密码","inactive-text":"不重置密码"},model:{value:e.reset,callback:function(t){e.reset=t},expression:"reset"}})],1)],1),e._v(" "),a("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:function(t){e.dialogFormVisible=!1}}},[e._v("取 消")]),e._v(" "),a("el-button",{attrs:{type:"primary",disabled:e.btn1&&e.btn3?e.btn:0==e.btn},on:{click:function(t){return e.edit()}}},[e._v("确 定")])],1)],1)],1)])},staticRenderFns:[]};var l=a("VU/8")(o,i,!1,function(e){a("yQXm")},"data-v-13bc8500",null);t.default=l.exports},yQXm:function(e,t){}});