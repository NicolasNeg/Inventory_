
function doGet() {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle("Sistema de Inventario 2026")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}


function cargarVistaParcial(nombre) {
  return HtmlService.createHtmlOutputFromFile(nombre).getContent();
}



function ordenarInventario() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('INVENTARIO');
  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();

  // Si no hay datos (solo encabezado), salir
  if (lastRow < 2) return;

  // Rango desde la fila 2 (debajo del encabezado) hasta el final
  const range = sheet.getRange(2, 1, lastRow - 1, lastCol);
  
  // Ordenar por la columna 1 (ID_ORDEN) de forma ascendente
  range.sort({column: 1, ascending: true});
  
  SpreadsheetApp.getUi().alert('✅ Inventario ordenado por categorías y marcas.');
}

// Agregar la opción al menú superior
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('INICIAR SISTEMA.')
    .addItem('📦 Abrir Web', 'abrirWeb')
    .addSeparator()
    .addToUi();
}

function abrirWeb() {
 const url = "https://script.google.com/macros/s/AKfycbx_oFhbTaNflO__A7NooqlVPWRCSWQQztJnSj9pgPbF9Cpzf9z2bV5frzbWnHyZE8DD/exec";
  const html = `
    <script>
      window.open("${url}", "_blank");
      google.script.host.close();
    </script>
  `;
  const userInterface = HtmlService.createHtmlOutput(html)
    .setWidth(10)
    .setHeight(10);
  SpreadsheetApp.getUi().showModalDialog(userInterface, "Abriendo...");
}


// --- FUNCIONES DE APOYO ---
function obtenerCategoriasParaSelect() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('CONFIG_ORDEN_TIPO_PRODUCTO'); 
    const datos = sheet.getDataRange().getValues();
    
    // Filtramos para evitar enviar filas vacías o el encabezado
    const categorias = datos.slice(1)
                            .map(fila => fila[0])
                            .filter(item => item !== "" && item !== null);
                            
    return categorias; 
  } catch (e) {
    console.error("Error en obtenerCategoriasParaSelect: " + e.toString());
    return ["ERROR DE LECTURA"];
  }
}

/**
 * Obtiene el historial filtrando únicamente por el ID_ORDEN
 */
/**
 * Obtiene el historial filtrando por el ID_ORDEN de la celda activa
 */
function obtenerMovimientosPorId(subModeloInventario) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const invSheet = ss.getSheetByName('INVENTARIO');
    const histSheet = ss.getSheetByName('HISTORICO');
    
    // Normalizamos el criterio (minúsculas y sin espacios)
    const criterio = String(subModeloInventario || "").trim().toLowerCase();
    
    // 1. Obtener Info del Producto desde INVENTARIO
    const dataInv = invSheet.getDataRange().getValues();
    // Columna E es índice 4
    const filaProducto = dataInv.find(f => String(f[4] || "").trim().toLowerCase() === criterio);
    
    let nombreProd = filaProducto ? filaProducto[2] : "Producto";
    let subProd = filaProducto ? `${filaProducto[3]} | ${filaProducto[4]}` : subModeloInventario;

    // 2. Obtener Movimientos desde HISTORICO
    const lastRow = histSheet.getLastRow();
    if (lastRow <= 1) return { producto: nombreProd, sub: subProd, movimientos: [] };

    const histData = histSheet.getRange(2, 1, lastRow - 1, 9).getValues();
    
    // Filtramos el histórico comparando la Columna E (índice 4) con el criterio
    const movimientos = histData
      .filter(f => String(f[4] || "").trim().toLowerCase() === criterio)
      .map(f => ({
        fecha: f[0] instanceof Date ? Utilities.formatDate(f[0], "GMT-6", "dd/MM/yy HH:mm") : String(f[0]),
        unidad: String(f[5] || ""),
        cantidad: f[6] || 0,
        autor: String(f[7] || ""),
        notas: String(f[8] || "")
      }))
      .reverse();

    return {
      producto: nombreProd,
      sub: subProd,
      movimientos: movimientos
    };

  } catch (e) {
    return { error: e.toString() };
  }
}



