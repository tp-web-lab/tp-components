type Row = number[];
const shared: Row = [1, 2];
const rows: Row[] = [shared, [3, 4], shared];

console.log(rows[0] === rows[2]);
rows[0].push(5);
console.log(rows);
