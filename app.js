(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const store = { get(k){ try{ return localStorage.getItem(k) }catch{ return null } }, set(k,v){ try{ localStorage.setItem(k,v) }catch{} } };
const clamp = (v,a,b) => Math.min(b, Math.max(a, v));

/* ---------- i18n ---------- */
const L = {
en:{
 tagline:'Clean streets, together', r_citizen:'Citizen', r_worker:'Worker', r_admin:'Admin',
 tab_map:'Map', tab_mine:'My reports', tab_wallet:'Wallet', tab_tasks:'Tasks', tab_done:'Done', tab_over:'Overview', tab_review:'Review', tab_rewards:'Rewards', tab_people:'People',
 f_all:'All', f_full:'Full clean', f_bag:'Bag pickup', f_done:'Resolved',
 st_pending:'Pending', st_in_progress:'In progress', st_completed:'Completed', st_rejected:'Rejected', st_flagged:'Needs review', st_await:'Awaiting verification',
 lbl_full:'Full clean needed', lbl_bag:'Bags ready for pickup',
 report:'Report', new_report:'New report', q_what:'What is happening?',
 o_hot:'Needs a worker clean-up', o_hot_s:'Photograph the waste and pin it on the map.',
 o_clean:'I cleaned it myself', o_clean_s:'Bagged and ready for pickup. You earn points once a worker verifies.',
 p_before:'Before photo', p_after:'After photo', p_waste:'Photo of the waste', p_tap:'Take photo', q_photos:'Photos',
 q_where:'Where is it?', tap_map:'Tap the map to drop the pin.', use_loc:'Use my location', pin_set:'Pin placed', locating:'Finding your location…',
 out_area:'Your location is outside the demo map. Tap the map to place the pin.', loc_denied:'Location is blocked. Tap the map to place the pin.',
 q_size:'Amount of waste', S:'Small', M:'Medium', L:'Large', q_note:'Note (optional)', note_ph:'Bags by the wall, near the bakery…',
 send:'Send report', cancel:'Cancel', back:'Back',
 err_photos:'Add all required photos first.', err_pin:'Tap the map to place the pin first.', err_cap:'Daily limit reached: 5 reports per day.', err_susp:'Your account is suspended. Contact an admin.',
 err_write:'Could not save. Ask the owner to give you Contributor access.',
 dup_title:'Already reported nearby', dup_body:'Another open report is within about {m} m. Open it instead of adding a duplicate?', dup_open:'Open it', dup_any:'Report anyway',
 sent_hot:'Report sent. You earn points once a worker confirms it.', sent_clean:'Cleanup sent. {n} points advanced, the rest after verification.', sent_flag:'Sent for admin review: some checks need a second look.',
 nearby:'Open near you', no_open:'Nothing open right now. Spot waste? Tap Report.', open_now:'Open', cleaned:'Resolved', my_pts:'Your points',
 mine_empty:'You have not sent a report yet. Tap Report to start.',
 detail:'Report', reporter:'Reported by', when:'When', zone:'District', amount:'Amount', worker:'Worker', priority:'Priority',
 timeline:'History', signals:'Check signals', sig_same_photo:'Before and after photos look identical', sig_reused_photo:'A photo matches another report', sig_stale_photo:'Photo was not taken just now', sig_weak_gps:'Weak GPS accuracy', sig_low_trust:'Low trust score',
 a_start:'Start task', a_complete:'Mark completed', a_pickup:'Mark picked up', a_verify:'Verify cleanup', a_reject:'Reject', a_invalid:'Mark invalid', a_approve:'Approve', a_delete:'Delete report', a_nav:'Open in maps',
 need_verify:'Verify the citizen cleanup before closing this task.', own_hint:'You cannot verify your own report.',
 reject_title:'Reject this report', reject_ph:'Reason (for the history)', ok:'Confirm',
 ev_submitted:'Submitted', ev_in_progress:'Started by worker', ev_completed:'Completed', ev_rejected:'Rejected', ev_verified:'Cleanup verified, points released', ev_approved:'Approved by admin', ev_flagged:'Sent to review',
 tasks_h:'Task queue', tasks_sub:'Sorted by priority: severity, size, age and distance from the depot.', tasks_empty:'No open tasks. Great work.', done_empty:'Nothing completed yet.',
 queue_open:'open tasks', queue_done:'done',
 wallet:'Wallet', pts:'points', lvl_to:'{n} points to {l}', lvl_max:'Top level reached',
 w_rewards:'Rewards', w_history:'History', w_board:'Leaderboard', w_coupons:'Your coupons',
 redeem:'Redeem', need_more:'Need {n} more', stock_left:'{n} left', redeemed:'Redeemed. Show the code at the partner shop.', hist_empty:'No points yet.',
 rs_advance:'Advance for cleanup', rs_verified:'Cleanup verified', rs_report_confirmed:'Report confirmed', rs_penalty:'Cleanup rejected', rs_redeem:'Redeemed reward',
 you:'you', lv_0:'Newcomer', lv_1:'Neighbor', lv_2:'Street Hero', lv_3:'Community Champion',
 ov_title:'Overview', ov_open:'Open', ov_res:'Resolved', ov_flag:'In review', ov_pts:'Points issued', by_status:'By status', by_zone:'By district',
 invite_h:'Let people try it', invite_b:'Use the Share menu at the top of this page and give citizens and workers Contributor access. They can then report, verify and redeem with their own accounts.',
 rev_empty:'Nothing waiting for review.', rev_h:'Flagged by checks',
 rw_h:'Manage rewards', rw_add:'Add reward', rw_title:'Title', rw_partner:'Partner', rw_cost:'Cost', rw_stock:'Stock', rw_on:'Active', rw_off:'Hidden', rw_del:'Delete', rw_added:'Reward added.',
 pp_h:'People', pp_trust:'Trust', pp_susp:'Suspend', pp_unsusp:'Restore', pp_rep:'reports',
 name_title:'Welcome to Hayy', name_body:'Pick a display name for the leaderboard.', name_ph:'Your name', name_ok:'Start',
 demo_tag:'Demo map (schematic), real tiles in production', copied:'Done.',
 my_loc:'Showing your location', loc_far:'Your location is outside the demo map.', rep_export:'Export reports (CSV)', ppl_export:'Export people (CSV)', reg_title:'Create your account', reg_sub:'Tell us who you are so workers and neighbors can trust reports. Your contact details are only shown to admins.', f_name:'Full name', f_email:'Email', f_phone:'Phone (0555123456)', f_zone:'Your district', f_terms:'I agree to share my contact details with the Hayy team and follow the community rules.', reg_btn:'Create account', e_name:'Enter your full name.', e_email:'Enter a valid email.', e_phone:'Enter a valid Algerian mobile number (05, 06 or 07).', e_terms:'Please accept the terms to continue.', pw_note:'No password needed: your Claude sign-in protects this account.', ct_export:'Export contacts (CSV)', tm_ago:'ago'
},
ar:{
 tagline:'شوارع نظيفة، معاً', r_citizen:'مواطن', r_worker:'عامل', r_admin:'مدير',
 tab_map:'الخريطة', tab_mine:'بلاغاتي', tab_wallet:'المحفظة', tab_tasks:'المهام', tab_done:'المنجزة', tab_over:'نظرة عامة', tab_review:'مراجعة', tab_rewards:'المكافآت', tab_people:'الأعضاء',
 f_all:'الكل', f_full:'تنظيف كامل', f_bag:'جمع الأكياس', f_done:'تم الحل',
 st_pending:'قيد الانتظار', st_in_progress:'جارٍ', st_completed:'مكتمل', st_rejected:'مرفوض', st_flagged:'بحاجة لمراجعة', st_await:'بانتظار التحقق',
 lbl_full:'تحتاج تنظيفاً كاملاً', lbl_bag:'أكياس جاهزة للجمع',
 report:'بلّغ', new_report:'بلاغ جديد', q_what:'ما الذي يحدث؟',
 o_hot:'تحتاج تنظيفاً من العمال', o_hot_s:'صوّر النفايات وحدد موقعها على الخريطة.',
 o_clean:'نظّفتها بنفسي', o_clean_s:'جمعتها في أكياس وهي جاهزة للأخذ. تحصل على النقاط بعد تحقق العامل.',
 p_before:'صورة قبل', p_after:'صورة بعد', p_waste:'صورة النفايات', p_tap:'التقط صورة', q_photos:'الصور',
 q_where:'أين الموقع؟', tap_map:'اضغط على الخريطة لتحديد الموقع.', use_loc:'استخدم موقعي', pin_set:'تم تحديد الموقع', locating:'جارٍ تحديد موقعك…',
 out_area:'موقعك خارج خريطة العرض. اضغط على الخريطة لتحديد الموقع.', loc_denied:'تم حظر الموقع. اضغط على الخريطة لتحديد الموقع.',
 q_size:'كمية النفايات', S:'قليلة', M:'متوسطة', L:'كبيرة', q_note:'ملاحظة (اختياري)', note_ph:'أكياس بجانب الجدار قرب المخبزة…',
 send:'أرسل البلاغ', cancel:'إلغاء', back:'رجوع',
 err_photos:'أضف كل الصور المطلوبة أولاً.', err_pin:'اضغط على الخريطة لتحديد الموقع أولاً.', err_cap:'بلغت الحد اليومي: 5 بلاغات.', err_susp:'حسابك موقوف. تواصل مع المدير.',
 err_write:'تعذر الحفظ. اطلب من المالك منحك صلاحية مساهم.',
 dup_title:'تم الإبلاغ عنها قريباً', dup_body:'يوجد بلاغ مفتوح على بعد حوالي {m} م. هل تفتحه بدل تكرار البلاغ؟', dup_open:'افتحه', dup_any:'بلّغ على أي حال',
 sent_hot:'تم إرسال البلاغ. تحصل على النقاط بعد تأكيد العامل.', sent_clean:'تم إرسال التنظيف. تم صرف {n} نقطة مقدماً والباقي بعد التحقق.', sent_flag:'أُرسل لمراجعة المدير: بعض الفحوصات تحتاج نظرة ثانية.',
 nearby:'مفتوح بالقرب منك', no_open:'لا شيء مفتوح الآن. رأيت نفايات؟ اضغط بلّغ.', open_now:'مفتوح', cleaned:'تم الحل', my_pts:'نقاطك',
 mine_empty:'لم ترسل أي بلاغ بعد. اضغط بلّغ للبدء.',
 detail:'البلاغ', reporter:'المُبلِّغ', when:'الوقت', zone:'الحي', amount:'الكمية', worker:'العامل', priority:'الأولوية',
 timeline:'السجل', signals:'إشارات الفحص', sig_same_photo:'صورتا قبل وبعد متطابقتان', sig_reused_photo:'صورة تطابق بلاغاً آخر', sig_stale_photo:'الصورة لم تلتقط الآن', sig_weak_gps:'دقة GPS ضعيفة', sig_low_trust:'درجة ثقة منخفضة',
 a_start:'ابدأ المهمة', a_complete:'تحديد كمكتمل', a_pickup:'تم الجمع', a_verify:'تحقق من التنظيف', a_reject:'ارفض', a_invalid:'بلاغ غير صالح', a_approve:'وافق', a_delete:'احذف البلاغ', a_nav:'افتح في الخرائط',
 need_verify:'تحقق من تنظيف المواطن قبل إغلاق المهمة.', own_hint:'لا يمكنك التحقق من بلاغك.',
 reject_title:'رفض هذا البلاغ', reject_ph:'السبب (للسجل)', ok:'تأكيد',
 ev_submitted:'تم الإرسال', ev_in_progress:'بدأ العامل', ev_completed:'اكتمل', ev_rejected:'مرفوض', ev_verified:'تم التحقق وصرف النقاط', ev_approved:'وافق المدير', ev_flagged:'أُرسل للمراجعة',
 tasks_h:'قائمة المهام', tasks_sub:'مرتبة حسب الأولوية: الخطورة والحجم والمدة والمسافة من المستودع.', tasks_empty:'لا مهام مفتوحة. عمل رائع.', done_empty:'لا شيء مكتمل بعد.',
 queue_open:'مهام مفتوحة', queue_done:'منجزة',
 wallet:'المحفظة', pts:'نقطة', lvl_to:'{n} نقطة للوصول إلى {l}', lvl_max:'وصلت إلى أعلى مستوى',
 w_rewards:'المكافآت', w_history:'السجل', w_board:'المتصدرون', w_coupons:'قسائمك',
 redeem:'استبدل', need_more:'تحتاج {n} أخرى', stock_left:'متبقي {n}', redeemed:'تم الاستبدال. اعرض الرمز في المتجر الشريك.', hist_empty:'لا نقاط بعد.',
 rs_advance:'دفعة مقدمة للتنظيف', rs_verified:'تم التحقق من التنظيف', rs_report_confirmed:'تم تأكيد البلاغ', rs_penalty:'رُفض التنظيف', rs_redeem:'استبدال مكافأة',
 you:'أنت', lv_0:'مبتدئ', lv_1:'جار', lv_2:'بطل الشارع', lv_3:'بطل الحي',
 ov_title:'نظرة عامة', ov_open:'مفتوح', ov_res:'تم الحل', ov_flag:'قيد المراجعة', ov_pts:'النقاط الممنوحة', by_status:'حسب الحالة', by_zone:'حسب الحي',
 invite_h:'دع الناس يجربونه', invite_b:'استخدم قائمة المشاركة أعلى الصفحة وامنح المواطنين والعمال صلاحية مساهم. عندها يمكنهم الإبلاغ والتحقق والاستبدال بحساباتهم.',
 rev_empty:'لا شيء بانتظار المراجعة.', rev_h:'تم تعليمها بواسطة الفحوصات',
 rw_h:'إدارة المكافآت', rw_add:'أضف مكافأة', rw_title:'العنوان', rw_partner:'الشريك', rw_cost:'التكلفة', rw_stock:'المخزون', rw_on:'نشطة', rw_off:'مخفية', rw_del:'حذف', rw_added:'تمت إضافة المكافأة.',
 pp_h:'الأعضاء', pp_trust:'الثقة', pp_susp:'إيقاف', pp_unsusp:'استعادة', pp_rep:'بلاغات',
 name_title:'مرحباً بك في حيّ', name_body:'اختر اسماً يظهر في لوحة المتصدرين.', name_ph:'اسمك', name_ok:'ابدأ',
 demo_tag:'خريطة تجريبية (مبسطة)، خرائط حقيقية في النسخة النهائية', copied:'تم.',
 my_loc:'تم عرض موقعك', loc_far:'موقعك خارج خريطة العرض.', rep_export:'تصدير البلاغات (CSV)', ppl_export:'تصدير الأعضاء (CSV)', reg_title:'أنشئ حسابك', reg_sub:'عرّفنا بنفسك ليثق العمال والجيران بالبلاغات. بيانات الاتصال تظهر للمديرين فقط.', f_name:'الاسم الكامل', f_email:'البريد الإلكتروني', f_phone:'الهاتف (0555123456)', f_zone:'حيّك', f_terms:'أوافق على مشاركة بيانات الاتصال مع فريق حيّ والالتزام بقواعد المجتمع.', reg_btn:'إنشاء الحساب', e_name:'أدخل اسمك الكامل.', e_email:'أدخل بريداً إلكترونياً صالحاً.', e_phone:'أدخل رقم هاتف جزائري صالحاً (05 أو 06 أو 07).', e_terms:'يرجى الموافقة على الشروط للمتابعة.', pw_note:'لا حاجة لكلمة مرور: تسجيل دخولك إلى Claude يحمي هذا الحساب.', ct_export:'تصدير جهات الاتصال (CSV)', tm_ago:''
}};
let lang = store.get('hayy_lang') || (navigator.language || '').startsWith('ar') ? 'ar' : 'en';
if (store.get('hayy_lang')) lang = store.get('hayy_lang');
const t = (k, v) => { let s = (L[lang] && L[lang][k]) || L.en[k] || k; if (v) for (const x in v) s = s.replace('{' + x + '}', v[x]); return s; };
const nf = n => Number(n || 0).toLocaleString(lang === 'ar' ? 'ar-DZ' : 'en');
const rtf = () => new Intl.RelativeTimeFormat(lang, { numeric: 'auto' });
const ago = ts => { const m = Math.round((Date.now() - ts) / 60000); if (m < 60) return rtf().format(-Math.max(m, 0), 'minute'); const h = Math.round(m / 60); if (h < 48) return rtf().format(-h, 'hour'); return rtf().format(-Math.round(h / 24), 'day'); };

/* ---------- icons ---------- */
const P = {
 camera:'<path d="M4 8h3l2-2.5h6L17 8h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
 pin:'<path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
 check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>', x:'<path d="M6 6l12 12M18 6L6 18"/>', back:'<path d="M15 5l-7 7 7 7"/>', plus:'<path d="M12 5v14M5 12h14"/>',
 star:'<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 17l-5.2 2.7 1-5.9L3.5 9.7l5.9-.8z"/>',
 locate:'<circle cx="12" cy="12" r="3.5"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3"/>',
 bag:'<path d="M9 4h6l-1 3c3 1.5 4.5 4.5 4 8-.4 3-2.5 5-6 5s-5.6-2-6-5c-.5-3.500 1-6.500 4-8z"/>',
 trash:'<path d="M5 7h14M9 7V4.500h6V7M7 7l1 13h8l1-13"/>', nav:'<path d="M4 11l16-7-7 16-2-7z"/>'
};
const ic = (n, s = 20) => `<svg class="ic${n === 'back' ? ' rtlflip' : ''}" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n]}</svg>`;

/* ---------- state & data layer ---------- */
const S = { role: store.get('hayy_role') || 'citizen', tab: 'map', sel: null, filter: 'all', wtab: 'rewards',
  reports: [], profiles: [], rewards: [], redemptions: [], ledger: [], contacts: [], uid: null, me: null, isAdmin: true,
  formOpen: false, form: null, loaded: { profiles: false } };
let db = null, user = null, askingName = false;
const LEVELS = [0, 100, 300, 700];
const levelOf = p => { let i = 0; LEVELS.forEach((m, k) => { if (p >= m) i = k; }); return i; };
const byId = id => S.reports.find(r => r.id === id);
const uidGen = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const fail = e => { console.warn(e); toast(t('err_write'), 'warn'); };
function memSet(c, id, d) { const a = S[c], i = a.findIndex(x => x.id === id), o = { id, ...d }; i < 0 ? a.push(o) : (a[i] = o); }
async function put(c, id, d) { try { if (db) await db.doc(c + '/' + id).set(d); else { memSet(c, id, d); draw(); } } catch (e) { fail(e); } }
async function upd(c, id, p) { try { if (db) await db.doc(c + '/' + id).update(p); else { const o = S[c].find(x => x.id === id); if (o) Object.assign(o, p); draw(); } } catch (e) { fail(e); } }
async function del(c, id) { try { if (db) await db.doc(c + '/' + id).delete(); else { S[c] = S[c].filter(x => x.id !== id); draw(); } } catch (e) { fail(e); } }

/* ---------- map geometry ---------- */
const DEPOT = { x: 480, y: 390 }, KM = 0.0108;
const ZONES = [{ n: 'Harbor', a: 'الميناء', x: 320, y: 225 }, { n: 'Old Quarter', a: 'الحي القديم', x: 540, y: 270 }, { n: 'Market', a: 'السوق', x: 730, y: 330 }, { n: 'Hillside', a: 'المرتفع', x: 210, y: 430 }, { n: 'Garden', a: 'الحديقة', x: 470, y: 480 }, { n: 'Eastgate', a: 'البوابة الشرقية', x: 840, y: 520 }, { n: 'University', a: 'الجامعة', x: 650, y: 600 }];
const zoneOf = (x, y) => { let b = ZONES[0], d = 1e9; ZONES.forEach(z => { const k = Math.hypot(z.x - x, z.y - y); if (k < d) { d = k; b = z; } }); return b; };
const zoneName = r => { const z = ZONES.find(z => z.n === r.zone) || zoneOf(r.x, r.y); return lang === 'ar' ? z.a : z.n; };
const geoToXY = (la, lo) => { const x = 500 + (lo + 0.6417) * 8333, y = 350 - (la - 35.6911) * 10279; return (x >= 0 && x <= 1000 && y >= 0 && y <= 700) ? { x, y } : null; };
const distU = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

function staticMap() {
  let g = '';
  for (let i = -300; i < 1400; i += 44) g += `<line x1="${i}" y1="-100" x2="${i - 220}" y2="850"/>`;
  for (let j = -200; j < 1000; j += 56) g += `<line x1="-200" y1="${j}" x2="1250" y2="${j + 120}"/>`;
  return `<defs><clipPath id="cl"><rect x="0" y="0" width="1000" height="700"/></clipPath></defs>
  <rect x="-3000" y="-3000" width="7000" height="7000" class="m-land"/>
  <g clip-path="url(#cl)">
   <g class="m-road" stroke-width="5">${g}</g>
   <path class="m-wadi" stroke-width="22" d="M560 130 C610 250 520 330 600 430 S760 560 700 720"/>
   <path class="m-park" d="M400 520 q40 -50 110 -30 q60 30 30 90 q-60 40 -120 10z"/>
   <path class="m-park" d="M150 300 q50 -40 100 -10 q30 50 -20 80 q-70 10 -80 -70z"/>
   <path class="m-park" d="M760 420 q60 -30 100 10 q10 60 -50 70 q-60 -10 -50 -80z"/>
   <g class="m-road" stroke-width="13"><path d="M-20 330 C250 300 500 400 1020 360"/><path d="M300 -20 C340 250 300 450 380 720"/><path d="M820 -20 C780 250 860 450 780 720"/><path d="M-20 560 C300 520 600 560 1020 600"/></g>
   <path class="m-sea" d="M-50 -50 H1050 V120 C900 160 800 100 660 145 C560 175 500 215 390 190 C290 168 160 110 -50 150Z"/>
   <g class="m-road" stroke-width="7"><path d="M250 150 l22 -26M300 168 l22 -30M350 183 l22 -30"/></g>
   ${ZONES.map(z => `<text class="m-lbl" x="${z.x}" y="${z.y}" text-anchor="middle">${esc(lang === 'ar' ? z.a : z.n)}</text>`).join('')}
  </g>`;
}

const M = { cx: 500, cy: 350, w: 1000, W: 1, H: 1 };
const svg = $('#map');
function setVB() { const r = svg.getBoundingClientRect(); M.W = r.width || 1; M.H = r.height || 1; const h = M.w * M.H / M.W; svg.setAttribute('viewBox', `${M.cx - M.w / 2} ${M.cy - h / 2} ${M.w} ${h}`); }
function fitView() { const r = svg.getBoundingClientRect(); M.W = r.width || 1; M.H = r.height || 1; M.w = Math.min(1000, 700 * M.W / M.H, 1000); M.w = Math.max(M.w, 420); M.cx = 500; M.cy = 350; setVB(); drawPins(); }
const toSvg = (cx, cy) => { const p = svg.createSVGPoint(); p.x = cx; p.y = cy; return p.matrixTransform(svg.getScreenCTM().inverse()); };
function setZoom(w, cx, cy) {
  const before = cx != null ? toSvg(cx, cy) : null; M.w = clamp(w, 200, 1300); setVB();
  if (before) { const a = toSvg(cx, cy); M.cx += before.x - a.x; M.cy += before.y - a.y; }
  clampView(); setVB(); drawPins();
}
const clampView = () => { M.cx = clamp(M.cx, 0, 1000); M.cy = clamp(M.cy, 0, 700); };
const centerOn = (x, y) => { M.cx = x; M.cy = y; clampView(); setVB(); };
{
  const ptrs = new Map(); let drag = null, pinch = null;
  svg.addEventListener('pointerdown', e => {
    svg.setPointerCapture(e.pointerId); ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (ptrs.size === 1) drag = { moved: 0, target: e.target };
    else if (ptrs.size === 2) { const [a, b] = [...ptrs.values()]; pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), w: M.w }; drag = null; }
  });
  svg.addEventListener('pointermove', e => {
    if (!ptrs.has(e.pointerId)) return; const prev = ptrs.get(e.pointerId); ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pinch && ptrs.size === 2) { const [a, b] = [...ptrs.values()]; setZoom(pinch.w * pinch.d / Math.hypot(a.x - b.x, a.y - b.y), (a.x + b.x) / 2, (a.y + b.y) / 2); return; }
    if (drag) { const dx = e.clientX - prev.x, dy = e.clientY - prev.y; drag.moved += Math.abs(dx) + Math.abs(dy); if (drag.moved > 8) { const s = M.w / M.W; M.cx -= dx * s; M.cy -= dy * s; clampView(); setVB(); } }
  });
  const end = e => {
    if (drag && ptrs.size === 1 && drag.moved <= 8 && e.type === 'pointerup') onTap(drag.target, e.clientX, e.clientY);
    ptrs.delete(e.pointerId); if (ptrs.size < 2) pinch = null; if (!ptrs.size) drag = null;
  };
  svg.addEventListener('pointerup', end); svg.addEventListener('pointercancel', end);
  svg.addEventListener('wheel', e => { e.preventDefault(); setZoom(M.w * (e.deltaY > 0 ? 1.15 : 0.87), e.clientX, e.clientY); }, { passive: false });
}
function onTap(target, cx, cy) {
  const pin = target.closest && target.closest('.pin');
  if (pin) { openDetail(pin.dataset.id); return; }
  if (S.formOpen) { const p = toSvg(cx, cy); S.form.x = clamp(p.x, 0, 1000); S.form.y = clamp(p.y, 0, 700); updateLoc(); drawPins(); }
}

