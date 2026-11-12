const mix=(a,b,t)=>a+(b-a)*t;
export function cubic(a,b,c,d,t){const u=1-t;return [0,1].map(k=>u*u*u*a[k]+3*u*u*t*b[k]+3*u*t*t*c[k]+t*t*t*d[k]);}
export function softContour(points){
  const n=points.length,mid=(a,b)=>`${(a[0]+b[0])/2} ${(a[1]+b[1])/2}`;
  let d=`M${mid(points[n-1],points[0])}`;
  for(let i=0;i<n;i++)d+=` Q${points[i][0]} ${points[i][1]} ${mid(points[i],points[(i+1)%n])}`;
  return d+' Z';
}
export function ribbon(a,j,b,widths){
  const unit=(x,y)=>{const n=Math.hypot(x,y)||1;return [x/n,y/n];};
  const u=unit(j[0]-a[0],j[1]-a[1]),v=unit(b[0]-j[0],b[1]-j[1]);
  const tangent=unit(u[0]+v[0],u[1]+v[1]);
  const d1=Math.hypot(j[0]-a[0],j[1]-a[1]),d2=Math.hypot(b[0]-j[0],b[1]-j[1]);
  const controls=[
    [a,[a[0]+u[0]*d1*.45,a[1]+u[1]*d1*.45],[j[0]-tangent[0]*d1*.24,j[1]-tangent[1]*d1*.24],j],
    [j,[j[0]+tangent[0]*d2*.24,j[1]+tangent[1]*d2*.24],[b[0]-v[0]*d2*.4,b[1]-v[1]*d2*.4],b],
  ];
  const left=[],right=[],center=[];
  for(let seg=0;seg<2;seg++)for(let i=seg?1:0;i<=12;i++){
    const t=i/12,point=cubic(...controls[seg],t),before=cubic(...controls[seg],Math.max(0,t-.01)),after=cubic(...controls[seg],Math.min(1,t+.01));
    const n=unit(-(after[1]-before[1]),after[0]-before[0]);
    const w=mix(widths[seg],widths[seg+1],t)*.5+Math.sin(t*Math.PI)*1.8;
    center.push(point);left.push([point[0]+n[0]*w,point[1]+n[1]*w]);right.push([point[0]-n[0]*w,point[1]-n[1]*w]);
  }
  return {outline:softContour([...left,...right.reverse()]),center,controls};
}
export function roundMouth(p){
  const smile=p.smile,jaw=p.jaw,round=p.round;
  const w=24+smile*12-round*11,cy=310-smile*7;
  if(round>.5){const ry=6+jaw*8;return {w,cy,open:2*ry,d:`M${220-w} ${cy+5} C${220-w} ${cy+5-ry*1.33} ${220+w} ${cy+5-ry*1.33} ${220+w} ${cy+5} C${220+w} ${cy+5+ry*1.33} ${220-w} ${cy+5+ry*1.33} ${220-w} ${cy+5} Z`};}
  const depth=5+jaw*25+smile*5;
  return {w,cy,open:depth,d:`M${220-w} ${cy} C${220-w*.55} ${cy+3-smile*2} ${220+w*.48} ${cy-3+smile*6} ${220+w} ${cy} C${220+w*.92} ${cy+depth*.82} ${220+w*.4} ${cy+depth*1.23} 220 ${cy+depth} C${220-w*.38} ${cy+depth*1.1} ${220-w*.9} ${cy+depth*.85} ${220-w} ${cy} Z`};
}
