import {cloneTemplate} from "../lib/utils.js";

/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: render}}
 */
export function initTable(settings, onAction) {
    const {tableTemplate, rowTemplate, before, after} = settings;
    const root = cloneTemplate(tableTemplate);

    before.reverse().forEach(subName => {
        root[subName] = cloneTemplate(subName)
        root.container.prepend(root[subName].container)
    })

    after.forEach(subName => {
        root[subName] = cloneTemplate(subName)
        root.container.appendChild(root[subName].container)
    })

    // @todo: #1.3 —  обработать события и вызвать onAction()
    root.container.addEventListener('change', () => {
        onAction()
    })
    root.container.addEventListener('reset', () => {
        setTimeout(onAction)
    })
    root.container.addEventListener('submit', (e) => {
        e.preventDefault()
        onAction(e.subbmiter)
    })
    root.container.addEventListener('click', (e) => {
        if (e.target.name === 'clear') {
            e.preventDefault();
            onAction(e.target);
        }
    })
    root.container.addEventListener('click', (e) => {
        if (e.target.name === 'sort' || e.target.closest('button[name="sort"]')) {
            e.preventDefault();
            const button = e.target.name === 'sort' ? e.target : e.target.closest('button[name="sort"]');
            onAction(button);
        }
        
        if (e.target.name === 'clear') {
            e.preventDefault();
            onAction(e.target);
        }

        if (e.target.name === 'first' || e.target.name === 'prev' || 
            e.target.name === 'next' || e.target.name === 'last' ||
            e.target.closest('button[name="first"]') || 
            e.target.closest('button[name="prev"]') ||
            e.target.closest('button[name="next"]') || 
            e.target.closest('button[name="last"]')) {
            e.preventDefault();
            
            let button;
            if (e.target.name) {
                button = e.target;
            } else {
                button = e.target.closest('button');
            }
            onAction(button);
        }
    });;

    const render = (data) => {
        // @todo: #1.1 — преобразовать данные в массив строк на основе шаблона rowTemplate
        const nextRows = data.map(item => {
            const row = cloneTemplate(rowTemplate)

            Object.keys(item).forEach(key => {
                if(row.elements[key]) {
                    row.elements[key].textContent = item[key]
                }
            })
            return row.container;
        });
        root.elements.rows.replaceChildren(...nextRows);
    }

    return {...root, render};
}