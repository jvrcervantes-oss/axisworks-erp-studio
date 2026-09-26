/* GENERADO por AxisWorks/comercial/demo-erp/build.py --instancia axisworks-demo — no editar. */
window.AXW_NUCLEO_OPERACION = true;
/* Módulos apagados en esta instancia del ERP — F4, 25-sep-2026 (encargos/20260924_estudio_erp_modular.md).
   build.py --instancia lo antepone a /contracts/assets/guard.js con el mapa rellenado desde erp/modulos.json y
   erp/instancias.json. Una instancia sin modulos_activos no lo lleva: allí todo está activo.

   NO ES EL CANDADO. El candado está en la base (políticas restrictivas y permisos por módulo): quien llame a la API
   a mano se encuentra la puerta cerrada igual. Esto es solo para que las pantallas activas no pidan lo que la base
   ya no les da y no enseñen errores: una tabla de un módulo apagado responde vacía, una función responde null, un
   bucket responde «no activo», sin salir a la red. Y oculta del menú los enlaces a pantallas apagadas. */
(function () {
  var A = {"b": {}, "f": {"bot_pendientes": "asistente", "bot_temas_resumen": "asistente", "contrato_identificadores": "leads", "crm_agenda": "leads", "crm_automatismos": "leads", "crm_campanas": "leads", "crm_campanas_conjuntos": "leads", "crm_estado_borrar": "leads", "crm_estado_crear": "leads", "crm_estado_editar": "leads", "crm_lead_accion_completar": "leads", "crm_lead_accion_poner": "leads", "crm_lead_asignar": "leads", "crm_lead_contacto": "leads", "crm_lead_fathom": "leads", "crm_lead_ficha_crear": "leads", "crm_lead_hilo": "leads", "crm_lead_mover": "leads", "crm_lead_nota": "leads", "crm_lead_para_contrato": "leads", "crm_leads": "leads", "crm_leads_resumen": "leads", "crm_mi_alcance": "leads", "crm_ranking_closers": "leads", "crm_reparto_closer_set": "leads", "crm_reparto_config": "leads", "crm_reparto_origen_set": "leads", "crm_serie_semanal": "leads", "crm_usuario_activo": "leads", "cron_trazabilidad_secret": "leads", "lead_a_mi_alcance": "leads", "traza_coincidencias_listar": "leads", "traza_cuenta_alta": "leads", "traza_cuenta_borrar": "leads", "traza_cuenta_estado": "leads", "traza_cuenta_token_cambiar": "leads", "traza_cuentas_listar": "leads", "traza_cuentas_para_sync": "leads", "traza_guardar": "leads", "traza_managers": "leads"}, "p": ["/intranet/leads/", "/intranet/v4/asistente-correos/", "/intranet/v4/asistente/"], "t": {"bot_bloqueos": "asistente", "bot_consultas": "asistente", "bot_faq": "asistente", "bot_fuentes": "asistente", "bot_respuestas_copiadas": "asistente", "bot_temas": "asistente", "fathom_call_insights": "leads", "lead_acceso_log": "leads", "lead_accion": "leads", "lead_closer": "leads", "lead_contrato": "leads", "lead_dueno_log": "leads", "lead_estado": "leads", "lead_estado_log": "leads", "lead_estados": "leads", "lead_notas": "leads", "lead_sugerencia": "leads", "lead_tablero": "leads", "leads": "leads", "meta_campanas": "leads", "meta_campanas_conjuntos": "leads", "meta_exclusiones_segmento": "leads", "meta_insights_dia": "leads", "meta_targeting_historial": "leads", "meta_vigilancia": "leads", "meta_vigilancia_acciones": "leads", "reparto_closer": "leads", "reparto_log": "leads", "reparto_origen": "leads", "traza_coincidencias": "leads", "traza_cuentas": "leads"}};
  window.AXW_APAGADOS = A;
  var NO_ACTIVO = { message: 'Módulo no activo en esta instancia' };
  // Rastro en consola, una vez por objeto (revisión previa #98, Seguridad): si un módulo ACTIVO estuviera mal
  // clasificado, este vacío escondería un fallo real de permisos. Así se ve qué se interceptó.
  var vistos = {};
  function rastro(tipo, n) { if (!vistos[tipo + n]) { vistos[tipo + n] = 1; try { console.info('[axw] módulo apagado: ' + tipo + ' ' + n + ' (' + (A.t[n] || A.f[n] || A.b[n]) + ')'); } catch (e) {} } }

  // Respuesta vacía encadenable: cualquier método (.select/.eq/.in/.order/.range…) devuelve la misma respuesta;
  // .single()/.maybeSingle() devuelven data null. Se resuelve al momento.
  function vacia(dato) {
    var res = { data: dato, error: null, count: 0, status: 200, statusText: 'OK' };
    var p = Promise.resolve(res);
    var prox = new Proxy(function () {}, {
      get: function (_o, k) {
        if (k === 'then') return p.then.bind(p);
        if (k === 'catch') return p.catch.bind(p);
        if (k === 'finally') return p.finally.bind(p);
        if (k === 'single' || k === 'maybeSingle') return function () { return vacia(null); };
        return function () { return prox; };
      },
      apply: function () { return prox; }
    });
    return prox;
  }
  function bucketApagado() {
    var r = Promise.resolve({ data: null, error: NO_ACTIVO });
    return new Proxy({}, { get: function () { return function () { return r; }; } });
  }

  function envuelve(c) {
    if (!c || c.__axwApagados) return c;
    c.__axwApagados = true;
    var from = c.from.bind(c), rpc = c.rpc.bind(c);
    c.from = function (n) { if (A.t[n]) { rastro('tabla', n); return vacia([]); } return from.apply(null, arguments); };
    c.rpc = function (n) { if (A.f[n]) { rastro('función', n); return vacia(null); } return rpc.apply(null, arguments); };
    // `storage` es un getter que crea un cliente nuevo en cada acceso: se envuelve el getter, no el objeto.
    var d = null, o = c;
    while (o && !(d = Object.getOwnPropertyDescriptor(o, 'storage'))) o = Object.getPrototypeOf(o);
    if (d) {
      var leer = d.get ? function () { return d.get.call(c); } : function () { return d.value; };
      Object.defineProperty(c, 'storage', {
        configurable: true,
        get: function () {
          var s = leer(), sf = s.from.bind(s);
          s.from = function (b) { if (A.b[b]) { rastro('bucket', b); return bucketApagado(); } return sf.apply(null, arguments); };
          return s;
        }
      });
    }
    return c;
  }

  function engancha() {
    var S = window.supabase;
    if (!S || !S.createClient || S.__axwApagados) return !!(S && S.__axwApagados);
    var orig = S.createClient;
    S.createClient = function () { return envuelve(orig.apply(this, arguments)); };
    S.__axwApagados = true;
    if (window.LW_SB) envuelve(window.LW_SB);
    return true;
  }
  engancha();

  // Menú: fuera los enlaces a pantallas de módulos apagados (el menú se pinta en varios tiempos).
  function apagada(href) {
    var ruta;
    try { ruta = new URL(href, location.href).pathname; } catch (e) { return false; }
    for (var i = 0; i < A.p.length; i++) if (ruta.indexOf(A.p[i]) === 0) return true;
    return false;
  }
  function filtra() {
    var as = document.querySelectorAll('a[href]');
    for (var i = 0; i < as.length; i++) if (apagada(as[i].getAttribute('href')) && as[i].style.display !== 'none') as[i].style.display = 'none';
  }
  function arranca() {
    engancha();
    filtra();
    var pend = null;
    new MutationObserver(function () {
      if (pend) return;
      pend = setTimeout(function () { pend = null; filtra(); }, 60);
    }).observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arranca); else arranca();
})();

