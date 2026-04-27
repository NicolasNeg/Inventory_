# Data Model Current (Google Sheets)

## Hojas detectadas

- `INVENTARIO`
- `HISTORICO`
- `ADD_INSUMOS`
- `HISTORICO_ADD_PRIMERINSUMO`
- `CONFIG_ORDEN_TIPO_PRODUCTO`
- `MODELOS_UNIDADES`
- `HISTORIAL_NOTAS_PENDIENTES`

## Columnas detectadas (segun uso en `index.js`)

### `INVENTARIO`

- A: `idOrden`
- B: `tipo`
- C: `producto`
- D: `marca`
- E: `subModelo`
- F: `autos`
- G: `stockInicial` / total
- H: `salidas` / usados
- I: `disponible`
- J: `minStock`
- K: reservado/no definido
- L: `movimientos` (string tipo `"N MOVIMIENTOS"`)
- M: `periodo`
- N: `statusNota`
- O: `idNotaRelacionada`

### `HISTORICO`

- A: fecha
- B: tipo (SALIDA/RE-INGRESO u otro)
- C: producto
- D: marca
- E: submodelo
- F: unidad / referencia
- G: cantidad
- H: autor
- I: notas

### `ADD_INSUMOS`

- A: fecha
- B: autor
- C: producto (texto de referencia)
- D: cantidad inicial
- E: cantidad agregada
- F: cantidad final
- G: notas

### `HISTORICO_ADD_PRIMERINSUMO`

- A: fecha
- B: autor
- C: producto (incluye periodo en algunos flujos)
- D: marca
- E: submodelo
- F: stock inicial
- G: stock minimo

### `CONFIG_ORDEN_TIPO_PRODUCTO`

- A: categoria/tipo
- B: prefijo para ID

### `MODELOS_UNIDADES`

- A: modelo unidad (desde A2 en adelante)

### `HISTORIAL_NOTAS_PENDIENTES`

- A: idNota
- B: fecha
- C: autor
- D: unidad/titulo
- E: nota
- F: estado (`PENDIENTE`/`RESUELTO`)
- G: fechaResuelto
- H: autorRes
- I: solucion

## Relaciones implicitas

- `INVENTARIO.A (idOrden)` enlaza con notas:
  - `INVENTARIO.O (idNotaRelacionada)` -> `HISTORIAL_NOTAS_PENDIENTES.A`
- Movimientos vinculados por submodelo:
  - `INVENTARIO.E` <-> `HISTORICO.E`
- Historial de cargas iniciales y recargas se empata por texto compuesto:
  - `HISTORICO_ADD_PRIMERINSUMO` con `ADD_INSUMOS.C` via etiqueta derivada.

## Riesgos de datos

1. `movimientos` mezclado como string (`"N MOVIMIENTOS"`) en vez de numero.
2. Fechas heterogeneas (`Date` y string) en varias hojas.
3. Dependencia de indices de columna fijos sin esquema versionado.
4. Vinculo por texto compuesto en historial de insumos (fragil ante cambios de formato).
5. Campos potencialmente vacios en datos legacy (marca/submodelo/autor/notas).

## Posibles inconsistencias detectadas

- `cantidad` puede llegar como string y convertirse de forma implícita.
- `subModelo`/`submodelo` y `producto` se alternan en filtros y consultas.
- En `HISTORICO`, la semantica de cantidad no siempre distingue signo; la vista lo interpreta.
- `INVENTARIO.H` se usa como salidas/usados segun flujo; naming no uniforme.

## Implicaciones para la fase de tipado

- Mantener parseo tolerante (defensivo) en repositorios/mappers.
- No endurecer validaciones en frontera UI aun.
- Centralizar conversiones de fila <-> dominio antes de cambiar contratos publicos.