function obtenerTodoElHistorico() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('HISTORICO');
    
    // Si la hoja no existe
    if (!sheet) return { error: "La hoja 'HISTORICO' no existe." };

    const lastRow = sheet.getLastRow();
    // Si solo hay encabezados o está vacía
    if (lastRow <= 1) return [];

    const data = sheet.getRange(2, 1, lastRow - 1, 9).getValues();
    
    // Mapeamos y preparamos para ordenar
    let registros = data.map(f => {
      // Intentamos obtener una fecha válida para el ordenamiento
      let fechaBase = f[0] instanceof Date ? f[0] : new Date(f[0]);
      
      return {
        fechaSort: fechaBase.getTime(), // Usamos milisegundos para comparar
        fecha: f[0] instanceof Date ? Utilities.formatDate(f[0], "GMT-6", "dd/MM/yy HH:mm") : String(f[0]),
        tipo: String(f[1] || ""),
        producto: String(f[2] || ""),
        submodelo: String(f[4] || ""),
        unidad: String(f[5] || ""),
        cantidad: f[6] || 0,
        autor: String(f[7] || ""),
        notas: String(f[8] || "")
      };
    });

    // ORDENAR: El más reciente (valor de tiempo más alto) va primero
    registros.sort((a, b) => b.fechaSort - a.fechaSort);

    console.log("Movimientos procesados:", registros.length);
    return registros;

  } catch (e) {
    console.error("Error en obtenerTodoElHistorico: " + e.toString());
    return { error: e.toString() };
  }
}

function obtenerProductos() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('INVENTARIO');
    const fullRange = sheet.getDataRange().getValues();
    if (fullRange.length <= 1) return [];

    const data = fullRange.slice(1).map((fila, index) => {
      const nombreProducto = fila[2] ? String(fila[2]).trim() : "";
      if (!nombreProducto) return null;

      return {
        idFila: index + 2,
        idOrden: String(fila[0] || ""),
        tipo: String(fila[1] || ""),
        producto: nombreProducto,
        marca: String(fila[3] || ""),
        subModelo: String(fila[4] || ""),
        autos: String(fila[5] || ""),
        stockInicial: fila[6] || 0,   // Col G
        salidas: fila[7] || 0,        // Col H
        disponible: fila[8] || 0,     // Col I
        reStockStatus: String(fila[10] || ""),
        movimientos: String(fila[11] || "0 MOVIMIENTOS"),
        periodo: fila[12] instanceof Date 
                 ? Utilities.formatDate(fila[12], "GMT-6", "MMMM yyyy").toUpperCase() 
                 : String(fila[12] || "").toUpperCase(),
        // --- NUEVAS COLUMNAS PARA NOTAS ---
        statusNota: String(fila[13] || ""), // Columna N (PENDIENTE)
        idNotaRelacionada: String(fila[14] || "") // Columna O (id_nota)
      };
    }).filter(item => item !== null);

    return data;
  } catch (e) {
    console.error("Error en obtenerProductos: " + e.message);
    return [];
  }
}



// Asegúrate que al guardar el producto, el submodelo no se pierda
function guardarProducto(datos) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('INVENTARIO');
  const histNuevoSheet = ss.getSheetByName('HISTORICO_ADD_PRIMERINSUMO');
  const mapping = obtenerMappingCategorias();
  
  let prefijo = mapping[datos.tipo.toUpperCase()] || "99";
  let ordenID = prefijo + "-" + datos.marca.toUpperCase().trim() + "-" + datos.subModelo.toUpperCase().trim();

  // 1. Insertar en INVENTARIO
  // Columnas: A:ID, B:Tipo, C:Producto, D:Marca, E:Modelo, F:Autos, G:Total, H:Usados, I:Disp, J:Min, K:?, L:?, M:Periodo
  const nuevaFila = [
    ordenID, 
    datos.tipo.toUpperCase().trim(), 
    datos.producto.trim(), 
    datos.marca.toUpperCase().trim(), 
    datos.subModelo.trim(), 
    datos.autos, 
    datos.cantidad, 
    0,              
    datos.cantidad, 
    datos.minStock,
    "", // Columna K
    "", // Columna L
    datos.periodo // Columna M (Índice 13)
  ];
  
  sheet.appendRow(nuevaFila);

  // 2. REGISTRAR EN HISTORIAL
  histNuevoSheet.appendRow([
    new Date(),
    datos.autor || "Sistema",
    datos.producto.trim() + " (" + datos.periodo + ")", // Añadimos periodo al título para el log
    datos.marca.toUpperCase().trim(),
    datos.subModelo.trim(),
    datos.cantidad,
    datos.minStock
  ]);

  // Ordenar tabla maestra
  sheet.getRange(2, 1, sheet.getLastRow()-1, sheet.getLastColumn()).sort([{column: 1, ascending: true}]);
  
  return { success: true, mensaje: "Producto registrado con periodo: " + datos.periodo };
}


