export default function NotFound() {
  return (
    <div className="page page--notfound">
      <p className="eyebrow">404</p>
      <h1 className="display display--xl">
        Strada <em>sbagliata</em>
      </h1>
      <p>La pagina che cerchi non esiste o è stata spostata.</p>
      <a className="btn btn--solid" href="#/">
        Torna alla home
      </a>
    </div>
  );
}
