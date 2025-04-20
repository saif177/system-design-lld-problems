class Row {
    constructor(columns, values) {
        this.data = new Map();

        for (const col of columns) {
            if (!(col in values)) {
                throw new Error(`Missing value for column '${col}'`);
            }
            this.data.set(col, values[col]);
        }
    }

    getValue(column) {
        return this.data.get(column);
    }

    toObject() {
        const obj = {};
        for (const [key, value] of this.data.entries()) {
            obj[key] = value;
        }
        return obj;
    }

    matches(predicate) {
        return predicate(this);
    }
}

class Table {
    constructor(name, columns) {
        this.name = name;
        this.columns = columns;
        this.rows = [];
    }

    insert(values) {
        const row = new Row(this.columns, values);
        this.rows.push(row);
    }

    select() {
        return this.rows;
    }

    delete(whereClause) {
        this.rows = this.rows.filter(row => !whereClause(row));
    }

    getName() {
        return this.name;
    }

    getColumns() {
        return this.columns;
    }
}

class InMemoryDatabase {
    constructor() {
        this.tables = new Map();
    }

    createTable(tableName, columns) {
        if (this.tables.has(tableName)) {
            throw new Error(`Table '${tableName}' already exists`);
        }
        this.tables.set(tableName, new Table(tableName, columns));
    }

    dropTable(tableName) {
        if (!this.tables.has(tableName)) {
            throw new Error(`Table '${tableName}' does not exist`);
        }
        this.tables.delete(tableName);
    }

    insert(tableName, rowData) {
        const table = this.tables.get(tableName);
        if (!table) throw new Error(`Table '${tableName}' does not exist`);
        table.insert(rowData);
    }

    select(tableName) {
        const table = this.tables.get(tableName);
        if (!table) throw new Error(`Table '${tableName}' does not exist`);
        return table.select().map(row => row.toObject());
    }

    delete(tableName, whereClause) {
        const table = this.tables.get(tableName);
        if (!table) throw new Error(`Table '${tableName}' does not exist`);
        table.delete(whereClause);
    }
}



const db = new InMemoryDatabase();

db.createTable("users", ["id", "name", "email"]);

db.insert("users", { id: 1, name: "Alice", email: "alice@example.com" });
db.insert("users", { id: 2, name: "Bob", email: "bob@example.com" });

console.log("All users:");
console.log(db.select("users"));

db.delete("users", (row) => row.getValue("name") === "Bob");

console.log("After deleting Bob:");
console.log(db.select("users"));

db.dropTable("users");
