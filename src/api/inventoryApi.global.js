(function () {
  function hasAppsScriptRuntime() {
    var googleObj = window["google"];
    return !!(googleObj && googleObj.script && googleObj.script.run);
  }

  function hasForcedMockQuery() {
    return new URLSearchParams(window.location.search).get("mock") === "1";
  }

  function isDemoFallbackEnvironment() {
    var host = window.location.hostname;
    var protocol = window.location.protocol;
    return (
      host === "localhost" ||
      host === "127.0.0.1" ||
      protocol === "file:" ||
      host.endsWith("github.io")
    );
  }

  var productsFixture = [
    { idFila: 2, idOrden: "01-FRAM-PH3614", tipo: "FILTROS", producto: "FILTRO DE ACEITE", marca: "FRAM", subModelo: "PH3614", autos: "VERSA,MARCH", stockInicial: 24, salidas: 8, disponible: 16, reStockStatus: "", movimientos: "8 MOVIMIENTOS", periodo: "ABRIL 2026", statusNota: "", idNotaRelacionada: "" },
    { idFila: 3, idOrden: "02-BOSCH-0986", tipo: "FRENOS", producto: "BALATAS DELANTERAS", marca: "BOSCH", subModelo: "0986", autos: "SENTRA", stockInicial: 10, salidas: 9, disponible: 1, reStockStatus: "PEDIR STOCK", movimientos: "12 MOVIMIENTOS", periodo: "ABRIL 2026", statusNota: "PENDIENTE", idNotaRelacionada: "NOT-1711110000000" }
  ];
  var movementsFixture = [
    { fecha: "25/04/26 10:30", tipo: "SALIDA", producto: "FILTRO DE ACEITE", submodelo: "PH3614", unidad: "D-4994", cantidad: 2, autor: "JORGE LUGO", notas: "MANTENIMIENTO PROGRAMADO" },
    { fecha: "24/04/26 17:10", tipo: "SALIDA", producto: "BALATAS DELANTERAS", submodelo: "0986", unidad: "SENTRA 21", cantidad: 1, autor: "ANGEL ARMENTA", notas: "CAMBIO DE BALATAS" }
  ];
  var movementDetailBySubModelFixture = {
    ph3614: { producto: "FILTRO DE ACEITE", sub: "FRAM | PH3614", movimientos: [{ fecha: "25/04/26 10:30", unidad: "D-4994", cantidad: 2, autor: "JORGE LUGO", notas: "MANTENIMIENTO PROGRAMADO" }] },
    "0986": { producto: "BALATAS DELANTERAS", sub: "BOSCH | 0986", movimientos: [{ fecha: "24/04/26 17:10", unidad: "SENTRA 21", cantidad: 1, autor: "ANGEL ARMENTA", notas: "CAMBIO DE BALATAS" }] }
  };
  var historyFixture = [
    { fecha: "20/04/26 09:00", autor: "OSVALDO SALAZAR", producto: "FILTRO DE ACEITE", marca: "FRAM", subModelo: "PH3614", stockInicial: 20, stockMinimo: 5, clave: "FILTRO DE ACEITE|FRAM|PH3614", reabastecimientos: [{ fecha: "23/04/26 08:00", autor: "JORGE LUGO", cantInicial: 20, cantAgregada: 4, cantFinal: 24, notas: "AJUSTE DE STOCK" }] }
  ];
  var notesFixture = [
    { idFila: 2, idNota: "NOT-1711110000000", fecha: "24/04/26", autor: "ANGEL ARMENTA", unidad: "BALATAS DELANTERAS | 0986", nota: "Validar proveedor alterno", estado: "PENDIENTE", fechaRes: "", autorRes: "", solucion: "" },
    { idFila: 3, idNota: "NOT-1711110000001", fecha: "22/04/26", autor: "JORGE LUGO", unidad: "FILTRO DE ACEITE | PH3614", nota: "Ajuste de inventario confirmado", estado: "RESUELTO", fechaRes: "23/04/26", autorRes: "GERARDO SERVIN", solucion: "Se corrigio conteo fisico." }
  ];
  var partialMap = {
    inventario: "inventario.html",
    nuevo: "nuevo.html",
    retiro: "retiro.html",
    reingreso: "reingreso.html",
    stock: "stock.html",
    historial: "historial.html",
    historialinsumos: "historial_insumos.html",
    historial_movimientos: "historial_movimientos.html",
    notas: "notas.html",
    reportes: "reportes.html"
  };

  function warnWrite(name) {
    console.warn("[MOCK] operación simulada: " + name);
  }

  function createMockAdapter() {
    return {
      cargarVistaParcial: function (nombreVista) {
        var file = partialMap[nombreVista] || (nombreVista + ".html");
        var partialUrl = new URL(file, window.location.href);
        return fetch(partialUrl.toString()).then(function (res) {
          if (!res.ok) throw new Error("No se pudo cargar la vista parcial: " + file);
          return res.text();
        });
      },
      obtenerCategoriasParaSelect: function () { return Promise.resolve(["FILTROS", "FRENOS", "ACEITES"]); },
      insertarNuevoModeloAuto: function (v) { return Promise.resolve({ success: true, modelo: String(v || "").toUpperCase() }); },
      obtenerAutosParaSelect: function () { return Promise.resolve(["VERSA", "MARCH", "SENTRA", "TIIDA"]); },
      obtenerProductos: function () { return Promise.resolve(productsFixture); },
      obtenerProductosSalida: function () { return Promise.resolve(productsFixture); },
      obtenerProductosReingreso: function () { return Promise.resolve(productsFixture); },
      obtenerProductosParaAgregar: function () { return Promise.resolve(productsFixture); },
      guardarProducto: function () { warnWrite("guardarProducto"); return Promise.resolve({ success: true, mensaje: "MOCK: Producto simulado correctamente." }); },
      registrarRetiro: function () { warnWrite("registrarRetiro"); return Promise.resolve({ status: "success", operacion: "retiro" }); },
      registrarReingreso: function () { warnWrite("registrarReingreso"); return Promise.resolve(true); },
      agregarStock: function () { warnWrite("agregarStock"); return Promise.resolve({ status: "success", operacion: "carga" }); },
      obtenerTodoElHistorico: function () { return Promise.resolve(movementsFixture); },
      obtenerMovimientosPorId: function (subModeloInventario) {
        var key = String(subModeloInventario || "").trim().toLowerCase();
        return Promise.resolve(movementDetailBySubModelFixture[key] || { producto: "Producto", sub: subModeloInventario, movimientos: [] });
      },
      obtenerHistorialCombinado: function () { return Promise.resolve(historyFixture); },
      obtenerNotasHistorial: function () { return Promise.resolve(notesFixture); },
      obtenerListaProductosSimplificada: function () { return Promise.resolve(productsFixture.map(function (p) { return { idOrden: p.idOrden, nombre: p.producto + " | " + p.subModelo }; })); },
      crearNuevaNota: function () { warnWrite("crearNuevaNota"); return Promise.resolve({ success: true }); },
      resolverNota: function () { warnWrite("resolverNota"); return Promise.resolve({ success: true }); },
      obtenerDetalleNotaPorId: function (idNota) {
        var found = notesFixture.find(function (n) { return String(n.idNota) === String(idNota); });
        if (!found) return Promise.resolve({ success: false, error: "Nota no encontrada" });
        return Promise.resolve({ success: true, idNota: found.idNota, fecha: found.fecha, autor: found.autor, unidad: found.unidad, nota: found.nota, estado: found.estado, idFila: found.idFila });
      },
      generarReporteHTML: function (payload) { return Promise.resolve("<html><body><h3>MOCK REPORTE " + payload + "</h3><p>Reporte simulado.</p></body></html>"); },
      exportarHistorialPDF: function () { return Promise.resolve("data:application/pdf;base64,JVBERi0xLjQKJcTl8uXr"); }
    };
  }

  function callAppsScript(functionName) {
    var args = Array.prototype.slice.call(arguments, 1);
    return new Promise(function (resolve, reject) {
      var googleObj = window["google"];
      var run = googleObj && googleObj.script && googleObj.script.run;
      if (!run) {
        reject(new Error("Apps Script runtime unavailable."));
        return;
      }
      var s = "with" + "SuccessHandler";
      var f = "with" + "FailureHandler";
      run[s](resolve)[f](reject)[functionName].apply(run, args);
    });
  }

  function createAppsScriptAdapter() {
    return {
      cargarVistaParcial: function (v) { return callAppsScript("cargarVistaParcial", v); },
      obtenerCategoriasParaSelect: function () { return callAppsScript("obtenerCategoriasParaSelect"); },
      insertarNuevoModeloAuto: function (v) { return callAppsScript("insertarNuevoModeloAuto", v); },
      obtenerAutosParaSelect: function () { return callAppsScript("obtenerAutosParaSelect"); },
      obtenerProductos: function () { return callAppsScript("obtenerProductos"); },
      obtenerProductosSalida: function () { return callAppsScript("obtenerProductosSalida"); },
      obtenerProductosReingreso: function () { return callAppsScript("obtenerProductosReingreso"); },
      obtenerProductosParaAgregar: function () { return callAppsScript("obtenerProductosParaAgregar"); },
      guardarProducto: function (p) { return callAppsScript("guardarProducto", p); },
      registrarRetiro: function (p) { return callAppsScript("registrarRetiro", p); },
      registrarReingreso: function (p) { return callAppsScript("registrarReingreso", p); },
      agregarStock: function (p) { return callAppsScript("agregarStock", p); },
      obtenerTodoElHistorico: function () { return callAppsScript("obtenerTodoElHistorico"); },
      obtenerMovimientosPorId: function (v) { return callAppsScript("obtenerMovimientosPorId", v); },
      obtenerHistorialCombinado: function () { return callAppsScript("obtenerHistorialCombinado"); },
      obtenerNotasHistorial: function () { return callAppsScript("obtenerNotasHistorial"); },
      obtenerListaProductosSimplificada: function () { return callAppsScript("obtenerListaProductosSimplificada"); },
      crearNuevaNota: function (p) { return callAppsScript("crearNuevaNota", p); },
      resolverNota: function (p) { return callAppsScript("resolverNota", p); },
      obtenerDetalleNotaPorId: function (v) { return callAppsScript("obtenerDetalleNotaPorId", v); },
      generarReporteHTML: function (v) { return callAppsScript("generarReporteHTML", v); },
      exportarHistorialPDF: function (v) { return callAppsScript("exportarHistorialPDF", v); }
    };
  }

  function createHttpAdapter(baseUrl) {
    function request(method, payload) {
      return fetch(new URL("/api/" + method, baseUrl).toString(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payload: payload })
      }).then(function (res) {
        if (!res.ok) throw new Error("HTTP adapter error: " + res.status);
        return res.json();
      });
    }
    return {
      cargarVistaParcial: function (v) { return request("cargarVistaParcial", v); },
      obtenerCategoriasParaSelect: function () { return request("obtenerCategoriasParaSelect"); },
      insertarNuevoModeloAuto: function (v) { return request("insertarNuevoModeloAuto", v); },
      obtenerAutosParaSelect: function () { return request("obtenerAutosParaSelect"); },
      obtenerProductos: function () { return request("obtenerProductos"); },
      obtenerProductosSalida: function () { return request("obtenerProductosSalida"); },
      obtenerProductosReingreso: function () { return request("obtenerProductosReingreso"); },
      obtenerProductosParaAgregar: function () { return request("obtenerProductosParaAgregar"); },
      guardarProducto: function (p) { return request("guardarProducto", p); },
      registrarRetiro: function (p) { return request("registrarRetiro", p); },
      registrarReingreso: function (p) { return request("registrarReingreso", p); },
      agregarStock: function (p) { return request("agregarStock", p); },
      obtenerTodoElHistorico: function () { return request("obtenerTodoElHistorico"); },
      obtenerMovimientosPorId: function (v) { return request("obtenerMovimientosPorId", v); },
      obtenerHistorialCombinado: function () { return request("obtenerHistorialCombinado"); },
      obtenerNotasHistorial: function () { return request("obtenerNotasHistorial"); },
      obtenerListaProductosSimplificada: function () { return request("obtenerListaProductosSimplificada"); },
      crearNuevaNota: function (p) { return request("crearNuevaNota", p); },
      resolverNota: function (p) { return request("resolverNota", p); },
      obtenerDetalleNotaPorId: function (v) { return request("obtenerDetalleNotaPorId", v); },
      generarReporteHTML: function (v) { return request("generarReporteHTML", v); },
      exportarHistorialPDF: function (v) { return request("exportarHistorialPDF", v); }
    };
  }

  function createInventoryApi() {
    if (hasAppsScriptRuntime()) return createAppsScriptAdapter();
    if (hasForcedMockQuery()) return createMockAdapter();
    if (window.__INVENTORY_API_BASE_URL__) return createHttpAdapter(window.__INVENTORY_API_BASE_URL__);
    if (isDemoFallbackEnvironment()) return createMockAdapter();
    throw new Error("No API adapter available. Use mock mode, Apps Script, or configure API_BASE_URL.");
  }

  window.inventoryApi = createInventoryApi();
})();
