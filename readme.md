# csvdb : node.js flat file CSV database

> Lightweight CRUD flat file database, using CSV as storage. Powered by Typescript + async/await.
> :zap: For node.js 7+

Features :

* complete CRUD API
* json-like requests
* model validation
* Typescript typings

## Usage

```js
> const db = await csvdb("users.csv", ["id","name","email"]);

> await db.get({email: "johndoe@github.com"});
[ {id: 1, name: "johndoe", mail: "john@github.com"} ]

> await db.add([{id: 2, name: "stevejobs", mail: "jobs@github.com"}]);
```

## Installation

This project is made using Typescript. To generate the transpiled npm package, you need to run gulp :
`> gulp`

You can run the full test suite with mocha :
`> npm i && npm run test`

## API Reference

* [csvdb<T>](#module_csvdb)
  * [.get](#module_csvdb.get)
  * [.edit](#module_csvdb.edit)
  * [.add](#module_csvdb.add)
  * [.delete](#module_csvdb.delete)

<a name="module_csvdb"></a>

### csvdb(filename, model [, delimiter]) ⇒ `Promise<CsvDatabase>`

Returns a database, given a CSV file and its model.

* `;` as default delimiter
* file is created if it doesn't exist

| Param                | Type       | Description      |
| -------------------- | ---------- | ---------------- |
| filename             | `string`   | csv file         |
| model                | `string[]` | database model   |
| [optional] delimiter | `string`   | custom delimiter |

**Example**

```js
const db = await csvdb("users.csv", ["id","name","email"], ",");
```

<a name="module_csvdb.get"></a>

### db.get([predicate]) ⇒ `Promise<Object[]>`

Returns database content. If given a predicate, returns data that matches its key-values pairs.

* empty array if nothing found
* throws an error if predicate does not match csv model

| Param                | Type             | Description      |
| -------------------- | ---------------- | ---------------- |
| [optional] predicate | `Object.partial` | search predicate |

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

### db.edit(predicate, data) ⇒ `Promise<Object[]>`

Edits data, given a search predicate object.

* returns a list of edited occurences

| Param     | Type             | Description                                        |
| --------- | ---------------- | -------------------------------------------------- |
| predicate | `Object.partial` | search predicate                                   |
| data      | `Object.partial` | data that will replace found occurences key/values |

**Example**

```js
> await db.edit({name: "johndoe"}, {email: "john@gitlab.com"});
[{1, "johndoe", "john@gitlab.com"}]
```

<a name="module_csvdb.add"></a>

### db.add(data) ⇒ `Promise<Object[]>`

Adds data to CSV.

* returns created occurences

| Param | Type       | Description      |
| ----- | ---------- | ---------------- |
| data  | `Object[]` | data to be added |

**Example**

```js
> await db.add({id: 3, name: "stevejobs", mail: "jobs@github.com"});
[{id: 3, name: "stevejobs", mail: "jobs@github.com"}]
```

### db.delete(predicate) ⇒ `Promise<Object[]>`

Deletes all data that matches the given predicate.

* returns deleted occurences

| Param     | Type             | Description      |
| --------- | ---------------- | ---------------- |
| predicate | `Object.partial` | search predicare |

**Example**

```js
> await db.delete({id: 1});
[ {id: 1, name: "johndoe", mail: "john@github.com"} ]
```