/* ---------- pins ---------- */
const colorOf = r => r.status === 'completed' ? 'var(--green)' : r.status === 'flagged' ? 'var(--violet)' : r.status === 'in_progress' ? 'var(--blue)' : r.type === 'hotspot' ? 'var(--red)' : 'var(--amber)';
const isOpen = r => ['pending', 'in_progress', 'flagged'].includes(r.status);
function visible(r) {
  if (r.status === 'rejected') return false;
  if (r.status === 'flagged' && r.reporter !== S.uid && S.role !== 'admin') return false;
  const f = S.filter; if (f === 'all') return true;
  if (f === 'full') return r.type === 'hotspot' && isOpen(r); if (f === 'bag') return r.type === 'cleanup' && isOpen(r); return r.status === 'completed';
}
const GLYPH = { hotspot: '<path d="M0-31v-7M0-24v.5" stroke="#fff" stroke-width="3.2" stroke-linecap="round" fill="none"/>', cleanup: '<path d="M-4-36h8l-1.500 3c3 1.500 4 4 3.500 7-.500 3-2.500 4-6 4s-5.500-1-6-4c-.500-3 .500-5.500 3.500-7z" fill="#fff"/>', done: '<path d="M-5-27l3.500 3.500L6-33" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' };
function drawPins() {
  const s = M.w / M.W * 0.85; let h = '';
  const list = S.reports.filter(visible).sort((a, b) => (a.status === 'completed' ? 0 : 1) - (b.status === 'completed' ? 0 : 1) || (a.id === S.sel) - (b.id === S.sel));
  list.forEach(r => {
    const g = r.status === 'completed' ? GLYPH.done : GLYPH[r.type]; const sel = r.id === S.sel;
    h += `<g class="pin" data-id="${esc(r.id)}" transform="translate(${r.x} ${r.y}) scale(${s * (r.status === 'completed' ? .8 : 1) * (sel ? 1.25 : 1)})">${sel ? '<circle cy="-16" r="26" fill="none" stroke="var(--ink)" stroke-width="2.500" opacity=".55"/>' : ''}<path d="M0 0C-9-12-16-19-16-28a16 16 0 1 1 32 0C16-19 9-12 0 0z" style="fill:${colorOf(r)}" stroke="#fff" stroke-width="2.500"/><g transform="translate(0 4)">${g}</g></g>`;
  });
  if (S.here) h += `<g transform="translate(${S.here.x} ${S.here.y}) scale(${s})"><circle r="16" fill="var(--blue)" opacity=".2"/><circle r="7" fill="var(--blue)" stroke="#fff" stroke-width="2.500"/></g>`;
  if (S.role === 'worker') h += `<g transform="translate(${DEPOT.x} ${DEPOT.y}) scale(${s})"><rect x="-11" y="-11" width="22" height="22" rx="6" fill="var(--ink)" stroke="#fff" stroke-width="2.500"/><path d="M-5 4V-4l5-4 5 4V4z" fill="var(--surface)"/></g>`;
  if (S.formOpen && S.form.x != null) {
    const a = S.form.gps && S.form.gps.acc ? S.form.gps.acc * KM * 1000 / 11 * 0 : 0; // accuracy ring is informational only
    h += `<g transform="translate(${S.form.x} ${S.form.y}) scale(${s * 1.2})"><circle r="22" fill="var(--brand)" opacity=".18"/><path d="M0 0C-9-12-16-19-16-28a16 16 0 1 1 32 0C16-19 9-12 0 0z" style="fill:var(--ink)" stroke="#fff" stroke-width="2.500"/><circle cy="-28" r="6" fill="#fff"/></g>`;
  }
  $('#pins').innerHTML = h;
}

