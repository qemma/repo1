import * as Yup from 'yup';

function setupCustomValidators() {
  // add vatCode validation to global Yup schema validation
  Yup.addMethod(Yup.string, 'vatCode', function() {
    return this.test('vatCode', 'vat code error', function(vatCode) {
      const { path, createError } = this;
      const errorMessage = checkVatCode(vatCode);
      return errorMessage ? createError({ path, message: errorMessage }) : true;
    });
  });

  // add taxCode validation to global Yup schema validation
  Yup.addMethod(Yup.string, 'taxCode', function() {
    return this.test('taxCode', 'tax code error', function(taxCode) {
      const { path, createError } = this;
      const errorMessage = checkTaxCode(taxCode);
      return errorMessage ? createError({ path, message: errorMessage }) : true;
    });
  });

  // address validation
  Yup.addMethod(Yup.object, 'address', function() {
    return this.test('address', 'address error', function(address) {
      const { path, createError } = this;
      const isValid = address && address.route && address.region && address.province;
      console.log(address);
      const errorMessage = isValid
        ? ''
        : 'indirizzo non valido: regione provincia e via sono obbligatori';
      return errorMessage ? createError({ path, message: errorMessage }) : true;
    });
  });
}

export function checkTaxCode(cf) {
  if (!cf) return;
  cf = cf.toUpperCase();
  if (!/^[0-9A-Z]{16}$/.test(cf)) return 'Il codice fiscale deve contenere 16 tra lettere e cifre.';
  const map = [
    1,
    0,
    5,
    7,
    9,
    13,
    15,
    17,
    19,
    21,
    1,
    0,
    5,
    7,
    9,
    13,
    15,
    17,
    19,
    21,
    2,
    4,
    18,
    20,
    11,
    3,
    6,
    8,
    12,
    14,
    16,
    10,
    22,
    25,
    24,
    23
  ];
  let s = 0;
  for (let i = 0; i < 15; i++) {
    let c = cf.charCodeAt(i);
    if (c < 65) c = c - 48;
    else c = c - 55;
    if (i % 2 === 0) s += map[c];
    else s += c < 10 ? c : c - 10;
  }
  let atteso = String.fromCharCode(65 + (s % 26));
  if (atteso !== cf.charAt(15))
    return 'Il codice fiscale non è valido: il codice di controllo non corrisponde.';
  return '';
}

export function checkVatCode(pi) {
  if (!pi) return '';
  if (!/^[0-9]{11}$/.test(pi)) return 'La partita IVA deve contenere 11 cifre.';
  var s = 0;
  for (let i = 0; i <= 9; i += 2) s += pi.charCodeAt(i) - '0'.charCodeAt(0);
  for (var i = 1; i <= 9; i += 2) {
    var c = 2 * (pi.charCodeAt(i) - '0'.charCodeAt(0));
    if (c > 9) c = c - 9;
    s += c;
  }
  var atteso = (10 - (s % 10)) % 10;
  if (atteso !== pi.charCodeAt(10) - '0'.charCodeAt(0))
    return 'La partita IVA non è valida: il codice di controllo non corrisponde.';
  return '';
}

export default setupCustomValidators();
