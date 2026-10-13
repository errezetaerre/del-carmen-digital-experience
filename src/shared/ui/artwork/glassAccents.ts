const glassProfile={outerRadius:14};
const accentPalette=Object.freeze({
 shadow:'#6F4B2D',bronze:'#A77943',gold:'#C99A5B',shoulder:'#E1BB80',soft:'#E8C48B',light:'#F7DBA9'
});
const linePalette=Object.freeze({...accentPalette,soft:'#DDB783',light:'#EBC994'});
export function glassSeparatorMarkup(id: string){
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -32 320 64" preserveAspectRatio="none" focusable="false">
 <defs>
  <linearGradient id="${id}-color" x1="0" y1="0" x2="320" y2="0" gradientUnits="userSpaceOnUse">
   <stop offset="0" stop-color="${linePalette.bronze}" stop-opacity=".08"/><stop offset=".14" stop-color="${linePalette.bronze}" stop-opacity=".28"/>
   <stop offset=".32" stop-color="${linePalette.gold}" stop-opacity=".68"/><stop offset=".45" stop-color="${linePalette.soft}" stop-opacity=".94"/>
   <stop offset=".50" stop-color="${linePalette.light}"/><stop offset=".55" stop-color="${linePalette.soft}" stop-opacity=".94"/>
   <stop offset=".68" stop-color="${linePalette.gold}" stop-opacity=".68"/><stop offset=".86" stop-color="${linePalette.bronze}" stop-opacity=".28"/>
   <stop offset="1" stop-color="${linePalette.bronze}" stop-opacity=".08"/>
  </linearGradient>
  <linearGradient id="${id}-field" x1="0" y1="0" x2="320" y2="0" gradientUnits="userSpaceOnUse">
   <stop offset="0" stop-color="${linePalette.bronze}" stop-opacity="0"/><stop offset=".16" stop-color="${linePalette.gold}" stop-opacity=".06"/>
   <stop offset=".32" stop-color="${linePalette.shoulder}" stop-opacity=".42"/><stop offset=".44" stop-color="${linePalette.soft}" stop-opacity=".79"/>
   <stop offset=".50" stop-color="${linePalette.light}"/><stop offset=".56" stop-color="${linePalette.soft}" stop-opacity=".79"/>
   <stop offset=".68" stop-color="${linePalette.shoulder}" stop-opacity=".42"/><stop offset=".84" stop-color="${linePalette.gold}" stop-opacity=".06"/>
   <stop offset="1" stop-color="${linePalette.bronze}" stop-opacity="0"/>
  </linearGradient>
  <filter id="${id}-air" filterUnits="userSpaceOnUse" x="-40" y="-40" width="400" height="80" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="24 6"/></filter>
  <filter id="${id}-shoulder" filterUnits="userSpaceOnUse" x="-40" y="-40" width="400" height="80" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="12 1.7"/></filter>
  <filter id="${id}-near" filterUnits="userSpaceOnUse" x="-40" y="-40" width="400" height="80" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="7 .45"/></filter>
 </defs>
 <path d="M 0 -4 H 320" fill="none" stroke="url(#${id}-field)" stroke-width="9" opacity=".60" filter="url(#${id}-air)"/>
 <path d="M 0 -.8 H 320" fill="none" stroke="url(#${id}-field)" stroke-width="3.4" opacity=".68" filter="url(#${id}-shoulder)"/>
 <path d="M 0 .5 H 320" fill="none" stroke="url(#${id}-color)" stroke-width="1.2" opacity=".65" filter="url(#${id}-near)"/>
 <path d="M 0 .5 H 320" fill="none" stroke="url(#${id}-color)" stroke-width=".45"/>
 </svg>`;
}
export function glassRimMarkup(id: string,width: number,height: number,side: -1 | 1){
 const r=glassProfile.outerRadius-1,e=1.30,arcR=r-e;
 const vertical=Math.min(32,height*.15),horizontal=Math.min(40,width*.21);
 const cy=height-r,fx=r-arcR/Math.sqrt(2),fy=cy+arcR/Math.sqrt(2);
 const contour=`M ${e} ${cy-vertical} V ${cy} A ${arcR} ${arcR} 0 0 0 ${r} ${height-e} H ${r+horizontal}`;
 const mirror=side>0?`translate(${width} 0) scale(-1 1)`:'';
 const reflection=`<g data-reflection="corner">
  <g data-soft-glow="corner" opacity=".18">
   <circle cx="${fx+.75}" cy="${fy-.75}" r="12.8" fill="url(#${id}-blend-air)" filter="url(#${id}-blend-air-soft)"/>
  </g>
  <circle data-halo="corner" cx="${fx+1.5}" cy="${fy-1.5}" r="14" fill="url(#${id}-sphere)" opacity=".80" filter="url(#${id}-sphere-soft)"/>
  <g clip-path="url(#${id}-inside)">
   <path d="${contour}" transform="translate(3 -3)" fill="none" stroke="url(#${id}-atmosphere)" stroke-width="16" opacity=".50" filter="url(#${id}-air)"/>
  </g>
  <path d="${contour}" fill="none" stroke="url(#${id}-atmosphere)" stroke-width="4.8" opacity=".56" filter="url(#${id}-outside)"/>
  <path d="${contour}" fill="none" stroke="url(#${id}-light)" stroke-width="2.0" opacity=".50" filter="url(#${id}-near)"/>
  <path d="${contour}" fill="none" stroke="url(#${id}-light)" stroke-width=".72" opacity=".82"/>

 </g>`;
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" focusable="false">
 <defs>
  <clipPath id="${id}-inside" clipPathUnits="userSpaceOnUse"><rect width="${width}" height="${height}" rx="${r}"/></clipPath>
  <radialGradient id="${id}-light" gradientUnits="userSpaceOnUse" cx="${fx}" cy="${fy}" r="54">
   <stop offset="0" stop-color="${accentPalette.light}"/><stop offset=".13" stop-color="${accentPalette.soft}"/>
   <stop offset=".28" stop-color="${accentPalette.gold}" stop-opacity=".70"/><stop offset=".50" stop-color="${accentPalette.bronze}" stop-opacity=".26"/>
   <stop offset=".76" stop-color="${accentPalette.bronze}" stop-opacity=".035"/><stop offset="1" stop-color="${accentPalette.bronze}" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="${id}-atmosphere" gradientUnits="userSpaceOnUse" cx="${fx}" cy="${fy}" r="56">
   <stop offset="0" stop-color="${accentPalette.shoulder}" stop-opacity=".88"/><stop offset=".20" stop-color="${accentPalette.gold}" stop-opacity=".66"/>
   <stop offset=".45" stop-color="${accentPalette.bronze}" stop-opacity=".26"/><stop offset=".72" stop-color="${accentPalette.bronze}" stop-opacity=".035"/>
   <stop offset="1" stop-color="${accentPalette.bronze}" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="${id}-sphere">
   <stop offset="0" stop-color="#F0D5A3" stop-opacity=".65"/>
   <stop offset=".18" stop-color="${accentPalette.shoulder}" stop-opacity=".48"/>
   <stop offset=".42" stop-color="${accentPalette.gold}" stop-opacity=".23"/>
   <stop offset=".70" stop-color="${accentPalette.bronze}" stop-opacity=".065"/>
   <stop offset="1" stop-color="${accentPalette.bronze}" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="${id}-blend-air">
   <stop offset="0" stop-color="${accentPalette.light}" stop-opacity=".75"/><stop offset=".20" stop-color="${accentPalette.shoulder}" stop-opacity=".65"/>
   <stop offset=".45" stop-color="${accentPalette.gold}" stop-opacity=".36"/><stop offset=".72" stop-color="${accentPalette.bronze}" stop-opacity=".10"/>
   <stop offset="1" stop-color="${accentPalette.bronze}" stop-opacity="0"/>
  </radialGradient>
  <filter id="${id}-blend-air-soft" filterUnits="userSpaceOnUse" x="-30" y="-30" width="${width+60}" height="${height+60}" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="3"/></filter>
  <filter id="${id}-sphere-soft" filterUnits="userSpaceOnUse" x="-30" y="-30" width="${width+60}" height="${height+60}" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="2.4"/></filter>
  <filter id="${id}-air" filterUnits="userSpaceOnUse" x="-30" y="-30" width="${width+60}" height="${height+60}" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="5"/></filter>
  <filter id="${id}-outside" filterUnits="userSpaceOnUse" x="-30" y="-30" width="${width+60}" height="${height+60}" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="2.2"/></filter>
  <filter id="${id}-near" filterUnits="userSpaceOnUse" x="-30" y="-30" width="${width+60}" height="${height+60}" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation=".52"/></filter>
 </defs>
 <g transform="${mirror}">${reflection}<g transform="translate(0 ${height}) scale(1 -1)">${reflection}</g></g></svg>`;
}
