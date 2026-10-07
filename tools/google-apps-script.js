/**
 * Backend do formulário (Google Apps Script) — cole no projeto vinculado à planilha.
 * 
 * 1. Configurações do projeto > Propriedades do script:
 *    - RECAPTCHA_SECRET = <sua secret key do reCAPTCHA v3>
 *    - META_PIXEL_ID = 2176540853173706
 *    - META_CAPI_TOKEN = <seu token de acesso CAPI da Meta>
 * 
 * 2. Implantar > Gerenciar implantações > editar > Nova versão (acesso: Qualquer pessoa).
 */

var process = (typeof process !== 'undefined') ? process : { env: {} };
if (!process.env) process.env = {};

process.env.META_PIXEL_ID = (typeof process.env.META_PIXEL_ID !== 'undefined' && process.env.META_PIXEL_ID)
  || (typeof PropertiesService !== 'undefined' && PropertiesService.getScriptProperties && PropertiesService.getScriptProperties().getProperty('META_PIXEL_ID'))
  || '2176540853173706';

process.env.META_CAPI_TOKEN = (typeof process.env.META_CAPI_TOKEN !== 'undefined' && process.env.META_CAPI_TOKEN)
  || (typeof PropertiesService !== 'undefined' && PropertiesService.getScriptProperties && PropertiesService.getScriptProperties().getProperty('META_CAPI_TOKEN'))
  || 'EAANi3c886r4BSqpr2BRwXWKrqWSPqxYZBx1D7PjEoZCO2bJwduhcIpPpjTgRyYZAo8SazrY6Mws6Ee44F4hAdv2mN2a38iFJ8uBspzh7tqg5cqGNgZAXYgSFMwDjF9as0ZB5R65kiAcU64iIO1bou9cM4UKMkEg7QuaPAcJQZA59k79dptOmkW3jQUuAIo7QZDZD';

