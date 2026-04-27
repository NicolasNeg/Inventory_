export interface Product {
  idOrden: string;
  tipo: string;
  producto: string;
  marca: string;
  subModelo: string;
  autos: string;
  periodo: string;
  minStock: number;
  stockInicial: number;
}

export interface InventoryItem {
  idFila: number;
  productId: string;
  total: number;
  salidas: number;
  disponible: number;
  movimientos: number;
  reStockStatus?: string;
}

export interface InventoryMovement {
  id?: string;
  fecha: string;
  tipo: "SALIDA" | "REINGRESO" | "CARGA" | "ALTA" | "OTRO";
  producto: string;
  submodelo: string;
  unidad: string;
  cantidad: number;
  autor: string;
  notas?: string;
}

export interface Warehouse {
  id: string;
  nombre: string;
  ubicacion?: string;
  activo: boolean;
}

export interface Supplier {
  id: string;
  nombre: string;
  contacto?: string;
  telefono?: string;
  email?: string;
  activo: boolean;
}

export type Role = "ADMIN" | "SUPERVISOR" | "OPERADOR" | "LECTOR";

export interface User {
  id: string;
  nombre: string;
  role: Role;
  activo: boolean;
}