/* ---------- misc UI helpers ---------- */
let toastT;
function toast(msg, kind) { const el = $('#toast'); el.innerHTML = `<div class="${kind === 'warn' ? 'warn2' : ''}" role="status">${esc(msg)}</div>`; clearTimeout(toastT); toastT = setTimeout(() => el.innerHTML = '', 3600); }
function modal({ title, body = '', input = null, actions }) {
  return new Promise(res => {
    const m = $('#modal');
    m.innerHTML = `<div class="mback"></div><div class="mcard" role="dialog" aria-modal="true"><h3>${esc(title)}</h3><div class="mb">${body}</div>${input ? `<input id="minput" class="inp" placeholder="${esc(input)}" maxlength="60">` : ''}<div class="macts">${actions.map((a, i) => `<button class="btn ${a.kind || ''}" data-i="${i}">${esc(a.label)}</button>`).join('')}</div></div>`;
    m.hidden = false;
    const done = v => { m.hidden = true; m.innerHTML = ''; res(v); };
    $$('.btn', m).forEach(b => b.onclick = () => { const a = actions[+b.dataset.i]; done('val' in a ? a.val : ($('#minput', m) ? $('#minput', m).value.trim() : true)); });
    const inp = $('#minput', m); if (inp) { inp.focus(); inp.onkeydown = e => { if (e.key === 'Enter') $('.btn.primary', m).click(); }; }
    if (!actions.some(a => a.kind === 'primary' && 'val' in a && a.val === 'never')) $('.mback', m).onclick = () => { if (!input || !actions.noDismiss) done(null); };
  });
}
function demoImg(k) {
  const bag = (x, y, c, r = 0) => `<g transform="translate(${x} ${y}) rotate(${r})"><ellipse cx="0" cy="0" rx="19" ry="16" fill="${c}"/><path d="M-5-14l5-7 5 7z" fill="${c}"/><ellipse cx="-6" cy="-5" rx="5" ry="3" fill="#fff" opacity=".18"/></g>`;
  let items = '';
  if (k === 'after') items = bag(210, 168, '#2f3b36') + bag(240, 172, '#3f6a8c') + bag(270, 166, '#2f3b36');
  else items = bag(70, 175, '#2f3b36', -10) + bag(110, 150, '#3f6a8c', 20) + bag(150, 180, '#7a6a52') + bag(200, 160, '#2f3b36', 8) + bag(238, 185, '#6b7f6e', -18) + bag(280, 158, '#3f6a8c') + bag(120, 192, '#9a8f7a', 12) + bag(190, 196, '#2f3b36') + '<rect x="40" y="198" width="30" height="5" rx="2" fill="#a4a091"/><rect x="258" y="196" width="22" height="5" rx="2" fill="#8c9a7c"/>';
  const s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240"><rect width="320" height="240" fill="${k === 'after' ? '#cdd6cc' : '#c4bdad'}"/><rect y="0" width="320" height="120" fill="${k === 'after' ? '#dfe5dc' : '#d3ccbc'}"/><rect y="118" width="320" height="6" fill="#9aa59a"/><rect x="20" y="40" width="46" height="78" fill="#b9b3a2" opacity=".6"/><rect x="250" y="30" width="50" height="88" fill="#b9b3a2" opacity=".6"/>${items}</svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(s);
}
const imgSrc = (v, k) => (v && v.startsWith('demo:')) ? demoImg(v.slice(5)) : v;
const hamming = (a, b) => { let d = 0; for (let i = 0; i < 64; i++) if (a[i] !== b[i]) d++; return d; };
async function processFile(file) {
  const url = URL.createObjectURL(file);
  const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = url; });
  const sc = Math.min(1, 420 / img.width), c = document.createElement('canvas'); c.width = Math.round(img.width * sc); c.height = Math.round(img.height * sc);
  c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
  const h = document.createElement('canvas'); h.width = h.height = 8; const hx = h.getContext('2d'); hx.drawImage(img, 0, 0, 8, 8);
  const px = hx.getImageData(0, 0, 8, 8).data, g = []; for (let i = 0; i < 64; i++) g.push(px[i * 4] * .3 + px[i * 4 + 1] * .59 + px[i * 4 + 2] * .11);
  const avg = g.reduce((a, b) => a + b) / 64; URL.revokeObjectURL(url);
  return { data: c.toDataURL('image/jpeg', .55), hash: g.map(v => v > avg ? '1' : '0').join(''), age: Date.now() - (file.lastModified || Date.now()) };
}

