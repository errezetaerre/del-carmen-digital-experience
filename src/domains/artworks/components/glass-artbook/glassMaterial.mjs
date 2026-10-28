// Canonical 11B-23 optical material. Shared by artwork and collection books.
export const GLASS_MATERIAL_VERTEX=`#version 300 es
precision highp float;in vec2 aPosition;out vec2 vUv;
void main(){vUv=aPosition*.5+.5;gl_Position=vec4(aPosition,0.,1.);}`;
export const GLASS_MATERIAL_FRAGMENT=`#version 300 es
precision highp float;in vec2 vUv;out vec4 outColor;
uniform float uAngle,uLight,uStrength,uArt,uPalette,uSide,uPixelRatio,uCornerStrength;
uniform vec2 uSize,uRadii;
vec3 rotY(vec3 p,float a){return vec3(cos(a)*p.x+sin(a)*p.z,p.y,-sin(a)*p.x+cos(a)*p.z);}
void coat(inout vec3 color,inout float alpha,vec3 tint,float coverage){
 coverage=clamp(coverage,0.,1.);
 float next=coverage+alpha*(1.-coverage);
 color=(tint*coverage+color*alpha*(1.-coverage))/max(next,.001);
 alpha=next;
}
void main(){
 vec2 uv=vUv;vec2 q=uv*2.-1.;
 float a=radians(uAngle),l=radians(uLight);
 vec3 n=normalize(rotY(vec3(0.,0.,1.),a));
 // Same camera/light/half-vector/Fresnel/specular model as Optical Lab 10.
 vec3 ro=vec3(0.,0.,3.5);
 // uSide is +1 for a face whose hinge is on its left and -1 on its right.
 // The reverse carries the opposite side and a 180-degree normal rotation.
 // Both faces therefore occupy the same rigid sheet around the same hinge.
 vec3 p=rotY(vec3((q.x+uSide)*.59,q.y*.76,0.),a);
 vec3 L=normalize(vec3(sin(l),.30,cos(l)));
 vec3 V=normalize(ro-p);vec3 H=normalize(L+V);
 float spec=pow(max(dot(n,H),0.),180.);
 float fres=pow(1.-abs(dot(n,V)),4.);
 float grazing=pow(max(dot(reflect(-L,n),V),0.),26.);
 float band=pow(max(dot(n,H),0.),30.);
 float energy=uStrength*(spec*2.8+grazing*.28+band*.15+fres*.48);
 // Information faces are visible at negative normal angles; artwork faces
 // are visible at positive angles. A mirrored support light lets the same
 // rigid-glass specular model catch both sweeps. The approved artwork pass
 // and primary light at +35 degrees remain exactly unchanged.
 if(uArt<.5){
  vec3 infoL=normalize(vec3(-sin(l),.30,cos(l)));
  vec3 infoH=normalize(infoL+V);
  float infoSpec=pow(max(dot(n,infoH),0.),180.);
  float infoGrazing=pow(max(dot(reflect(-infoL,n),V),0.),26.);
  float infoBand=pow(max(dot(n,infoH),0.),30.);
  energy+=uStrength*(infoSpec*2.8+infoGrazing*.28+infoBand*.15);
 }

 // Only a neutral 5% black film is composited over the existing DOM image.
 // Reflection raises opacity locally; the primary image is never repainted.
 float spineDistance=uSide>0.?uv.x:1.-uv.x;
 float spine=exp(-spineDistance*18.)*uStrength*(.07+.13*fres);
 float alpha=.05;
 vec3 color=vec3(0.);
 coat(color,alpha,vec3(1.,.86,.64),1.-exp(-max(energy+spine,0.)));
 // Signed distance to the rounded contour, in CSS pixels. The radii
 // match the clipping profile minus its one-pixel transparent border.
 vec2 cssSize=uSize/max(uPixelRatio,.001);
 vec2 centered=(uv-.5)*cssSize;
 vec2 edgePx=min(uv,1.-uv)*cssSize;
 bool outerCorner=q.x*uSide>0.;
 float radius=outerCorner?uRadii.x:uRadii.y;
 radius=min(radius,min(cssSize.x,cssSize.y)*.25);
 vec2 box=abs(centered)-(cssSize*.5-vec2(radius));
 vec2 roundVector=max(box,vec2(0.));
 float contour=length(roundVector)+min(max(box.x,box.y),0.)-radius;
 float distanceInside=-contour;
 float aa=max(fwidth(contour),.35);
 // The bevel normal follows each corner's arc as well as its straight edges.
 vec2 outward=length(roundVector)>.001?normalize(roundVector)*sign(centered):
   (box.x>box.y?vec2(sign(centered.x),0.):vec2(0.,sign(centered.y)));
 vec3 bevelN=normalize(rotY(vec3(outward*.55,1.),a));
 vec3 perimeterL=uArt<.5?normalize(vec3(-sin(l),.30,cos(l))):L;
 vec3 perimeterH=normalize(perimeterL+V);
 float bevelSpec=pow(max(dot(bevelN,perimeterH),0.),64.);
 float bevelFres=pow(1.-abs(dot(bevelN,V)),4.);
 // The continuous rim uses a bounded bronze/champagne reflection.
 // The contour stays in place; its colored film is now finer and capped at 50% opacity.
 float offset=distanceInside-.85;
 float coreWidth=max(.23,aa*.32);
 float softCore=exp(-.5*pow(offset/coreWidth,2.));
 float shoulder=exp(-.5*pow(offset/1.15,2.));
 float falloff=1.-smoothstep(3.,4.5,max(distanceInside,0.));
 float rimEnergy=.06+uStrength*(.24+.16*bevelSpec+.06*bevelFres);
 float borderOpacity=.50;
 float rimCoverage=borderOpacity*softCore*falloff*clamp(.50+uStrength*(.70+.50*bevelSpec+.20*bevelFres),0.,1.);
 vec3 bronzeShadow=vec3(111.,75.,45.)/255.;
 vec3 bronzeBody=vec3(167.,121.,67.)/255.;
 vec3 goldShoulder=vec3(201.,154.,91.)/255.;
 vec3 champagne=vec3(225.,187.,128.)/255.;
 vec3 highlight=vec3(240.,213.,163.)/255.;
 coat(color,alpha,champagne,rimCoverage);
 // A specular corner focus feeds the short physical metal bevel.
 // A distinct bronze substrate preserves the cap under the moving glass
 // reflection. Its warm catch and surrounding light have independent energy.
 vec3 cornerHighlight=vec3(247.,219.,169.)/255.;
 vec3 cornerGlow=vec3(211.,164.,96.)/255.;
 float cornerReach=max(edgePx.x,edgePx.y);
 bool onArc=box.x>0. && box.y>0.;
 float along=onArc?radius*abs(atan(roundVector.y,roundVector.x)-.785398):
   radius*.785398+max(cornerReach-radius,0.);
 float tailEnvelope=outerCorner?exp(-pow(along/44.,1.6)):0.;
 tailEnvelope*=1.-smoothstep(28.,42.,along);
 float focusEnvelope=outerCorner?exp(-.5*pow(along/18.,2.)):0.;
 focusEnvelope*=1.-smoothstep(30.,48.,along);
 float capWidth=.60+5.80*exp(-pow(along/32.,1.7));
 float capCoverage=tailEnvelope*(1.-smoothstep(capWidth-aa*.6,capWidth+aa*.6,distanceInside));
 float across=clamp(distanceInside/capWidth,0.,1.);
 vec3 capN=normalize(rotY(vec3(outward*(1.-2.*across),1.),a));
 float capSpec=pow(max(dot(capN,perimeterH),0.),100.);
 float darkFacet=exp(-pow((across-.73)/.16,2.));
 float broadFacet=exp(-pow((across-.37)/.30,2.));
 vec3 bronzeEnvironment=mix(vec3(.14,.115,.09),bronzeShadow,.38);
 vec3 metal=mix(bronzeEnvironment,goldShoulder,.24+.40*broadFacet);
 metal=mix(metal,champagne,broadFacet*(.18+.22*uCornerStrength));
 metal*=1.-.28*darkFacet;
 coat(color,alpha,metal,capCoverage);
 float depth=max(distanceInside,0.);
 float innerAir=exp(-.5*pow((depth-2.2)/6.2,2.));
 innerAir*=1.-smoothstep(17.,23.,depth);
 float airEnergy=innerAir*focusEnvelope*uCornerStrength*.21;
 coat(color,alpha,cornerGlow,1.-exp(-airEnergy));
 float cornerShoulder=exp(-.5*pow((depth-1.7)/1.05,2.));
 float shoulderEnergy=cornerShoulder*focusEnvelope*uCornerStrength*(.56+.12*capSpec);
 coat(color,alpha,vec3(225.,187.,128.)/255.,1.-exp(-shoulderEnergy));
 float reflectionDepth=1.30+.22*sin(a+.15*outward.y);
 float catchWidth=max(.34,aa*.60);
 float arcCatch=exp(-.5*pow((depth-reflectionDepth)/catchWidth,2.));
 float reflectedEnergy=arcCatch*focusEnvelope*uCornerStrength*(4.3+capSpec*1.2);
 coat(color,alpha,cornerHighlight,1.-exp(-reflectedEnergy));
 outColor=vec4(pow(clamp(color,0.,1.),vec3(.94)),alpha*(1.-smoothstep(-aa,aa,contour)));
}`;

