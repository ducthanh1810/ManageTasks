// const FilterWithDate = (order: string) => {
//   return `field=date&order=${order}`;
// };

// const FilterWithType = (order: string) => {
//   return `field=type&order=${order}`;
// };

// const FilterWithCompleted = (order: string) => {
//   return `field=completed&order=${order}`;
// };

// const ListFilter = {
//   date: FilterWithDate,
//   type: FilterWithType,
//   completed: FilterWithCompleted,
// };

// export type FilterTask = "date" | "type" | "completed";

// export const Filter = (listEnabledFilter: { field: FilterTask; order: string }[] ) => {
//     const _listFilter = [];
//     listEnabledFilter.forEach((filter) => {
//       filter += ListFilter[filter.field](filter.order);
//     });
// }