/* ---------- points ---------- */
const BASE = { hotspot: 10, S: 30, M: 60, L: 100 };
const trustMult = tr => +(0.8 + (tr / 100) * 0.5).toFixed(2);
function calcPts(type, size, trust) { const total = Math.round((type === 'hotspot' ? BASE.hotspot : BASE[size]) * trustMult(trust)); return { total, advance: type === 'cleanup' ? Math.round(total * 0.3) : 0, mult: trustMult(trust) }; }
async function credit(uid, pts, reason, reportId, trustD) {
  const p = S.profiles.find(p => p.id === uid); if (!p) return;
  await upd('profiles', uid, { points: Math.max(0, (p.points || 0) + pts), trust: clamp((p.trust ?? 50) + trustD, 0, 100) });
  if (pts) await put('ledger', uidGen(), { uid, pts, reason, reportId: reportId || null, at: Date.now() });
}
const ev = (to, note) => ({ t: Date.now(), by: S.uid, name: S.me ? S.me.name : '', to, note: note || '' });

/* ---------- views ---------- */
const badgeKey = r => (r.status === 'pending' && r.type === 'cleanup' && !r.verified) ? 'await' : r.status;
const rlabel = r => r.type === 'hotspot' ? t('lbl_full') : t('lbl_bag');
const km = r => (distU(r, DEPOT) * KM).toFixed(1);
const score = r => (r.type === 'hotspot' ? 40 : 20) + ({ S: 0, M: 6, L: 12 }[r.size] || 0) + Math.min(30, (Date.now() - r.createdAt) / 864e5 * 6) + Math.max(0, 20 - distU(r, DEPOT) * .04);
function rowHTML(r, extra = '') {
  return `<button class="row" data-act="sel" data-id="${esc(r.id)}" style="--c:${colorOf(r)}"><span class="bar"></span><span class="rbody"><b>${esc(rlabel(r))}</b><span class="sub"><span>${esc(zoneName(r))}</span><span>${esc(t(r.size))}</span><span>${ago(r.createdAt)}</span>${extra}</span></span><span class="badge ${badgeKey(r)}">${t('st_' + badgeKey(r))}</span></button>`;
}
function tabsBar(list) { return `<div class="tabs" role="tablist">${list.map(([k, l]) => `<button role="tab" aria-selected="${S.tab === k}" data-act="tab" data-tab="${k}">${t(l)}</button>`).join('')}</div>`; }
const levelName = i => t('lv_' + i);

