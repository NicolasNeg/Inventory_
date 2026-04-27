import { ModulePlaceholder } from "../components/ModulePlaceholder";

export function UserManagementPage() {
  return (
    <ModulePlaceholder
      title="Gestión de Usuarios"
      description="Pantalla base para administración de perfiles, roles y permisos."
      nextSteps="Conectar profiles/roles/permissions con RLS activa."
    />
  );
}
