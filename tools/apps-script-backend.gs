/**
 * Backend do formulário (Google Apps Script) — cole no projeto vinculado à planilha.
 * 1. Configurações do projeto > Propriedades do script: RECAPTCHA_SECRET = <secret key do reCAPTCHA v3>
 * 2. Implantar > Gerenciar implantações > editar > Nova versão (acesso: Qualquer pessoa).
 */
function doPost(e) {
  try {
    var p = e.parameter || {};
    var secret = PropertiesService.getScriptProperties().getProperty('RECAPTCHA_SECRET');
    if (secret) {
      if (!p.recaptchaToken) return out_({ ok: false, error: 'captcha ausente' });
      var r = UrlFetchApp.fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'post',
        payload: { secret: secret, response: p.recaptchaToken }
      });
      var v = JSON.parse(r.getContentText());
      if (!v.success || v.score < 0.5 || v.action !== 'diagnostico') {
        return out_({ ok: false, error: 'captcha reprovado' });
      }
    }
    if (!p.name || !p.email || !p.whatsapp) return out_({ ok: false, error: 'dados incompletos' });

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    sheet.appendRow([new Date(), p.formType, p.need, p.name, p.whatsapp, p.email, p.country, p.assets, p.message]);
    return out_({ ok: true });
  } catch (err) {
    return out_({ ok: false, error: String(err) });
  }
}

function out_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
