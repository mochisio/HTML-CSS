const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

var center = {
  x: 150,
  y: 150,
};

var radius = 100;

var data = [{
  name: '1',
  color: '#FFCEBE',
  weight: 1,
}, {
  name: '2',
  color: '#CEFFBE',
  weight: 1,
}, {
  name: '3',
  color: '#CEBEFF',
  weight: 1,
}, {
  name: '4',
  color: '#FDED9E',
  weight: 1,
}, {
  name: '5',
  color: '#aaaaaa',
  weight: 1,
},{
  name: '6',
  color: '#00aaaa',
  weight: 1,
}
];

var sum_weight = 0;
var unit_weight = 0;
var stopFlag = false;
var startFlag = false;
var uw_count =0;

//
// メイン処理
//
data.forEach(e => {
  sum_weight += e.weight;
});
unit_weight = 360 / sum_weight;

init();

showLabel();

drawRoullet(0);

function drawRoullet(offset) {
  var uw_count = offset;

  data.forEach(e => {
    drawPie(
      center.x,
      center.y,
      uw_count,
      uw_count + unit_weight,
      radius,
      e.color,
      e.name
    );
    uw_count += unit_weight;
  });
}

//ターン管理





var turnset=document.getElementById("turnSet");
var whoseturn=document.getElementById("whoseTurn");


var turnsetInt=parseInt(turnset);
var whoseturnInt=parseInt(whoseturn);

turnsetInt=1;
whoseturnInt=1;

function turn(){
  var playerStock=document.getElementById("playerStock");
  var playerStockInt=parseInt(playerStock.valueAsNumber);
  if(whoseturnInt<playerStockInt){
    whoseturnInt++;
    whoseturn.textContent=`${whoseturnInt}`;
    }
  else{
  whoseturnInt =1;
  whoseturn.textContent=`${whoseturnInt}`;
  turnsetInt++;
  turnset.textContent=`${turnsetInt}`;
  }
  
}

document.getElementById("turnEnd").addEventListener('click',turn)

//音源用意
const rollSound = document.getElementById("rollSound");
const stopSound = document.getElementById("stopSound");

//音声制御用
let audioTimer= null;


let audio = new Audio();

//音を止める
function audioStop(audio){
  audio.pause();
  audio.currentTime = 0;
  audioTimer =null;

}


function runRoullet() {
  var count = 1; // 終了までのカウント
  var lastCell = '';
  var deg_counter = 0; // 角度のカウント
  var acceleration = 1;
  
  var timer = setInterval(function() {
    deg_counter += acceleration;

    if (stopFlag) {
      count++;
      //回転中のBGMフェードアウト
      rollSound.volume -= 0.002;
    }

    if (count < 500) {
      acceleration = 1000 / (count);
      drawRoullet(deg_counter);
      
    } else {
      count = 0;
      clearInterval(timer);
      endEvent();
    }
  }, 10);

  var endEvent =async function() {
    count++;
    var id = setTimeout(endEvent, 115);
    if (count > 9) {
      clearTimeout(id);
      startFlag = false;
      stopFlag = false;
      var current_deg = Math.ceil(deg_counter % 360);
      var sum = uw_count;
      
      for (var i = data.length-1; i > 0; i--) {
        if (
          unit_weight * sum < current_deg
          && current_deg < unit_weight * (sum + data[i].weight)
        ) {
          
          break;
        }
        sum -= data[i].weight;
      }
      rollSound.loop =false;
      audioStop(rollSound);
      
    }
    
  };
    
}

document.getElementById('run').addEventListener('click',cantMash);
//スタート連打出来ないようにする
function cantMash(){
  if (startFlag === false) {
    runRoullet();
    // スタートを無効化
    document.getElementById('run').removeEventListener('click',cantMash);
    startFlag = true;
    //回転中のBGM再生
    rollSound.volume =1;
    rollSound.play();
    rollSound.loop = true;
  } else {
    startFlag = false;
  }
}

document.getElementById('stop').addEventListener('click',   async function() {
  if (startFlag) {
    stopFlag = true; 

  //スタートを無効化したのを元に戻す
      document.getElementById('run').addEventListener('click',cantMash);
      
      ;
      await audio.play();
      audioStop();   
    }
    
});

function init() {
  canvas.width = 300;
  canvas.height = 300;

  var dst = context.createImageData(canvas.width, canvas.height);
  for (var i = 0; i < dst.data.length; i++) {
    dst.data[i] = 255;
  }
  context.putImageData(dst, 0, 0);
}
  //context.rotate((start_deg * Math.PI) / 180);
  //context.translate(cx,cy);
