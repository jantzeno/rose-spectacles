import { uuid } from '../../internal/utils/uuid/index';

/**
 * @deprecated since v4.3.0. Use `uuid` from @openuxkit/utils instead.
 * @param {string} prefix
 * @return {string}
 */
export default function (prefix = 'pv_id_') {
    return uuid(prefix);
}
