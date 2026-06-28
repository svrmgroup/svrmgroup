import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { protectContactNodes } from "@/lib/protectContacts";
import { getSavedLanguage, translatePage } from "@/lib/siteTranslator";

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Shield email + phone numbers from Google Translate on every route.
    // Run after the new page paints, then once more after translation re-applies.
    requestAnimationFrame(() => protectContactNodes());
    const t = setTimeout(() => protectContactNodes(), 600);
    const lang = getSavedLanguage();
    const translateTimer = lang === "en" ? 0 : window.setTimeout(() => translatePage(lang), 80);


    if (hash) {
      // Defer to allow target route to render before scrolling.
      const id = decodeURIComponent(hash.replace("#", ""));
      const tryScroll = (attempt = 0) => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        } else if (attempt < 10) {
          setTimeout(() => tryScroll(attempt + 1), 80);
        }
      };
      tryScroll();
      return () => {
        clearTimeout(t);
        clearTimeout(translateTimer);
      };
    }
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    return () => {
      clearTimeout(t);
      clearTimeout(translateTimer);
    };
  }, [pathname, hash]);

  return null;
};


export default ScrollToTop;
