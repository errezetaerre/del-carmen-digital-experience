import { ARTWORK_EXPERIENCE_KEY } from "@/shared/ui/artwork/artworkExperiencePreference";

// Before hydration, cover Standard only when the established preference chooses
// Glass. No writes, requests or new preference; without JavaScript Standard works.
export const HOME_BOOK_BOOTSTRAP = `(function(s){try{var p=localStorage.getItem(${JSON.stringify(ARTWORK_EXPERIENCE_KEY)});if(p!=="glass"&&p!=="standard"){var q=new URL(location.href).searchParams;p=q.get("experience")||q.get("view")}if(p==="glass"&&s)s.parentElement.setAttribute("data-home-glass-pending","")}catch(e){}})(document.currentScript);`;
