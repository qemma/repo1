// @flow
import { useState, useEffect } from 'react';
import { debounce, groupBy } from 'lodash';
import { DEFAULT_GRID_OPTIONS } from './const';
import { transform, isEqual, isObject, isEmpty } from 'lodash';

function useEntitiesList(
  initialOptions?: Options = {},
  entityService: EntityService,
  hub: PiramisHub
) {
  const [result: Result, setResult] = useState({
    total: 0,
    children: [],
    groups: [],
    parents: [],
    related: [],
    items: [],
    childrenBag: {},
    parentsBag: {},
    relatedBag: {}
  });
  const [loading: boolean, setLoading] = useState(false);
  const [options: { esoptions: Options, action: GridAction }, setOptions] = useState(() => ({
    esoptions: { ...DEFAULT_GRID_OPTIONS, ...initialOptions },
    action: 'init',
    uuid: 0
  }));

  function onLoadResults(newOptions: Options, action: GridAction) {
    const updtOptions = {
      action,
      esoptions: {
        ...options.esoptions,
        ...newOptions
      },
      uuid: options.uuid + 1
    };

    const changes = difference(newOptions, options.esoptions);
    if (updtOptions.action === 'filter' && needDebouncing(changes)) {
      debounceSetOptions(updtOptions);
    } else {
      setOptions(updtOptions);
    }
  }

  async function loadData(gridOptions: { esoptions: any, action: GridAction }) {
    setLoading(true);
    hub.loading(true);
    try {
      const result: any = await entityService.search(gridOptions.esoptions);
      setResult({
        ...result,
        childrenBag: (groupBy(result.children, el => el.parentId): any),
        parentsBag: (groupBy(result.parents, el => el.uuid): any)
      });
    } finally {
      setLoading(false);
      hub.loading(false);
    }
  }

  const debounceSetOptions = debounce(setOptions, 1000);

  useEffect(() => {
    loadData(options);
  }, [options.uuid]);

  return [result, options, loading, onLoadResults];
}

function difference(object, base) {
  function changes(object, base) {
    return transform(object, function(result, value, key) {
      if (!isEqual(value, base[key]) || key === 'matchMode') {
        result[key] = isObject(value) && isObject(base[key]) ? changes(value, base[key]) : value;
      }
    });
  }
  return changes(object, base);
}

function needDebouncing(change: any) {
  if (isEmpty(change.filters)) return false;
  const notDebounced = Object.keys(change.filters).filter(key =>
    ['range', 'match'].includes(change.filters[key].matchMode)
  );

  return notDebounced.length === 0;
}

export default useEntitiesList;
