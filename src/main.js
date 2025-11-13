import "./fonts/ys-display/fonts.css";
import "./style.css";

import { data as sourceData } from "./data/dataset_2.js";
import { initData } from "./data.js";
import { processFormData } from "./lib/utils.js";

import { initTable } from "./components/table.js";
import { initPagination } from "./components/pagination.js";
import { initSorting } from "./components/sorting.js";
import { initFiltering } from "./components/filtering.js";
import { initSearching } from "./components/searching.js";

// Исходные данные
const { data, ...indexes } = initData(sourceData);

/**
 * Создаём таблицу сначала
 */
const sampleTable = initTable(
  {
    tableTemplate: "table",
    rowTemplate: "row",
    before: ["search", "header", "filter"], // search перед header
    after: ["pagination"], // пагинация после таблицы
  },
  render // функция render будет определена ниже
);

/**
 * Инициализация модулей
 */
const applySearching = initSearching("search");

const applyFiltering = initFiltering(sampleTable.filter.elements, {
  searchBySeller: indexes.sellers,
});

const applySorting = initSorting([
  sampleTable.header.elements.sortByDate,
  sampleTable.header.elements.sortByTotal,
]);

const applyPagination = initPagination(
  sampleTable.pagination.elements,
  (el, page, isCurrent) => {
    const input = el.querySelector("input");
    const label = el.querySelector("span");
    input.value = page;
    input.checked = isCurrent;
    label.textContent = page;
    return el;
  }
);

/**
 * Сбор и обработка состояния полей формы
 */
function collectState() {
  const state = processFormData(new FormData(sampleTable.container));
  const rowsPerPage = parseInt(state.rowsPerPage);
  const page = parseInt(state.page ?? 1);

  return {
    ...state,
    rowsPerPage,
    page,
  };
}

/**
 * Функция рендера таблицы
 */
function render(action) {
  const state = collectState();
  let result = [...data];

  // порядок применения: поиск -> фильтрация -> сортировка -> пагинация
  if (typeof applySearching === "function") {
    result = applySearching(result, state, action);
  }

  if (typeof applyFiltering === "function") {
    result = applyFiltering(result, state, action);
  }

  if (typeof applySorting === "function") {
    result = applySorting(result, state, action);
  }

  if (typeof applyPagination === "function") {
    result = applyPagination(result, state, action);
  }

  sampleTable.render(result);
}

/**
 * Монтируем таблицу в DOM
 */
document.querySelector("#app").appendChild(sampleTable.container);

// Финальный первый рендер
render();