function citizenTab() {
  const tabs = tabsBar([['map', 'tab_map'], ['mine', 'tab_mine'], ['wallet', 'tab_wallet']]);
  if (S.tab === 'mine') {
    const mine = S.reports.filter(r => r.reporter === S.uid).sort((a, b) => b.createdAt - a.createdAt);
    return tabs + `<div class="pad"><h2 style="margin-bottom:12px">${t('tab_mine')}</h2>${mine.length ? mine.map(r => rowHTML(r)).join('') : `<div class="empty">${t('mine_empty')}</div>`}</div>`;
  }
  if (S.tab === 'wallet') return tabs + walletView();
  const open = S.reports.filter(r => isOpen(r) && r.status !== 'flagged').sort((a, b) => b.createdAt - a.createdAt);
  const res = S.reports.filter(r => r.status === 'completed').length;
  return tabs + `<div class="pad"><div class="stats"><div><b>${nf(open.length)}</b><span class="muted small">${t('open_now')}</span></div><div><b>${nf(res)}</b><span class="muted small">${t('cleaned')}</span></div><div><b>${nf(S.me ? S.me.points : 0)}</b><span class="muted small">${t('my_pts')}</span></div></div>
  <div class="sec"><h3>${t('nearby')}</h3>${open.length ? open.slice(0, 12).map(r => rowHTML(r)).join('') : `<div class="empty">${t('no_open')}</div>`}</div></div>`;
}

function walletView() {
  const p = S.me || { points: 0, trust: 50 }, lv = levelOf(p.points), nxt = LEVELS[lv + 1];
  const pct = nxt ? Math.round((p.points - LEVELS[lv]) / (nxt - LEVELS[lv]) * 100) : 100;
  let body = '';
  if (S.wtab === 'rewards') {
    const mineC = S.redemptions.filter(r => r.uid === S.uid).sort((a, b) => b.at - a.at);
    body = `<div class="grid2">${S.rewards.filter(r => r.active !== false).map(r => {
      const can = p.points >= r.cost && r.stock > 0;
      return `<div class="reward"><b>${esc(r.title)}</b><span class="muted small">${esc(r.partner)}</span><span class="cost">${ic('star', 16)} ${nf(r.cost)}</span><span class="small muted">${t('stock_left', { n: nf(r.stock) })}</span><button class="btn ${can ? 'primary' : ''}" ${can ? '' : 'disabled'} data-act="redeem" data-id="${esc(r.id)}">${can ? t('redeem') : t('need_more', { n: nf(Math.max(0, r.cost - p.points)) })}</button></div>`;
    }).join('')}</div>${mineC.length ? `<div class="sec"><h3>${t('w_coupons')}</h3>${mineC.map(c => `<div class="coupon"><div class="small muted">${esc(c.title)}</div><code>${esc(c.code)}</code></div>`).join('')}</div>` : ''}`;
  } else if (S.wtab === 'history') {
    const h = S.ledger.filter(l => l.uid === S.uid).sort((a, b) => b.at - a.at);
    body = h.length ? h.map(l => `<div class="lb"><span class="nm">${t('rs_' + l.reason)}<div class="small muted">${ago(l.at)}</div></span><b style="color:${l.pts < 0 ? 'var(--red)' : 'var(--green)'}">${l.pts > 0 ? '+' : ''}${nf(l.pts)}</b></div>`).join('') : `<div class="empty">${t('hist_empty')}</div>`;
  } else {
    const top = [...S.profiles].sort((a, b) => (b.points || 0) - (a.points || 0)).slice(0, 10);
    body = top.map((q, i) => `<div class="lb ${q.id === S.uid ? 'me' : ''}"><span class="rk">${i + 1}</span><span class="nm">${esc(q.name)}${q.id === S.uid ? ` (${t('you')})` : ''}<div class="small muted">${levelName(levelOf(q.points || 0))}</div></span><b>${nf(q.points || 0)}</b></div>`).join('');
  }
  return `<div class="pad"><div class="muted">${t('wallet')}</div><div class="big">${nf(p.points)}</div><div class="muted" style="margin-top:2px">${t('pts')}, ${levelName(lv)}</div>
  <div class="prog"><i style="width:${pct}%"></i></div><div class="small muted">${nxt ? t('lvl_to', { n: nf(nxt - p.points), l: levelName(lv + 1) }) : t('lvl_max')}</div>
  <div class="subtabs">${[['rewards', 'w_rewards'], ['history', 'w_history'], ['board', 'w_board']].map(([k, l]) => `<button aria-pressed="${S.wtab === k}" data-act="wtab" data-k="${k}">${t(l)}</button>`).join('')}</div>${body}</div>`;
}

function workerTab() {
  const tabs = tabsBar([['tasks', 'tab_tasks'], ['done', 'tab_done']]);
  if (S.tab === 'done') { const d = S.reports.filter(r => r.status === 'completed').sort((a, b) => b.createdAt - a.createdAt); return tabs + `<div class="pad"><h2 style="margin-bottom:12px">${t('tab_done')}</h2>${d.length ? d.map(r => rowHTML(r)).join('') : `<div class="empty">${t('done_empty')}</div>`}</div>`; }
  const q = S.reports.filter(r => ['pending', 'in_progress'].includes(r.status)).sort((a, b) => score(b) - score(a));
  const dn = S.reports.filter(r => r.status === 'completed').length;
  return tabs + `<div class="pad"><h2>${t('tasks_h')}</h2><div class="stats"><div><b>${nf(q.length)}</b><span class="muted small">${t('queue_open')}</span></div><div><b>${nf(dn)}</b><span class="muted small">${t('queue_done')}</span></div></div><p class="muted small" style="margin:4px 0 14px">${t('tasks_sub')}</p>
  ${q.length ? q.map(r => rowHTML(r, `<span>${km(r)} km</span><span>${t('priority')} ${Math.round(score(r))}</span>`)).join('') : `<div class="empty">${t('tasks_empty')}</div>`}</div>`;
}

function adminTab() {
  const tabs = tabsBar([['overview', 'tab_over'], ['review', 'tab_review'], ['rewards', 'tab_rewards'], ['people', 'tab_people']]);
  if (S.tab === 'review') {
    const f = S.reports.filter(r => r.status === 'flagged');
    return tabs + `<div class="pad"><h2 style="margin-bottom:12px">${t('rev_h')}</h2>${f.length ? f.map(r => rowHTML(r)).join('') : `<div class="empty">${t('rev_empty')}</div>`}</div>`;
  }
  if (S.tab === 'rewards') {
    return tabs + `<div class="pad"><h2 style="margin-bottom:12px">${t('rw_h')}</h2>${S.rewards.map(r => `<div class="reward" style="margin-bottom:10px"><div class="irow" style="grid-template-columns:1fr 1fr"><input class="inp" data-rw="${esc(r.id)}" data-f="title" value="${esc(r.title)}" aria-label="${t('rw_title')}"><input class="inp" data-rw="${esc(r.id)}" data-f="partner" value="${esc(r.partner)}" aria-label="${t('rw_partner')}"></div><div class="irow" style="grid-template-columns:1fr 1fr auto auto"><input class="inp" type="number" min="1" data-rw="${esc(r.id)}" data-f="cost" value="${r.cost}" aria-label="${t('rw_cost')}"><input class="inp" type="number" min="0" data-rw="${esc(r.id)}" data-f="stock" value="${r.stock}" aria-label="${t('rw_stock')}"><button class="btn" data-act="rwtoggle" data-id="${esc(r.id)}">${r.active !== false ? t('rw_on') : t('rw_off')}</button><button class="btn danger" data-act="rwdel" data-id="${esc(r.id)}" aria-label="${t('rw_del')}">${ic('trash', 18)}</button></div></div>`).join('')}
    <div class="sec"><h3>${t('rw_add')}</h3><input class="inp" id="nrT" placeholder="${t('rw_title')}" style="margin-bottom:8px"><input class="inp" id="nrP" placeholder="${t('rw_partner')}" style="margin-bottom:8px"><div class="irow" style="grid-template-columns:1fr 1fr"><input class="inp" id="nrC" type="number" min="1" placeholder="${t('rw_cost')}"><input class="inp" id="nrS" type="number" min="0" placeholder="${t('rw_stock')}"></div><button class="btn primary block" data-act="rwadd">${ic('plus', 18)} ${t('rw_add')}</button></div></div>`;
  }
  if (S.tab === 'people') {
    const ps = [...S.profiles].sort((a, b) => (b.points || 0) - (a.points || 0));
    return tabs + `<div class="pad"><div class="h-row"><h2 style="flex:1">${t('pp_h')}</h2><button class="btn" data-act="csvc">${t('ct_export')}</button></div>${ps.map(p => { const c = S.contacts.find(x => x.id === p.id) || {};
      return `<div class="lb"><span class="nm"><b>${esc(p.name)}</b>${p.suspended ? ' <span class="badge rejected">' + t('st_rejected') + '</span>' : ''}${c.email || c.phone ? `<div class="small muted" dir="ltr" style="text-align:start">${esc(c.email || '')} ${esc(c.phone || '')}</div>` : ''}<div class="small muted">${nf(p.points || 0)} ${t('pts')}, ${t('pp_trust')} ${p.trust ?? 50}, ${nf(S.reports.filter(r => r.reporter === p.id).length)} ${t('pp_rep')}</div></span><button class="btn" data-act="susp" data-id="${esc(p.id)}">${p.suspended ? t('pp_unsusp') : t('pp_susp')}</button></div>`; }).join('')}</div>`;
  }
  const rs = S.reports, c = k => rs.filter(r => r.status === k).length;
  const issued = S.ledger.filter(l => l.pts > 0).reduce((a, l) => a + l.pts, 0);
  const mx = Math.max(1, ...['pending', 'in_progress', 'completed', 'flagged', 'rejected'].map(c));
  const colS = { pending: 'var(--amber)', in_progress: 'var(--blue)', completed: 'var(--green)', flagged: 'var(--violet)', rejected: 'var(--red)' };
  const zs = ZONES.map(z => ({ z, n: rs.filter(r => (r.zone || zoneOf(r.x, r.y).n) === z.n && isOpen(r)).length }));
  const zm = Math.max(1, ...zs.map(o => o.n));
  return tabs + `<div class="pad"><h2>${t('ov_title')}</h2><div class="stats" style="margin-top:12px"><div><b>${nf(rs.filter(r => ['pending', 'in_progress'].includes(r.status)).length)}</b><span class="muted small">${t('ov_open')}</span></div><div><b>${nf(c('completed'))}</b><span class="muted small">${t('ov_res')}</span></div><div><b>${nf(c('flagged'))}</b><span class="muted small">${t('ov_flag')}</span></div><div><b>${nf(issued)}</b><span class="muted small">${t('ov_pts')}</span></div></div>
  <div class="sec"><h3>${t('by_status')}</h3><div class="bars">${['pending', 'in_progress', 'completed', 'flagged', 'rejected'].map(k => `<div style="--c:${colS[k]}"><span>${t('st_' + k)}</span><i style="width:${Math.max(4, c(k) / mx * 100)}%"></i><b>${c(k)}</b></div>`).join('')}</div></div>
  <div class="sec"><h3>${t('by_zone')}</h3><div class="bars">${zs.map(o => `<div style="--c:var(--brand)"><span>${esc(lang === 'ar' ? o.z.a : o.z.n)}</span><i style="width:${Math.max(4, o.n / zm * 100)}%"></i><b>${o.n}</b></div>`).join('')}</div></div>
  <div class="sec"><div class="btns"><button class="btn" data-act="csvr">${t('rep_export')}</button><button class="btn" data-act="csvp">${t('ppl_export')}</button></div></div><div class="sec warn" style="background:var(--soft)"><h3 style="margin-bottom:4px">${t('invite_h')}</h3><span class="muted">${t('invite_b')}</span></div></div>`;
}

