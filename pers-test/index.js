// utility to curry a function (i copied it)
function curry(fn) {
  const arity = fn.length;

  return function $curry(...args) {
    if (args.length < arity) {
      return $curry.bind(null, ...args);
    }

    return fn.call(null, ...args);
  };
}

// utility to compose functions: right to left. again i copied it
const compose = (...fns) => (...args) =>
  fns.reduceRight((res, fn) => [fn.call(null, ...res)], args)[0];

//maps each config entry to a curried function: the idea is to build a composable function chain for each entry in the config
//mapping the config entry key to the corresponding function
const configMap = {
  upper_case: curry((position, items) => {
    if (!['first', 'last'].includes(position))
      throw new Error(
        `wrong config parameter position = ${position}: allowed values are 'first','last'`
      );
    const regExp = position === 'first' ? /\b\w/g : /.$/g; //here we are excluding non ascii chars like ö
    return items.map(el => el.replace(regExp, l => l.toUpperCase()));
  }),

  length: curry((limit, items) => {
    const boundaries = Array.isArray(limit) ? limit : [limit, limit];
    if (
      boundaries.length !== 2 ||
      !Number.isInteger(boundaries[0]) ||
      !Number.isInteger(boundaries[1])
    )
      throw new Error(
        `wrong config parameter limit: you have to pass an int number or an array of 2 int numbers`
      );
    return items.filter(item => item.length >= boundaries[0] && item.length <= boundaries[1]);
  }),

  strip: curry((type, items) => {
    if (!['consonants', 'vowels'].includes(type))
      throw new Error(
        `wrong config parameter type = ${type}: allowed values are 'consonants','vowels'`
      );
    const vowels = ['i', 'u', 'o', 'a', 'e'];
    const stringFilter =
      type === 'consonants'
        ? item => vowels.includes(item.toLowerCase())
        : item => !vowels.includes(item.toLowerCase());
    return items.map(el =>
      el
        .split('')
        .filter(stringFilter)
        .join('')
    );
  })
};

const execute = (configs, words) => {
  if (!configs) throw new Error('please provide a config in input');
  if (!Array.isArray(words)) throw new Error('please provide an array of words in input');
  return configs.map(entry => {
    const functionsToApply = Object.keys(entry).reduce((acc, curr) => {
      return [configMap[curr](entry[curr])].concat(acc);
    }, []);
    return compose(...functionsToApply)(words);
  });
};
