import { resolve } from '../../utils/index';
import { evaluateDtExpressions, type StyleType } from '..';
import { structuralDt } from './structure';

export function css(strings: TemplateStringsArray | StyleType, ...exprs: unknown[]): string | undefined {
    if (strings instanceof Array) {
        const raw = strings.reduce((acc, str, i) => acc + str + (resolve(exprs[i], { dt: structuralDt }) ?? ''), '');

        return evaluateDtExpressions(raw, structuralDt);
    }

    return resolve(strings as unknown, { dt: structuralDt }) as string | undefined;
}
