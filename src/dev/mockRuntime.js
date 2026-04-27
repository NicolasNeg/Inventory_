(function () {
  function shouldUseMock() {
    if (window.google && window.google.script && window.google.script.run) return false;
    var query = new URLSearchParams(window.location.search);
    var forced = query.get("mock") === "1";
    var isLocalHost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    var isFileProtocol = window.location.protocol === "file:";
    var isGithubPages = window.location.hostname.endsWith("github.io");
    return forced || isLocalHost || isFileProtocol || isGithubPages;
  }

  if (!shouldUseMock()) return;

  var productsFixture = [
    { idFila: 2, idOrden: "01-FRAM-PH3614", tipo: "FILTROS", producto: "FILTRO DE ACEITE", marca: "FRAM", subModelo: "PH3614", autos: "VERSA,MARCH", stockInicial: 24, salidas: 8, disponible: 16, reStockStatus: "", movimientos: "8 MOVIMIENTOS", periodo: "ABRIL 2026", statusNota: "", idNotaRelacionada: "" },
    { idFila: 3, idOrden: "02-BOSCH-0986", tipo: "FRENOS", producto: "BALATAS DELANTERAS", marca: "BOSCH", subModelo: "0986", autos: "SENTRA", stockInicial: 10, salidas: 9, disponible: 1, reStockStatus: "PEDIR STOCK", movimientos: "12 MOVIMIENTOS", periodo: "ABRIL 2026", statusNota: "PENDIENTE", idNotaRelacionada: "NOT-1711110000000" }
  ];
  var movementsFixture = [
    { fecha: "25/04/26 10:30", tipo: "SALIDA", producto: "FILTRO DE ACEITE", submodelo: "PH3614", unidad: "D-4994", cantidad: 2, autor: "JORGE LUGO", notas: "MANTENIMIENTO PROGRAMADO" }
  ];
  var detailMap = {
    ph3614: { producto: "FILTRO DE ACEITE", sub: "FRAM | PH3614", movimientos: [{ fecha: "25/04/26 10:30", unidad: "D-4994", cantidad: 2, autor: "JORGE LUGO", notas: "MANTENIMIENTO PROGRAMADO" }] },
    "0986": { producto: "BALATAS DELANTERAS", sub: "BOSCH | 0986", movimientos: [{ fecha: "24/04/26 17:10", unidad: "SENTRA 21", cantidad: 1, autor: "ANGEL ARMENTA", notas: "CAMBIO DE BALATAS" }] }
  };
  var historyFixture = [
    { fecha: "20/04/26 09:00", autor: "OSVALDO SALAZAR", producto: "FILTRO DE ACEITE", marca: "FRAM", subModelo: "PH3614", stockInicial: 20, stockMinimo: 5, clave: "FILTRO DE ACEITE|FRAM|PH3614", reabastecimientos: [{ fecha: "23/04/26 08:00", autor: "JORGE LUGO", cantInicial: 20, cantAgregada: 4, cantFinal: 24, notas: "AJUSTE DE STOCK" }] }
  ];
  var notesFixture = [
    { idFila: 2, idNota: "NOT-1711110000000", fecha: "24/04/26", autor: "ANGEL ARMENTA", unidad: "BALATAS DELANTERAS | 0986", nota: "Validar proveedor alterno", estado: "PENDIENTE", fechaRes: "", autorRes: "", solucion: "" }
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
    console.warn("[MOCK] '" + name + "' simula escritura. No se escribira en base real.");
  }

  function fetchPartial(name) {
    var file = partialMap[name] || (name + ".html");
    var partialUrl = new URL(file, window.location.href);
    return fetch(partialUrl.toString()).then(function (response) {
      if (!response.ok) throw new Error("No se pudo cargar la vista parcial: " + file);
      return response.text();
    });
  }

  function executeMock(method, args) {
    switch (method) {
      case "cargarVistaParcial": return fetchPartial(String(args[0] || "inventario"));
      case "obtenerProductos": return Promise.resolve(productsFixture);
      case "obtenerMovimientosPorId": {
        var key = String(args[0] || "").trim().toLowerCase();
        return Promise.resolve(detailMap[key] || { producto: "Producto", sub: String(args[0] || ""), movimientos: [] });
      }
      case "obtenerTodoElHistorico": return Promise.resolve(movementsFixture);
      case "obtenerHistorialCombinado": return Promise.resolve(historyFixture);
      case "obtenerNotasHistorial": return Promise.resolve(notesFixture);
      case "guardarProducto": warnWrite(method); return Promise.resolve({ success: true, mensaje: "MOCK: Producto simulado correctamente." });
      case "registrarRetiro": warnWrite(method); return Promise.resolve({ status: "success", operacion: "retiro" });
      case "registrarReingreso": warnWrite(method); return Promise.resolve(true);
      case "agregarStock": warnWrite(method); return Promise.resolve({ status: "success", operacion: "carga" });
      case "crearNuevaNota": warnWrite(method); return Promise.resolve({ success: true });
      case "resolverNota": warnWrite(method); return Promise.resolve({ success: true });
      default: return Promise.reject(new Error("[MOCK] Metodo no implementado: " + method));
    }
  }

  var onSuccess = function () {};
  var onFailure = function () {};
  var api = {
    withSuccessHandler: function (handler) { onSuccess = handler || function () {}; return proxy; },
    withFailureHandler: function (handler) { onFailure = handler || function () {}; return proxy; }
  };

  var proxy = new Proxy(api, {
    get: function (target, prop) {
      if (prop in target) return target[prop];
      return function () {
        var args = Array.prototype.slice.call(arguments);
        executeMock(String(prop), args).then(onSuccess).catch(onFailure);
      };
    }
  });

  window.google = {
    script: {
      run: proxy,
      host: {
        close: function () {
          console.warn("[MOCK] google.script.host.close() sin efecto en entorno local.");
        }
      }
    }
  };
})();
