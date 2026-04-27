import { historyFixture } from "./fixtures/history.fixture";
import { movementDetailBySubModelFixture, movementsFixture } from "./fixtures/movements.fixture";
import { notesFixture } from "./fixtures/notes.fixture";
import { productsFixture } from "./fixtures/products.fixture";

type SuccessHandler = (data: unknown) => void;
type FailureHandler = (error: Error) => void;

interface MockRun {
  withSuccessHandler(handler: SuccessHandler): MockRun;
  withFailureHandler(handler: FailureHandler): MockRun;
  [method: string]: unknown;
}

const partialMap: Record<string, string> = {
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

async function fetchPartial(name: string): Promise<string> {
  const file = partialMap[name] || `${name}.html`;
  const partialUrl = new URL(file, window.location.href);
  const response = await fetch(partialUrl.toString());
  if (!response.ok) throw new Error(`No se pudo cargar la vista parcial: ${file}`);
  return response.text();
}

function warnWrite(name: string): void {
  console.warn(`[MOCK] '${name}' simula escritura. No se escribira en base real.`);
}

function executeMock(method: string, args: unknown[]): Promise<unknown> {
  switch (method) {
    case "cargarVistaParcial":
      return fetchPartial(String(args[0] || "inventario"));
    case "obtenerProductos":
      return Promise.resolve(productsFixture);
    case "obtenerMovimientosPorId": {
      const key = String(args[0] || "").trim().toLowerCase();
      return Promise.resolve(
        movementDetailBySubModelFixture[key] || { producto: "Producto", sub: String(args[0] || ""), movimientos: [] }
      );
    }
    case "obtenerTodoElHistorico":
      return Promise.resolve(movementsFixture);
    case "obtenerHistorialCombinado":
      return Promise.resolve(historyFixture);
    case "obtenerNotasHistorial":
      return Promise.resolve(notesFixture);

    case "guardarProducto":
      warnWrite(method);
      return Promise.resolve({ success: true, mensaje: "MOCK: Producto simulado correctamente." });
    case "registrarRetiro":
      warnWrite(method);
      return Promise.resolve({ status: "success", operacion: "retiro" });
    case "registrarReingreso":
      warnWrite(method);
      return Promise.resolve(true);
    case "agregarStock":
      warnWrite(method);
      return Promise.resolve({ status: "success", operacion: "carga" });
    case "crearNuevaNota":
      warnWrite(method);
      return Promise.resolve({ success: true });
    case "resolverNota":
      warnWrite(method);
      return Promise.resolve({ success: true });

    default:
      return Promise.reject(new Error(`[MOCK] Metodo no implementado: ${method}`));
  }
}

export function createGoogleScriptRunMock(): MockRun {
  let onSuccess: SuccessHandler = () => undefined;
  let onFailure: FailureHandler = () => undefined;

  const base = {
    withSuccessHandler(handler: SuccessHandler): MockRun {
      onSuccess = handler;
      return proxy as unknown as MockRun;
    },
    withFailureHandler(handler: FailureHandler): MockRun {
      onFailure = handler;
      return proxy as unknown as MockRun;
    }
  };

  const proxy = new Proxy(base as Record<string, unknown>, {
    get(target, prop: string | symbol) {
      if (typeof prop !== "string") return Reflect.get(target, prop);
      if (prop in target) return target[prop as keyof typeof target];

      return (...args: unknown[]) => {
        executeMock(String(prop), args)
          .then((result) => onSuccess(result))
          .catch((err: Error) => onFailure(err));
      };
    }
  });

  return proxy as unknown as MockRun;
}