function registrarRetiro(d) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const invSheet = ss.getSheetByName('INVENTARIO');
    const histSheet = ss.getSheetByName('HISTORICO');
    
    const filaInv = parseInt(d.fila);
    if (!filaInv || filaInv <= 1) throw new Error("Fila inválida");

    // 1. Registro de Histórico
    histSheet.appendRow([new Date(), d.tipo, d.producto, d.marca, d.sub, d.unidad, d.cantidad, d.autor, d.notas]);

    // 2. Actualización de Stock
    const rangoStock = invSheet.getRange(filaInv, 8, 1, 2);
    const valores = rangoStock.getValues()[0];
    rangoStock.setValues([[Number(valores[0]) + d.cantidad, Number(valores[1]) - d.cantidad]]);

    // 3. Actualización de Movimientos
    const celdaMov = invSheet.getRange(filaInv, 12);
    const numMov = parseInt(celdaMov.getValue()) || 0;
    celdaMov.setValue((numMov + 1) + " MOVIMIENTOS");

    // FORZAR SINCRONIZACIÓN ANTES DEL RETORNO
    SpreadsheetApp.flush(); 
    return { status: "success", operacion: "retiro" }; 
  } catch (e) {
    throw new Error(e.message);
  }
}


function obtenerMappingCategorias() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('CONFIG_ORDEN_TIPO_PRODUCTO');
  const datos = sheet.getDataRange().getValues();
  let mapping = {};
  for (let i = 1; i < datos.length; i++) { mapping[datos[i][0].toString().toUpperCase()] = datos[i][1].toString(); }
  return mapping;
}




function obtenerAutosParaSelect() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('MODELOS_UNIDADES'); // Asegúrate que el nombre coincida
  const values = sheet.getRange("A2:A" + sheet.getLastRow()).getValues();
  
  // Convertimos la matriz en un arreglo simple y filtramos celdas vacías
  return values.flat().filter(item => item !== "");
}



function agregarStock(d) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const invSheet = ss.getSheetByName('INVENTARIO');
    const addSheet = ss.getSheetByName('ADD_INSUMOS');
    
    const filaInv = parseInt(d.fila);
    const rango = invSheet.getRange(filaInv, 7, 1, 3); 
    const valores = rango.getValues()[0];
    
    let totalActual = Number(valores[0]) || 0;
    let usadosActual = Number(valores[1]) || 0;
    let cantidadAAgregar = Number(d.cantidad) || 0;
    
    let nuevoTotal = totalActual + cantidadAAgregar;
    let nuevoDisponible = nuevoTotal - usadosActual;
    
    invSheet.getRange(filaInv, 7).setValue(nuevoTotal);
    invSheet.getRange(filaInv, 9).setValue(nuevoDisponible);
    
    addSheet.appendRow([new Date(), d.autor, d.producto, totalActual, cantidadAAgregar, nuevoTotal, d.notas]);
    
    SpreadsheetApp.flush();
    return { status: "success", operacion: "carga" };
  } catch (e) {
    throw new Error(e.message);
  }
}


function obtenerProductosParaAgregar() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('INVENTARIO');
  const lastRow = sheet.getLastRow();
  
  if (lastRow <= 1) return [];

  // Leemos solo hasta la columna 9 (I) que es donde está "Disponible"
  // Esto evita cargar columnas innecesarias y acelera la respuesta
  const values = sheet.getRange(2, 1, lastRow - 1, 9).getValues();

  return values.map((fila, index) => {
    // Si la celda de nombre de producto está vacía, saltamos la fila
    if (!fila[2]) return null;

    return {
      idFila: index + 2,
      idOrden: String(fila[0]),
      tipo: fila[1],
      producto: fila[2],
      marca: fila[3],
      subModelo: fila[4],
      disponible: fila[8] || 0
    };
  }).filter(item => item !== null); // Limpiamos las filas vacías
}