function detailView(id) {
  const r = byId(id); if (!r) { S.sel = null; return null; }
  const canWork = S.role === 'worker' || S.role === 'admin', own = r.reporter === S.uid, openState = ['pending', 'in_progress'].includes(r.status);
  const imgs = r.type === 'cleanup'
    ? `<div class="imgs"><figure><img src="${imgSrc(r.imgs.before)}" alt=""><figcaption>${t('p_before')}</figcaption></figure><figure><img src="${imgSrc(r.imgs.after)}" alt=""><figcaption>${t('p_after')}</figcaption></figure></div>`
    : `<div class="imgs one"><figure><img src="${imgSrc(r.imgs.report)}" alt=""></figure></div>`;
  let acts = '', hint = '';
  if (canWork && r.status === 'pending') acts += `<button class="btn primary" data-act="start">${t('a_start')}</button>`;
  if (canWork && r.type === 'cleanup' && !r.verified && openState) {
    acts += `<button class="btn primary" data-act="verify" ${own ? 'disabled' : ''}>${ic('check', 18)} ${t('a_verify')}</button>`; if (own) hint = t('own_hint');
  }
  if (canWork && r.status === 'in_progress') {
    const need = r.type === 'cleanup' && !r.verified;
    acts += `<button class="btn ${need ? '' : 'primary'}" data-act="complete" ${need ? 'disabled' : ''}>${r.type === 'cleanup' ? t('a_pickup') : t('a_complete')}</button>`; if (need && !hint) hint = t('need_verify');
  }
  if (canWork && openState) acts += `<button class="btn danger" data-act="reject">${r.type === 'cleanup' ? t('a_reject') : t('a_invalid')}</button>`;
  if (S.role === 'admin' && r.status === 'flagged') acts += `<button class="btn primary" data-act="approve">${t('a_approve')}</button><button class="btn danger" data-act="reject">${t('a_reject')}</button>`;
  if (S.role === 'admin') acts += `<button class="btn" data-act="delete">${ic('trash', 18)} ${t('a_delete')}</button>`;
  const gps = r.gps ? `<a class="btn" target="_blank" rel="noopener" href="https://www.google.com/maps?q=${r.gps.lat},${r.gps.lng}">${ic('nav', 18)} ${t('a_nav')}</a>` : '';
  return `<div class="pad"><div class="h-row"><button class="hbtn" data-act="back" aria-label="${t('back')}">${ic('back')}</button><h2 style="flex:1">${esc(rlabel(r))}</h2><span class="badge ${badgeKey(r)}">${t('st_' + badgeKey(r))}</span></div>
  ${r.status === 'flagged' && r.flags && r.flags.length ? `<div class="warn"><b>${t('signals')}</b><br>${r.flags.map(f => esc(t('sig_' + f))).join('<br>')}</div>` : (r.flags && r.flags.length && canWork ? `<div class="warn"><b>${t('signals')}</b><br>${r.flags.map(f => esc(t('sig_' + f))).join('<br>')}</div>` : '')}
  ${imgs}${r.desc ? `<p style="margin:0 0 6px">${esc(r.desc)}</p>` : ''}
  <dl class="kv"><dt>${t('reporter')}</dt><dd>${esc(r.reporterName)}</dd><dt>${t('when')}</dt><dd>${ago(r.createdAt)}</dd><dt>${t('zone')}</dt><dd>${esc(zoneName(r))}</dd><dt>${t('amount')}</dt><dd>${t(r.size)}</dd>${r.worker ? `<dt>${t('worker')}</dt><dd>${esc(r.worker.name)}</dd>` : ''}${canWork ? `<dt>${t('priority')}</dt><dd>${Math.round(score(r))}, ${km(r)} km</dd>` : ''}</dl>
  ${(acts || gps) ? `<div class="btns">${acts}${gps}</div>` : ''}${hint ? `<div class="hint">${hint}</div>` : ''}
  <div class="sec"><h3>${t('timeline')}</h3><ul class="tl">${(r.events || []).map(e => `<li><b>${t('ev_' + e.to)}</b><div class="small muted">${esc(e.name || '')} ${ago(e.t)}${e.note ? ', ' + esc(e.note) : ''}</div></li>`).join('')}</ul></div></div>`;
}

function formView() {
  const f = S.form, cl = f.type === 'cleanup';
  const slot = (k, label) => `<label class="photo ${f.imgs[k] ? 'has' : ''}"><input type="file" accept="image/*" capture="environment" data-photo="${k}" hidden>${f.imgs[k] ? `<img src="${f.imgs[k]}" alt="">` : ic('camera', 26)}<span class="pl">${label}</span></label>`;
  return `<div class="pad"><div class="h-row"><button class="hbtn" data-act="cancelform" aria-label="${t('cancel')}">${ic('back')}</button><h2>${t('new_report')}</h2></div>
  <label class="f" style="margin-top:6px">${t('q_what')}</label>
  <button class="choice" data-act="ftype" data-k="hotspot" aria-pressed="${!cl}">${ic('trash', 22)}<span class="t"><b>${t('o_hot')}</b><span class="muted small">${t('o_hot_s')}</span></span></button>
  <button class="choice" data-act="ftype" data-k="cleanup" aria-pressed="${cl}">${ic('bag', 22)}<span class="t"><b>${t('o_clean')}</b><span class="muted small">${t('o_clean_s')}</span></span></button>
  <label class="f">${t('q_photos')}</label><div class="photos">${cl ? slot('before', t('p_before')) + slot('after', t('p_after')) : slot('report', t('p_waste'))}</div>
  <label class="f">${t('q_where')}</label><div class="locbox" id="locOut"></div><div class="btns" style="margin-top:8px"><button class="btn" data-act="locate">${ic('locate', 18)} ${t('use_loc')}</button></div>
  <label class="f">${t('q_size')}</label><div class="sizes">${['S', 'M', 'L'].map(k => `<button data-act="fsize" data-k="${k}" aria-pressed="${f.size === k}">${t(k)}</button>`).join('')}</div>
  <label class="f" for="fdesc">${t('q_note')}</label><textarea class="inp" id="fdesc" placeholder="${t('note_ph')}" maxlength="200">${esc(f.desc)}</textarea>
  <div class="btns" style="margin-top:18px"><button class="btn" data-act="cancelform">${t('cancel')}</button><button class="btn primary" data-act="submit">${t('send')}</button></div></div>`;
}
function updateLoc() {
  const el = $('#locOut'); if (!el) return; const f = S.form;
  el.innerHTML = f.x != null ? `${ic('pin', 20)}<span><b>${t('pin_set')}</b><div class="small muted">${esc(lang === 'ar' ? zoneOf(f.x, f.y).a : zoneOf(f.x, f.y).n)}${f.gps && f.gps.acc ? ', ±' + Math.round(f.gps.acc) + ' m' : ''}</div></span>` : `${ic('pin', 20)}<span class="muted">${t('tap_map')}</span>`;
}

