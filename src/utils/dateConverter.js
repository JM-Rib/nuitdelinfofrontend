export const convertDateSql  = (date) => {
  let jour = ("0" + date.getDate()).slice(-2);
  let mois = ("0" + (date.getMonth() + 1)).slice(-2);
  let annee = date.getFullYear();
  return (""+annee + "-" + mois + "-" + jour);
}

export const convertDateHuman = (dateString) => {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
  return date.toLocaleString('fr-FR', options);
}