function obtenerHistorialCombinado() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const hojaInicial = ss.getSheetByName('HISTORICO_ADD_PRIMERINSUMO');
  const hojaAdd = ss.getSheetByName('ADD_INSUMOS');

  const datosIniciales = hojaInicial.getDataRange().getValues();
  datosIniciales.shift(); 

  const datosAdd = hojaAdd.getDataRange().getValues();
  datosAdd.shift(); 

  // 1. Procesar registros iniciales
  let historialAgrupado = datosIniciales.map(f => {
    // Definimos una clave única de rastreo por Producto + Marca + Submodelo
    const claveTracking = `${f[2]}|${f[3]}|${f[4]}`.toUpperCase().trim();
    
    return {
      fecha: f[0] instanceof Date ? Utilities.formatDate(f[0], "GMT-6", "dd/MM/yy HH:mm") : f[0],
      autor: f[1] || "Desconocido",
      producto: f[2] || "Sin nombre",
      marca: f[3] || "Genérica",
      subModelo: f[4] || "Estándar",
      stockInicial: f[5] || 0,
      stockMinimo: f[6] || 0,
      clave: claveTracking,
      reabastecimientos: [] 
    };
  });

  // 2. Adjuntar los ADD_INSUMOS
  datosAdd.forEach(f => {
    // La hoja ADD_INSUMOS guarda en Col C: "PRODUCTO | MARCA - SUBMODELO"
    // Reconstruimos para comparar
    const logMovimiento = f[2].toString().toUpperCase().trim();

    historialAgrupado.forEach(original => {
      const matchLabel = `${original.producto} | ${original.marca} - ${original.subModelo}`.toUpperCase().trim();

      if (logMovimiento === matchLabel) {
        original.reabastecimientos.push({
          fecha: f[0] instanceof Date ? Utilities.formatDate(f[0], "GMT-6", "dd/MM/yy HH:mm") : f[0],
          autor: f[1] || "N/A",
          cantInicial: f[3] || 0,
          cantAgregada: f[4] || 0,
          cantFinal: f[5] || 0,
          notas: f[6] || ""
        });
      }
    });
  });

  return historialAgrupado.reverse(); 
}
// ESTO VA EN EL ARCHIVO .GS
function exportarHistorialPDF() {
  // Aquí llamamos a la función que ya tienes en el servidor para traer los datos
  const datos = obtenerHistorialCombinado(); 
  
  let html = `
    <html>
      <head>
        <style>
          body { font-family: sans-serif; padding: 20px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; font-size: 10px; text-align: left; }
          th { background-color: #0f172a; color: white; text-transform: uppercase; }
          h2 { color: #1a73e8; border-bottom: 2px solid #1a73e8; padding-bottom: 10px; }
          .reab-row { background-color: #f8fafc; color: #475569; font-size: 9px; }
          .badge { font-weight: bold; color: #16a34a; }
        </style>
      </head>
      <body>
        <h2>REPORTE DE AUDITORÍA DE INVENTARIO - MEX 2026</h2>
        <table>
          <thead>
            <tr>
              <th>Fecha Registro</th>
              <th>Producto / Insumo</th>
              <th>Marca/Modelo</th>
              <th>Autor</th>
              <th>Stock Inicial</th>
            </tr>
          </thead>
          <tbody>`;

  datos.forEach(item => {
    html += `
      <tr>
        <td>${item.fecha}</td>
        <td><b>${item.producto}</b></td>
        <td>${item.marca} - ${item.subModelo}</td>
        <td>${item.autor}</td>
        <td>${item.stockInicial} pzas</td>
      </tr>`;
    
    if (item.reabastecimientos && item.reabastecimientos.length > 0) {
      item.reabastecimientos.forEach(r => {
        html += `
          <tr class="reab-row">
            <td colspan="2" style="padding-left: 20px;">↳ CARGA EXTRA: ${r.fecha}</td>
            <td colspan="2">Responsable: ${r.autor} | Notas: ${r.notas}</td>
            <td><span class="badge">+${r.cantAgregada}</span> (Final: ${r.cantFinal})</td>
          </tr>`;
      });
    }
  });

  html += `</tbody></table></body></html>`;

  // El servidor crea el blob y lo convierte a Base64 para enviarlo al navegador
  const blob = Utilities.newBlob(html, 'text/html', 'temp.html');
  const pdf = blob.getAs('application/pdf').setName('Reporte_Auditoria_Insumos.pdf');
  
  return "data:application/pdf;base64," + Utilities.base64Encode(pdf.getBytes());
}
// Función para abrir este modal desde el menú
function abrirHistorialInsumos() {
  const html = HtmlService.createHtmlOutputFromFile('FormHistorialInsumos').setWidth(700).setHeight(600);
  SpreadsheetApp.getUi().showModalDialog(html, ' ');
}


/**
 * Inserta un nuevo modelo de auto en la hoja MODELOS_UNIDADES
 */
function insertarNuevoModeloAuto(nuevoModelo) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('MODELOS_UNIDADES');
  const modeloLimpio = nuevoModelo.toUpperCase().trim();
  
  // Verificar si ya existe para evitar duplicados
  const valores = sheet.getRange("A2:A" + sheet.getLastRow()).getValues().flat();
  if (valores.includes(modeloLimpio)) return { success: false, msg: "El modelo ya existe" };
  
  sheet.appendRow([modeloLimpio]);
  return { success: true, modelo: modeloLimpio };
}