function drawPie(cx, cy, start_deg, end_deg, radius, color ,label) {
  context.save();
  var _start_deg = (360 - start_deg) * Math.PI / 180;
  var _end_deg = (360 - end_deg) * Math.PI / 180;
  
  context.beginPath();
  context.translate(cx,cy);
  context.rotate( (360/data.length) - (_end_deg + _start_deg) / 2);
  context.moveTo(0, 0);
  
  context.fillStyle = color; // 塗りつぶしの色は赤
  context.arc(0, 0, radius,(360/data.length) - (_end_deg - _start_deg) / 2 ,(360/data.length) + (_end_deg - _start_deg) / 2 ,true);
  context.fill();
    // グラフの中に文字表示　 構想としては各図形の中央辺りに配置したい
    context.font = "30pt Arial" //文字の大きさとフォント
    context.fillStyle ='#000000'; //文字の色
    //context.rotate(-180-(_end_deg/2));
    tategaki(context,label,0,0);
    
    context.restore();
    showArrow();
}
//縦書きにする関数 参考元：https://codepen.io/phi_jp/pen/negKRO
function tategaki(context, text, x, y) {
  var textList = text.split('\n');
  var lineHeight = context.measureText("あ").width;
  
  textList.forEach(function(elm, i) {
    Array.prototype.forEach.call(elm, function(ch, j) {
      context.fillText(ch, -50+(lineHeight*Math.sin(360/(data.length*2)))+(x-lineHeight*i), y+lineHeight*j);
    });
  });
  
};


function roulletLabel(){
  context.font('16px Century Gothic')
  context.strokeText('label', 225, 225);
}

function showLabel() {
  var label_el = document.getElementById('labels');

  var text = '<table>';

  for (var i = 0; i < data.length; i++) {
    text += `
        <tr>
        <td style="width:20px;background-color:${data[i].color};"></td>
        <td>${data[i].name}</td>
        </tr>`;
  }

  text += '</table>';

  
}

function showArrow() {
  context.beginPath();
  context.moveTo(center.x, center.y - radius);
  context.lineTo(center.x + 10, center.y - radius - 10);
  context.lineTo(center.x - 10, center.y - radius - 10);
  context.closePath();
  context.stroke();
  context.fillStyle = 'rgba(40,40,40)';
  context.fill();
}

//ポイント管理
let point1 =document.getElementById("point1");
let point2 =document.getElementById("point2");
let point3 =document.getElementById("point3");
let point4 =document.getElementById("point4");
let point5 =document.getElementById("point5");
let point6 =document.getElementById("point6");
let point7 =document.getElementById("point7");
let point8=document.getElementById("point8");
let point9 =document.getElementById("point9");
let point10 =document.getElementById("point10");
//精算するポイント
const event_point =document.getElementsByClassName("event-point");
const event_point1 = document.getElementById("event-point1");
const event_point2 = document.getElementById("event-point2");
const event_point3 = document.getElementById("event-point3");
const event_point4 = document.getElementById("event-point4");
const event_point5 = document.getElementById("event-point5");
const event_point6 = document.getElementById("event-point6");
const event_point7 = document.getElementById("event-point7");
const event_point8= document.getElementById("event-point8");
const event_point9 = document.getElementById("event-point9");
const event_point10 = document.getElementById("event-point10");







//精算ボタン
let seisann1_button=document.getElementById("seisann_button1");
let seisann2_button=document.getElementById("seisann_button2");
let seisann3_button=document.getElementById("seisann_button3");
let seisann4_button=document.getElementById("seisann_button4");
let seisann5_button=document.getElementById("seisann_button5");
let seisann6_button=document.getElementById("seisann_button6");
let seisann7_button=document.getElementById("seisann_button7");
let seisann8_button=document.getElementById("seisann_button8");
let seisann9_button=document.getElementById("seisann_button9");
let seisann10_button=document.getElementById("seisann_button10");







//精算ボタンの関数
function seisann1(){
  
  pointSum1 =parseInt(point1.textContent)+event_point1.valueAsNumber;
  if (isNaN(event_point1.valueAsNumber)){
  
    alert('警告：2文字目以降に+または-が含まれているため、ポイント精算が出来ません。+か-の前にある文字を取り除いてからもう一度精算ボタンを押してください 。');
  }
  else{
    point1.textContent =`${pointSum1}`
    event_point1.value=0;
  }
}

