

export function initFiltering(elements) {
    const updateIndexes = (elements, indexes) => {
        Object.keys(indexes).forEach((elementName) => {
            elements[elementName].append(...Object.values(indexes[elementName]).map(name => {
                const el = document.createElement('option');
                el.textContent = name;
                el.value = name;
                return el;
            }))
        })
    }

    const applyFiltering = (query, state, action) => {
        // код с обработкой очистки поля
        if (action && action.name === 'clear') {
            const fieldName = action.dataset.field;
            if (fieldName) {
                // Находим input по имени поля
                const inputName = `searchBy${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}`;
                const input = elements[inputName];
                
                if (input) {
                    // Очищаем значение input
                    input.value = '';
                    
                    // Триггерим событие input чтобы обновить CSS-классы
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                    
                    // Удаляем параметр фильтра из query
                    delete query[`filter[${fieldName}]`];
                }
            }
        }
        // @todo: #4.5 — отфильтровать данные, используя компаратор
        const filter = {};
        Object.keys(elements).forEach(key => {
            if (elements[key]) {
                if (['INPUT', 'SELECT'].includes(elements[key].tagName) && elements[key].value) { // ищем поля ввода в фильтре с непустыми данными
                    filter[`filter[${elements[key].name}]`] = elements[key].value; // чтобы сформировать в query вложенный объект фильтра
                }
            }
        })

        return Object.keys(filter).length ? Object.assign({}, query, filter) : query; // если в фильтре что-то добавилось, применим к запросу
    }

    return {
        updateIndexes,
        applyFiltering
    }
}