function registrarReingreso(d) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const invSheet = ss.getSheetByName('INVENTARIO');
  const histSheet = ss.getSheetByName('HISTORICO');
  const filaInv = parseInt(d.idFila); // Usamos la fila enviada desde el buscador

  if (!filaInv) throw new Error("No se especificó la fila del producto.");

  // 1. Manejo de Fecha Robusto (Evita el desfase de 1 día)
  const fechaObj = d.fecha ? new Date(d.fecha + "T12:00:00") : new Date();

  // 2. Registro en Histórico
  // Formato: Fecha | Tipo | Producto | Marca | Sub | Referencia | Cantidad | Autor | Notas
  histSheet.appendRow([
    fechaObj, 
    "RE-INGRESO", 
    d.producto, 
    d.marca || "", 
    d.sub || "", 
    "RETORNO: " + d.unidad, 
    d.cantidad, 
    d.autor, 
    "MOTIVO: " + d.notas
  ]);

  // 3. Actualizar Stock (Basado en tu lógica H=Usados, I=Disponible)
  const rangoStock = invSheet.getRange(filaInv, 8, 1, 2); 
  const valores = rangoStock.getValues()[0];
  
  const usadosActual = Number(valores[0]) || 0;
  const dispActual = Number(valores[1]) || 0;

  // Solo restamos de "Usados" si hay de donde restar, para no tener negativos
  const nuevosUsados = Math.max(0, usadosActual - d.cantidad);
  const nuevosDisp = dispActual + d.cantidad;

  rangoStock.setValues([[nuevosUsados, nuevosDisp]]);

  // 4. Actualizar contador de movimientos (Solo número para poder sumar después)
const celdaMov = invSheet.getRange(filaInv, 12);
const valorActual = celdaMov.getValue().toString();
const numMov = parseInt(valorActual.split(" ")[0]) || 0;
celdaMov.setValue((numMov + 1) + " MOVIMIENTOS");


SpreadsheetApp.flush();
  return true;
}


/**
 * Nueva función que devuelve el HTML como texto para evitar bloqueos de ventanas
 */
