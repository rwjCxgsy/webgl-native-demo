var Et=Object.defineProperty;var Tt=(i,t,e)=>t in i?Et(i,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):i[t]=e;var A=(i,t,e)=>(Tt(i,typeof t!="symbol"?t+"":t,e),e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function e(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerpolicy&&(s.referrerPolicy=r.referrerpolicy),r.crossorigin==="use-credentials"?s.credentials="include":r.crossorigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(r){if(r.ep)return;r.ep=!0;const s=e(r);fetch(r.href,s)}})();class B{constructor(t,e,n,r={}){A(this,"u_bias",-1e-4);A(this,"color",16777215);A(this,"textures",[]);A(this,"time",0);this.vs=t,this.fs=e,this.type=n,Object.entries(r).forEach(([s,o])=>{this[s]=o})}}const Mt=`attribute vec4 a_position;

attribute vec3 a_normal;

attribute vec2 a_texcoord;


// 相机三剑客

uniform mat4 u_projection;


uniform mat4 u_camera;

uniform mat4 u_modelView;

// 法线

varying vec3 v_normal;


varying vec2 v_texcoord;

void main() {
  gl_Position = u_projection * u_camera * u_modelView * a_position;

  v_normal = a_normal;

  v_texcoord = a_texcoord;
}`,Ct=`precision mediump float;

uniform vec3 u_color;

varying vec3 a_normal;
varying vec2 v_texcoord;

uniform sampler2D u_texture0;




void main() {
   
   gl_FragColor = texture2D(u_texture0, v_texcoord);

   bvec4 e = equal(gl_FragColor, vec4(0.0, 0.0, 0.0, 1.0));
   if (all(e)) {
      gl_FragColor = vec4(u_color,  1.0);
   }
}`;class zt extends B{constructor(t){super(Mt,Ct,"BasicMaterial",t)}}const Lt=`attribute vec4 a_position;
attribute vec3 a_normal;
attribute vec2 a_texcoord;

uniform mat4 u_projection;

uniform mat4 u_camera;

uniform mat4 u_modelView;


varying vec3 v_normal;

// 灯光位置
uniform vec3 u_lightPosition;

// 相机位置
uniform vec3 u_cameraPosition;

// 计算点到灯光向量
varying vec3 v_fragToLight;

varying vec3 v_fragToCamera;

varying float v_fogDepth;
varying vec3 v_lightPosition;

// 阴影lookat 矩阵 相关参数
uniform mat4 u_textureMatrix;
// 阴影投影矩阵
varying vec4 v_projectedTexcoord;

varying vec2 v_texcoord;

void main(){


  vec4 worldPosition = u_modelView*a_position;

  gl_Position=u_projection*u_camera*worldPosition;
  

  
  v_normal=normalize(mat3(u_modelView) * a_normal);
  
  // 计算点到灯光向量
  v_fragToLight=u_lightPosition-vec3(worldPosition);
  
  v_fragToCamera=u_cameraPosition-vec3(u_camera * worldPosition);

    v_fogDepth = -worldPosition.z;

    v_lightPosition = u_lightPosition;


      // 阴影
  v_projectedTexcoord = u_textureMatrix * worldPosition;

  v_texcoord = a_texcoord;
}
`,St=`
precision mediump float;

uniform vec3 u_color;

uniform float u_bias;

// 灯光颜色
uniform vec3 u_lightColor;
// 环境光颜色
uniform vec3 u_baseLightColor;

varying vec3 v_normal;

varying vec3 v_fragToLight;

varying vec3 v_fragToCamera;

varying float v_fogDepth;

varying vec3 v_lightPosition;

varying vec2 v_texcoord;

// 阴影相关
varying vec4 v_projectedTexcoord;
// 深度纹理
uniform sampler2D u_projectedTexture;



void main(){
  
  float u_bias = -0.0;
  // 原色
  vec3 color=u_color;
  
  vec3 projectedTexcoord=v_projectedTexcoord.xyz/v_projectedTexcoord.w;
    float currentDepth=projectedTexcoord.z + u_bias;
    
    bool inRange=
    projectedTexcoord.x>=-1.0 &&
    projectedTexcoord.x<=1.&&
    projectedTexcoord.y>=-1.0 &&
    projectedTexcoord.y<=1.;
    
    // the 'r' channel has the depth values

    vec2 uv = (vec2(projectedTexcoord.xy) + 1.0) / 2.0; 
    float projectedDepth=texture2D(u_projectedTexture,uv.xy).r;
    float shadowLight=(inRange && projectedDepth <= currentDepth) ? 0.0 : 1.0;
  
  vec3 toLight=normalize(v_fragToLight);
  vec3 toView=normalize(v_fragToCamera);
  
  // 环境光 50%
  vec4 ambient=vec4(color*u_baseLightColor*.4,1.);
  
  float diffuseAmt=max(dot(toLight,v_normal), 0.0);
  vec4 diffuse=vec4(color*u_lightColor*.6*diffuseAmt * shadowLight,1.);

  vec3 halfVector=normalize(toView+toLight);
  float light=max(dot(v_normal,toView),0.);
  float specular=0.;
  
  if(light>0.){
    specular=pow(max(dot(v_normal,halfVector), 0.0),412.);
  }
  
  vec4 specularColor=vec4(u_lightColor.rgb*abs(specular * shadowLight),1.);
  
  vec4 frag=ambient+diffuse+specularColor;
  


  // gl_FragColor = texture2D(u_projectedTexture,uv.xy);
  gl_FragColor = frag;
  
  
}`;class st extends B{constructor(t){super(Lt,St,"StandardMaterial",t)}}class pt extends B{constructor(t,e,n){super(t,e,"ShaderMaterial",n)}}const Dt=`attribute vec4 a_position;

attribute vec3 a_normal;

attribute vec2 a_texcoord;


// 相机三剑客

uniform mat4 u_projection;


uniform mat4 u_camera;

uniform mat4 u_modelView;

// 法线

varying vec3 v_normal;


varying vec2 v_texcoord;

void main() {
  gl_Position = u_projection * u_camera * u_modelView * a_position;

  v_normal = a_normal;

  v_texcoord = a_texcoord;
}`,Ft=`precision mediump float;

uniform vec3 u_color;

// 法线

varying vec3 v_normal;


varying vec2 v_texcoord;


void main() {
   
   gl_FragColor = vec4(u_color, 1.0);
}`;class Rt extends B{constructor(){super(Dt,Ft,"ShadowMaterial")}}var Y=typeof Float32Array<"u"?Float32Array:Array;Math.hypot||(Math.hypot=function(){for(var i=0,t=arguments.length;t--;)i+=arguments[t]*arguments[t];return Math.sqrt(i)});function T(){var i=new Y(16);return Y!=Float32Array&&(i[1]=0,i[2]=0,i[3]=0,i[4]=0,i[6]=0,i[7]=0,i[8]=0,i[9]=0,i[11]=0,i[12]=0,i[13]=0,i[14]=0),i[0]=1,i[5]=1,i[10]=1,i[15]=1,i}function O(i,t){var e=t[0],n=t[1],r=t[2],s=t[3],o=t[4],h=t[5],m=t[6],l=t[7],c=t[8],a=t[9],d=t[10],u=t[11],p=t[12],f=t[13],g=t[14],_=t[15],w=e*h-n*o,v=e*m-r*o,x=e*l-s*o,y=n*m-r*h,b=n*l-s*h,L=r*l-s*m,S=c*f-a*p,M=c*g-d*p,C=c*_-u*p,R=a*g-d*f,j=a*_-u*f,I=d*_-u*g,E=w*I-v*j+x*R+y*C-b*M+L*S;return E?(E=1/E,i[0]=(h*I-m*j+l*R)*E,i[1]=(r*j-n*I-s*R)*E,i[2]=(f*L-g*b+_*y)*E,i[3]=(d*b-a*L-u*y)*E,i[4]=(m*C-o*I-l*M)*E,i[5]=(e*I-r*C+s*M)*E,i[6]=(g*x-p*L-_*v)*E,i[7]=(c*L-d*x+u*v)*E,i[8]=(o*j-h*C+l*S)*E,i[9]=(n*C-e*j-s*S)*E,i[10]=(p*b-f*x+_*w)*E,i[11]=(a*x-c*b-u*w)*E,i[12]=(h*M-o*R-m*S)*E,i[13]=(e*R-n*M+r*S)*E,i[14]=(f*v-p*y-g*w)*E,i[15]=(c*y-a*v+d*w)*E,i):null}function K(i,t,e){var n=t[0],r=t[1],s=t[2],o=t[3],h=t[4],m=t[5],l=t[6],c=t[7],a=t[8],d=t[9],u=t[10],p=t[11],f=t[12],g=t[13],_=t[14],w=t[15],v=e[0],x=e[1],y=e[2],b=e[3];return i[0]=v*n+x*h+y*a+b*f,i[1]=v*r+x*m+y*d+b*g,i[2]=v*s+x*l+y*u+b*_,i[3]=v*o+x*c+y*p+b*w,v=e[4],x=e[5],y=e[6],b=e[7],i[4]=v*n+x*h+y*a+b*f,i[5]=v*r+x*m+y*d+b*g,i[6]=v*s+x*l+y*u+b*_,i[7]=v*o+x*c+y*p+b*w,v=e[8],x=e[9],y=e[10],b=e[11],i[8]=v*n+x*h+y*a+b*f,i[9]=v*r+x*m+y*d+b*g,i[10]=v*s+x*l+y*u+b*_,i[11]=v*o+x*c+y*p+b*w,v=e[12],x=e[13],y=e[14],b=e[15],i[12]=v*n+x*h+y*a+b*f,i[13]=v*r+x*m+y*d+b*g,i[14]=v*s+x*l+y*u+b*_,i[15]=v*o+x*c+y*p+b*w,i}function Pt(i,t,e){var n=e[0],r=e[1],s=e[2],o,h,m,l,c,a,d,u,p,f,g,_;return t===i?(i[12]=t[0]*n+t[4]*r+t[8]*s+t[12],i[13]=t[1]*n+t[5]*r+t[9]*s+t[13],i[14]=t[2]*n+t[6]*r+t[10]*s+t[14],i[15]=t[3]*n+t[7]*r+t[11]*s+t[15]):(o=t[0],h=t[1],m=t[2],l=t[3],c=t[4],a=t[5],d=t[6],u=t[7],p=t[8],f=t[9],g=t[10],_=t[11],i[0]=o,i[1]=h,i[2]=m,i[3]=l,i[4]=c,i[5]=a,i[6]=d,i[7]=u,i[8]=p,i[9]=f,i[10]=g,i[11]=_,i[12]=o*n+c*r+p*s+t[12],i[13]=h*n+a*r+f*s+t[13],i[14]=m*n+d*r+g*s+t[14],i[15]=l*n+u*r+_*s+t[15]),i}function _t(i,t,e){var n=Math.sin(e),r=Math.cos(e),s=t[4],o=t[5],h=t[6],m=t[7],l=t[8],c=t[9],a=t[10],d=t[11];return t!==i&&(i[0]=t[0],i[1]=t[1],i[2]=t[2],i[3]=t[3],i[12]=t[12],i[13]=t[13],i[14]=t[14],i[15]=t[15]),i[4]=s*r+l*n,i[5]=o*r+c*n,i[6]=h*r+a*n,i[7]=m*r+d*n,i[8]=l*r-s*n,i[9]=c*r-o*n,i[10]=a*r-h*n,i[11]=d*r-m*n,i}function $t(i,t,e){var n=Math.sin(e),r=Math.cos(e),s=t[0],o=t[1],h=t[2],m=t[3],l=t[8],c=t[9],a=t[10],d=t[11];return t!==i&&(i[4]=t[4],i[5]=t[5],i[6]=t[6],i[7]=t[7],i[12]=t[12],i[13]=t[13],i[14]=t[14],i[15]=t[15]),i[0]=s*r-l*n,i[1]=o*r-c*n,i[2]=h*r-a*n,i[3]=m*r-d*n,i[8]=s*n+l*r,i[9]=o*n+c*r,i[10]=h*n+a*r,i[11]=m*n+d*r,i}function kt(i,t,e){var n=Math.sin(e),r=Math.cos(e),s=t[0],o=t[1],h=t[2],m=t[3],l=t[4],c=t[5],a=t[6],d=t[7];return t!==i&&(i[8]=t[8],i[9]=t[9],i[10]=t[10],i[11]=t[11],i[12]=t[12],i[13]=t[13],i[14]=t[14],i[15]=t[15]),i[0]=s*r+l*n,i[1]=o*r+c*n,i[2]=h*r+a*n,i[3]=m*r+d*n,i[4]=l*r-s*n,i[5]=c*r-o*n,i[6]=a*r-h*n,i[7]=d*r-m*n,i}function Vt(i,t,e,n,r){var s=1/Math.tan(t/2),o;return i[0]=s/e,i[1]=0,i[2]=0,i[3]=0,i[4]=0,i[5]=s,i[6]=0,i[7]=0,i[8]=0,i[9]=0,i[11]=-1,i[12]=0,i[13]=0,i[15]=0,r!=null&&r!==1/0?(o=1/(n-r),i[10]=(r+n)*o,i[14]=2*r*n*o):(i[10]=-1,i[14]=-2*n),i}var Ut=Vt;function Bt(i,t,e,n){var r=t[0],s=t[1],o=t[2],h=n[0],m=n[1],l=n[2],c=r-e[0],a=s-e[1],d=o-e[2],u=c*c+a*a+d*d;u>0&&(u=1/Math.sqrt(u),c*=u,a*=u,d*=u);var p=m*d-l*a,f=l*c-h*d,g=h*a-m*c;return u=p*p+f*f+g*g,u>0&&(u=1/Math.sqrt(u),p*=u,f*=u,g*=u),i[0]=p,i[1]=f,i[2]=g,i[3]=0,i[4]=a*g-d*f,i[5]=d*p-c*g,i[6]=c*f-a*p,i[7]=0,i[8]=c,i[9]=a,i[10]=d,i[11]=0,i[12]=r,i[13]=s,i[14]=o,i[15]=1,i}function V(){var i=new Y(3);return Y!=Float32Array&&(i[0]=0,i[1]=0,i[2]=0),i}function jt(i,t,e){var n=t[0],r=t[1],s=t[2],o=e[3]*n+e[7]*r+e[11]*s+e[15];return o=o||1,i[0]=(e[0]*n+e[4]*r+e[8]*s+e[12])/o,i[1]=(e[1]*n+e[5]*r+e[9]*s+e[13])/o,i[2]=(e[2]*n+e[6]*r+e[10]*s+e[14])/o,i}(function(){var i=V();return function(t,e,n,r,s,o){var h,m;for(e||(e=3),n||(n=0),r?m=Math.min(r*e+n,t.length):m=t.length,h=n;h<m;h+=e)i[0]=t[h],i[1]=t[h+1],i[2]=t[h+2],s(i,i,o),t[h]=i[0],t[h+1]=i[1],t[h+2]=i[2];return t}})();class It{constructor(t,e){A(this,"id");A(this,"modelView",T());A(this,"position",V());A(this,"xRotate",0);A(this,"yRotate",0);A(this,"zRotate",0);A(this,"name");this.geometry=t,this.material=e,this.id=Math.random().toString().substring(2)}transform(){const t=T();Pt(t,T(),this.position);const e=T();_t(e,T(),this.xRotate),$t(e,e,this.yRotate),kt(e,e,this.zRotate),K(this.modelView,e,t)}setPosition(t){this.position=t,this.transform()}rotateX(t){this.xRotate=Math.PI/180*t,this.transform()}rotateY(t){this.yRotate=Math.PI/180*t,this.transform()}rotateZ(t){this.zRotate=Math.PI/180*t,this.transform()}translation(){}}class k extends It{constructor(t,e){super(t,e)}}/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const gt="149";function ft(i,t,e){return Math.max(t,Math.min(e,i))}class Nt{constructor(t=0,e=0,n=0,r=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=r}static slerpFlat(t,e,n,r,s,o,h){let m=n[r+0],l=n[r+1],c=n[r+2],a=n[r+3];const d=s[o+0],u=s[o+1],p=s[o+2],f=s[o+3];if(h===0){t[e+0]=m,t[e+1]=l,t[e+2]=c,t[e+3]=a;return}if(h===1){t[e+0]=d,t[e+1]=u,t[e+2]=p,t[e+3]=f;return}if(a!==f||m!==d||l!==u||c!==p){let g=1-h;const _=m*d+l*u+c*p+a*f,w=_>=0?1:-1,v=1-_*_;if(v>Number.EPSILON){const y=Math.sqrt(v),b=Math.atan2(y,_*w);g=Math.sin(g*b)/y,h=Math.sin(h*b)/y}const x=h*w;if(m=m*g+d*x,l=l*g+u*x,c=c*g+p*x,a=a*g+f*x,g===1-h){const y=1/Math.sqrt(m*m+l*l+c*c+a*a);m*=y,l*=y,c*=y,a*=y}}t[e]=m,t[e+1]=l,t[e+2]=c,t[e+3]=a}static multiplyQuaternionsFlat(t,e,n,r,s,o){const h=n[r],m=n[r+1],l=n[r+2],c=n[r+3],a=s[o],d=s[o+1],u=s[o+2],p=s[o+3];return t[e]=h*p+c*a+m*u-l*d,t[e+1]=m*p+c*d+l*a-h*u,t[e+2]=l*p+c*u+h*d-m*a,t[e+3]=c*p-h*a-m*d-l*u,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,r){return this._x=t,this._y=e,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e){const n=t._x,r=t._y,s=t._z,o=t._order,h=Math.cos,m=Math.sin,l=h(n/2),c=h(r/2),a=h(s/2),d=m(n/2),u=m(r/2),p=m(s/2);switch(o){case"XYZ":this._x=d*c*a+l*u*p,this._y=l*u*a-d*c*p,this._z=l*c*p+d*u*a,this._w=l*c*a-d*u*p;break;case"YXZ":this._x=d*c*a+l*u*p,this._y=l*u*a-d*c*p,this._z=l*c*p-d*u*a,this._w=l*c*a+d*u*p;break;case"ZXY":this._x=d*c*a-l*u*p,this._y=l*u*a+d*c*p,this._z=l*c*p+d*u*a,this._w=l*c*a-d*u*p;break;case"ZYX":this._x=d*c*a-l*u*p,this._y=l*u*a+d*c*p,this._z=l*c*p-d*u*a,this._w=l*c*a+d*u*p;break;case"YZX":this._x=d*c*a+l*u*p,this._y=l*u*a+d*c*p,this._z=l*c*p-d*u*a,this._w=l*c*a-d*u*p;break;case"XZY":this._x=d*c*a-l*u*p,this._y=l*u*a-d*c*p,this._z=l*c*p+d*u*a,this._w=l*c*a+d*u*p;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e!==!1&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,r=Math.sin(n);return this._x=t.x*r,this._y=t.y*r,this._z=t.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],r=e[4],s=e[8],o=e[1],h=e[5],m=e[9],l=e[2],c=e[6],a=e[10],d=n+h+a;if(d>0){const u=.5/Math.sqrt(d+1);this._w=.25/u,this._x=(c-m)*u,this._y=(s-l)*u,this._z=(o-r)*u}else if(n>h&&n>a){const u=2*Math.sqrt(1+n-h-a);this._w=(c-m)/u,this._x=.25*u,this._y=(r+o)/u,this._z=(s+l)/u}else if(h>a){const u=2*Math.sqrt(1+h-n-a);this._w=(s-l)/u,this._x=(r+o)/u,this._y=.25*u,this._z=(m+c)/u}else{const u=2*Math.sqrt(1+a-n-h);this._w=(o-r)/u,this._x=(s+l)/u,this._y=(m+c)/u,this._z=.25*u}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(ft(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const r=Math.min(1,e/n);return this.slerp(t,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,r=t._y,s=t._z,o=t._w,h=e._x,m=e._y,l=e._z,c=e._w;return this._x=n*c+o*h+r*l-s*m,this._y=r*c+o*m+s*h-n*l,this._z=s*c+o*l+n*m-r*h,this._w=o*c-n*h-r*m-s*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,r=this._y,s=this._z,o=this._w;let h=o*t._w+n*t._x+r*t._y+s*t._z;if(h<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,h=-h):this.copy(t),h>=1)return this._w=o,this._x=n,this._y=r,this._z=s,this;const m=1-h*h;if(m<=Number.EPSILON){const u=1-e;return this._w=u*o+e*this._w,this._x=u*n+e*this._x,this._y=u*r+e*this._y,this._z=u*s+e*this._z,this.normalize(),this._onChangeCallback(),this}const l=Math.sqrt(m),c=Math.atan2(l,h),a=Math.sin((1-e)*c)/l,d=Math.sin(e*c)/l;return this._w=o*a+this._w*d,this._x=n*a+this._x*d,this._y=r*a+this._y*d,this._z=s*a+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=Math.random(),e=Math.sqrt(1-t),n=Math.sqrt(t),r=2*Math.PI*Math.random(),s=2*Math.PI*Math.random();return this.set(e*Math.cos(r),n*Math.sin(s),n*Math.cos(s),e*Math.sin(r))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class G{constructor(t=0,e=0,n=0){G.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(ot.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(ot.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,r=this.z,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6]*r,this.y=s[1]*e+s[4]*n+s[7]*r,this.z=s[2]*e+s[5]*n+s[8]*r,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,r=this.z,s=t.elements,o=1/(s[3]*e+s[7]*n+s[11]*r+s[15]);return this.x=(s[0]*e+s[4]*n+s[8]*r+s[12])*o,this.y=(s[1]*e+s[5]*n+s[9]*r+s[13])*o,this.z=(s[2]*e+s[6]*n+s[10]*r+s[14])*o,this}applyQuaternion(t){const e=this.x,n=this.y,r=this.z,s=t.x,o=t.y,h=t.z,m=t.w,l=m*e+o*r-h*n,c=m*n+h*e-s*r,a=m*r+s*n-o*e,d=-s*e-o*n-h*r;return this.x=l*m+d*-s+c*-h-a*-o,this.y=c*m+d*-o+a*-s-l*-h,this.z=a*m+d*-h+l*-o-c*-s,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,r=this.z,s=t.elements;return this.x=s[0]*e+s[4]*n+s[8]*r,this.y=s[1]*e+s[5]*n+s[9]*r,this.z=s[2]*e+s[6]*n+s[10]*r,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=this.x<0?Math.ceil(this.x):Math.floor(this.x),this.y=this.y<0?Math.ceil(this.y):Math.floor(this.y),this.z=this.z<0?Math.ceil(this.z):Math.floor(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,r=t.y,s=t.z,o=e.x,h=e.y,m=e.z;return this.x=r*m-s*h,this.y=s*o-n*m,this.z=n*h-r*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return W.copy(this).projectOnVector(t),this.sub(W)}reflect(t){return this.sub(W.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(ft(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,r=this.z-t.z;return e*e+n*n+r*r}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const r=Math.sin(e)*t;return this.x=r*Math.sin(n),this.y=Math.cos(e)*t,this.z=r*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),r=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=r,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=(Math.random()-.5)*2,e=Math.random()*Math.PI*2,n=Math.sqrt(1-t**2);return this.x=n*Math.cos(e),this.y=n*Math.sin(e),this.z=t,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const W=new G,ot=new Nt;typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:gt}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=gt);/**
 * lil-gui
 * https://lil-gui.georgealways.com
 * @version 0.18.0
 * @author George Michael Brower
 * @license MIT
 */class F{constructor(t,e,n,r,s="div"){this.parent=t,this.object=e,this.property=n,this._disabled=!1,this._hidden=!1,this.initialValue=this.getValue(),this.domElement=document.createElement("div"),this.domElement.classList.add("controller"),this.domElement.classList.add(r),this.$name=document.createElement("div"),this.$name.classList.add("name"),F.nextNameID=F.nextNameID||0,this.$name.id=`lil-gui-name-${++F.nextNameID}`,this.$widget=document.createElement(s),this.$widget.classList.add("widget"),this.$disable=this.$widget,this.domElement.appendChild(this.$name),this.domElement.appendChild(this.$widget),this.parent.children.push(this),this.parent.controllers.push(this),this.parent.$children.appendChild(this.domElement),this._listenCallback=this._listenCallback.bind(this),this.name(n)}name(t){return this._name=t,this.$name.innerHTML=t,this}onChange(t){return this._onChange=t,this}_callOnChange(){this.parent._callOnChange(this),this._onChange!==void 0&&this._onChange.call(this,this.getValue()),this._changed=!0}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(){this._changed&&(this.parent._callOnFinishChange(this),this._onFinishChange!==void 0&&this._onFinishChange.call(this,this.getValue())),this._changed=!1}reset(){return this.setValue(this.initialValue),this._callOnFinishChange(),this}enable(t=!0){return this.disable(!t)}disable(t=!0){return t===this._disabled?this:(this._disabled=t,this.domElement.classList.toggle("disabled",t),this.$disable.toggleAttribute("disabled",t),this)}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}options(t){const e=this.parent.add(this.object,this.property,t);return e.name(this._name),this.destroy(),e}min(t){return this}max(t){return this}step(t){return this}decimals(t){return this}listen(t=!0){return this._listening=t,this._listenCallbackID!==void 0&&(cancelAnimationFrame(this._listenCallbackID),this._listenCallbackID=void 0),this._listening&&this._listenCallback(),this}_listenCallback(){this._listenCallbackID=requestAnimationFrame(this._listenCallback);const t=this.save();t!==this._listenPrevValue&&this.updateDisplay(),this._listenPrevValue=t}getValue(){return this.object[this.property]}setValue(t){return this.object[this.property]=t,this._callOnChange(),this.updateDisplay(),this}updateDisplay(){return this}load(t){return this.setValue(t),this._callOnFinishChange(),this}save(){return this.getValue()}destroy(){this.listen(!1),this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.controllers.splice(this.parent.controllers.indexOf(this),1),this.parent.$children.removeChild(this.domElement)}}class Xt extends F{constructor(t,e,n){super(t,e,n,"boolean","label"),this.$input=document.createElement("input"),this.$input.setAttribute("type","checkbox"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$widget.appendChild(this.$input),this.$input.addEventListener("change",()=>{this.setValue(this.$input.checked),this._callOnFinishChange()}),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.checked=this.getValue(),this}}function Q(i){let t,e;return(t=i.match(/(#|0x)?([a-f0-9]{6})/i))?e=t[2]:(t=i.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/))?e=parseInt(t[1]).toString(16).padStart(2,0)+parseInt(t[2]).toString(16).padStart(2,0)+parseInt(t[3]).toString(16).padStart(2,0):(t=i.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i))&&(e=t[1]+t[1]+t[2]+t[2]+t[3]+t[3]),e?"#"+e:!1}const Ot={isPrimitive:!0,match:i=>typeof i=="string",fromHexString:Q,toHexString:Q},N={isPrimitive:!0,match:i=>typeof i=="number",fromHexString:i=>parseInt(i.substring(1),16),toHexString:i=>"#"+i.toString(16).padStart(6,0)},Ht={isPrimitive:!1,match:i=>Array.isArray(i),fromHexString(i,t,e=1){const n=N.fromHexString(i);t[0]=(n>>16&255)/255*e,t[1]=(n>>8&255)/255*e,t[2]=(n&255)/255*e},toHexString([i,t,e],n=1){n=255/n;const r=i*n<<16^t*n<<8^e*n<<0;return N.toHexString(r)}},Yt={isPrimitive:!1,match:i=>Object(i)===i,fromHexString(i,t,e=1){const n=N.fromHexString(i);t.r=(n>>16&255)/255*e,t.g=(n>>8&255)/255*e,t.b=(n&255)/255*e},toHexString({r:i,g:t,b:e},n=1){n=255/n;const r=i*n<<16^t*n<<8^e*n<<0;return N.toHexString(r)}},Gt=[Ot,N,Ht,Yt];function qt(i){return Gt.find(t=>t.match(i))}class Wt extends F{constructor(t,e,n,r){super(t,e,n,"color"),this.$input=document.createElement("input"),this.$input.setAttribute("type","color"),this.$input.setAttribute("tabindex",-1),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$text=document.createElement("input"),this.$text.setAttribute("type","text"),this.$text.setAttribute("spellcheck","false"),this.$text.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$display.appendChild(this.$input),this.$widget.appendChild(this.$display),this.$widget.appendChild(this.$text),this._format=qt(this.initialValue),this._rgbScale=r,this._initialValueHexString=this.save(),this._textFocused=!1,this.$input.addEventListener("input",()=>{this._setValueFromHexString(this.$input.value)}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$text.addEventListener("input",()=>{const s=Q(this.$text.value);s&&this._setValueFromHexString(s)}),this.$text.addEventListener("focus",()=>{this._textFocused=!0,this.$text.select()}),this.$text.addEventListener("blur",()=>{this._textFocused=!1,this.updateDisplay(),this._callOnFinishChange()}),this.$disable=this.$text,this.updateDisplay()}reset(){return this._setValueFromHexString(this._initialValueHexString),this}_setValueFromHexString(t){if(this._format.isPrimitive){const e=this._format.fromHexString(t);this.setValue(e)}else this._format.fromHexString(t,this.getValue(),this._rgbScale),this._callOnChange(),this.updateDisplay()}save(){return this._format.toHexString(this.getValue(),this._rgbScale)}load(t){return this._setValueFromHexString(t),this._callOnFinishChange(),this}updateDisplay(){return this.$input.value=this._format.toHexString(this.getValue(),this._rgbScale),this._textFocused||(this.$text.value=this.$input.value.substring(1)),this.$display.style.backgroundColor=this.$input.value,this}}class Z extends F{constructor(t,e,n){super(t,e,n,"function"),this.$button=document.createElement("button"),this.$button.appendChild(this.$name),this.$widget.appendChild(this.$button),this.$button.addEventListener("click",r=>{r.preventDefault(),this.getValue().call(this.object),this._callOnChange()}),this.$button.addEventListener("touchstart",()=>{},{passive:!0}),this.$disable=this.$button}}class Zt extends F{constructor(t,e,n,r,s,o){super(t,e,n,"number"),this._initInput(),this.min(r),this.max(s);const h=o!==void 0;this.step(h?o:this._getImplicitStep(),h),this.updateDisplay()}decimals(t){return this._decimals=t,this.updateDisplay(),this}min(t){return this._min=t,this._onUpdateMinMax(),this}max(t){return this._max=t,this._onUpdateMinMax(),this}step(t,e=!0){return this._step=t,this._stepExplicit=e,this}updateDisplay(){const t=this.getValue();if(this._hasSlider){let e=(t-this._min)/(this._max-this._min);e=Math.max(0,Math.min(e,1)),this.$fill.style.width=e*100+"%"}return this._inputFocused||(this.$input.value=this._decimals===void 0?t:t.toFixed(this._decimals)),this}_initInput(){this.$input=document.createElement("input"),this.$input.setAttribute("type","number"),this.$input.setAttribute("step","any"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$widget.appendChild(this.$input),this.$disable=this.$input;const t=()=>{let _=parseFloat(this.$input.value);isNaN(_)||(this._stepExplicit&&(_=this._snap(_)),this.setValue(this._clamp(_)))},e=_=>{const w=parseFloat(this.$input.value);isNaN(w)||(this._snapClampSetValue(w+_),this.$input.value=this.getValue())},n=_=>{_.code==="Enter"&&this.$input.blur(),_.code==="ArrowUp"&&(_.preventDefault(),e(this._step*this._arrowKeyMultiplier(_))),_.code==="ArrowDown"&&(_.preventDefault(),e(this._step*this._arrowKeyMultiplier(_)*-1))},r=_=>{this._inputFocused&&(_.preventDefault(),e(this._step*this._normalizeMouseWheel(_)))};let s=!1,o,h,m,l,c;const a=5,d=_=>{o=_.clientX,h=m=_.clientY,s=!0,l=this.getValue(),c=0,window.addEventListener("mousemove",u),window.addEventListener("mouseup",p)},u=_=>{if(s){const w=_.clientX-o,v=_.clientY-h;Math.abs(v)>a?(_.preventDefault(),this.$input.blur(),s=!1,this._setDraggingStyle(!0,"vertical")):Math.abs(w)>a&&p()}if(!s){const w=_.clientY-m;c-=w*this._step*this._arrowKeyMultiplier(_),l+c>this._max?c=this._max-l:l+c<this._min&&(c=this._min-l),this._snapClampSetValue(l+c)}m=_.clientY},p=()=>{this._setDraggingStyle(!1,"vertical"),this._callOnFinishChange(),window.removeEventListener("mousemove",u),window.removeEventListener("mouseup",p)},f=()=>{this._inputFocused=!0},g=()=>{this._inputFocused=!1,this.updateDisplay(),this._callOnFinishChange()};this.$input.addEventListener("input",t),this.$input.addEventListener("keydown",n),this.$input.addEventListener("wheel",r,{passive:!1}),this.$input.addEventListener("mousedown",d),this.$input.addEventListener("focus",f),this.$input.addEventListener("blur",g)}_initSlider(){this._hasSlider=!0,this.$slider=document.createElement("div"),this.$slider.classList.add("slider"),this.$fill=document.createElement("div"),this.$fill.classList.add("fill"),this.$slider.appendChild(this.$fill),this.$widget.insertBefore(this.$slider,this.$input),this.domElement.classList.add("hasSlider");const t=(_,w,v,x,y)=>(_-w)/(v-w)*(y-x)+x,e=_=>{const w=this.$slider.getBoundingClientRect();let v=t(_,w.left,w.right,this._min,this._max);this._snapClampSetValue(v)},n=_=>{this._setDraggingStyle(!0),e(_.clientX),window.addEventListener("mousemove",r),window.addEventListener("mouseup",s)},r=_=>{e(_.clientX)},s=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("mousemove",r),window.removeEventListener("mouseup",s)};let o=!1,h,m;const l=_=>{_.preventDefault(),this._setDraggingStyle(!0),e(_.touches[0].clientX),o=!1},c=_=>{_.touches.length>1||(this._hasScrollBar?(h=_.touches[0].clientX,m=_.touches[0].clientY,o=!0):l(_),window.addEventListener("touchmove",a,{passive:!1}),window.addEventListener("touchend",d))},a=_=>{if(o){const w=_.touches[0].clientX-h,v=_.touches[0].clientY-m;Math.abs(w)>Math.abs(v)?l(_):(window.removeEventListener("touchmove",a),window.removeEventListener("touchend",d))}else _.preventDefault(),e(_.touches[0].clientX)},d=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("touchmove",a),window.removeEventListener("touchend",d)},u=this._callOnFinishChange.bind(this),p=400;let f;const g=_=>{if(Math.abs(_.deltaX)<Math.abs(_.deltaY)&&this._hasScrollBar)return;_.preventDefault();const v=this._normalizeMouseWheel(_)*this._step;this._snapClampSetValue(this.getValue()+v),this.$input.value=this.getValue(),clearTimeout(f),f=setTimeout(u,p)};this.$slider.addEventListener("mousedown",n),this.$slider.addEventListener("touchstart",c,{passive:!1}),this.$slider.addEventListener("wheel",g,{passive:!1})}_setDraggingStyle(t,e="horizontal"){this.$slider&&this.$slider.classList.toggle("active",t),document.body.classList.toggle("lil-gui-dragging",t),document.body.classList.toggle(`lil-gui-${e}`,t)}_getImplicitStep(){return this._hasMin&&this._hasMax?(this._max-this._min)/1e3:.1}_onUpdateMinMax(){!this._hasSlider&&this._hasMin&&this._hasMax&&(this._stepExplicit||this.step(this._getImplicitStep(),!1),this._initSlider(),this.updateDisplay())}_normalizeMouseWheel(t){let{deltaX:e,deltaY:n}=t;return Math.floor(t.deltaY)!==t.deltaY&&t.wheelDelta&&(e=0,n=-t.wheelDelta/120,n*=this._stepExplicit?1:10),e+-n}_arrowKeyMultiplier(t){let e=this._stepExplicit?1:10;return t.shiftKey?e*=10:t.altKey&&(e/=10),e}_snap(t){const e=Math.round(t/this._step)*this._step;return parseFloat(e.toPrecision(15))}_clamp(t){return t<this._min&&(t=this._min),t>this._max&&(t=this._max),t}_snapClampSetValue(t){this.setValue(this._clamp(this._snap(t)))}get _hasScrollBar(){const t=this.parent.root.$children;return t.scrollHeight>t.clientHeight}get _hasMin(){return this._min!==void 0}get _hasMax(){return this._max!==void 0}}class Jt extends F{constructor(t,e,n,r){super(t,e,n,"option"),this.$select=document.createElement("select"),this.$select.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this._values=Array.isArray(r)?r:Object.values(r),this._names=Array.isArray(r)?r:Object.keys(r),this._names.forEach(s=>{const o=document.createElement("option");o.innerHTML=s,this.$select.appendChild(o)}),this.$select.addEventListener("change",()=>{this.setValue(this._values[this.$select.selectedIndex]),this._callOnFinishChange()}),this.$select.addEventListener("focus",()=>{this.$display.classList.add("focus")}),this.$select.addEventListener("blur",()=>{this.$display.classList.remove("focus")}),this.$widget.appendChild(this.$select),this.$widget.appendChild(this.$display),this.$disable=this.$select,this.updateDisplay()}updateDisplay(){const t=this.getValue(),e=this._values.indexOf(t);return this.$select.selectedIndex=e,this.$display.innerHTML=e===-1?t:this._names[e],this}}class Kt extends F{constructor(t,e,n){super(t,e,n,"string"),this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$input.addEventListener("input",()=>{this.setValue(this.$input.value)}),this.$input.addEventListener("keydown",r=>{r.code==="Enter"&&this.$input.blur()}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$widget.appendChild(this.$input),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.value=this.getValue(),this}}const Qt=`.lil-gui {
  font-family: var(--font-family);
  font-size: var(--font-size);
  line-height: 1;
  font-weight: normal;
  font-style: normal;
  text-align: left;
  background-color: var(--background-color);
  color: var(--text-color);
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  --background-color: #1f1f1f;
  --text-color: #ebebeb;
  --title-background-color: #111111;
  --title-text-color: #ebebeb;
  --widget-color: #424242;
  --hover-color: #4f4f4f;
  --focus-color: #595959;
  --number-color: #2cc9ff;
  --string-color: #a2db3c;
  --font-size: 11px;
  --input-font-size: 11px;
  --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
  --font-family-mono: Menlo, Monaco, Consolas, "Droid Sans Mono", monospace;
  --padding: 4px;
  --spacing: 4px;
  --widget-height: 20px;
  --title-height: calc(var(--widget-height) + var(--spacing) * 1.25);
  --name-width: 45%;
  --slider-knob-width: 2px;
  --slider-input-width: 27%;
  --color-input-width: 27%;
  --slider-input-min-width: 45px;
  --color-input-min-width: 45px;
  --folder-indent: 7px;
  --widget-padding: 0 0 0 3px;
  --widget-border-radius: 2px;
  --checkbox-size: calc(0.75 * var(--widget-height));
  --scrollbar-width: 5px;
}
.lil-gui, .lil-gui * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
.lil-gui.root {
  width: var(--width, 245px);
  display: flex;
  flex-direction: column;
}
.lil-gui.root > .title {
  background: var(--title-background-color);
  color: var(--title-text-color);
}
.lil-gui.root > .children {
  overflow-x: hidden;
  overflow-y: auto;
}
.lil-gui.root > .children::-webkit-scrollbar {
  width: var(--scrollbar-width);
  height: var(--scrollbar-width);
  background: var(--background-color);
}
.lil-gui.root > .children::-webkit-scrollbar-thumb {
  border-radius: var(--scrollbar-width);
  background: var(--focus-color);
}
@media (pointer: coarse) {
  .lil-gui.allow-touch-styles {
    --widget-height: 28px;
    --padding: 6px;
    --spacing: 6px;
    --font-size: 13px;
    --input-font-size: 16px;
    --folder-indent: 10px;
    --scrollbar-width: 7px;
    --slider-input-min-width: 50px;
    --color-input-min-width: 65px;
  }
}
.lil-gui.force-touch-styles {
  --widget-height: 28px;
  --padding: 6px;
  --spacing: 6px;
  --font-size: 13px;
  --input-font-size: 16px;
  --folder-indent: 10px;
  --scrollbar-width: 7px;
  --slider-input-min-width: 50px;
  --color-input-min-width: 65px;
}
.lil-gui.autoPlace {
  max-height: 100%;
  position: fixed;
  top: 0;
  right: 15px;
  z-index: 1001;
}

.lil-gui .controller {
  display: flex;
  align-items: center;
  padding: 0 var(--padding);
  margin: var(--spacing) 0;
}
.lil-gui .controller.disabled {
  opacity: 0.5;
}
.lil-gui .controller.disabled, .lil-gui .controller.disabled * {
  pointer-events: none !important;
}
.lil-gui .controller > .name {
  min-width: var(--name-width);
  flex-shrink: 0;
  white-space: pre;
  padding-right: var(--spacing);
  line-height: var(--widget-height);
}
.lil-gui .controller .widget {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  min-height: var(--widget-height);
}
.lil-gui .controller.string input {
  color: var(--string-color);
}
.lil-gui .controller.boolean .widget {
  cursor: pointer;
}
.lil-gui .controller.color .display {
  width: 100%;
  height: var(--widget-height);
  border-radius: var(--widget-border-radius);
  position: relative;
}
@media (hover: hover) {
  .lil-gui .controller.color .display:hover:before {
    content: " ";
    display: block;
    position: absolute;
    border-radius: var(--widget-border-radius);
    border: 1px solid #fff9;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
}
.lil-gui .controller.color input[type=color] {
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}
.lil-gui .controller.color input[type=text] {
  margin-left: var(--spacing);
  font-family: var(--font-family-mono);
  min-width: var(--color-input-min-width);
  width: var(--color-input-width);
  flex-shrink: 0;
}
.lil-gui .controller.option select {
  opacity: 0;
  position: absolute;
  width: 100%;
  max-width: 100%;
}
.lil-gui .controller.option .display {
  position: relative;
  pointer-events: none;
  border-radius: var(--widget-border-radius);
  height: var(--widget-height);
  line-height: var(--widget-height);
  max-width: 100%;
  overflow: hidden;
  word-break: break-all;
  padding-left: 0.55em;
  padding-right: 1.75em;
  background: var(--widget-color);
}
@media (hover: hover) {
  .lil-gui .controller.option .display.focus {
    background: var(--focus-color);
  }
}
.lil-gui .controller.option .display.active {
  background: var(--focus-color);
}
.lil-gui .controller.option .display:after {
  font-family: "lil-gui";
  content: "↕";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  padding-right: 0.375em;
}
.lil-gui .controller.option .widget,
.lil-gui .controller.option select {
  cursor: pointer;
}
@media (hover: hover) {
  .lil-gui .controller.option .widget:hover .display {
    background: var(--hover-color);
  }
}
.lil-gui .controller.number input {
  color: var(--number-color);
}
.lil-gui .controller.number.hasSlider input {
  margin-left: var(--spacing);
  width: var(--slider-input-width);
  min-width: var(--slider-input-min-width);
  flex-shrink: 0;
}
.lil-gui .controller.number .slider {
  width: 100%;
  height: var(--widget-height);
  background-color: var(--widget-color);
  border-radius: var(--widget-border-radius);
  padding-right: var(--slider-knob-width);
  overflow: hidden;
  cursor: ew-resize;
  touch-action: pan-y;
}
@media (hover: hover) {
  .lil-gui .controller.number .slider:hover {
    background-color: var(--hover-color);
  }
}
.lil-gui .controller.number .slider.active {
  background-color: var(--focus-color);
}
.lil-gui .controller.number .slider.active .fill {
  opacity: 0.95;
}
.lil-gui .controller.number .fill {
  height: 100%;
  border-right: var(--slider-knob-width) solid var(--number-color);
  box-sizing: content-box;
}

.lil-gui-dragging .lil-gui {
  --hover-color: var(--widget-color);
}
.lil-gui-dragging * {
  cursor: ew-resize !important;
}

.lil-gui-dragging.lil-gui-vertical * {
  cursor: ns-resize !important;
}

.lil-gui .title {
  height: var(--title-height);
  line-height: calc(var(--title-height) - 4px);
  font-weight: 600;
  padding: 0 var(--padding);
  -webkit-tap-highlight-color: transparent;
  cursor: pointer;
  outline: none;
  text-decoration-skip: objects;
}
.lil-gui .title:before {
  font-family: "lil-gui";
  content: "▾";
  padding-right: 2px;
  display: inline-block;
}
.lil-gui .title:active {
  background: var(--title-background-color);
  opacity: 0.75;
}
@media (hover: hover) {
  body:not(.lil-gui-dragging) .lil-gui .title:hover {
    background: var(--title-background-color);
    opacity: 0.85;
  }
  .lil-gui .title:focus {
    text-decoration: underline var(--focus-color);
  }
}
.lil-gui.root > .title:focus {
  text-decoration: none !important;
}
.lil-gui.closed > .title:before {
  content: "▸";
}
.lil-gui.closed > .children {
  transform: translateY(-7px);
  opacity: 0;
}
.lil-gui.closed:not(.transition) > .children {
  display: none;
}
.lil-gui.transition > .children {
  transition-duration: 300ms;
  transition-property: height, opacity, transform;
  transition-timing-function: cubic-bezier(0.2, 0.6, 0.35, 1);
  overflow: hidden;
  pointer-events: none;
}
.lil-gui .children:empty:before {
  content: "Empty";
  padding: 0 var(--padding);
  margin: var(--spacing) 0;
  display: block;
  height: var(--widget-height);
  font-style: italic;
  line-height: var(--widget-height);
  opacity: 0.5;
}
.lil-gui.root > .children > .lil-gui > .title {
  border: 0 solid var(--widget-color);
  border-width: 1px 0;
  transition: border-color 300ms;
}
.lil-gui.root > .children > .lil-gui.closed > .title {
  border-bottom-color: transparent;
}
.lil-gui + .controller {
  border-top: 1px solid var(--widget-color);
  margin-top: 0;
  padding-top: var(--spacing);
}
.lil-gui .lil-gui .lil-gui > .title {
  border: none;
}
.lil-gui .lil-gui .lil-gui > .children {
  border: none;
  margin-left: var(--folder-indent);
  border-left: 2px solid var(--widget-color);
}
.lil-gui .lil-gui .controller {
  border: none;
}

.lil-gui input {
  -webkit-tap-highlight-color: transparent;
  border: 0;
  outline: none;
  font-family: var(--font-family);
  font-size: var(--input-font-size);
  border-radius: var(--widget-border-radius);
  height: var(--widget-height);
  background: var(--widget-color);
  color: var(--text-color);
  width: 100%;
}
@media (hover: hover) {
  .lil-gui input:hover {
    background: var(--hover-color);
  }
  .lil-gui input:active {
    background: var(--focus-color);
  }
}
.lil-gui input:disabled {
  opacity: 1;
}
.lil-gui input[type=text],
.lil-gui input[type=number] {
  padding: var(--widget-padding);
}
.lil-gui input[type=text]:focus,
.lil-gui input[type=number]:focus {
  background: var(--focus-color);
}
.lil-gui input::-webkit-outer-spin-button,
.lil-gui input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.lil-gui input[type=number] {
  -moz-appearance: textfield;
}
.lil-gui input[type=checkbox] {
  appearance: none;
  -webkit-appearance: none;
  height: var(--checkbox-size);
  width: var(--checkbox-size);
  border-radius: var(--widget-border-radius);
  text-align: center;
  cursor: pointer;
}
.lil-gui input[type=checkbox]:checked:before {
  font-family: "lil-gui";
  content: "✓";
  font-size: var(--checkbox-size);
  line-height: var(--checkbox-size);
}
@media (hover: hover) {
  .lil-gui input[type=checkbox]:focus {
    box-shadow: inset 0 0 0 1px var(--focus-color);
  }
}
.lil-gui button {
  -webkit-tap-highlight-color: transparent;
  outline: none;
  cursor: pointer;
  font-family: var(--font-family);
  font-size: var(--font-size);
  color: var(--text-color);
  width: 100%;
  height: var(--widget-height);
  text-transform: none;
  background: var(--widget-color);
  border-radius: var(--widget-border-radius);
  border: 1px solid var(--widget-color);
  text-align: center;
  line-height: calc(var(--widget-height) - 4px);
}
@media (hover: hover) {
  .lil-gui button:hover {
    background: var(--hover-color);
    border-color: var(--hover-color);
  }
  .lil-gui button:focus {
    border-color: var(--focus-color);
  }
}
.lil-gui button:active {
  background: var(--focus-color);
}

@font-face {
  font-family: "lil-gui";
  src: url("data:application/font-woff;charset=utf-8;base64,d09GRgABAAAAAAUsAAsAAAAACJwAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABHU1VCAAABCAAAAH4AAADAImwmYE9TLzIAAAGIAAAAPwAAAGBKqH5SY21hcAAAAcgAAAD0AAACrukyyJBnbHlmAAACvAAAAF8AAACEIZpWH2hlYWQAAAMcAAAAJwAAADZfcj2zaGhlYQAAA0QAAAAYAAAAJAC5AHhobXR4AAADXAAAABAAAABMAZAAAGxvY2EAAANsAAAAFAAAACgCEgIybWF4cAAAA4AAAAAeAAAAIAEfABJuYW1lAAADoAAAASIAAAIK9SUU/XBvc3QAAATEAAAAZgAAAJCTcMc2eJxVjbEOgjAURU+hFRBK1dGRL+ALnAiToyMLEzFpnPz/eAshwSa97517c/MwwJmeB9kwPl+0cf5+uGPZXsqPu4nvZabcSZldZ6kfyWnomFY/eScKqZNWupKJO6kXN3K9uCVoL7iInPr1X5baXs3tjuMqCtzEuagm/AAlzQgPAAB4nGNgYRBlnMDAysDAYM/gBiT5oLQBAwuDJAMDEwMrMwNWEJDmmsJwgCFeXZghBcjlZMgFCzOiKOIFAB71Bb8AeJy1kjFuwkAQRZ+DwRAwBtNQRUGKQ8OdKCAWUhAgKLhIuAsVSpWz5Bbkj3dEgYiUIszqWdpZe+Z7/wB1oCYmIoboiwiLT2WjKl/jscrHfGg/pKdMkyklC5Zs2LEfHYpjcRoPzme9MWWmk3dWbK9ObkWkikOetJ554fWyoEsmdSlt+uR0pCJR34b6t/TVg1SY3sYvdf8vuiKrpyaDXDISiegp17p7579Gp3p++y7HPAiY9pmTibljrr85qSidtlg4+l25GLCaS8e6rRxNBmsnERunKbaOObRz7N72ju5vdAjYpBXHgJylOAVsMseDAPEP8LYoUHicY2BiAAEfhiAGJgZWBgZ7RnFRdnVJELCQlBSRlATJMoLV2DK4glSYs6ubq5vbKrJLSbGrgEmovDuDJVhe3VzcXFwNLCOILB/C4IuQ1xTn5FPilBTj5FPmBAB4WwoqAHicY2BkYGAA4sk1sR/j+W2+MnAzpDBgAyEMQUCSg4EJxAEAwUgFHgB4nGNgZGBgSGFggJMhDIwMqEAYAByHATJ4nGNgAIIUNEwmAABl3AGReJxjYAACIQYlBiMGJ3wQAEcQBEV4nGNgZGBgEGZgY2BiAAEQyQWEDAz/wXwGAAsPATIAAHicXdBNSsNAHAXwl35iA0UQXYnMShfS9GPZA7T7LgIu03SSpkwzYTIt1BN4Ak/gKTyAeCxfw39jZkjymzcvAwmAW/wgwHUEGDb36+jQQ3GXGot79L24jxCP4gHzF/EIr4jEIe7wxhOC3g2TMYy4Q7+Lu/SHuEd/ivt4wJd4wPxbPEKMX3GI5+DJFGaSn4qNzk8mcbKSR6xdXdhSzaOZJGtdapd4vVPbi6rP+cL7TGXOHtXKll4bY1Xl7EGnPtp7Xy2n00zyKLVHfkHBa4IcJ2oD3cgggWvt/V/FbDrUlEUJhTn/0azVWbNTNr0Ens8de1tceK9xZmfB1CPjOmPH4kitmvOubcNpmVTN3oFJyjzCvnmrwhJTzqzVj9jiSX911FjeAAB4nG3HMRKCMBBA0f0giiKi4DU8k0V2GWbIZDOh4PoWWvq6J5V8If9NVNQcaDhyouXMhY4rPTcG7jwYmXhKq8Wz+p762aNaeYXom2n3m2dLTVgsrCgFJ7OTmIkYbwIbC6vIB7WmFfAAAA==") format("woff");
}`;function te(i){const t=document.createElement("style");t.innerHTML=i;const e=document.querySelector("head link[rel=stylesheet], head style");e?document.head.insertBefore(t,e):document.head.appendChild(t)}let at=!1;class it{constructor({parent:t,autoPlace:e=t===void 0,container:n,width:r,title:s="Controls",closeFolders:o=!1,injectStyles:h=!0,touchStyles:m=!0}={}){if(this.parent=t,this.root=t?t.root:this,this.children=[],this.controllers=[],this.folders=[],this._closed=!1,this._hidden=!1,this.domElement=document.createElement("div"),this.domElement.classList.add("lil-gui"),this.$title=document.createElement("div"),this.$title.classList.add("title"),this.$title.setAttribute("role","button"),this.$title.setAttribute("aria-expanded",!0),this.$title.setAttribute("tabindex",0),this.$title.addEventListener("click",()=>this.openAnimated(this._closed)),this.$title.addEventListener("keydown",l=>{(l.code==="Enter"||l.code==="Space")&&(l.preventDefault(),this.$title.click())}),this.$title.addEventListener("touchstart",()=>{},{passive:!0}),this.$children=document.createElement("div"),this.$children.classList.add("children"),this.domElement.appendChild(this.$title),this.domElement.appendChild(this.$children),this.title(s),m&&this.domElement.classList.add("allow-touch-styles"),this.parent){this.parent.children.push(this),this.parent.folders.push(this),this.parent.$children.appendChild(this.domElement);return}this.domElement.classList.add("root"),!at&&h&&(te(Qt),at=!0),n?n.appendChild(this.domElement):e&&(this.domElement.classList.add("autoPlace"),document.body.appendChild(this.domElement)),r&&this.domElement.style.setProperty("--width",r+"px"),this._closeFolders=o,this.domElement.addEventListener("keydown",l=>l.stopPropagation()),this.domElement.addEventListener("keyup",l=>l.stopPropagation())}add(t,e,n,r,s){if(Object(n)===n)return new Jt(this,t,e,n);const o=t[e];switch(typeof o){case"number":return new Zt(this,t,e,n,r,s);case"boolean":return new Xt(this,t,e);case"string":return new Kt(this,t,e);case"function":return new Z(this,t,e)}console.error(`gui.add failed
	property:`,e,`
	object:`,t,`
	value:`,o)}addColor(t,e,n=1){return new Wt(this,t,e,n)}addFolder(t){const e=new it({parent:this,title:t});return this.root._closeFolders&&e.close(),e}load(t,e=!0){return t.controllers&&this.controllers.forEach(n=>{n instanceof Z||n._name in t.controllers&&n.load(t.controllers[n._name])}),e&&t.folders&&this.folders.forEach(n=>{n._title in t.folders&&n.load(t.folders[n._title])}),this}save(t=!0){const e={controllers:{},folders:{}};return this.controllers.forEach(n=>{if(!(n instanceof Z)){if(n._name in e.controllers)throw new Error(`Cannot save GUI with duplicate property "${n._name}"`);e.controllers[n._name]=n.save()}}),t&&this.folders.forEach(n=>{if(n._title in e.folders)throw new Error(`Cannot save GUI with duplicate folder "${n._title}"`);e.folders[n._title]=n.save()}),e}open(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),this.domElement.classList.toggle("closed",this._closed),this}close(){return this.open(!1)}_setClosed(t){this._closed!==t&&(this._closed=t,this._callOnOpenClose(this))}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}openAnimated(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),requestAnimationFrame(()=>{const e=this.$children.clientHeight;this.$children.style.height=e+"px",this.domElement.classList.add("transition");const n=s=>{s.target===this.$children&&(this.$children.style.height="",this.domElement.classList.remove("transition"),this.$children.removeEventListener("transitionend",n))};this.$children.addEventListener("transitionend",n);const r=t?this.$children.scrollHeight:0;this.domElement.classList.toggle("closed",!t),requestAnimationFrame(()=>{this.$children.style.height=r+"px"})}),this}title(t){return this._title=t,this.$title.innerHTML=t,this}reset(t=!0){return(t?this.controllersRecursive():this.controllers).forEach(n=>n.reset()),this}onChange(t){return this._onChange=t,this}_callOnChange(t){this.parent&&this.parent._callOnChange(t),this._onChange!==void 0&&this._onChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(t){this.parent&&this.parent._callOnFinishChange(t),this._onFinishChange!==void 0&&this._onFinishChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onOpenClose(t){return this._onOpenClose=t,this}_callOnOpenClose(t){this.parent&&this.parent._callOnOpenClose(t),this._onOpenClose!==void 0&&this._onOpenClose.call(this,t)}destroy(){this.parent&&(this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.folders.splice(this.parent.folders.indexOf(this),1)),this.domElement.parentElement&&this.domElement.parentElement.removeChild(this.domElement),Array.from(this.children).forEach(t=>t.destroy())}controllersRecursive(){let t=Array.from(this.controllers);return this.folders.forEach(e=>{t=t.concat(e.controllersRecursive())}),t}foldersRecursive(){let t=Array.from(this.folders);return this.folders.forEach(e=>{t=t.concat(e.foldersRecursive())}),t}}const ee=it;function ht(i,t,e){const n=i.createShader(t);if(i.shaderSource(n,e),i.compileShader(n),!i.getShaderParameter(n,i.COMPILE_STATUS))throw console.error(i.getShaderInfoLog(n)),new Error("shader error");return n}function J(i,t){const e=ht(i,i.VERTEX_SHADER,t.vs),n=ht(i,i.FRAGMENT_SHADER,t.fs),r=i.createProgram();if(i.attachShader(r,e),i.attachShader(r,n),i.linkProgram(r),!i.getProgramParameter(r,i.LINK_STATUS))throw console.log(i.getProgramInfoLog(r)),new Error("program error");return r}class vt{constructor(t,e,n,r){A(this,"position",V());A(this,"projectionMatrix",T());A(this,"shadowView",T());A(this,"up",[0,1,0]);A(this,"target",V());let s=this.projectionMatrix=T();Ut(s,Math.PI/180*t,e,n,r)}get viewMatrix(){let t=T();return Bt(t,this.position,this.target,this.up),t}get viewMatrixInverse(){const t=T();return O(t,this.viewMatrix),t}lookAt(t,e,n){this.target=[t,e,n]}setPosition(t,e,n){this.position=[t,e,n]}eyeToTargetDistance(){return Math.sqrt(Math.pow(this.position[0]-this.target[0],2)+Math.pow(this.position[1]-this.target[1],2)+Math.pow(this.position[2]-this.target[2],2))}}class P{constructor(t,e=211332){A(this,"loaded",!1);A(this,"image");A(this,"texture");this.url=t,this.level=e}load(t){const e=t.createTexture();t.bindTexture(t.TEXTURE_2D,e);const n=new Image;return n.crossOrigin="Anonymous",n.src=this.url,n.onload=()=>{t.bindTexture(t.TEXTURE_2D,e),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,t.RGBA,t.UNSIGNED_BYTE,n),t.generateMipmap(t.TEXTURE_2D)},this.texture=e,e}}function ie(i,t){const e=i.createTexture(),n=t;i.bindTexture(i.TEXTURE_2D,e),i.texImage2D(i.TEXTURE_2D,0,i.DEPTH_COMPONENT,n,n,0,i.DEPTH_COMPONENT,i.UNSIGNED_INT,null),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MAG_FILTER,i.NEAREST),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE);const r=i.createFramebuffer();i.bindFramebuffer(i.FRAMEBUFFER,r),i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,e,0);const s=i.createTexture();return i.bindTexture(i.TEXTURE_2D,s),i.texImage2D(i.TEXTURE_2D,0,i.RGBA,n,n,0,i.RGBA,i.UNSIGNED_BYTE,null),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MAG_FILTER,i.NEAREST),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),i.framebufferTexture2D(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,s,0),{depthTexture:e,depthFramebuffer:r}}function ne(i){var t=i.createTexture();i.bindTexture(i.TEXTURE_2D,t);{const n=i.LUMINANCE,r=3,s=2,o=0,h=i.LUMINANCE,m=i.UNSIGNED_BYTE,l=new Uint8Array([128,64,128,0,192,0]),c=1;i.pixelStorei(i.UNPACK_ALIGNMENT,c),i.texImage2D(i.TEXTURE_2D,0,n,r,s,o,h,m,l),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MAG_FILTER,i.NEAREST),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE)}return t}function lt(i){var t;return((t=i.toString(16).padStart(6,"0").match(/(\d|\w){2}/gi))==null?void 0:t.map(e=>parseInt(e,16)/255))||[0,0,0]}class q{constructor(t){A(this,"attr");A(this,"indices");A(this,"indicesLength");this.indices=t.indices||new Int8Array,delete t.indices,this.attr=t,this.indicesLength=this.indices.length}}const re=[-1,-1,-1,1,-1,-1,-1,1,-1,1,1,-1,-1,-1,1,1,-1,1,-1,1,1,1,1,1],se=[0,1,1,3,3,2,2,0,4,5,5,7,7,6,6,4,0,4,1,5,3,7,2,6];class oe extends q{constructor(){const t={position:new Float32Array(re),indices:new Uint16Array(se)};super(t)}}const ae=`attribute vec4 a_position;




// 相机三剑客

uniform mat4 u_projection;


uniform mat4 u_camera;

uniform mat4 u_modelView;


void main() {
  gl_Position = u_projection * u_camera * u_modelView * a_position;


}`,he=`precision mediump float;







void main() {
   
   gl_FragColor = vec4(1.0,0.0 ,0.0 , 1.0);
}`;class le extends B{constructor(){super(ae,he,"LineMaterial")}}const ct=new Map;let ce=new Set;class ue{constructor(t,e){A(this,"gl");A(this,"depthTexture");A(this,"depthFramebuffer");A(this,"depthTextureSize",512);A(this,"sceneTexture");A(this,"lastUsedProgramInfo");A(this,"lastUsedBufferInfo");A(this,"renderType",1);A(this,"shadowCamera",new vt(120,1,10,200));A(this,"shadowProgram");A(this,"defaultTexture");A(this,"frustumEntity",new k(new oe,new le));A(this,"frustumProgramInfo");this.ele=t,this.options=e;const n=this.gl=t.getContext("webgl",{antialias:!0});n.getExtension("WEBGL_depth_texture"),n.getExtension("OES_element_index_uint"),t.width=(window.innerWidth||document.documentElement.clientWidth)*window.devicePixelRatio,(t.height=window.innerHeight||document.documentElement.clientHeight)*window.devicePixelRatio,t.style.width=(window.innerWidth||document.documentElement.clientWidth)+"px",t.style.height=(window.innerHeight||document.documentElement.clientHeight)+"px",this.shadowCamera.lookAt(0,0,0),this.shadowProgram=J(n,new Rt),this.defaultTexture=ne(this.gl);const{depthTexture:r,depthFramebuffer:s}=ie(this.gl,this.depthTextureSize);this.depthTexture=r,this.depthFramebuffer=s}transUniforms(t,e){var c;const{gl:n}=this,{camera:r,object:s,lights:o}=e;{const a=n.getUniformLocation(t.program,"u_cameraPosition");if(a&&n.uniform3fv(a,new Float32Array(r.position)),this.renderType===0){const d=n.getUniformLocation(t.program,"u_color"),u=new Float32Array(lt(s.material.color));n.uniform3fv(d,u);return}}{const a=n.getUniformLocation(t.program,"u_textureMatrix");a&&n.uniformMatrix4fv(a,!1,r.shadowView)}{let a=0;(c=t.textures)==null||c.forEach(u=>{const p=n.getUniformLocation(t.program,"u_texture"+a);p&&n.activeTexture(n.TEXTURE0+a),p&&n.bindTexture(n.TEXTURE_2D,u),p&&n.uniform1i(p,a),a++});const d=n.getUniformLocation(t.program,"u_projectedTexture");this.renderType===1&&this.depthTexture&&d&&(n.activeTexture(n.TEXTURE0+a),n.bindTexture(n.TEXTURE_2D,this.depthTexture),n.uniform1i(d,a))}const h=n.getUniformLocation(t.program,"u_color"),m=n.getUniformLocation(t.program,"u_time"),l=n.getUniformLocation(t.program,"u_bias");h&&n.uniform3fv(h,new Float32Array(lt(s.material.color))),m&&n.uniform1f(m,s.material.time),l&&n.uniform1f(l,s.material.u_bias),o.forEach(a=>{switch(a.type){case"PointLight":const d=n.getUniformLocation(t.program,"u_lightColor"),u=n.getUniformLocation(t.program,"u_lightPosition");d&&n.uniform3fv(d,a.color),u&&n.uniform3fv(u,a.position);break;case"AmbientLight":const p=n.getUniformLocation(t.program,"u_baseLightColor");p&&n.uniform3fv(p,a.color);break}})}bindAttrBuffer(t){const{gl:e}=this,n=e.getAttribLocation(t.program,"a_position"),r=e.getAttribLocation(t.program,"a_normal"),s=e.getAttribLocation(t.program,"a_texcoord");e.enableVertexAttribArray(n),e.bindBuffer(e.ARRAY_BUFFER,t.buffers.position),e.vertexAttribPointer(n,3,e.FLOAT,!1,0,0),r>=0&&(e.enableVertexAttribArray(r),e.bindBuffer(e.ARRAY_BUFFER,t.buffers.normal),e.vertexAttribPointer(r,3,e.FLOAT,!1,0,0)),s>=0&&(e.enableVertexAttribArray(s),e.bindBuffer(e.ARRAY_BUFFER,t.buffers.texcoord),e.vertexAttribPointer(s,2,e.FLOAT,!1,0,0))}creteBuffer(t,e){const{gl:n}=this,r=n.createBuffer();return n.bindBuffer(t,r),n.bufferData(t,e,n.STATIC_DRAW),r}createAttributes(t){const{gl:e}=this,n={};Object.entries(t.attr).forEach(([s,o])=>{const h=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,h),e.bufferData(e.ARRAY_BUFFER,o,e.STATIC_DRAW),n[s]=h});const r=e.createBuffer();return e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,r),e.bufferData(e.ELEMENT_ARRAY_BUFFER,t.indices,e.STATIC_DRAW),{indicesBuffer:r,buffers:n}}setUniformMatrix(t,e,n){const{gl:r}=this,s=r.getUniformLocation(t.program,"u_projection");r.uniformMatrix4fv(s,!1,n.projectionMatrix);const o=T();O(o,n.viewMatrix);const h=r.getUniformLocation(t.program,"u_camera");r.uniformMatrix4fv(h,!1,o);const m=r.getUniformLocation(t.program,"u_modelView");r.uniformMatrix4fv(m,!1,e.modelView)}renderObject(t,e,n){const{gl:r}=this;let s;e.forEach(o=>{var m;let h=ct.get(o);if(!h){h={program:J(r,o.material),buffers:{},textures:new Set},(m=o.material.textures)!=null&&m.length&&o.material.textures.forEach(a=>{var u;const d=a.load(r);(u=h.textures)==null||u.add(d)});const{indicesBuffer:l,buffers:c}=this.createAttributes(o.geometry);h.buffers=c,h.indicesBuffer=l,ct.set(o,h)}this.renderType===1?(r.useProgram(h.program),s=h):(r.useProgram(this.shadowProgram),s={program:this.shadowProgram,buffers:{},textures:new Set}),this.bindAttrBuffer(h),this.setUniformMatrix(s,o,{projectionMatrix:t.projectionMatrix,viewMatrix:t.viewMatrix}),this.transUniforms(s,{camera:t,lights:n,object:o}),r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,h.indicesBuffer),r.drawElements(r.TRIANGLES,o.geometry.indices.length,r.UNSIGNED_SHORT,0)}),ce.clear()}renderShadowTexture(t,e){this.shadowCamera.position=e.find(r=>r.type==="PointLight").position,this.renderType=0;const{gl:n}=this;n.enable(n.DEPTH_TEST),n.bindFramebuffer(n.FRAMEBUFFER,this.depthFramebuffer),n.viewport(0,0,this.depthTextureSize,this.depthTextureSize),n.clearColor(0,0,0,1),n.clear(n.COLOR_BUFFER_BIT|n.DEPTH_BUFFER_BIT),this.renderObject(this.shadowCamera,t,e)}render(t,e,n){const{gl:r}=this;this.renderType=1,r.bindFramebuffer(r.FRAMEBUFFER,null),r.viewport(0,0,r.canvas.width,r.canvas.height),r.clear(r.DEPTH_BUFFER_BIT|r.COLOR_BUFFER_BIT),r.enable(r.DEPTH_TEST),r.clearColor(0,0,0,1);const s=T();O(s,this.shadowCamera.viewMatrix);const o=T();K(o,this.shadowCamera.projectionMatrix,s),t.shadowView=o,this.renderObject(t,e,n)}renderFrustum(t){const{gl:e}=this;let{frustumProgramInfo:n}=this;if(!n){const o=J(e,this.frustumEntity.material),{buffers:h,indicesBuffer:m}=this.createAttributes(this.frustumEntity.geometry);n={program:o,buffers:h,indicesBuffer:m,textures:new Set}}e.useProgram(n.program),this.shadowCamera.lookAt(0,0,0);const r=T();O(r,this.shadowCamera.projectionMatrix);const s=T();K(s,this.shadowCamera.viewMatrix,r),this.bindAttrBuffer(n),this.frustumEntity.modelView=s,this.setUniformMatrix(n,this.frustumEntity,{projectionMatrix:t.projectionMatrix,viewMatrix:t.viewMatrix}),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,n.indicesBuffer),e.drawElements(e.LINES,this.frustumEntity.geometry.indicesLength,e.UNSIGNED_SHORT,0)}}class xt{constructor(t,e,n){this.type=t,this.color=e,this.position=n}}class de extends xt{constructor(t,e=[0,0,0]){super("AmbientLight",t,e)}}class me extends xt{constructor(t,e){super("PointLight",t,e)}}function pe(i){return i=i||window,i!==i.top}pe()||(console.log("%c%s","color:blue;font-weight:bold;","for more about webgl-utils.js see:"),console.log("%c%s","color:blue;font-weight:bold;","https://webglfundamentals.org/webgl/lessons/webgl-boilerplate.html"));function _e(i,t){let e=0;return i.push=function(){for(let n=0;n<arguments.length;++n){const r=arguments[n];if(r instanceof Array||r.buffer&&r.buffer instanceof ArrayBuffer)for(let s=0;s<r.length;++s)i[e++]=r[s];else i[e++]=r}},i.reset=function(n){e=n||0},i.numComponents=t,Object.defineProperty(i,"numElements",{get:function(){return this.length/this.numComponents|0}}),i}function z(i,t,e=Float32Array){const n=e||Float32Array;return _e(new n(i*t),i)}const ge=!!document.documentMode,fe=!ge&&!!window.StyleMedia;fe&&(HTMLCanvasElement.prototype.getContext=function(i){return function(){let t=arguments;return t[0]==="webgl"&&(t=[].slice.call(arguments),t[0]="experimental-webgl"),i.apply(this,t)}}(HTMLCanvasElement.prototype.getContext));const ve=[[3,7,5,1],[6,2,0,4],[6,7,3,2],[0,1,5,4],[7,6,4,5],[2,3,1,0]];function xe(i=10,t,e,n,r,s,o){if(t<=0||e<=0)throw Error("subdivisionAxis and subdivisionHeight must be > 0");n=n||0,r=r||Math.PI,s=s||0,o=o||Math.PI*2;const h=r-n,m=o-s,l=(t+1)*(e+1),c=z(3,l),a=z(3,l),d=z(2,l);for(let f=0;f<=e;f++)for(let g=0;g<=t;g++){const _=g/t,w=f/e,v=m*_+s,x=h*w+n,y=Math.sin(v),b=Math.cos(v),L=Math.sin(x),S=Math.cos(x),M=b*L,C=S,R=y*L;c.push(i*M,i*C,i*R),a.push(M,C,R),d.push(1-_,w)}const u=t+1,p=z(3,t*e*2,Uint16Array);for(let f=0;f<t;f++)for(let g=0;g<e;g++)p.push((g+0)*u+f,(g+0)*u+f+1,(g+1)*u+f),p.push((g+1)*u+f,(g+0)*u+f+1,(g+1)*u+f+1);return{position:c,normal:a,texcoord:d,indices:p}}function ye(i=10){const t=i/2,e=[[-t,-t,-t],[+t,-t,-t],[-t,+t,-t],[+t,+t,-t],[-t,-t,+t],[+t,-t,+t],[-t,+t,+t],[+t,+t,+t]],n=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]],r=[[1,0],[0,0],[0,1],[1,1]],s=6*4,o=z(3,s),h=z(3,s),m=z(2,s),l=z(3,6*2,Uint16Array);for(let c=0;c<6;++c){const a=ve[c];for(let u=0;u<4;++u){const p=e[a[u]],f=n[c],g=r[u];o.push(p),h.push(f),m.push(g)}const d=4*c;l.push(d+0,d+1,d+2),l.push(d+0,d+2,d+3)}return{position:o,normal:h,texcoord:m,indices:l}}function we(i=10,t=10,e=1,n=1,r=T()){const s=(e+1)*(n+1),o=z(3,s),h=z(3,s),m=z(2,s);for(let a=0;a<=n;a++)for(let d=0;d<=e;d++){const u=d/e,p=a/n;o.push(i*u-i*.5,0,t*p-t*.5),h.push(0,1,0),m.push(u,p)}const l=e+1,c=z(3,e*n*2,Uint16Array);for(let a=0;a<n;a++)for(let d=0;d<e;d++)c.push((a+0)*l+d,(a+1)*l+d,(a+0)*l+d+1),c.push((a+1)*l+d,(a+1)*l+d+1,(a+0)*l+d+1);return{position:o,normal:h,texcoord:m,indices:c}}class nt extends q{constructor(t=1,e=32,n=16,r=0,s=Math.PI,o=0,h=Math.PI*2){super(xe(t,e,n,r,s,o,h))}}class yt extends q{constructor(t=10,e=10,n=1,r=1,s=T()){super(we(t,e,n,r,s))}}class Ae extends q{constructor(t=10){super(ye(t))}}const be=`

attribute vec4 a_position;
attribute vec3 a_normal;
attribute vec3 a_color;
attribute vec2 a_texcoord;

uniform mat4 u_projection;

uniform mat4 u_camera;

uniform mat4 u_modelView;

// 灯光位置
uniform vec3 u_lightPosition;

// 相机位置
uniform vec3 u_cameraPosition;

uniform float u_time;

varying vec3 v_color;

varying vec2 v_uv;

varying vec2 v_uv2;

// 计算点到灯光向量
varying vec3 v_fragToLight;

varying vec3 v_fragToCamera;


varying mat3 TBN; 


varying vec3 v_normal;


// 阴影lookat 矩阵 相关参数
uniform mat4 u_textureMatrix;
// 阴影投影矩阵
varying vec4 v_projectedTexcoord;


varying float v_fogDepth;

void main() {

  vec4 worldPosition = u_modelView * a_position;

  gl_Position = u_projection * u_camera * worldPosition;
  v_color = a_color;


  float v_t = u_time * 0.00004;
  float v_t2 = u_time * 0.00003;
  v_uv = vec2(a_texcoord.x + v_t, a_texcoord.y) * 3.0;
  v_uv2 = vec2(a_texcoord.x + v_t2, a_texcoord.y - v_t2) * 2.0;
  
  vec3 T = vec3(0, 0, 1);
  vec3 B = vec3(1, 0, 0);
  vec3 N = vec3(0, 1, 0);

  TBN = mat3(T, B, N);

  TBN = TBN;

    // 转换后的世界坐标位置
  // vec4 position=u_camera * u_modelView*a_position;
  
  // 计算点到灯光向量
  // v_fragToLight=vec3(0.0, 0.0, 200)-vec3(a_position);
  v_fragToLight=u_lightPosition-vec3(worldPosition);
  
  v_fragToCamera=u_cameraPosition-vec3(u_camera * worldPosition);

  // 阴影
  v_projectedTexcoord = u_textureMatrix * worldPosition;

  v_normal = a_normal;


  v_fogDepth = -(u_camera * a_position).z;
}`,Ee=`precision mediump float;

uniform vec3 u_color;
uniform sampler2D u_texture0;

// 深度纹理
uniform sampler2D u_projectedTexture;

uniform float u_bias;

// 灯光颜色
uniform vec3 u_lightColor;

// 环境光颜色
uniform vec3 u_baseLightColor;

varying vec3 v_fragToLight;

varying vec3 v_fragToCamera;

varying mat3 TBN;

varying vec3 v_color;
varying vec2 v_uv;
varying vec2 v_uv2;

varying vec3 v_normal;

// 阴影相关

varying vec4 v_projectedTexcoord;

uniform float u_isRenderShadowTexture;

varying float v_fogDepth;

void main(){
   
   // 水的颜色
   vec3 warerColor=vec3(0.0002, 0.472, 0.619);
     float u_bias = 0.0001;
   
  vec3 projectedTexcoord=v_projectedTexcoord.xyz/v_projectedTexcoord.w;
    float currentDepth=projectedTexcoord.z + u_bias;
    
    bool inRange=
    projectedTexcoord.x>=-1.0 &&
    projectedTexcoord.x<=1.&&
    projectedTexcoord.y>=-1.0 &&
    projectedTexcoord.y<=1.;
    
    // the 'r' channel has the depth values

    vec2 uv = (vec2(projectedTexcoord.xy) + 1.0) / 2.0; 
    float projectedDepth=texture2D(u_projectedTexture,uv.xy).r;
    float shadowLight=(inRange && projectedDepth <= currentDepth) ? 0.5 : 1.0;
      
   
   // 如果在投影中 则 减少光亮
   
   vec3 toLight=normalize(v_fragToLight);
   vec3 toView=normalize(v_fragToCamera);
   
   vec4 textureNormal1=texture2D(u_texture0,v_uv);
   vec4 textureNormal2=texture2D(u_texture0,v_uv2);
   vec3 normal1=vec3(textureNormal1)*2.-1.;
   vec3 normal2=vec3(textureNormal2)*2.-1.;
   vec3 normal=normalize(normal1+normal2);
   
   normal=normalize(TBN*normal);
   
   // normal = vec3(0.0, 1.0, 0.0);
   
   // 环境光 50%
   vec4 ambient=vec4(warerColor*u_baseLightColor * 0.77 * shadowLight,1.);
   
   // // 漫反射
   float diffuseAmt=max(dot(toLight,normal), 0.0);
   // // 模型颜色 *
   vec4 diffuse=vec4(warerColor*u_lightColor*.23*diffuseAmt,1.);
   
   vec3 halfVector=normalize(toView+toLight);
   float light=max(dot(normal,toView),0.);
   float specular=0.;
   
   if(light>0.&&shadowLight==1.){
      specular=pow(max(dot(normal,halfVector), 0.0),512.);
   }
   
   vec4 specularColor=vec4(u_lightColor.rgb*specular,1.);
   
   vec4 frag=ambient+diffuse+specularColor;

         vec4 u_fogColor = vec4(1.0, 1.0, 1.0, 1.0);
        float fogAmount = smoothstep(180.0, 300.0, v_fogDepth);


   gl_FragColor= mix(frag, u_fogColor, fogAmount);

}`,Te=`

attribute vec4 a_position;
attribute vec3 a_normal;
attribute vec2 a_texcoord;

uniform mat4 u_projection;

uniform mat4 u_camera;

uniform mat4 u_modelView;

// 灯光位置
uniform vec3 u_lightPosition;

// 相机位置
uniform vec3 u_cameraPosition;

uniform float u_time;


varying vec2 v_uv;

varying vec2 v_uv2;

// 计算点到灯光向量
varying vec3 v_fragToLight;

varying vec3 v_fragToCamera;


// varying mat3 TBN; 


// 阴影lookat 矩阵 相关参数
uniform mat4 u_textureMatrix;
// 阴影投影矩阵
varying vec4 v_projectedTexcoord;

varying vec2 v_texcoord;

varying vec3 v_normal;


void main() {

  vec4 worldPosition = u_modelView * a_position;

  gl_Position = u_projection * u_camera * worldPosition;





    // 转换后的世界坐标位置
  // vec4 position=u_camera * u_modelView*a_position;
  
  // 计算点到灯光向量
  // v_fragToLight=vec3(0.0, 0.0, 200)-vec3(a_position);
  v_fragToLight=u_lightPosition-vec3(worldPosition);
  
  v_fragToCamera=u_cameraPosition-vec3(u_camera * worldPosition);

  // 阴影
  v_projectedTexcoord = u_textureMatrix * worldPosition;
v_texcoord = a_texcoord;
v_normal = a_normal;
}`,Me=`precision mediump float;

uniform sampler2D u_texture0; // 基础颜色纹理
uniform sampler2D u_texture1; // 过程纹理
uniform sampler2D u_texture2; // 大理石
uniform sampler2D u_texture3; // 花冈石
uniform sampler2D u_texture4; // 土地
uniform sampler2D u_texture5; // 草地

uniform vec3 u_color;


uniform float u_bias;

// 灯光颜色
uniform vec3 u_lightColor;

// 环境光颜色
uniform vec3 u_baseLightColor;

varying vec3 v_fragToLight;

varying vec3 v_fragToCamera;

// varying mat3 TBN;

varying vec2 v_uv;
varying vec2 v_uv2;

// 阴影相关

varying vec4 v_projectedTexcoord;



// 深度纹理
uniform sampler2D u_projectedTexture;

varying vec2 v_texcoord;

varying vec3 v_normal;

void main(){
   



     float u_bias = -0.001;
   
  vec3 projectedTexcoord=v_projectedTexcoord.xyz/v_projectedTexcoord.w;
    float currentDepth=projectedTexcoord.z + u_bias;
    
    bool inRange=
    projectedTexcoord.x>=-1.0 &&
    projectedTexcoord.x<=1.&&
    projectedTexcoord.y>=-1.0 &&
    projectedTexcoord.y<=1.;
    
    // the 'r' channel has the depth values

    vec2 uv = (vec2(projectedTexcoord.xy) + 1.0) / 2.0; 
    float projectedDepth=texture2D(u_projectedTexture,uv.xy).r;
    float shadowLight=(inRange && projectedDepth <= currentDepth) ? 0.5 : 1.0;

    shadowLight = 1.0;

  // 如果在投影中 则 减少光亮 
  
   
   vec3 toLight=normalize(v_fragToLight);
   vec3 toView=normalize(v_fragToCamera);
   
  //  vec4 textureNormal1=texture2D(u_texture0,v_uv);
  //  vec4 textureNormal2=texture2D(u_texture0,v_uv2);
  //  vec3 normal1=vec3(textureNormal1)*2.-1.;
  //  vec3 normal2=vec3(textureNormal2)*2.-1.;
  //  vec3 normal=normalize(normal1+normal2);
   
  //  normal=normalize(TBN*normal);

  // vec3 normal = vec3(1.0, 0.0, 0.0);
   
   vec3 normal = v_normal;






  // 基础颜色
   vec4 baseColor=texture2D(u_texture0, v_texcoord);

  float dtScale1=27.0;                 //细节纹理1 的缩放系数
  float dtScale2=20.00;                 //细节纹理2 的缩放系数
  float dtScale3=6.0;                 //细节纹理3 的缩放系数
  float dtScale4=6.0;                 //细节纹理4 的缩放系数
  float ctSize=257.00;                  //地形灰度图的尺寸（以像素为单位）
  float factor1=ctSize/dtScale1;        //细节纹理1 的纹理坐标缩放系数
  float factor2=ctSize/dtScale2;        //细节纹理2 的纹理坐标缩放系数
  float factor3=ctSize/dtScale3;        //细节纹理3 的纹理坐标缩放系数
  float factor4=ctSize/dtScale4;        //细节纹理4 的纹理坐标缩放系数

  // 各种颜色取色系数 
   vec4 qsxs = texture2D(u_texture1, v_texcoord);
  vec4 color_bigRock = texture2D(u_texture2, v_texcoord * factor1) * qsxs.r;
  vec4 color_rock = texture2D(u_texture3, v_texcoord * factor2) * qsxs.g;
  vec4 color_hardDirt = texture2D(u_texture4, v_texcoord * factor3) * qsxs.b;
  vec4 color_grass = texture2D(u_texture5, v_texcoord * factor4) * qsxs.a;

  // 计算后的地形颜色
  vec3 color = (color_bigRock + color_rock + color_hardDirt + color_grass + baseColor - 0.5).rgb;

   // 环境光 50%
   vec4 ambient=vec4(color*u_baseLightColor * (shadowLight - 0.4),1.);
   
   // // 漫反射
   float diffuseAmt=dot(toLight,normal);
   // // 模型颜色 *
   vec4 diffuse=vec4(color*u_lightColor *.6*diffuseAmt,1.);
   
   vec3 halfVector=normalize(toView+toLight);
   float light=max(dot(normal,toView),0.);
   float specular=0.;
   
   if(light>0.){
      specular=pow(dot(normal,halfVector),512.);
   }
   
   vec4 specularColor=vec4(u_lightColor.rgb  *specular,1.);
   
   
   vec4 frag =ambient + 0.1;
  gl_FragColor = frag;


  // gl_FragColor = vec4(normal, 1.0);


// 






}`;function ut(i,t,e){this.nx=i,this.ny=t,this.nz=e,this.compareNormal=function(n){var r=1e-6;return!(this.nx-n.nx<r&&this.ny-n.ny<r&&this.nz-n.nz<r)}}function Ce(){this.array=new Array,this.add=function(i,t){if(this.array[i]==null)this.array[i]=new Array,this.array[i].push(t);else{for(var e=!0,n=0;n<this.array[i].length;n++)this.array[i][n].compareNormal(t)==!1&&(e=!1);e==!0&&this.array[i].push(t)}}}function tt(i){var t=Math.sqrt(i[0]*i[0]+i[1]*i[1]+i[2]*i[2]);return[i[0]/t,i[1]/t,i[2]/t]}function dt(i,t){return[i[1]*t[2]-i[2]*t[1],i[2]*t[0]-i[0]*t[2],i[0]*t[1]-i[1]*t[0]]}function ze(i){var t=new Array(0,0,0);return i.forEach(function(e){t[0]+=e.nx,t[1]+=e.ny,t[2]+=e.nz}),tt(t)}function Le(i){for(var t=new Array(i.length),e=0;e<i.length;e++){t[e]=new Array(i[0].length);for(var n=0;n<i[0].length;n++)t[e][n]=new Array(3)}for(var r=new Array(i.length),e=0;e<i.length;e++){r[e]=new Array(i[0].length);for(var n=0;n<i[0].length;n++)r[e][n]=new Array(3)}for(var e=0;e<i.length;e++)for(var n=0;n<i[0].length;n++){var s=-1*i.length/2+e*1,o=-1*i[0].length/2+n*1;t[e][n][0]=s,t[e][n][1]=i[e][n],t[e][n][2]=o}for(var h=new Ce,m=i.length-1,l=i[0].length-1,e=0;e<m;e++)for(var n=0;n<l;n++){var c=new Array;c[0]=e*(l+1)+n,c[1]=c[0]+1,c[2]=c[0]+l+1,c[3]=c[1]+l+1;for(var a=t[e+1][n][0]-t[e][n][0],d=t[e+1][n][1]-t[e][n][1],u=t[e+1][n][2]-t[e][n][2],p=t[e][n+1][0]-t[e][n][0],f=t[e][n+1][1]-t[e][n][1],g=t[e][n+1][2]-t[e][n][2],_=tt(dt([a,d,u],[p,f,g])),x=new ut(_[0],_[1],_[2]),w=0;w<3;w++)h.add(c[w],x);a=t[e+1][n][0]-t[e+1][n+1][0],d=t[e+1][n][1]-t[e+1][n+1][1],u=t[e+1][n][2]-t[e+1][n+1][2],p=t[e][n+1][0]-t[e+1][n+1][0],f=t[e][n+1][1]-t[e+1][n+1][1],g=t[e][n+1][2]-t[e+1][n+1][2];for(var v=tt(dt([p,f,g],[a,d,u])),x=new ut(v[0],v[1],v[2]),w=1;w<4;w++)h.add(c[w],x)}for(var e=0;e<i.length;e++)for(var n=0;n<i[0].length;n++){var c=e*(l+1)+n,x=h.array[c],y=ze(x);r[e][n]=y}const b=[],L=T();return _t(L,T(),-Math.PI/2),r.flat(1).forEach(S=>{const M=V();M[0]=S[0],M[1]=S[1],M[2]=S[2];const C=V();jt(C,M,L),b.push(C[0],C[1],C[2])}),b}function Se(i,t,e){var n=98,r=-40,s=new Array,o=new Array;const h=new Array;var m=0,l=0,c=document.createElement("canvas"),a=c.getContext("2d");a.drawImage(i,0,0,t,e);function d(){for(var f=a.getImageData(0,0,t,e),g=0;g<f.data.length;g+=4){var _=f.data[g],w=f.data[g+1],v=f.data[g+2];f.data[g+3]=255;var x=(_+w+v)/3;const y=x/255*n+r;o[m]=y,h.push(y),m++}}d();for(var u=0;u<e;u++){s[u]=new Array;for(var m=0;m<t;m++)s[u][m]=o[l++]}return{normal:Le(s),heightY:h}}class De{constructor(t,e){A(this,"params",{xOffset:0,yOffset:0,incAngle:.5,currentYAngle:0,currentXAngle:0,lastClickX:0,lastClickY:0,ismoved:!1,down:!1,sunx:3e3,sunz:0,sunRadius:2500,sunAngle:Math.PI/2});A(this,"onmousedown",t=>{t.preventDefault(),t.target.tagName=="CANVAS"&&(this.params.lastClickX=t.clientX,this.params.lastClickY=t.clientY,this.params.ismoved=!0,this.params.down=!0)});A(this,"onmousemove",t=>{const{ismoved:e,incAngle:n,lastClickX:r,lastClickY:s,currentYAngle:o,currentXAngle:h}=this.params;t.preventDefault();var m=t.clientX,l=t.clientY;if(e){this.params.down=!1,this.params.currentYAngle=o+(m-r)*n,this.params.currentXAngle=h+(l-s)*n,h>90?this.params.currentXAngle=90:h<-0&&(this.params.currentXAngle=-0);const{target:c}=this.camera,[a,d,u]=c,p=this.camera.eyeToTargetDistance();Math.sin(this.params.currentYAngle)*p+a,Math.cos(this.params.currentXAngle)*p+d,this.camera}this.params.lastClickX=m,this.params.lastClickY=l});A(this,"onmouseup",()=>{const{down:t,lastClickX:e,lastClickY:n}=this.params;this.params.ismoved=!1,t&&(e<400?this.params.xOffset+=4:e>400&&e<800&&n<400?this.params.yOffset+=4:e>400&&e<800&&n>400?this.params.yOffset-=4:e>800&&(this.params.xOffset-=4))});this.ele=t,this.camera=e,t.addEventListener("mousedown",this.onmousedown),t.addEventListener("mousemove",this.onmousemove),t.addEventListener("mouseup",this.onmouseup)}}const Fe=`attribute vec4 a_position;

attribute vec3 a_normal;

attribute vec2 a_texcoord;


// 相机三剑客

uniform mat4 u_projection;


uniform mat4 u_camera;

uniform mat4 u_modelView;

// 法线

varying vec3 v_normal;


varying vec2 v_texcoord;

varying float v_fogDepth;

void main() {
  gl_Position = u_projection * u_camera * u_modelView * a_position;

  v_normal = a_normal;

  v_texcoord = a_texcoord;

  v_fogDepth = -(u_camera * a_position).z;
}`,Re=`precision mediump float;

uniform vec3 u_color;

varying vec3 a_normal;
varying vec2 v_texcoord;

varying float v_fogDepth;

void main() {

      vec3 u_fogColor = vec3(1.0, 1.0, 1.0);
        float fogAmount = smoothstep(400.0, 500.0, v_fogDepth);
     gl_FragColor = vec4(mix(u_color, u_fogColor, fogAmount), 1.0);  
}`;class Pe extends B{constructor(t){super(Fe,Re,"SkyMaterial",t)}}const $e=""+new URL("water_nrm-803bb610.png",import.meta.url).href,ke=""+new URL("texture/mountain/default_c.png",import.meta.url).href,Ve=""+new URL("texture/mountain/default_d.png",import.meta.url).href,Ue=""+new URL("texture/mountain/bigRockFace.png",import.meta.url).href,Be=""+new URL("texture/mountain/grayRock.png",import.meta.url).href,je=""+new URL("texture/mountain/hardDirt.png",import.meta.url).href,Ie=""+new URL("texture/mountain/shortGrass.png",import.meta.url).href;window.Vector3=G;const X=new ee,wt=document.querySelector("#root"),H=new ue(wt),$=new vt(75,window.innerWidth/window.innerHeight,.01,1e3);$.lookAt(0,0,0);$.setPosition(0,60,150);const mt=new de([1,1,1]),D=new me([1,1,1],[10,80,10]),U=new Set,et=new Set;{for(let i=0;i<50;i++){const t=new k(new nt((Math.random()*5|0)+3,32,16),new st({color:Math.random()*16777215|0})),e=Math.random()*100-55,n=Math.random()*50+10,r=Math.random()*100-50;t.setPosition([e,n,r]),U.add(t),et.add(t)}for(let i=0;i<50;i++){const t=new k(new Ae((Math.random()*5|0)+3),new st({color:Math.random()*16777215|0})),e=Math.random()*100-55,n=Math.random()*50+10,r=Math.random()*100-50;t.setPosition([e,n,r]),U.add(t),et.add(t)}}const rt=new k(new nt(400,64,32,0,Math.PI/2,0,Math.PI*2),new Pe({color:3368703}));rt.name="sky";U.add(rt);const At=new k(new yt(1e3,1e3),new pt(be,Ee,{color:3368703,textures:[new P($e)]}));U.add(At);function Ne(){const i=new Image;i.onload=()=>{const t=new yt(99,99,99,99),{normal:e,heightY:n}=Se(i,100,100);t.attr.normal=new Float32Array(e),n.forEach((s,o)=>{t.attr.position[o*3+1]=s});const r=new k(t,new pt(Te,Me,{color:16773120,textures:[new P(ke),new P(Ve),new P(Ue),new P(Be),new P(je),new P(Ie)]}));r.name="山"},i.src="/assets/texture/mountain/default.png"}Ne();new k(new nt(2,16,8),new zt({color:16711680}));new De(wt,$);H.gl;function bt(i){requestAnimationFrame(bt);const t=Math.sin(Math.PI/180*(i/20))*30,e=Math.cos(Math.PI/180*(i/20))*30;rt.setPosition([$.position[0],0,$.position[2]*2]),D.position[0]=t,D.position[2]=e,At.material.time=i,et.forEach(n=>{n.xRotate+=.01,n.yRotate+=.02,n.zRotate+=.03}),H.renderShadowTexture(U,[mt,D]),H.render($,U,[mt,D]),H.renderFrustum($)}requestAnimationFrame(bt);X.add({aspect:65},"aspect",40,90,1).onChange(i=>{});X.add({lightX:D.position[0]},"lightX",-300,300,2).onChange(i=>{D.position[0]=i});X.add({lightY:D.position[1]},"lightY",20,300,2).onChange(i=>{D.position[1]=i});X.add({lightZ:D.position[2]},"lightZ",-300,300,2).onChange(i=>{D.position[2]=i});X.add({cameraX:0},"cameraX",0,90,2).onChange(i=>{});
