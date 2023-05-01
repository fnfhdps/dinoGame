let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d'); // 렌더링 컨텍스트를 노출

canvas.width = window.innerWidth - 100;
canvas.height = window.innerHeight - 100;

// 공룡그리기
let dinoImg = new Image();
dinoImg.src = './images/dinosaur.png';
const dino = {
  x: 10,
  y: 200,
  width : 50,
  height : 50,
  draw(){ 
    ctx.fillStyle = 'green';
    // ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.drawImage(dinoImg, this.x, this.y, this.width, this.height);
  }
}

// 장애물그리기
let cactusImg = new Image();
cactusImg.src = './images/cactus.png';
class Cactus{
  constructor(){
    this.x = 500;
    this.y = 200;
    this.width = 50;
    this.height = 50;
  }
  draw(){
    ctx.fillStyle = 'red';
    // 네모를 그리는 이유- 일명 hitbox로 충돌 범위를 파악하기 위해
    // ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.drawImage(cactusImg, this.x, this.y);
  }
}

// 장애물을 2~3초마다 생성해야함
// 120프레임마다 장애물 생성 후 array에 넣고
// 반복문으로 array에 있는 장애물들 draw();
let timer = 0;
let cactuses = []; // 장애물 여러개 관리
let jumping = false;
let jumpTimer = 0;
let animation;

function frameRun(){ 
  // 1초에 60번 코드 반복 실행
  // 실행횟수는 모니터 fps에 따라 다름
  animation = requestAnimationFrame(frameRun);
  timer++;

  // 단순하게 이동만하면 잔상이 남기 때문에 캠버스를 지우고 그리고 반복
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  if(timer % 120 === 0){
    const cactus = new Cactus();
    cactuses.push(cactus);
  }

  cactuses.forEach((a, i, o)=>{
    // x좌표가 0미만이면 장애물 제거
    if(a.x < 0){
      o.splice(i, 1) // i번째 1개만 삭제
    }
    a.x -= 3; // 장애물 이동

    collisionCheck(dino, a); // 충돌확인

    a.draw();
  });

  // 점프 위
  if(jumping){
    dino.y -= 3;
    jumpTimer +=2;
  }
  // 점프 아래
  // dino의 기존위치 y=200을 넘으면~
  if(jumping == false && dino.y < 200){
    dino.y += 3;
  }
  if(jumpTimer >  80){
    jumping = false;
    jumpTimer = 0;
  }

  dino.draw();
} 
frameRun();

// space 눌렀을 때  
document.addEventListener('keydown', function(e){
  if(e.code === 'Space'){
    jumping = true;
  }
});

// 충돌확인
// 장애물의 x좌표 - dino의 x좌표 < 0 ==> 앞에서 충돌함
// 장애물의 y좌표 - dino의 y좌표 < 0 ==> 위에서 충돌함
function collisionCheck(dino, cactus){
  const xGap = cactus.x - (dino.x + dino.width);
  const yCap = cactus.y - (dino.y + dino.height);
  if(xGap < 0 && yCap < 0){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    cancelAnimationFrame(animation); // 애니매이션 중단
  }
}