function generarReporteHTML(tipoHoja) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(tipoHoja);
  if (!sheet) throw new Error("La hoja '" + tipoHoja + "' no existe.");

  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  let colorTema = "#1a73e8"; 
  let cardsHtml = "";

  if (tipoHoja === 'INVENTARIO') colorTema = "#2e7d32";
  else if (tipoHoja === 'HISTORICO_ADD_PRIMERINSUMO') colorTema = "#ef6c00";
  else if (tipoHoja === 'ADD_INSUMOS') colorTema = "#1565c0";
  else if (tipoHoja === 'HISTORICO') colorTema = "#c62828";

  for (let i = 1; i < values.length; i++) {
    if (!values[i][2]) continue; 

    // Limpieza de caracteres raros (â€¢) preventivo en todas las columnas
    const filaLimpia = values[i].map(val => 
      typeof val === 'string' ? val.replace(/[^\x20-\x7E\u00C0-\u00FF]/g, ' ').trim() : val
    );

    if (tipoHoja === 'INVENTARIO') {
      // CORRECCIÓN DE ÍNDICE: DISPONIBLE es columna I (índice 8)
      cardsHtml += `
        <div class="card card-compact">
          <div class="card-header">
            <div class="title-section">
              <span class="type-tag">${filaLimpia[1]}</span>
              <div class="main-title">${filaLimpia[2]}</div>
              <div class="sub-title">${filaLimpia[3]} | ${filaLimpia[4]}</div>
            </div>
            <div class="badge badge-stock">${filaLimpia[8]} DISP.</div>
          </div>
          <div class="card-footer-simple">AUTOS: ${filaLimpia[5] || 'GENERAL'} | MOVIMIENTOS: ${filaLimpia[11] || 0}</div>
        </div>`;

    }
    
    else if (tipoHoja === 'HISTORIAL_NOTAS_PENDIENTES') {
  colorTema = "#37474f";
  cardsHtml += `
    <div class="card card-compact" style="border-left-color: ${filaLimpia[5] === 'PENDIENTE' ? '#d93025' : '#1e8e3e'}">
      <div class="card-header">
        <div class="title-section">
          <div class="main-title">${filaLimpia[3]} (UNIDAD)</div>
          <div class="meta-text">Creado por: ${filaLimpia[2]} | ${Utilities.formatDate(filaLimpia[1], "GMT-6", "dd/MM/yy")}</div>
        </div>
        <div class="badge" style="background:${filaLimpia[5] === 'PENDIENTE' ? '#fce8e6' : '#e6f4ea'}">${filaLimpia[5]}</div>
      </div>
      <div style="padding: 10px 18px; font-size: 0.9rem;">
        <b>Nota:</b> ${filaLimpia[4]}
        ${filaLimpia[8] ? `<div class="notes-box"><b>Solución:</b> ${filaLimpia[8]} <br><small>Por: ${filaLimpia[7]}</small></div>` : ''}
      </div>
    </div>`;
}
     else if (tipoHoja === 'HISTORICO_ADD_PRIMERINSUMO') {
      cardsHtml += `
        <div class="card card-minimal">
          <div class="minimal-grid">
            <div class="min-date">${Utilities.formatDate(filaLimpia[0], "GMT-6", "dd/MM/yy")}</div>
            <div class="min-title"><b>${filaLimpia[2]}</b> <small>${filaLimpia[3]}</small></div>
            <div class="min-stock">INI: ${filaLimpia[5]}</div>
            <div class="min-user">${filaLimpia[1]}</div>
          </div>
        </div>`;

    } else if (tipoHoja === 'ADD_INSUMOS') {
      // Diseño detallado: Muestra flujo de stock
      cardsHtml += `
        <div class="card">
          <div class="card-header">
            <div class="title-section">
              <div class="main-title">${filaLimpia[2]}</div>
              <p class="meta-text"><i class="material-icons">person</i> ${filaLimpia[1]} | <i class="material-icons">event</i> ${Utilities.formatDate(filaLimpia[0], "GMT-6", "dd/MM/yy HH:mm")}</p>
            </div>
          </div>
          <div class="stock-flow-container">
            <div class="flow-item">
              <label>INICIAL</label>
              <div class="flow-val">${filaLimpia[3]}</div>
            </div>
            <div class="flow-separator"><i class="material-icons">add_circle</i></div>
            <div class="flow-item highlight">
              <label>AGREGADO</label>
              <div class="flow-val">+${filaLimpia[4]}</div>
            </div>
            <div class="flow-separator"><i class="material-icons">trending_flat</i></div>
            <div class="flow-item">
              <label>FINAL</label>
              <div class="flow-val">${filaLimpia[5]}</div>
            </div>
          </div>
          <div class="card-body">
            <div class="notes-box">"${filaLimpia[6] || 'Sin notas'}"</div>
          </div>
        </div>`;

    } else if (tipoHoja === 'HISTORICO') {
      // Salidas: Cantidad con prefijo negativo y diseño compacto
      cardsHtml += `
        <div class="card card-compact">
          <div class="card-header border-none" style="padding-bottom:5px">
            <div class="title-section">
              <div class="main-title-small">${filaLimpia[2]} <small>| ${filaLimpia[4]}</small></div>
              <div class="sub-title">${Utilities.formatDate(filaLimpia[0], "GMT-6", "dd/MM/yy HH:mm")} | DESTINO: ${filaLimpia[5]}</div>
            </div>
            <div class="badge badge-neg">-${filaLimpia[6]} PZAS</div>
          </div>
          <div class="card-footer-simple">AUTORIZA: ${filaLimpia[7]} | NOTAS: ${filaLimpia[8]}</div>
        </div>`;
    }
  }

  // Se añade meta charset para asegurar la codificación correcta
  return `
    <html>
    <head>
      <meta charset="UTF-8">
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
      <style>
        :root { --tema: ${colorTema}; }
        body { font-family: 'Segoe UI', sans-serif; background: #f0f2f5; margin: 0; padding: 0; }
        .container { max-width: 850px; margin: 20px auto; padding-bottom: 80px; }
        .header-print { background: var(--tema); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
        .card { background: white; border-radius: 8px; margin-bottom: 12px; border-left: 5px solid var(--tema); box-shadow: 0 1px 3px rgba(0,0,0,0.1); overflow: hidden; page-break-inside: avoid; }
        .card-header { padding: 12px 18px; display: flex; justify-content: space-between; align-items: center; }
        .main-title { font-weight: bold; font-size: 1rem; }
        .main-title-small { font-weight: bold; font-size: 0.9rem; }
        .meta-text { font-size: 0.75rem; color: #777; display: flex; align-items: center; gap: 5px; margin: 4px 0 0 0; }
        .meta-text i { font-size: 12px; }
        .badge { padding: 4px 10px; border-radius: 4px; font-weight: bold; font-size: 0.75rem; }
        .badge-stock { background: #e8f5e9; color: #2e7d32; border: 1px solid #c8e6c9; }
        .badge-neg { background: #ffebee; color: #c62828; }
        .stock-flow-container { display: flex; justify-content: space-around; background: #f8f9fa; padding: 10px; border-top: 1px solid #eee; }
        .flow-item { text-align: center; }
        .flow-item label { display: block; font-size: 0.6rem; color: #999; font-weight: bold; }
        .flow-val { font-size: 1.1rem; font-weight: bold; color: #444; }
        .highlight .flow-val { color: var(--tema); }
        .flow-separator { display: flex; align-items: center; color: #ccc; }
        .card-compact { border-left-width: 3px; }
        .card-footer-simple { background: #fafafa; padding: 6px 18px; font-size: 0.7rem; color: #888; border-top: 1px solid #f0f0f0; }
        .type-tag { font-size: 0.6rem; color: var(--tema); font-weight: bold; text-transform: uppercase; }
        .card-minimal { padding: 10px 18px; }
        .minimal-grid { display: grid; grid-template-columns: 80px 1fr 100px 100px; align-items: center; gap: 10px; font-size: 0.8rem; }
        .min-date { color: #999; }
        .min-stock { color: var(--tema); font-weight: bold; text-align: right; }
        .notes-box { font-style: italic; font-size: 0.8rem; color: #666; border-left: 2px solid #ddd; padding-left: 10px; margin: 5px 0; }
        .fab { position: fixed; bottom: 30px; right: 30px; background: #1a73e8; color: white; width: 56px; height: 56px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.3); cursor: pointer; border: none; }
        @media print {
          body { background: white; }
          .container { max-width: 100%; margin: 0; }
          .fab { display: none; }
          .card { border: 1px solid #eee; border-left: 4px solid var(--tema); box-shadow: none; }
          @page { margin: 1cm; size: portrait; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header-print">
          <h3 style="margin:0">REPORTE DE ${tipoHoja.replace(/_/g, ' ')}</h3>
          <small>Inventario Insumos 2026</small>
        </div>
        ${cardsHtml}
      </div>
      <button class="fab" onclick="window.print()"><i class="material-icons">print</i></button>
    </body>
    </html>`;
}







