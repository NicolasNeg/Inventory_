export type ProductSheetRow = [
  idOrden: string,
  tipo: string,
  producto: string,
  marca: string,
  subModelo: string,
  autos: string,
  stockInicial: number,
  salidas: number,
  disponible: number,
  minStock: number,
  colK: string,
  movimientos: string,
  periodo: string,
  statusNota?: string,
  idNotaRelacionada?: string
];

export type InventorySheetRow = ProductSheetRow;

export type MovementSheetRow = [
  fecha: Date | string,
  tipo: string,
  producto: string,
  marca: string,
  submodelo: string,
  unidad: string,
  cantidad: number,
  autor: string,
  notas: string
];

export type SupplierSheetRow = [
  id: string,
  nombre: string,
  contacto?: string,
  telefono?: string,
  email?: string,
  activo?: boolean
];

export type UserSheetRow = [
  id: string,
  nombre: string,
  role: string,
  activo?: boolean
];