export function createGlassMaterial(canvas){
  const gl=canvas.getContext('webgl2',{alpha:true,premultipliedAlpha:false,antialias:true,preserveDrawingBuffer:true});if(!gl)throw Error('WebGL2 no disponible');
  function sh(t,source){const s=gl.createShader(t);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;}
  const program=gl.createProgram();gl.attachShader(program,sh(gl.VERTEX_SHADER,GLASS_MATERIAL_VERTEX));gl.attachShader(program,sh(gl.FRAGMENT_SHADER,GLASS_MATERIAL_FRAGMENT));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));
  gl.useProgram(program);const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
  const loc=gl.getAttribLocation(program,'aPosition');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
  const material={gl,program,buffer,uniforms:Object.fromEntries(['uAngle','uLight','uStrength','uArt','uPalette','uSide','uSize','uPixelRatio','uRadii','uCornerStrength'].map(k=>[k,gl.getUniformLocation(program,k)]))};
  return material;
}

export function paintGlassMaterial(material,canvas,frame){
 const {gl,program,uniforms:u}=material;
 if(gl.isContextLost())return false;
 const {width,height,pixelRatio=1,angle=0,side=1,artwork=false,palette=0,strength=.6,cornerStrength=.9,outerRadius=13,innerRadius=1}=frame;
 const w=Math.max(2,Math.round(width*pixelRatio)),h=Math.max(2,Math.round(height*pixelRatio));
 if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h)}
 const signature=[w,h,pixelRatio,artwork,palette,side,angle.toFixed(5),strength,cornerStrength,outerRadius,innerRadius].join(':');
 if(material.lastFrame===signature)return true;
 material.lastFrame=signature;
 gl.useProgram(program);
 gl.uniform1f(u.uAngle,angle);gl.uniform1f(u.uLight,35);gl.uniform1f(u.uStrength,strength);gl.uniform1f(u.uCornerStrength,cornerStrength);
 gl.uniform1f(u.uArt,artwork?1:0);gl.uniform1f(u.uPalette,palette);
 gl.uniform1f(u.uSide,side);gl.uniform2f(u.uSize,w,h);gl.uniform1f(u.uPixelRatio,pixelRatio);gl.uniform2f(u.uRadii,outerRadius,innerRadius);gl.drawArrays(gl.TRIANGLES,0,6);
 return true;
}

export function disposeGlassMaterial(material){
 if(!material)return;
 material.gl.deleteBuffer(material.buffer);material.gl.deleteProgram(material.program);
 material.gl.getExtension('WEBGL_lose_context')?.loseContext();
}
