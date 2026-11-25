export default function ForgotPasswordPage() {
  return (
    <div className="container py-5" style={{ maxWidth: 560 }}>
      <h1 className="h2">Mot de passe oublié</h1>
      <div className="alert alert-info" role="status">
        L’API Étape 2 ne fournit pas d’endpoint de réinitialisation de mot de passe.
        Cette page est présente pour le parcours de maquettage ; aucun courriel n’est envoyé.
      </div>
    </div>
  );
}