/* ---------- render ---------- */
function renderChrome() {
  document.documentElement.lang = lang; document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  $('#tagline').textContent = t('tagline'); $('#demotag').textContent = t('demo_tag'); $('#langbtn').textContent = lang === 'ar' ? 'EN' : 'ع';
  const roles = ['citizen', 'worker'].concat(S.isAdmin ? ['admin'] : []);
  $('#roles').innerHTML = roles.map(r => `<button aria-pressed="${S.role === r}" data-act="role" data-r="${r}">${t('r_' + r)}</button>`).join('');
  $('#hwallet').innerHTML = S.role === 'citizen' && S.me ? `<div class="chip-pts" title="${t('wallet')}">${ic('star', 16)}${nf(S.me.points)}</div>` : '';
  $('#filters').innerHTML = [['all', 'f_all', ''], ['full', 'f_full', 'var(--red)'], ['bag', 'f_bag', 'var(--amber)'], ['done', 'f_done', 'var(--green)']].map(([k, l, c]) => `<button aria-pressed="${S.filter === k}" data-act="filter" data-k="${k}">${c ? `<span class="dot" style="--c:${c}"></span>` : ''}${t(l)}</button>`).join('');
  $('#fabwrap').innerHTML = S.role === 'citizen' && !S.formOpen ? `<button class="fab" data-act="newreport">${ic('plus', 20)} ${t('report')}</button>` : '';
  $('#mapwrap').classList.toggle('picking', S.formOpen);
  $('#map .static').innerHTML = staticMap();
}
function renderPanel() {
  const p = $('#panel'), keep = p.scrollTop; let h;
  if (S.formOpen) h = formView();
  else if (S.sel && (h = detailView(S.sel)) != null) { /* detail */ }
  else h = ({ citizen: citizenTab, worker: workerTab, admin: adminTab })[S.role]();
  p.innerHTML = h; p.scrollTop = keep; if (S.formOpen) updateLoc();
}
function draw() { drawPins(); if (!S.formOpen) renderPanel(); $('#hwallet').innerHTML = S.role === 'citizen' && S.me ? `<div class="chip-pts">${ic('star', 16)}${nf(S.me.points)}</div>` : ''; }
function fullRender() { renderChrome(); drawPins(); renderPanel(); }
function openDetail(id) { S.sel = id; S.formOpen = false; const r = byId(id); if (r) centerOn(r.x, r.y); renderChrome(); drawPins(); renderPanel(); $('#panel').scrollTop = 0; }

/* ---------- actions ---------- */
function defaultTab(role) { return { citizen: 'map', worker: 'tasks', admin: 'overview' }[role]; }
function locate() {
  if (!navigator.geolocation) { toast(t('loc_denied'), 'warn'); return; }
  toast(t('locating'));
  navigator.geolocation.getCurrentPosition(pos => {
    const { latitude: la, longitude: lo, accuracy: ac } = pos.coords; S.form.gps = { lat: la, lng: lo, acc: ac };
    const xy = geoToXY(la, lo); if (!xy) { toast(t('out_area'), 'warn'); updateLoc(); return; }
    S.form.x = xy.x; S.form.y = xy.y; centerOn(xy.x, xy.y); updateLoc(); drawPins();
  }, () => toast(t('loc_denied'), 'warn'), { enableHighAccuracy: true, timeout: 8000 });
}
async function submit() {
  const f = S.form; f.desc = ($('#fdesc') || {}).value || f.desc;
  if (S.me && S.me.suspended) return toast(t('err_susp'), 'warn');
  const need = f.type === 'cleanup' ? ['before', 'after'] : ['report'];
  if (need.some(k => !f.imgs[k])) return toast(t('err_photos'), 'warn');
  if (f.x == null) return toast(t('err_pin'), 'warn');
  if (S.reports.filter(r => r.reporter === S.uid && Date.now() - r.createdAt < 864e5).length >= 5) return toast(t('err_cap'), 'warn');
  if (f.type === 'hotspot') {
    const near = S.reports.find(r => r.type === 'hotspot' && ['pending', 'in_progress'].includes(r.status) && distU(r, f) < 24);
    if (near) {
      const a = await modal({ title: t('dup_title'), body: t('dup_body', { m: Math.round(distU(near, f) * KM * 1000) }), actions: [{ label: t('dup_any'), val: 'any' }, { label: t('dup_open'), kind: 'primary', val: 'open' }] });
      if (a === 'open') { S.formOpen = false; openDetail(near.id); return; } if (a !== 'any') return;
    }
  }
  const trust = S.me ? (S.me.trust ?? 50) : 50, flags = []; let hard = 0, soft = 0;
  if (f.type === 'cleanup' && hamming(f.hashes.before, f.hashes.after) < 6) { flags.push('same_photo'); hard++; }
  const mine = Object.values(f.hashes);
  if (S.reports.some(r => Object.values(r.hashes || {}).some(h => mine.some(m => hamming(h, m) <= 3)))) { flags.push('reused_photo'); hard++; }
  if (Object.values(f.ages).some(a => a > 10 * 60 * 1000)) { flags.push('stale_photo'); soft++; }
  if (f.gps && f.gps.acc > 30) { flags.push('weak_gps'); soft++; }
  if (trust < 30) { flags.push('low_trust'); soft++; }
  const flagged = hard > 0 || soft >= 2, pts = calcPts(f.type, f.size, trust), id = 'r' + uidGen();
  const rep = { type: f.type, status: flagged ? 'flagged' : 'pending', size: f.size, desc: f.desc.trim(), x: Math.round(f.x), y: Math.round(f.y), gps: f.gps || null, reporter: S.uid, reporterName: S.me ? S.me.name : '', createdAt: Date.now(), imgs: f.imgs, hashes: f.hashes, flags, pts, verified: false, worker: null, zone: zoneOf(f.x, f.y).n, events: [ev('submitted')].concat(flagged ? [ev('flagged')] : []) };
  S.formOpen = false; S.form = null;
  await put('reports', id, rep);
  if (f.type === 'cleanup' && !flagged && pts.advance) await credit(S.uid, pts.advance, 'advance', id, 0);
  S.tab = 'mine'; S.sel = id; renderChrome(); drawPins(); renderPanel(); centerOn(rep.x, rep.y);
  toast(flagged ? t('sent_flag') : f.type === 'cleanup' ? t('sent_clean', { n: pts.advance }) : t('sent_hot'));
}
async function workerAct(act) {
  const r = byId(S.sel); if (!r) return; const me = { id: S.uid, name: S.me ? S.me.name : '' };
  if (act === 'start') await upd('reports', r.id, { status: 'in_progress', worker: me, events: [...(r.events || []), ev('in_progress')] });
  else if (act === 'verify') {
    if (r.reporter === S.uid) return toast(t('own_hint'), 'warn');
    await upd('reports', r.id, { verified: true, events: [...(r.events || []), ev('verified')] });
    await credit(r.reporter, (r.pts.total || 0) - (r.pts.advance || 0), 'verified', r.id, 3);
  } else if (act === 'complete') {
    if (r.type === 'cleanup' && !r.verified) return toast(t('need_verify'), 'warn');
    await upd('reports', r.id, { status: 'completed', worker: r.worker || me, events: [...(r.events || []), ev('completed')] });
    if (r.type === 'hotspot' && r.reporter !== S.uid && !r.paid) { await upd('reports', r.id, { paid: true }); await credit(r.reporter, r.pts.total || 10, 'report_confirmed', r.id, 1); }
  } else if (act === 'reject') {
    const note = await modal({ title: t('reject_title'), input: t('reject_ph'), actions: [{ label: t('cancel'), val: null }, { label: t('ok'), kind: 'primary' }] });
    if (note === null) return;
    await upd('reports', r.id, { status: 'rejected', events: [...(r.events || []), ev('rejected', note === true ? '' : note)] });
    if (r.type === 'cleanup' && r.status !== 'flagged' && r.pts && r.pts.advance) await credit(r.reporter, -r.pts.advance, 'penalty', r.id, -10);
    else await credit(r.reporter, 0, 'penalty', r.id, -10);
    S.sel = null;
  } else if (act === 'approve') {
    await upd('reports', r.id, { status: 'pending', events: [...(r.events || []), ev('approved')] });
    if (r.type === 'cleanup' && r.pts && r.pts.advance) await credit(r.reporter, r.pts.advance, 'advance', r.id, 0);
  } else if (act === 'delete') { S.sel = null; await del('reports', r.id); }
  fullRender();
}
async function redeem(id) {
  const rw = S.rewards.find(x => x.id === id), p = S.me; if (!rw || !p || p.points < rw.cost || rw.stock < 1) return;
  const code = 'HY-' + Math.random().toString(36).slice(2, 8).toUpperCase();
  await credit(S.uid, -rw.cost, 'redeem', null, 0);
  await put('redemptions', uidGen(), { uid: S.uid, rewardId: id, title: rw.title, code, at: Date.now(), status: 'issued' });
  await upd('rewards', id, { stock: rw.stock - 1 });
  toast(t('redeemed'));
}

