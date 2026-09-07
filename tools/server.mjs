import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd(), port=Number(process.env.PORT||5173);
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.webp':'image/webp','.mp4':'video/mp4','.gif':'image/gif','.woff2':'font/woff2'};
http.createServer((req,res)=>{
  let pathname;try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400).end();return;}
  const file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
  if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
  fs.stat(file,(err,stat)=>{
    if(err||!stat.isFile()){res.writeHead(404).end('Not found');return;}
    const headers={'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-cache','Accept-Ranges':'bytes'};
    const range=req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
    if(range){const start=Number(range[1]),end=range[2]?Number(range[2]):stat.size-1;if(start>end||end>=stat.size){res.writeHead(416).end();return;}res.writeHead(206,{...headers,'Content-Range':`bytes ${start}-${end}/${stat.size}`,'Content-Length':end-start+1});fs.createReadStream(file,{start,end}).pipe(res);}
    else{res.writeHead(200,{...headers,'Content-Length':stat.size});fs.createReadStream(file).pipe(res);}
  });
}).on('error',error=>{
  if(error.code==='EADDRINUSE')console.error(`端口 ${port} 已被占用。若作品集已启动，请直接打开 http://localhost:${port}；或在 PowerShell 设置 $env:PORT="5174" 后重新运行 npm.cmd run dev。`);
  else console.error(error.message);
  process.exitCode=1;
}).listen(port,'127.0.0.1',()=>console.log(`Portfolio preview: http://localhost:${port}`));