function seisann2(){
  pointSum2 =parseInt(point2.textContent)+event_point2.valueAsNumber;
  if (isNaN(event_point2.valueAsNumber)){
  
    alert('警告：2文字目以降に+または-が含まれているため、ポイント精算が出来ません。+か-の前にある文字を取り除いてからもう一度精算ボタンを押してください 。');
  }
  else{
    point2.textContent =`${pointSum2}`
    event_point2.value=0;
  }
}
function seisann3(){
  pointSum3 =parseInt(point3.textContent)+event_point3.valueAsNumber;
  if (isNaN(event_point3.valueAsNumber)){
  
    alert('警告：2文字目以降に+または-が含まれているため、ポイント精算が出来ません。+か-の前にある文字を取り除いてからもう一度精算ボタンを押してください 。');
  }
  else{
    point3.textContent =`${pointSum3}`
    event_point3.value=0;
  }
}
function seisann4(){
  pointSum4 =parseInt(point4.textContent)+event_point4.valueAsNumber;
  if (isNaN(event_point4.valueAsNumber)){
  
    alert('警告：2文字目以降に+または-が含まれているため、ポイント精算が出来ません。+か-の前にある文字を取り除いてからもう一度精算ボタンを押してください 。');
  }
  else{
    point4.textContent =`${pointSum4}`
    event_point4.value=0;
  }
}
function seisann5(){
  pointSum5 =parseInt(point5.textContent)+event_point5.valueAsNumber;
  if (isNaN(event_point5.valueAsNumber)){
  
    alert('警告：2文字目以降に+または-が含まれているため、ポイント精算が出来ません。+か-の前にある文字を取り除いてからもう一度精算ボタンを押してください 。');
  }
  else{
    point5.textContent =`${pointSum5}`
    event_point5.value=0;
  }
}

function seisann6(){
  pointSum6 =parseInt(point6.textContent)+event_point6.valueAsNumber;
  if (isNaN(event_point6.valueAsNumber)){
  
    alert('警告：2文字目以降に+または-が含まれているため、ポイント精算が出来ません。+か-の前にある文字を取り除いてからもう一度精算ボタンを押してください 。');
  }
  else{
    point6.textContent =`${pointSum6}`
    event_point6.value=0;
  }
}
function seisann7(){
  pointSum7 =parseInt(point7.textContent)+event_point7.valueAsNumber;
  if (isNaN(event_point7.valueAsNumber)){
  
    alert('警告：2文字目以降に+または-が含まれているため、ポイント精算が出来ません。+か-の前にある文字を取り除いてからもう一度精算ボタンを押してください 。');
  }
  else{
    point7.textContent =`${pointSum7}`
    event_point7.value=0;
  }
}
function seisann8(){
  pointSum8 =parseInt(point8.textContent)+event_point8.valueAsNumber;
  if (isNaN(event_point8.valueAsNumber)){
  
    alert('警告：2文字目以降に+または-が含まれているため、ポイント精算が出来ません。+か-の前にある文字を取り除いてからもう一度精算ボタンを押してください 。');
  }
  else{
    point8.textContent =`${pointSum8}`
    event_point8.value=0;
  }
}
function seisann9(){
  pointSum9 =parseInt(point9.textContent)+event_point9.valueAsNumber;
  if (isNaN(event_point9.valueAsNumber)){
  
    alert('警告：2文字目以降に+または-が含まれているため、ポイント精算が出来ません。+か-の前にある文字を取り除いてからもう一度精算ボタンを押してください 。');
  }
  else{
    point9.textContent =`${pointSum9}`
    event_point9.value=0;
  }
}
function seisann10(){
  pointSum10 =parseInt(point10.textContent)+event_point10.valueAsNumber;
  if (isNaN(event_point10.valueAsNumber)){
  
    alert('警告：2文字目以降に+または-が含まれているため、ポイント精算が出来ません。+か-の前にある文字を取り除いてからもう一度精算ボタンを押してください 。');
  }
  else{
    point10.textContent =`${pointSum10}`
    event_point10.value=0;
  }
}


seisann1_button.addEventListener("click",seisann1);
seisann2_button.addEventListener("click",seisann2);
seisann3_button.addEventListener("click",seisann3);
seisann4_button.addEventListener("click",seisann4);
seisann5_button.addEventListener("click",seisann5);
seisann6_button.addEventListener("click",seisann6);
seisann7_button.addEventListener("click",seisann7);
seisann8_button.addEventListener("click",seisann8);
seisann9_button.addEventListener("click",seisann9);
seisann10_button.addEventListener("click",seisann10);


