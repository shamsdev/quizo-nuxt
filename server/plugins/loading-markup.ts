export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:html', (html) => {
    const loader =
      '<div id="nuxt-loading" style="position:fixed;inset:0;background:#0c1222;display:flex;align-items:center;justify-content:center;z-index:99999">' +
      '<div style="width:48px;height:48px;border:4px solid #334155;border-top-color:#0ea5e9;border-radius:50%;animation:nuxt-load-spin .8s linear infinite"></div>' +
      '</div><style>@keyframes nuxt-load-spin{to{transform:rotate(360deg)}}</style>';
    html.bodyPrepend.push(loader);
  });
});
