import { themes } from "./themes";

export function buildThemeScript(): string {
  const themesJson = JSON.stringify(themes.map((t) => ({ colors: t.colors })));

  return `(function(){
  var THEMES=${themesJson};
  var KEY="portfolio-theme-state";

  var total=THEMES.length;
  var current=0;
  try{
    var stored=JSON.parse(localStorage.getItem(KEY)||"null");
    if(stored!==null&&typeof stored.index==="number") current=(stored.index+1)%total;
  }catch(e){}

  try{localStorage.setItem(KEY,JSON.stringify({index:current}));}catch(e){}

  var theme=THEMES[current];
  if(!theme) return;

  var root=document.documentElement;
  var names=["--theme-bg","--theme-card","--theme-text"];
  names.forEach(function(name,i){ root.style.setProperty(name,theme.colors[i]); });
  root.setAttribute("data-theme-index",String(current));
})();`;
}