// sistema de notas

function abrirNotasAlertas() {
  const html = HtmlService.createHtmlOutputFromFile('FormNotas')
    .setWidth(800)
    .setHeight(700);
  SpreadsheetApp.getUi().showModalDialog(html, ' ');
}

function obtenerNotasHistorial() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('HISTORIAL_NOTAS_PENDIENTES');
    if (!sheet) return [];

    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) return [];

    // Mapeo exacto para que coincida con el renderizarNotas del HTML
    return data.slice(1).map((f, index) => ({
      idFila: index + 2,
      // Según tu sheetNotas.appendRow([idNota, fecha, autor, unidad, nota, estado...])
      idNota: f[0], 
      fecha: f[1] instanceof Date ? Utilities.formatDate(f[1], "GMT-6", "dd/MM/yy") : String(f[1]),
      autor: f[2],
      unidad: f[3], // El nombre del producto o título externo
      nota: f[4],   // El cuerpo del mensaje
      estado: f[5] || 'PENDIENTE',
      fechaRes: f[6] instanceof Date ? Utilities.formatDate(f[6], "GMT-6", "dd/MM/yy") : "",
      autorRes: f[7],
      solucion: f[8]
    })).reverse(); 
  } catch (e) {
    return [];
  }
}
function crearNuevaNota(d) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetNotas = ss.getSheetByName('HISTORIAL_NOTAS_PENDIENTES');
  const invSheet = ss.getSheetByName('INVENTARIO');
  const idNota = "NOT-" + new Date().getTime();
  
  sheetNotas.appendRow([idNota, new Date(), d.autor, d.unidad, d.nota, "PENDIENTE", "", "", ""]);

  if (d.idOrden) {
    const ids = invSheet.getRange("A:A").getValues().flat();
    const fila = ids.indexOf(d.idOrden) + 1;
    if (fila > 0) {
      invSheet.getRange(fila, 14).setValue("PENDIENTE"); // Col N
      invSheet.getRange(fila, 15).setValue(idNota);      // Col O
    }
  }
  return { success: true };
}
// Resolver una nota existente
function resolverNota(d) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('HISTORIAL_NOTAS_PENDIENTES');
  sheet.getRange(d.idFila, 6, 1, 4).setValues([["RESUELTO", new Date(), d.autorRes, d.solucion]]);
  return { success: true };
}


