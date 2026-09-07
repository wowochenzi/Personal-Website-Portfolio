const routes=new Set(['cover','choose','about','archive','other']);
let projectJourney=false;
export function browseProjects(){projectJourney=true;navigate('choose');}
export function takeProjectJourney(){const pending=projectJourney;projectJourney=false;return pending;}
export function readRoute(){const parts=location.hash.replace(/^#\/?/,'').split('/');if(parts[0]==='project'&&['pawtern','woodlab','nuofield','beeflow'].includes(parts[1]))return{scene:'project',id:parts[1]};return{scene:routes.has(parts[0])?parts[0]:'cover'};}
export function navigate(route){location.hash=`#/${route}`;}
export function installRouter(render){window.addEventListener('hashchange',render);window.addEventListener('keydown',e=>{if(e.key==='Escape'){const{scene}=readRoute();navigate(scene==='project'||scene==='other'?'archive':scene==='cover'?'cover':'choose');}});if(!location.hash)history.replaceState(null,'','#/cover');render();}
