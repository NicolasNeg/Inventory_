interface ModulePlaceholderProps {
  title: string;
  description: string;
  nextSteps: string;
}

export function ModulePlaceholder({ title, description, nextSteps }: ModulePlaceholderProps) {
  return (
    <section className="page">
      <h1 className="page-title">{title}</h1>
      <p className="page-muted">{description}</p>
      <div className="module-placeholder">
        <p className="module-placeholder__state">Estado: módulo preparado</p>
        <p className="module-placeholder__next">Siguiente paso: {nextSteps}</p>
      </div>
    </section>
  );
}
