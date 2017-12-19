import assert = require("assert");
import mockfs = require("mock-fs");
import fs = require("fs");

import csvdb = require("../src");

const EXISTINGFILECONTENT = "foo;bar\na;b\nc;d";
const INVALIDFILECONTENT = "foo;bar\n1;2;3";

mockfs({
  fixtures: {
    "db.csv": EXISTINGFILECONTENT,
    "invalid.csv": INVALIDFILECONTENT
  }
});

const NEWFILE = "fixtures/new.csv";
const EXISTINGFILE = "fixtures/db.csv";
const INVALIDFILE = "fixtures/invalid.csv";
const MODEL = ["foo", "bar"];

after(() => mockfs.restore());

describe("database init", () => {
  it("should create a new csv if it doesn't exist", async () => {
    const db = await csvdb(NEWFILE, MODEL);
    const contents = fs.readFileSync(NEWFILE).toString();
    assert.deepEqual(contents, "foo;bar");
  });
  it("should read a valid CSV without throwing error", async () => {
    try {
      await csvdb(EXISTINGFILE, MODEL);
    } catch (err) {
      throw new Error("csv is valid but not read");
    }
  });
  it("should error when reading an invalid CSV", async () => {
    try {
      await csvdb(INVALIDFILE, MODEL);
    } catch (err) {
      return;
    }
    throw new Error("file is invalid but has been validated");
  });
  it("should check options", async () => {});
});

describe("database behavior - read", () => {
  it("should find all data", async () => {
    const db = await csvdb(EXISTINGFILE, MODEL);
    const values = await db.get();

    assert.deepEqual(values, [{ foo: "a", bar: "b" }, { foo: "c", bar: "d" }]);
  });

  it("should find filtered data", async () => {
    const db = await csvdb(EXISTINGFILE, MODEL);
    const values = await db.get({ foo: "a" });

    assert.deepEqual(values, [{ foo: "a", bar: "b" }]);
  });

  it("should find nothing", async () => {
    const db = await csvdb(EXISTINGFILE, MODEL);
    const values = await db.get({ foox: "a" });

    assert.deepEqual(values, []);
  });
});

describe("database behavior - create | update | delete", () => {
  beforeEach(() => {
    mockfs({ fixtures: { "db.csv": EXISTINGFILECONTENT } });
  });

  it("should edit filtered data", async () => {
    const db = await csvdb(EXISTINGFILE, MODEL);
    const editedValues = await db.edit({ foo: "a" }, { foo: "x", bar: "y" });
    const newValue = await db.get({ foo: "x" });
    const oldValue = await db.get({ foo: "a" });

    assert.deepEqual(editedValues, [{ foo: "x", bar: "y" }]);
    assert.deepEqual(oldValue, []);
    assert.deepEqual(newValue, [{ foo: "x", bar: "y" }]);
  });

  /*
  it("should edit multiple data - lock file system", async () => {
    const db = await csvdb(EXISTINGFILE, MODEL);
    const editedValue = await db.edit({ foo: "a" }, { foo: "x" });
    const newValue = await db.get({ foo: "x" });
    const oldValue = await db.get({ foo: "a" });

    assert.deepEqual(editedValue, { foo: "x", bar: "b" });
    assert.deepEqual(oldValue, []);
    assert.deepEqual(newValue, [{ foo: "x", bar: "b" }]);
  });*/

  it("should return nothing when editing non existent data", async () => {
    const db = await csvdb(EXISTINGFILE, MODEL);
    const editedValue = await db.edit({ foo: "x" }, { foo: "x" });
    const newValue = await db.get({ foo: "x" });
    const oldValue = await db.get({ foo: "a" });

    assert.deepEqual(editedValue, []);
    assert.deepEqual(oldValue, [{ foo: "a", bar: "b" }]);
    assert.deepEqual(newValue, []);
  });

  it("should add data", async () => {
    const db = await csvdb(EXISTINGFILE, MODEL);
    await db.add({ foo: "z", bar: "p" });
    const values = await db.get();

    assert.deepEqual(values, [
      { foo: "a", bar: "b" },
      { foo: "c", bar: "d" },
      { foo: "z", bar: "p" }
    ]);
  });

  it("should delete filtered data", async () => {
    const db = await csvdb(EXISTINGFILE, MODEL);
    const deletedValue = await db.delete({ foo: "a" });
    const values = await db.get();

    assert.deepEqual(values, [{ foo: "c", bar: "d" }]);
    assert.deepEqual(deletedValue, [{ foo: "a", bar: "b" }]);
  });

  it("should delete nothing", async () => {
    const db = await csvdb(EXISTINGFILE, MODEL);
    const deletedValue = await db.delete({ foo: "x" });
    const values = await db.get();

    assert.deepEqual(values, [{ foo: "a", bar: "b" }, { foo: "c", bar: "d" }]);
    assert.deepEqual(deletedValue, []);
  });
});
