export default function isClickable(element: Element): boolean {
    if (element) {
        const targetNode = element.nodeName;
        const parentNode = element.parentElement && element.parentElement.nodeName;

        return (
            targetNode === 'INPUT' ||
            targetNode === 'TEXTAREA' ||
            targetNode === 'BUTTON' ||
            targetNode === 'A' ||
            parentNode === 'INPUT' ||
            parentNode === 'TEXTAREA' ||
            parentNode === 'BUTTON' ||
            parentNode === 'A' ||
            !!element.closest('.rs-button, .rs-checkbox, .rs-radiobutton') // @todo Add [data-pc-section="button"]
        );
    }

    return false;
}