document.addEventListener('click', async e => {
  const b = e.target.closest('[data-act]'); if (!b) return; const a = b.dataset.act, d = b.dataset;
  switch (a) {
    case 'role': S.role = d.r; store.set('hayy_role', S.role); S.tab = defaultTab(S.role); S.sel = null; S.formOpen = false; fullRender(); break;
    case 'tab': S.tab = d.tab; S.sel = null; renderPanel(); break;
    case 'wtab': S.wtab = d.k; renderPanel(); break;
    case 'filter': S.filter = d.k; renderChrome(); drawPins(); break;
    case 'sel': openDetail(d.id); break;
    case 'back': S.sel = null; renderChrome(); drawPins(); renderPanel(); break;
    case 'zin': setZoom(M.w * .7); break; case 'zout': setZoom(M.w * 1.4); break;
    case 'recenter': fitView(); break;
    case 'lang': break;
    case 'newreport': S.formOpen = true; S.sel = null; S.form = { type: 'hotspot', size: 'M', desc: '', x: null, y: null, gps: null, imgs: {}, hashes: {}, ages: {} }; renderChrome(); drawPins(); renderPanel(); $('#panel').scrollTop = 0; break;
    case 'cancelform': S.formOpen = false; S.form = null; fullRender(); break;
    case 'ftype': S.form.desc = ($('#fdesc') || {}).value || ''; S.form.type = d.k; S.form.imgs = {}; S.form.hashes = {}; S.form.ages = {}; renderPanel(); break;
    case 'fsize': S.form.desc = ($('#fdesc') || {}).value || ''; S.form.size = d.k; renderPanel(); break;
    case 'locate': locate(); break;
    case 'submit': submit(); break;
    case 'start': case 'verify': case 'complete': case 'reject': case 'approve': workerAct(a); break;
    case 'delete': workerAct('delete'); break;
    case 'redeem': redeem(d.id); break;
    case 'mylocate':
      if (!navigator.geolocation) { toast(t('loc_denied'), 'warn'); break; }
      toast(t('locating'));
      navigator.geolocation.getCurrentPosition(pos => {
        const xy = geoToXY(pos.coords.latitude, pos.coords.longitude);
        if (!xy) return toast(t('loc_far'), 'warn');
        S.here = xy; centerOn(xy.x, xy.y); drawPins(); toast(t('my_loc'));
      }, () => toast(t('loc_denied'), 'warn'), { enableHighAccuracy: true, timeout: 8000 });
      break;
    case 'csvc': csv('hayy-contacts.csv', ['name', 'email', 'phone', 'district', 'points', 'trust'], S.profiles.map(p => { const c = S.contacts.find(x => x.id === p.id) || {}; return [p.name, c.email, c.phone, p.zone, p.points || 0, p.trust ?? 50]; })); break;
    case 'csvr': csv('hayy-reports.csv', ['date', 'type', 'status', 'size', 'district', 'reporter', 'note', 'x', 'y'], S.reports.map(r => [new Date(r.createdAt).toISOString(), r.type, r.status, r.size, r.zone, r.reporterName, r.desc, r.x, r.y])); break;
    case 'csvp': csv('hayy-people.csv', ['name', 'points', 'trust', 'reports'], S.profiles.map(p => [p.name, p.points || 0, p.trust ?? 50, S.reports.filter(r => r.reporter === p.id).length])); break;
    case 'susp': { const p = S.profiles.find(x => x.id === d.id); if (p) await upd('profiles', d.id, { suspended: !p.suspended }); break; }
    case 'rwtoggle': { const r = S.rewards.find(x => x.id === d.id); if (r) await upd('rewards', d.id, { active: r.active === false }); break; }
    case 'rwdel': await del('rewards', d.id); break;
    case 'rwadd': {
      const ti = $('#nrT').value.trim(), pa = $('#nrP').value.trim(), co = +$('#nrC').value, st = +$('#nrS').value;
      if (!ti || !co) return; await put('rewards', 'w' + uidGen(), { title: ti, partner: pa, cost: co, stock: st || 0, active: true }); toast(t('rw_added')); break;
    }
  }
});
$('#langbtn').addEventListener('click', () => { lang = lang === 'ar' ? 'en' : 'ar'; store.set('hayy_lang', lang); fullRender(); });
document.addEventListener('change', async e => {
  const ph = e.target.dataset && e.target.dataset.photo;
  if (ph && e.target.files[0]) {
    try { const r = await processFile(e.target.files[0]); S.form.desc = ($('#fdesc') || {}).value || S.form.desc; S.form.imgs[ph] = r.data; S.form.hashes[ph] = r.hash; S.form.ages[ph] = r.age; renderPanel(); } catch { toast(t('err_photos'), 'warn'); }
  }
  const rw = e.target.dataset && e.target.dataset.rw;
  if (rw) { const f = e.target.dataset.f; const v = (f === 'cost' || f === 'stock') ? Math.max(0, +e.target.value || 0) : e.target.value; await upd('rewards', rw, { [f]: v }); }
});
window.addEventListener('resize', () => { setVB(); drawPins(); });

function csv(name, head, rows) {
  const q = v => { v = String(v ?? ''); if (/^[=+\-@\t\r]/.test(v)) v = "'" + v; return '"' + v.replace(/"/g, '""') + '"'; };
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(['\uFEFF' + [head, ...rows].map(r => r.map(q).join(',')).join('\r\n')], { type: 'text/csv;charset=utf-8' }));
  a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
/* ---------- boot ---------- */
const phoneOk = p => /^(\+213|0)[567]\d{8}$/.test(p);
function regForm() {
  return new Promise(res => {
    const m = $('#modal'), zs = ZONES.map(z => `<option value="${z.n}">${esc(lang === 'ar' ? z.a : z.n)}</option>`).join('');
    m.innerHTML = `<div class="mback"></div><div class="mcard wide" role="dialog" aria-modal="true"><h3>${t('reg_title')}</h3><div class="mb">${t('reg_sub')}</div>
    <label class="f" for="rn">${t('f_name')}</label><input id="rn" class="inp" maxlength="80" autocomplete="name">
    <label class="f" for="re">${t('f_email')}</label><input id="re" class="inp" type="email" autocomplete="email" dir="ltr">
    <label class="f" for="rp">${t('f_phone')}</label><input id="rp" class="inp" type="tel" autocomplete="tel" dir="ltr">
    <label class="f" for="rz">${t('f_zone')}</label><select id="rz" class="inp">${zs}</select>
    <label class="chk"><input type="checkbox" id="rt"><span>${t('f_terms')}</span></label>
    <div class="fe" id="rerr" role="alert"></div><div class="small muted">${t('pw_note')}</div>
    <div class="macts"><button class="btn primary" id="rs">${t('reg_btn')}</button></div></div>`;
    m.hidden = false;
    const err = k => { $('#rerr').textContent = t(k); };
    $('#rs').onclick = () => {
      const name = $('#rn').value.trim(), email = $('#re').value.trim(), phone = $('#rp').value.replace(/[\s-]/g, '');
      if (name.length < 3) return err('e_name');
      if (!/^\S+@\S+\.\S+$/.test(email)) return err('e_email');
      if (!phoneOk(phone)) return err('e_phone');
      if (!$('#rt').checked) return err('e_terms');
      m.hidden = true; m.innerHTML = ''; res({ name, email, phone, zone: $('#rz').value });
    };
    $('#rn').focus();
  });
}
async function ensureProfile() {
  if (S.me || askingName || !S.loaded.profiles) return;
  S.me = S.profiles.find(p => p.id === S.uid) || null; if (S.me) return;
  askingName = true;
  const r = await regForm(), now = Date.now();
  await put('profiles', S.uid, { name: r.name, points: 0, trust: 50, zone: r.zone, createdAt: now });
  await put('contacts', S.uid, { uid: S.uid, name: r.name, email: r.email, phone: r.phone, createdAt: now });
  if (!db) S.me = S.profiles.find(x => x.id === S.uid);
  askingName = false; draw(); renderChrome();
}
function subscribe(c, key, q) {
  (q || db.collection(c)).onSnapshot(s => {
    S[key] = s.docs.map(d => ({ id: d.id, ...d.data() }));
    if (key === 'profiles') { S.loaded.profiles = true; S.me = S.profiles.find(p => p.id === S.uid) || null; if (!S.me) ensureProfile(); }
    if (S.formOpen) { drawPins(); } else draw();
  }, e => console.warn(c, e));
}
async function init() {
  svg.innerHTML = '<g class="static"></g><g id="pins"></g>';
  try {
    if (window.claude && claude.use) { user = await claude.use('user'); db = await claude.use('db'); }
  } catch (e) { console.warn(e); }
  try { S.uid = user && user.id ? await user.id() : null; } catch { S.uid = null; }
  if (!S.uid) { S.uid = store.get('hayy_uid') || 'u' + Math.random().toString(36).slice(2, 10); store.set('hayy_uid', S.uid); }
  try { S.isAdmin = user ? !!((await user.isOwner()) || (await user.canEdit())) : true; } catch { S.isAdmin = true; }
  if (S.role === 'admin' && !S.isAdmin) S.role = 'citizen';
  S.tab = defaultTab(S.role);
  fullRender(); fitView();
  if (db) {
    subscribe('reports', 'reports'); subscribe('profiles', 'profiles'); subscribe('rewards', 'rewards'); subscribe('redemptions', 'redemptions'); subscribe('ledger', 'ledger'); if (S.isAdmin) subscribe('contacts', 'contacts'); else subscribe('contacts', 'contacts', db.collection('contacts').where('uid', '==', S.uid));
  } else {
    S.rewards = [{ id: 'w1', title: 'Free coffee', partner: 'Partner café', cost: 150, stock: 20, active: true }, { id: 'w2', title: '10% bakery discount', partner: 'Neighborhood bakery', cost: 200, stock: 20, active: true }];
    S.loaded.profiles = true; ensureProfile(); draw();
  }
}
init();
})();
