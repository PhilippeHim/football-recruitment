export default function RegressionCaption({ regression }) {
  const format = (value) => value.toLocaleString('fr-FR', { maximumFractionDigits: 2 });
  const sign = regression.intercept < 0 ? '−' : '+';
  return (
    <div className="regression-caption" role="status">
      Droite violette : DRI estimé = {format(regression.slope)} × PAC {sign}{' '}
      {format(Math.abs(regression.intercept))}.{' '}
      {regression.rSquared === null
        ? 'R² non défini : toutes les notes DRI sont identiques.'
        : `R² = ${format(regression.rSquared)} (proche de 1 : meilleur ajustement linéaire).`}{' '}
      Calculée sur {regression.count} joueurs. Cette tendance ne démontre pas une
      causalité.
    </div>
  );
}
