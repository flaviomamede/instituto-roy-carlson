/**
 * Captura de leads (flipbook + assinatura) → Google Sheets + e-mail
 * ---------------------------------------------------------------
 * Como instalar:
 *   1) Abra a planilha de Leads no Google Sheets.
 *   2) Menu  Extensões → Apps Script.
 *   3) Selecione TODO o conteúdo do editor (Ctrl+A) e apague.
 *   4) Cole TODO o conteúdo deste arquivo.
 *   5) Salve (ícone de disquete / Ctrl+S).
 *   6) Autorize: escolha a função  doGet  no topo e clique em Executar uma vez;
 *      aceite as permissões (inclui enviar e-mail por você, via MailApp).
 *   7) Implantar → Gerenciar implantações → (lápis) → Versão: Nova versão → Implantar.
 *      A URL /exec continua a mesma.
 *
 * Mantenha a PLANILHA PRIVADA (e-mails são dado pessoal — LGPD).
 */

// ID da planilha de Leads:
var SHEET_ID  = '1KJN372VysUkxqUWBDVAdHCDRV9Na84CpDezAp1f4fMU';
// Aba onde os leads são gravados (criada se não existir):
var TAB_NAME  = 'Leads';
// Evitar gravar o mesmo e-mail duas vezes? (false = registra todas as visitas)
var DEDUP     = false;
// Fuso para o carimbo de data/hora:
var TIMEZONE  = 'America/Sao_Paulo';
// Para onde vai a notificação de novas assinaturas:
var NOTIFY_TO = 'institutoroycarlson@gmail.com';

var HEADERS = ['Data/Hora', 'E-mail', 'Origem', 'Página', 'Referer', 'Navegador'];

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000); // evita corrida em acessos simultâneos

    var data = {};
    if (e && e.postData && e.postData.contents) {
      try { data = JSON.parse(e.postData.contents); }
      catch (err) { data = (e.parameter || {}); } // fallback p/ form-encoded
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    var email = String(data.email || '').trim();
    var sheet = getSheet_();

    if (DEDUP && email) {
      var existing = sheet.getRange(2, 2, Math.max(sheet.getLastRow() - 1, 0), 1).getValues();
      for (var i = 0; i < existing.length; i++) {
        if (String(existing[i][0]).trim().toLowerCase() === email.toLowerCase()) {
          return json_({ ok: true, duplicated: true });
        }
      }
    }

    var when = Utilities.formatDate(new Date(), TIMEZONE, 'yyyy-MM-dd HH:mm:ss');
    sheet.appendRow([
      when,
      email,
      String(data.source || ''),
      String(data.page   || ''),
      String(data.ref    || ''),
      String(data.ua     || '')
    ]);

    // Notifica assinaturas e contatos de fundador/patrocinador por e-mail
    // (DEPOIS do appendRow, fora da lista)
    if (data.tipo === 'assinatura' || data.tipo === 'fundador') {
      var isFundador = data.tipo === 'fundador';
      MailApp.sendEmail({
        to: NOTIFY_TO,
        subject: isFundador
          ? 'Contato Fundador/Patrocinador (' + email + ')'
          : 'Nova assinatura - ' + (data.plano || '') + ' (' + email + ')',
        body: (isFundador
          ? 'Tipo: Fundador/Patrocinador' +
            '\nNome: ' + (data.nome || '') +
            '\nE-mail: ' + email +
            '\nMensagem: ' + (data.mensagem || '')
          : 'Plano: ' + (data.plano || '') +
            '\nValor: R$ ' + (data.valor || '') +
            '\nNome: ' + (data.nome || '') +
            '\nE-mail: ' + email +
            '\nOrigem: ' + (data.source || '')) +
          '\nQuando: ' + when
      });
    }

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (e2) {}
  }
}

// Teste no navegador: abrir a URL /exec deve mostrar {"ok":true,"status":"online",...}
function doGet() {
  try {
    var sheet = getSheet_();
    return json_({
      ok: true,
      status: 'online',
      sheet: SHEET_ID,
      tab: TAB_NAME,
      rows: sheet.getLastRow()
    });
  } catch (err) {
    return json_({ ok: false, status: 'error', error: String(err) });
  }
}

function getSheet_() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName(TAB_NAME);
  if (!sheet) sheet = ss.insertSheet(TAB_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
