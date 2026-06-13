import { PREVIEW_COOKIE, PREVIEW_STORAGE_KEY, PREVIEW_COOKIE_MAX_AGE } from "@/lib/preview";

const ComingSoonLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <script
      dangerouslySetInnerHTML={{
        __html: `(function(){try{if(localStorage.getItem('${PREVIEW_STORAGE_KEY}')==='true'){document.cookie='${PREVIEW_COOKIE}=true;path=/;max-age=${PREVIEW_COOKIE_MAX_AGE};SameSite=Lax';window.location.replace(location.pathname);}}catch(e){}})();`,
      }}
    />
    {children}
  </>
);

export default ComingSoonLayout;
