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

    // Validação de qualificação de lead:
    // Cenário B (Não Qualificado): "Até R$ 1 milhão"
    // Cenário A (Qualificado): R$ 1M a R$ 3M, R$ 3M a R$ 10M, R$ 10M+, "Prefiro informar", etc.
    var assets = (p.assets || '').toString().toLowerCase().trim();
    var isUnqualified = assets.indexOf('até r$ 1') !== -1 || assets.indexOf('ate r$ 1') !== -1 || assets.indexOf('até 1') !== -1 || assets.indexOf('ate 1') !== -1;
    var isQualified = Boolean(assets) && !isUnqualified;

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    sheet.appendRow([
      new Date(),
      p.formType,
      p.need,
      p.name,
      p.whatsapp,
      p.email,
      p.country,
      p.assets,
      p.message,
      isQualified ? 'Qualificado' : 'Não Qualificado'
    ]);
    return out_({ ok: true, qualified: isQualified });
  } catch (err) {
    return out_({ ok: false, error: String(err) });
  }
}

function out_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
