import { Link } from 'react-router-dom';

export default function PaymentExternalPage() {
  return (
    <div className="container py-5" style={{ maxWidth: 560 }}>
      <h1 className="h2">Paiement externe (maquette)</h1>
      <div className="bg-white border rounded p-4">
        <p>
          Cette page représente l’écran externe de saisie bancaire prévu dans les maquettes.
          <strong> Aucun paiement réel n’est effectué</strong> et aucun champ carte n’est envoyé à l’API.
        </p>
        <p className="text-muted small mb-4">
          L’API Étape 2 refuse même les champs `numero_carte`, `carte` ou `cvv`.
        </p>
        <Link to="/checkout" className="btn btn-lg-primary">Retour au règlement simulé</Link>
      </div>
    </div>
  );
}
