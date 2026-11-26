const shared = [1, 2];
const rows = [shared, [3, 4], shared];

console.log(rows[0] === rows[2]);
rows[0].push(5);
console.log(rows);
