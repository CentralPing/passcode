exports.filter = filter;

/**
 * Filters object with a predicate
 * @private
 * @example
 * const origObj = {foo: false, bar: undefined};
 * const filteredObj = filter(origObj, ([k, v]) => v !== undefined);
 * // {foo: false}
 * @param {Object} [obj={}]
 * @param {Function} [predicate=()=>true] A predicate function that is
 *  called with an array pair of `[key, value]`
 * @return {Object} Filtered object (shallow clone)
 */
function filter(obj = {}, predicate = () => true) {
  return Object.entries(obj)
    .filter(predicate)
    .reduce((o, [key, value]) => (o[key] = value, o), {});
}
