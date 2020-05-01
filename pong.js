// select canvas element
const canvas = document.getElementById("pong");

// getContext of canvas = methods and properties to draw and do a lot of things to the Canvas
const ctx = canvas.getContext("2d");

const user = {
    x : 0,
    y : canvas.height/2 - 100/2,
    width : 10,
    height : 100,
    color: "WHITE",
    score : 0
}

const com = {
    x : canvas.width - 10,
    y : canvas.height/2 - 100/2,
    width : 10,
    height : 100,
    color: "WHITE",
    score : 0
}

const ball = {
    x : canvas.width/2,
    y : canvas.height/2,
    r : 10,
    speed : 5,
    velocityX : 5,
    velocityY : 5,
    color : "WHITE"
}

const net = {
    x: canvas.width/2 - 2/2,
    y: 0,
    width : 2,
    height : 10,
    color :"WHITE"
}

// draw rect function
function drawRect(x, y, w, h, color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

// draw circle
function drawCircle(x, y, r, color){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI*2, false);
    ctx.closePath();
    ctx.fill();
}

function drawText(text, x, y, color){
    ctx.fillStyle = color;
    ctx.font = "75px fantasy";
    ctx.fillText(text, x, y);
}

function drawNet(){
    for(let i = 0; i <= canvas.height; i+=15){
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}

canvas.addEventListener("mousemove", movePaddle);

function movePaddle(evt){
    let rect = canvas.getBoundingClientRect();
    user.y = evt.clientY - rect.top - user.height/2;
}

function collision(b, p){
    
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    b.top = b.y - b.r;
    b.bottom = b.y + b.r;
    b.left = b.x - b.r;
    b.right = b.x + b.r;
    console.log(b.x)
    
    return b.bottom > p.top && b.top < p.bottom && b.left < p.right && b.right > p.left;
}

function resetBall(){
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    ball.speed = 5;
    ball.velocityX = -ball.velocityX;
}

function render(){
    // clear the canvas
    drawRect(0, 0, canvas.width, canvas.height, "BLACK");
    
    // draw the net
    drawNet();
    
    // draw score
    drawText(user.score, canvas.width/4, canvas.height/5, "WHITE");
    drawText(com.score, 3*canvas.width/4, canvas.height/5, "WHITE");
    
    // draw user's paddle
    drawRect(user.x, user.y, user.width, user.height, user.color);
    
    // draw COM's paddle
    drawRect(com.x, com.y, com.width, com.height, com.color);

    // draw ball
    drawCircle(ball.x, ball.y, ball.r, ball.color);
}

function update(){
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    
    // COM paddle
    let computerLevel = 0.1;
    com.y += (ball.y - (com.y + com.height/2)) * computerLevel;

    // collision with top and bottom of canvas
    if(ball.y + ball.r > canvas.height || ball.y - ball.r < 0){
        ball.velocityY = -ball.velocityY;
    }
    
    let player = (ball.x < canvas.width/2) ? user:com;

    // collision with player (user or com) and ball, reverse ball direction
    if(collision(ball, player)){
        let collidePoint = (ball.y - (player.y + player.height/2));
        collidePoint = collidePoint
        console.log(collision(ball, player))
        ball.velocityX = -ball.velocityX;
        
        // normalization
        collidePoint = collidePoint / (player.height/2);
        let angleRad = (Math.PI/4) * collidePoint;

        let direction = (ball.x < canvas.width/2) ? 1 : -1;

        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = direction * ball.speed * Math.sin(angleRad);        

        ball.speed += 0.5;
    }
    
    // com win
    if(ball.x - ball.r < 0){
        com.score++;
        resetBall();

    // user win
    }else if(ball.x + ball.r > canvas.width){
        user.score++;
        resetBall();
    }
}

function game(){
    update(); //Movements, Collisions detection, Score update,     
    render();
}

const framePerSecond = 50;
// runs the render function every 1000ms=1s
setInterval(game, 1000/framePerSecond);