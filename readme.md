# csvdb : node.js flat file CSV database

> Lightweight CRUD flat file database, using CSV as storage. Powered by async/await.

## API Reference

* [csvdb<T>](#module_csvdb)
  * [.get([data])](#module_csvdb.get)
  * [.edit(data)](#module_csvdb.edit)
  * [.add(data)](#module_csvdb.add)
  * [.delete(data)](#module_csvdb.delete)

<a name="module_csvdb"></a>

### csvdb(filename, model [, delimiter]) ⇒ <code>Promise <CsvDatabase<T>></code>

Returns a CRUD database given a CSV file and an object model.

* uses `;` as default delimiter
* creates file if it doesn't exist

| Param                | Type                  | Description                             |
| -------------------- | --------------------- | --------------------------------------- |
| filename             | <code>string</code>   | the input value to convert to an array  |
| model                | <code>string[]</code> | database model, as keys in string array |
| [optional] delimiter | <code>string</code>   | custom CSV delimiter                    |

**Example**

```js
const db = await csvdb("users.csv", ["id","name","email"], ",");
```

<a name="module_csvdb.get"></a>

### db.get([predicate]) ⇒ <code>Promise<T[]></code>

Returns database content. If given an object predicate, returns data that matches its key-values pairs.

* if nothing is found, returns an empty array
* throws an error if predicate object does not match csv model

| Param                | Type                    | Description                                                  |
| -------------------- | ----------------------- | ------------------------------------------------------------ |
| [optional] predicate | <code>Partial<T></code> | object or partial that matches model, to be searched against |

**Example**

```js
> await db.get();
[
    {id: 1, name: "johndoe", mail: "john@github.com"},
    {id: 2, name: "frankmass", mail: "frankmass@github.com"}
]

> await db.get({name: "johndoe"});
[ {id: 1, name: "johndoe", mail: "john@github.com"} ]

> await db.get({name: "stevejobs"});
[ ]
```

<a name="module_csvdb.edit"></a>

### db.edit(predicate, data) ⇒ <code>Promise<Object[]></code>

Edits data that matches a predicate.

* it will edit all occurences that match the given predicate
* returns a list of edited occurences

| Param     | Type                    | Description                                        |
| --------- | ----------------------- | -------------------------------------------------- |
| predicate | <code>Partial<T></code> | predicate to match data                            |
| data      | <code>Partial<T></code> | data that will replace found occurences key/values |

**Example**

```js
> await db.edit({name: "johndoe"}, {email: "john@gitlab.com"});
[{1, "johndoe", "john@gitlab.com"}]
```

<a name="module_csvdb.add"></a>

### db.add(data) ⇒ <code>Promise<Object[]></code>

Adds data to CSV.

* returns created occurences

| Param | Type             | Description                  |
| ----- | ---------------- | ---------------------------- |
| data  | <code>T[]</code> | array of objects to be added |

**Example**

```js
> await db.add({id: 3, name: "stevejobs", mail: "jobs@github.com"});
[{id: 3, name: "stevejobs", mail: "jobs@github.com"}]
```

### db.delete(predicate) ⇒ <code>Promise<Object[]></code>

Deletes all data that matches the given predicate.

* returns deleted occurences

| Param     | Type                    | Description      |
| --------- | ----------------------- | ---------------- |
| predicate | <code>Partial<T></code> | predicate object |

**Example**

```js
> await db.delete({id: 1});
[ {id: 1, name: "johndoe", mail: "john@github.com"} ]
```
