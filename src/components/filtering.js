import { createComparison, defaultRules } from "../lib/compare.js";

export function initFiltering(elements, indexes) {
  // @todo: #4.1 — заполнить выпадающие списки опциями
  Object.keys(indexes).forEach((elementName) => {
    const options = Object.values(indexes[elementName]).map((name) => {
      const option = document.createElement("option");
      option.value = name;
      option.textContent = name;
      return option;
    });

    elements[elementName].append(...options);
  });

  return (data, state, action) => {
    // @todo: #4.2 — обработать очистку поля
    if (action && action.name === "clear") {
      const parent = action.closest(".form__field");
      const input = parent.querySelector("input, select");
      const field = action.dataset.field;

      if (input) input.value = "";
      if (state[field] !== undefined) state[field] = "";
    }

    // @todo: #4.3 — настроить компаратор
    const compare = createComparison(defaultRules);

    // @todo: #4.5 — отфильтровать данные используя компаратор
    return data.filter((item) => compare(item, state));
  };
}
