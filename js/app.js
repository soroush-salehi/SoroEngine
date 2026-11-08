"use strict";
class Input {
 constructor(canvas){this.keys=new Set();this.canvas=canvas;window.addEventListener("keydown",event=>{const key=event.key.toLowerCase();if(["arrowup","arrowdown","arrowleft","arrowright"," "].includes(key))event.preventDefault();this.keys.add(key);});window.addEventListener("keyup",event=>this.keys.delete(event.key.toLowerCase()));window.addEventListener("blur",()=>this.keys.clear());}
 down(...keys){return keys.some(key=>this.keys.has(key));}
}
class Player {
 constructor(){this.x=450;this.y=210;this.speed=230;this.radius=16;}
 update(dt,input,width,height){
  let dx=Number(input.down("d","arrowright"))-Number(input.down("a","arrowleft"));
  let dy=Number(input.down("s","arrowdown"))-Number(input.down("w","arrowup"));
  const length=Math.hypot(dx,dy)||1;dx/=length;dy/=length;
  this.x=Math.max(this.radius,Math.min(width-this.radius,this.x+dx*this.speed*dt));
  this.y=Math.max(this.radius,Math.min(height-this.radius,this.y+dy*this.speed*dt));
 }
}
class Engine {
 constructor(canvas){
  this.canvas=canvas;this.ctx=canvas.getContext("2d");this.input=new Input(canvas);
  this.player=new Player();this.last=0;this.frames=0;this.fpsAt=0;this.running=true;
  this.loop=this.loop.bind(this);this.frame=requestAnimationFrame(this.loop);
 }
 loop(time){
  if(!this.running)return;
  const dt=Math.min((time-this.last)/1000||0,.05);this.last=time;
  this.player.update(dt,this.input,this.canvas.width,this.canvas.height);
  this.render();this.frames++;
  if(time-this.fpsAt>=1000){document.querySelector("#fps").textContent="FPS: "+this.frames;this.frames=0;this.fpsAt=time;}
  this.frame=requestAnimationFrame(this.loop);
 }
 render(){
  const {ctx,canvas,player}=this;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle="#172644";ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.strokeStyle="#2c3d5e";ctx.lineWidth=1;
  for(let x=0;x<canvas.width;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,canvas.height);ctx.stroke();}
  for(let y=0;y<canvas.height;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(canvas.width,y);ctx.stroke();}
  ctx.fillStyle="#91aaff";ctx.beginPath();ctx.arc(player.x,player.y,player.radius,0,Math.PI*2);ctx.fill();
  ctx.fillStyle="#fff";ctx.font="13px system-ui";ctx.fillText("WASD / ARROWS · MOVE",18,24);
 }
 reset(){this.player=new Player();}
 destroy(){this.running=false;cancelAnimationFrame(this.frame);}
}
const canvas=document.querySelector("#game");
const engine=new Engine(canvas);
document.querySelector("#reset").addEventListener("click",()=>engine.reset());
window.addEventListener("beforeunload",()=>engine.destroy());