export const drawBall = (ctx, x, y, r)=>{
    ctx.beginPath()
    ctx.arc(x,y,r,0.3*Math.PI);
    ctx.fillStyle = '#'+Math.floor(Math.random()*16777215).toString(16)
    ctx.fill()
}