function resolverNotaServidor(idNota, autor, solucion) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const hoja = ss.getSheetByName("HISTORIAL_NOTAS_PENDIENTES");
  const datos = hoja.getDataRange().getValues();
  
  for (let i = 1; i < datos.length; i++) {
    if (datos[i][0] === idNota) {
      const fila = i + 1;
      hoja.getRange(fila, 6).setValue("RESUELTO"); // Columna F: ESTADO
      hoja.getRange(fila, 7).setValue(new Date()); // Columna G: FECHA_RESUELTO
      hoja.getRange(fila, 8).setValue(autor);      // Columna H: AUTOR_RESOLVIO
      hoja.getRange(fila, 9).setValue(solucion);   // Columna I: COMO_SE_RESOLVIO
      break;
    }
  }
  // Aquí podrías agregar lógica para limpiar la celda de la hoja INVENTARIO si lo deseas
}


function obtenerListaProductosSimplificada() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('INVENTARIO');
    const data = sheet.getDataRange().getValues();
    
    // Mapeamos solo Nombre (Col C) e ID (Col A)
    return data.slice(1).map(f => ({
      idOrden: String(f[0] || ""),
      nombre: `${f[2]} | ${f[4]}` // Producto + Submodelo para identificar mejor
    })).filter(p => p.nombre.trim() !== "");
  } catch (e) {
    return [];
  }
}


/**
 * Busca una nota específica por ID y la muestra en el modal.
 * Se activa automáticamente si el usuario entra desde el link del inventario.
 */


/**
 * Busca en el historial de notas la fila que coincida con el ID generado.
 */
function obtenerDetalleNotaPorId(idNota) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('HISTORIAL_NOTAS_PENDIENTES');
    const data = sheet.getDataRange().getValues();
    
    // Buscamos la fila que coincida con el idNota (Columna A)
    const filaNota = data.find(f => f[0] === idNota);
    
    if (filaNota) {
      return {
        success: true,
        idNota: filaNota[0],
        fecha: Utilities.formatDate(filaNota[1], "GMT-6", "dd/MM/yy"),
        autor: filaNota[2],
        unidad: filaNota[3],
        nota: filaNota[4],
        estado: filaNota[5],
        idFila: data.indexOf(filaNota) + 1 // Para poder resolverla después
      };
    }
    return { success: false, error: "Nota no encontrada" };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}


function abrirModalVerNota(idNota) {
  try {
    const html = HtmlService.createTemplateFromFile('FormVerNota');
    html.idNota = idNota; // Asegúrate de que esta variable coincida con <?= idNota ?> en tu HTML
    
    const interface = html.evaluate()
      .setWidth(450)
      .setHeight(600)
      .setSandboxMode(HtmlService.SandboxMode.IFRAME);
      
    SpreadsheetApp.getUi().showModalDialog(interface, "Detalle de Nota");
  } catch (err) {
    // Si hay un error, esto te avisará en la pantalla de Excel
    SpreadsheetApp.getUi().alert("Error al abrir: " + err.message);
  }
}












function obtenerProductosSalida() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('INVENTARIO');
    const fullRange = sheet.getDataRange().getValues();
    if (fullRange.length <= 1) return [];

    // Filtramos y mapeamos solo los datos esenciales para una salida
    return fullRange.slice(1).map((fila, index) => {
      const nombreProducto = fila[2] ? String(fila[2]).trim() : "";
      
      // Si no hay nombre de producto, ignoramos la fila
      if (!nombreProducto) return null;

      return {
        idFila: index + 2,            // Necesario para saber dónde escribir la salida
        idOrden: String(fila[0] || ""),
        tipo: String(fila[1] || ""),
        producto: nombreProducto,
        marca: String(fila[3] || ""),
        subModelo: String(fila[4] || ""),
        disponible: Number(fila[8] || 0) // Columna I: Lo único vital es saber cuánto hay
      };
    }).filter(item => item !== null);

  } catch (e) {
    Logger.log("Error en obtenerProductosSalida: " + e.message);
    return [];
  }
}



function obtenerProductosReingreso() {
  return obtenerBaseLigera(); // Función auxiliar para no repetir código
}

function obtenerProductosAgregarStock() {
  return obtenerBaseLigera();
}

// Función auxiliar para traer solo lo esencial (Producto, Marca, Submodelo, Fila)
function obtenerBaseLigera() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('INVENTARIO');
    const fullRange = sheet.getDataRange().getValues();
    return fullRange.slice(1).map((fila, index) => {
      const nombre = fila[2] ? String(fila[2]).trim() : "";
      if (!nombre) return null;
      return {
        idFila: index + 2,
        producto: nombre,
        marca: String(fila[3] || ""),
        subModelo: String(fila[4] || ""),
        disponible: Number(fila[8] || 0)
      };
    }).filter(item => item !== null);
  } catch (e) { return []; }
}

