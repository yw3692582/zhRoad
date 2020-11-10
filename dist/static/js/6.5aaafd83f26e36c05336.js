webpackJsonp([6],{"/tEo":function(e,r){},puWT:function(e,r,s){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var a={data:function(){var e=this;return{radio:"2",ruleForm:{username:"",password:"",ageinPass:""},rules:{password:[{required:!0,validator:function(r,s,a){""===s?a(new Error("请输入密码")):(""!==e.ruleForm.ageinPass&&e.$refs.ruleForm.validateField("ageinPass"),a())},trigger:"blur"}],ageinPass:[{required:!0,validator:function(r,s,a){""===s?a(new Error("请再次输入密码")):s!==e.ruleForm.password?a(new Error("两次输入密码不一致!")):a()},trigger:"blur"}]},value:"",is_admin:0,options:[]}},watch:{"ruleForm.username":function(e,r){12==e.length&&this.$message({type:"warning",message:"用户名长度不能大于12"})},"ruleForm.password":function(e,r){15==e.length&&this.$message({type:"warning",message:"密码长度不能大于15"})}},methods:{register:function(e){var r=this;this.$refs[e].validate(function(e){if(r.ruleForm.password.length<6)r.$message({type:"warning",message:"密码长度不能小于6"});else{if(!e)return r.$message({type:"error",message:"请检查两次输入的密码是否一致"}),!1;var s=r.$ajax.defaults.headers.common;s.token=localStorage.getItem("token"),s.username=localStorage.getItem("user_name"),r.$ajax.post("/add_user",{username:encodeURI(r.ruleForm.username),password:r.ruleForm.password,service_code:"",is_admin:r.is_admin}).then(function(e){switch(e.data.code){case-1:alert("登录已失效,请重新登录!"),localStorage.clear(),r.$router.push("/");break;case 0:r.$message({type:"error",message:"新建用户失败！"});break;case 1:r.$router.push("/users"),r.$message({type:"success",message:"用户添加成功！"});break;case 2:r.$message({type:"warning",message:"用户已存在！"});break;default:r.$message({type:"warning",message:"业务号不存在！"})}})}})}},mounted:function(){}},t={render:function(){var e=this,r=e.$createElement,s=e._self._c||r;return s("div",[s("div",[s("el-page-header",{attrs:{content:"新建用户"},on:{back:function(r){return e.$router.push("/users")}}}),e._v(" "),s("el-divider")],1),e._v(" "),s("div",{staticClass:"box"},[s("el-card",{staticClass:"login-card",attrs:{header:"新建用户"}},[s("el-form",{ref:"ruleForm",attrs:{model:e.ruleForm,"status-icon":"",rules:e.rules},nativeOn:{submit:function(e){e.preventDefault()}}},[s("el-form-item",{attrs:{label:"用户名",prop:"username",rules:{required:!0,message:"用户名不能为空"}}},[s("el-input",{attrs:{maxlength:"12",onkeyup:"value=value.replace(/[^\\w_]/g,'');",placeholder:"不要使用中文"},model:{value:e.ruleForm.username,callback:function(r){e.$set(e.ruleForm,"username","string"==typeof r?r.trim():r)},expression:"ruleForm.username"}})],1),e._v(" "),s("el-form-item",{attrs:{label:"密码",prop:"password"}},[s("el-input",{attrs:{maxlength:"15",type:"password",placeholder:"请输入密码",autocomplete:"off"},model:{value:e.ruleForm.password,callback:function(r){e.$set(e.ruleForm,"password","string"==typeof r?r.trim():r)},expression:"ruleForm.password"}})],1),e._v(" "),s("el-form-item",{attrs:{label:"确认密码",prop:"ageinPass"}},[s("el-input",{attrs:{type:"password",placeholder:"请再次输入密码",autocomplete:"off"},model:{value:e.ruleForm.ageinPass,callback:function(r){e.$set(e.ruleForm,"ageinPass","string"==typeof r?r.trim():r)},expression:"ruleForm.ageinPass"}})],1),e._v(" "),s("el-form-item",[s("el-button",{attrs:{type:"primary","native-type":"submit"},on:{click:function(r){return e.register("ruleForm")}}},[e._v("新建")])],1)],1)],1)],1)])},staticRenderFns:[]};var o=s("VU/8")(a,t,!1,function(e){s("/tEo")},"data-v-60c92738",null);r.default=o.exports}});