function doPost(e) {
  try {
    var p = e.parameter || {};
    var secret = (typeof PropertiesService !== 'undefined' && PropertiesService.getScriptProperties)
      ? PropertiesService.getScriptProperties().getProperty('RECAPTCHA_SECRET')
      : (process.env.RECAPTCHA_SECRET || null);

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

    // Formatação do WhatsApp como texto para evitar que o '+' gere fórmula inválida (#ERROR!) na planilha
    var whatsappText = (p.whatsapp || '').toString().trim();
    if (whatsappText && !whatsappText.startsWith("'")) {
      whatsappText = "'" + whatsappText;
    }

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    sheet.appendRow([
      new Date(),
      p.formType || 'Diagnóstico',
      p.name || '',
      p.email || '',
      whatsappText,
      p.country || '',
      p.need || p.subject || '',
      p.assets || '',
      p.message || '',
      isQualified ? 'Qualificado' : 'Não Qualificado'
    ]);

    // Disparo Meta Conversions API (CAPI) para evento 'Lead'
    // Dentro de try/catch para que qualquer falha na API da Meta nunca trave ou interrompa o envio do formulário do usuário
    try {
      sendMetaCapiLead(p, e);
    } catch (metaErr) {
      console.error('Falha ao processar Meta CAPI: ' + metaErr);
    }

    return out_({ ok: true, qualified: isQualified });
  } catch (err) {
    return out_({ ok: false, error: String(err) });
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({ ok: true, status: 'online', service: 'Liberaction Backend' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function out_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Envia o evento 'Lead' para a Meta Conversions API (CAPI).
 */
function sendMetaCapiLead(p, e) {
  try {
    var capiToken = process.env.META_CAPI_TOKEN;
    if (!capiToken) {
      console.warn('Meta CAPI: META_CAPI_TOKEN não configurado nas propriedades do script.');
      return;
    }

    // Normalização e hash SHA-256 de e-mail (lowercase, sem espaços)
    var email = (p.email || '').toString().toLowerCase().trim();
    var hashedEmail = email ? sha256Hex(email) : '';

    // Normalização e hash SHA-256 do WhatsApp em formato E.164
    var rawPhone = (p.whatsapp || '').toString().trim();
    var phoneDigits = rawPhone.replace(/\D/g, '').replace(/^0+/, '');
    if ((phoneDigits.length === 10 || phoneDigits.length === 11) && !phoneDigits.startsWith('55')) {
      phoneDigits = '55' + phoneDigits;
    }
    var hashedPhone = phoneDigits ? sha256Hex(phoneDigits) : '';

    // Extração de IP do cabeçalho da requisição ou parâmetro
    var headers = (e && (e.headers || e.header)) || {};
    var clientIp = headers['x-forwarded-for'] || headers['x-real-ip'] || headers['cf-connecting-ip'] || headers['client-ip'] || p.client_ip_address || '';
    if (clientIp && clientIp.indexOf(',') !== -1) {
      clientIp = clientIp.split(',')[0].trim();
    }

    // Extração de User Agent do cabeçalho ou parâmetro enviado pelo front-end
    var userAgent = headers['user-agent'] || headers['User-Agent'] || p.client_user_agent || '';

    // Montagem dos dados de usuário (user_data)
    var userData = {};
    if (hashedEmail) userData.em = [hashedEmail];
    if (hashedPhone) userData.ph = [hashedPhone];
    if (clientIp) userData.client_ip_address = clientIp;
    if (userAgent) userData.client_user_agent = userAgent;
    if (p.fbp) userData.fbp = String(p.fbp).trim();
    if (p.fbc) userData.fbc = String(p.fbc).trim();

    // Definição de custom_data com pontuação de valor por patrimônio
    var customData = {
      currency: 'BRL',
      value: getAssetValue(p.assets),
      lead_need: p.need || p.subject || '',
      asset_range: p.assets || ''
    };

    var eventTime = Math.floor(new Date().getTime() / 1000);
    var eventSourceUrl = p.event_source_url || 'https://liberaction.io/pt/contato/';

    var eventData = {
      event_name: 'Lead',
      event_time: eventTime,
      action_source: 'website',
      event_source_url: eventSourceUrl,
      user_data: userData,
      custom_data: customData
    };

    var payload = {
      data: [eventData]
    };

    var testEventCode = (typeof PropertiesService !== 'undefined' && PropertiesService.getScriptProperties && PropertiesService.getScriptProperties().getProperty('TEST_EVENT_CODE'))
      || (process.env && process.env.TEST_EVENT_CODE)
      || p.test_event_code
      || '';
    if (testEventCode) {
      payload.test_event_code = String(testEventCode).trim();
    }

    var url = `https://graph.facebook.com/v20.0/${process.env.META_PIXEL_ID}/events?access_token=${capiToken}`;

    if (typeof UrlFetchApp !== 'undefined' && UrlFetchApp.fetch) {
      var response = UrlFetchApp.fetch(url, {
        method: 'post',
        contentType: 'application/json',
        payload: JSON.stringify(payload),
        muteHttpExceptions: true
      });
      console.log('Meta CAPI status: ' + response.getResponseCode() + ' | ' + response.getContentText());
    } else if (typeof fetch === 'function') {
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).then(function(res) {
        return res.text();
      }).then(function(text) {
        console.log('Meta CAPI response: ' + text);
      }).catch(function(err) {
        console.error('Meta CAPI fetch error: ' + err);
      });
    }
  } catch (err) {
    console.error('Erro ao enviar evento para Meta CAPI: ' + err);
  }
}

/**
 * Mapeia o valor em BRL com base na faixa de patrimônio selecionada.
 */
function getAssetValue(assetStr) {
  var raw = (assetStr || '').toString().trim();
  var exactMap = {
    'Acima de R$ 50 milhões': 500,
    'R$ 10 milhões a R$ 50 milhões': 350,
    'R$ 3 milhões a R$ 10 milhões': 250,
    'R$ 1 milhão a R$ 3 milhões': 150,
    'Prefiro informar durante o atendimento': 150,
    'Até R$ 1 milhão': 30
  };
  if (exactMap.hasOwnProperty(raw)) return exactMap[raw];

  var lower = raw.toLowerCase();
  if (lower.indexOf('50') !== -1 && (lower.indexOf('acima') !== -1 || lower.indexOf('+') !== -1 || lower.indexOf('mais') !== -1)) return 500;
  if (lower.indexOf('10') !== -1 && lower.indexOf('50') !== -1) return 350;
  if (lower.indexOf('3') !== -1 && lower.indexOf('10') !== -1) return 250;
  if (lower.indexOf('1') !== -1 && lower.indexOf('3') !== -1) return 150;
  if (lower.indexOf('prefiro') !== -1) return 150;
  if (lower.indexOf('1') !== -1 && (lower.indexOf('até') !== -1 || lower.indexOf('ate') !== -1)) return 30;

  return 30;
}

/**
 * Gera hash SHA-256 em hexadecimal (lowercase).
 * Compatível tanto com Google Apps Script (Utilities.computeDigest) quanto Node.js (crypto).
 */
function sha256Hex(str) {
  if (!str) return '';
  str = String(str).trim();
  if (typeof Utilities !== 'undefined' && Utilities.computeDigest) {
    var raw = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, str, Utilities.Charset.UTF_8);
    var hex = '';
    for (var i = 0; i < raw.length; i++) {
      var byteVal = raw[i];
      if (byteVal < 0) byteVal += 256;
      var h = byteVal.toString(16);
      if (h.length === 1) h = '0' + h;
      hex += h;
    }
    return hex.toLowerCase();
  }
  if (typeof require !== 'undefined') {
    try {
      var c = require('crypto');
      return c.createHash('sha256').update(str, 'utf8').digest('hex').toLowerCase();
    } catch (e) {}
  }
  return '';
}

/**
 * Função de teste direto: selecione esta função no menu superior do Google Apps Script
 * e clique em "Executar" para testar o envio para a Meta CAPI na hora e ver a resposta no log.
 */
function testarEnvioMeta() {
  Logger.log('Iniciando teste de envio para Meta CAPI...');
  var mockP = {
    email: 'teste@liberaction.io',
    whatsapp: '+55 11 99999-9999',
    name: 'Teste Manual Liberaction',
    need: 'Saída fiscal do Brasil',
    assets: 'R$ 3 milhões a R$ 10 milhões'
  };
  sendMetaCapiLead(mockP, null);
  Logger.log('Teste concluído. Verifique os logs acima.');
}
