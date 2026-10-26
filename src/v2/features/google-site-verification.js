const META_NAME = "google-site-verification";
const VERIFICATION_TOKEN = "fiujJPBUim9VxPM1vTiUF3AKYv0jng7fKCoMS0oULME";

export function initGoogleSiteVerification({ document }) {
  if (document.querySelector(`meta[name="${META_NAME}"]`)) return;
  const meta = document.createElement("meta");
  meta.name = META_NAME;
  meta.content = VERIFICATION_TOKEN;
  (document.head || document.documentElement).appendChild(meta);
  return () => meta.remove();
}