(function(){var FICHA=window.LW_INSTANCIA;if(!FICHA||!/^https:\/\/[a-z0-9]+\.supabase\.co$/.test(FICHA.sb_url||"")){throw new Error("[guard] falta /contracts/assets/instancia.js antes de guard.js")}var URL_SB=FICHA.sb_url;var KEY_SB=FICHA.sb_key;function fija(k,v){try{Object.defineProperty(window,k,{value:v,writable:false,configurable:false,enumerable:true})}catch(e){}}fija("LW_SB_URL",URL_SB);fija("LW_SB_KEY",KEY_SB);fija("lwEdge",(function(nombre){if(!/^[a-z0-9-]+$/.test(String(nombre)))throw new Error("lwEdge: nombre de edge no válido");return URL_SB+"/functions/v1/"+nombre}));try{if(location.hostname==="localhost"&&new URLSearchParams(location.search).get("qa")==="1"){document.write('<script src="/_qa_double_guard.js"><\/script>');return}}catch(e){}var LOGIN="/intranet/";var HUB="/intranet/";var propia=document.currentScript;var HERRAMIENTA=propia&&propia.getAttribute("data-herramienta");var HERRAMIENTAS_REQ=HERRAMIENTA?HERRAMIENTA.split(","):null;var ROL_REQ=propia&&propia.getAttribute("data-rol");var ROLES_REQ=(ROL_REQ||"").split(/\s+/).filter((function(x){return x}));function rolBasta(ficha){if(!ROL_REQ)return true;if(!ficha)return false;if(ficha.rol==="super_admin")return true;if(ROLES_REQ.length===1&&ROLES_REQ[0]==="super_admin")return false;var otros=ROLES_REQ.filter((function(x){return x!=="admin"&&x!=="super_admin"}));if(ficha.rol==="admin")return ROLES_REQ.indexOf("admin")!==-1||!otros.length;return otros.indexOf(ficha.rol)!==-1}var raiz=document.documentElement;raiz.style.visibility="hidden";var carga=document.createElement("div");carga.id="lw-gate-carga";carga.style.cssText="visibility:visible;position:fixed;inset:0;display:flex;"+"align-items:center;justify-content:center;background:var(--rl,#F5F0E6);z-index:2147483647";carga.innerHTML='<div style="width:32px;height:32px;border:2.5px solid rgba(16,76,79,.16);'+'border-top-color:var(--dl,#104C4F);border-radius:50%;animation:lw-gate-girar .75s linear infinite">'+"</div><style>@keyframes lw-gate-girar{to{transform:rotate(360deg)}}</style>";raiz.appendChild(carga);function quitarCarga(){if(carga.parentNode)carga.parentNode.removeChild(carga)}function alLogin(){location.replace(LOGIN+"?next="+encodeURIComponent(location.pathname+location.search))}window.LW_AUTH=new Promise((function(resolve){function comprobar(){if(!window.supabase||!window.supabase.createClient){alLogin();return}var sb=window.LW_SB||window.supabase.createClient(URL_SB,KEY_SB);window.LW_SB=sb;sb.auth.getSession().then((function(r){var sesion=r&&r.data&&r.data.session;if(!sesion){alLogin();return}var cierre=window.lwCierre;if(!cierre)console.error("[guard] falta /contracts/assets/cierre.js antes de guard.js: el modo mantenimiento no se aplica en esta página");var pEstado=cierre?cierre.leer(sb):Promise.resolve(null);function entrar(ficha){var sigue=cierre?cierre.puerta(sb,ficha,pEstado).catch((function(){return true})):Promise.resolve(true);sigue.then((function(ok){quitarCarga();if(!ok)return;raiz.style.visibility="";resolve({sb:sb,session:sesion,ficha:ficha})}))}sb.from("usuarios").select("rol, herramientas, activo, nombre, notif_visto_hasta").eq("user_id",sesion.user.id).maybeSingle().then((function(f){var ficha=f&&f.data||null;if(ficha&&!ficha.activo){alLogin();return}if(!ficha){if((sesion.user.app_metadata||{}).portal){location.replace("/portal/");return}sb.auth.signOut().then(alLogin,alLogin);return}var sinLimite=ficha&&ficha.rol==="super_admin";if(HERRAMIENTAS_REQ&&ficha&&!sinLimite&&!HERRAMIENTAS_REQ.some((function(h){return(ficha.herramientas||[]).indexOf(h)!==-1}))){location.replace(HUB+"?sin_permiso="+encodeURIComponent(HERRAMIENTA));return}if(!rolBasta(ficha)){location.replace(HUB+"?sin_permiso="+encodeURIComponent("Panel de control"));return}entrar(ficha)})).catch((function(){if(!rolBasta(null)){location.replace(HUB+"?sin_permiso="+encodeURIComponent("Panel de control"));return}entrar(null)}))})).catch(alLogin)}if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",comprobar);else comprobar()}))})();