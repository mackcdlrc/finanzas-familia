/**
 * FINANZAS FAMILIARES — Backend con Google Apps Script + Google Sheets
 * ----------------------------------------------------------------------
 * Cómo instalarlo: sigue el README.md paso a paso. Resumen rápido:
 * 1. Crea una hoja de cálculo en Google Sheets.
 * 2. Extensiones > Apps Script.
 * 3. Borra el contenido de Code.gs y pega TODO este archivo.
 * 4. Cambia APP_TOKEN abajo por el mismo valor que pondrás en CONFIG.APP_TOKEN
 *    dentro de index.html. Este token es interno: Mack y Giorgiana nunca lo
 *    ven ni lo escriben, solo protege que otras personas con el link de
 *    Apps Script no puedan leer o escribir datos.
 * 5. Implementar > Nueva implementación > Aplicación web
 *    - Ejecutar como: Yo
 *    - Quién tiene acceso: Cualquier usuario
 * 6. Copia la URL que te da y pégala en CONFIG.API_URL de index.html.
 */

const APP_TOKEN = "cambia-esto-por-una-clave-larga"; // debe ser IDÉNTICO a CONFIG.APP_TOKEN en index.html
const NOMBRE_HOJA = "Movimientos";

const COLUMNAS = [
  "id", "fecha_creacion", "usuario", "tipo", "descripcion", "categoria",
  "monto", "fecha_registro", "esCuotas", "numCuotas", "valorCuota",
  "fechaInicio", "frecuencia", "cuotasPagadas", "estado"
];

function getSheet_(){
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(NOMBRE_HOJA);
  if(!sheet){
    sheet = ss.insertSheet(NOMBRE_HOJA);
    sheet.appendRow(COLUMNAS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function jsonOut_(obj){
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/* ---------------- GET: listar movimientos ---------------- */
function doGet(e){
  const token = e.parameter.token;
  if(token !== APP_TOKEN){
    return jsonOut_({ error: "Token inválido" });
  }
  const sheet = getSheet_();
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows = data.slice(1).map(row=>{
    const obj = {};
    headers.forEach((h,i)=> obj[h] = row[i]);
    // normalizar fechas a texto YYYY-MM-DD
    ["fecha_registro","fechaInicio"].forEach(k=>{
      if(obj[k] instanceof Date){
        obj[k] = Utilities.formatDate(obj[k], Session.getScriptTimeZone(), "yyyy-MM-dd");
      }
    });
    obj.cuotasPagadas = obj.cuotasPagadas ? String(obj.cuotasPagadas) : "";
    return obj;
  }).filter(r => r.id); // ignora filas vacías

  return jsonOut_(rows);
}

/* ---------------- POST: crear / actualizar ---------------- */
function doPost(e){
  let body;
  try{
    body = JSON.parse(e.postData.contents);
  }catch(err){
    return jsonOut_({ error: "JSON inválido" });
  }

  if(body.token !== APP_TOKEN){
    return jsonOut_({ error: "Token inválido" });
  }

  const sheet = getSheet_();

  if(body.action === "create"){
    const id = Utilities.getUuid();
    const fila = COLUMNAS.map(col=>{
      if(col === "id") return id;
      if(col === "fecha_creacion") return new Date();
      return body[col] !== undefined ? body[col] : "";
    });
    sheet.appendRow(fila);
    return jsonOut_({ ok: true, id });
  }

  if(body.action === "update"){
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const idCol = headers.indexOf("id");
    for(let i=1;i<data.length;i++){
      if(data[i][idCol] === body.id){
        headers.forEach((h,colIdx)=>{
          if(body[h] !== undefined && h !== "id"){
            sheet.getRange(i+1, colIdx+1).setValue(body[h]);
          }
        });
        return jsonOut_({ ok: true });
      }
    }
    return jsonOut_({ error: "No se encontró el movimiento" });
  }

  return jsonOut_({ error: "Acción no reconocida" });
}
