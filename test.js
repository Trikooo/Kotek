const stringToNormalize = "Béjaïa";

console.log(stringToNormalize.normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
