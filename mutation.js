const onConnectedStore = new Set()

export function onConnectedCallback(elem, callback) {
    onConnectedStore.add([elem, callback])
}

function mutationCallback(records) {
    for (const record of records) {
        onConnectedStore.forEach((val) => {
            let item = Array.from(record.addedNodes).find(i => i === val[0])
            if (item instanceof Node) {
                val[1](item)
                onConnectedStore.delete(val)
            } else {
                Array.from(record.addedNodes).find(i => item = Array.from(i.childNodes).find(c => c === val[0]))
                if (item instanceof Node) {
                    val[1](item)
                    onConnectedStore.delete(val)
                }
            }
        })
    }

}
export function defineRoot(rootElement) {
    new MutationObserver(mutationCallback).observe(rootElement, { childList: true, subtree: true })
}