export const movementsFixture = [
  {
    fecha: "25/04/26 10:30",
    tipo: "SALIDA",
    producto: "FILTRO DE ACEITE",
    submodelo: "PH3614",
    unidad: "D-4994",
    cantidad: 2,
    autor: "JORGE LUGO",
    notas: "MANTENIMIENTO PROGRAMADO"
  },
  {
    fecha: "24/04/26 17:10",
    tipo: "SALIDA",
    producto: "BALATAS DELANTERAS",
    submodelo: "0986",
    unidad: "SENTRA 21",
    cantidad: 1,
    autor: "ANGEL ARMENTA",
    notas: "CAMBIO DE BALATAS"
  }
];

export const movementDetailBySubModelFixture: Record<
  string,
  { producto: string; sub: string; movimientos: Array<{ fecha: string; unidad: string; cantidad: number; autor: string; notas: string }> }
> = {
  ph3614: {
    producto: "FILTRO DE ACEITE",
    sub: "FRAM | PH3614",
    movimientos: [
      {
        fecha: "25/04/26 10:30",
        unidad: "D-4994",
        cantidad: 2,
        autor: "JORGE LUGO",
        notas: "MANTENIMIENTO PROGRAMADO"
      }
    ]
  },
  "0986": {
    producto: "BALATAS DELANTERAS",
    sub: "BOSCH | 0986",
    movimientos: [
      {
        fecha: "24/04/26 17:10",
        unidad: "SENTRA 21",
        cantidad: 1,
        autor: "ANGEL ARMENTA",
        notas: "CAMBIO DE BALATAS"
      }
    ]
  }
};
