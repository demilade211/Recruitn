export const paginate = (items:any, page:number, perPage:number) => {
  return items.slice(perPage * (page - 1), perPage * page);
}
  
  