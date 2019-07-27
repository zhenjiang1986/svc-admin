





/**
 * 判断路径是否为外部地址
 *
 * @export
 * @param {*} path
 * @returns {Boolean}
 */
export function isExternal(path) {
    return /^(https?:|mailto:|tel:)/.test(path)
  }