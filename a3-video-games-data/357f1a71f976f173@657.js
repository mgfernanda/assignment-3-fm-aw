export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["duckdb_wasm.svg",new URL("./files/0ae4731de23b95622ee7cbb3895db25ceff764201b7a627b86663391a8b0fa874fb3de58170a8eab5fb7b18a2110df48fe4798060ceebbc5011b7c67183b73db",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["FileAttachment","db","md"], async function(FileAttachment,db,md){return(
md`# DuckDB in WebAssembly

<img src="${await FileAttachment("duckdb_wasm.svg").url()}" height="100">

Welcome to [DuckDB](https://duckdb.org/) running in your browser with [WebAssembly](https://webassembly.org/).
To use it, import an initialized DuckDB and the DuckDB library into your notebook.

\`\`\`js
import {db, duckdb} from '@cmudig/duckdb'
\`\`\`

You can then start running queries on the \`db\`. For example:

\`\`\`js
result = {
  const conn = await db.connect();
  const result = await conn.runQuery(query);
  await conn.close();
  return result;
}
\`\`\`

A query result is an [Apache Arrow Table](https://arrow.apache.org/docs/js/classes/table.html).

We also provide a convenient Database client \`DuckDBClient\`. You can learn more about the client at [the documentation page](/@cmudig/duckdb-client).

\`\`\`js
import {DuckDBClient} from '@cmudig/duckdb'
\`\`\`

The current version of DuckDB Web is ${await db.getVersion()}. We use the [\`@duckdb/duckdb-wasm\` NPM package](https://www.npmjs.com/package/@duckdb/duckdb-wasm).`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`---`
)});
  main.variable(observer("libraryVersion")).define("libraryVersion", function(){return(
"0.0.41-dev180.0"
)});
  main.variable(observer("packageName")).define("packageName", function(){return(
'@duckdb/duckdb-wasm'
)});
  main.variable(observer("distURL")).define("distURL", ["packageName","libraryVersion"], function(packageName,libraryVersion){return(
`https://cdn.jsdelivr.net/npm/${packageName}@${libraryVersion}/dist/`
)});
  main.variable(observer("DUCKDB_BUNDLES")).define("DUCKDB_BUNDLES", ["distURL"], function(distURL){return(
{
    asyncDefault: {
        mainModule: new URL('duckdb.wasm', distURL).toString(),
        mainWorker: new URL('duckdb-browser-async.worker.js', distURL).toString(),
    },
    asyncNext: {
        mainModule: new URL(`duckdb-next.wasm`, distURL).toString(),
        mainWorker: new URL('duckdb-browser-async-next.worker.js', distURL).toString(),
    },
    asyncNextCOI: {
        mainModule: new URL('duckdb-next-coi.wasm', distURL).toString(),
        mainWorker: new URL('duckdb-browser-async-next-coi.worker.js', distURL).toString(),
        pthreadWorker: new URL('duckdb-browser-async-next-coi.pthread.worker.js', distURL).toString(),
    },
}
)});
  main.variable(observer("duckdb")).define("duckdb", ["packageName","libraryVersion"], function(packageName,libraryVersion){return(
import(`https://cdn.skypack.dev/${packageName}@${libraryVersion}`)
)});
  main.variable(observer("bundle")).define("bundle", ["duckdb","DUCKDB_BUNDLES"], function(duckdb,DUCKDB_BUNDLES){return(
duckdb.selectBundle(DUCKDB_BUNDLES)
)});
  main.variable(observer("workerURL")).define("workerURL", ["bundle"], async function(bundle)
{
  // Manually download worker script to bypass CORS issue in Observable
  let workerReq = await fetch(bundle.mainWorker);
  let workerScript = await workerReq.text();
  let workerScriptBlob = new Blob([workerScript], { type: 'application/javascript' });
  return URL.createObjectURL(workerScriptBlob);
}
);
  main.variable(observer("wasmURL")).define("wasmURL", ["bundle"], async function(bundle)
{
  // Manually download WASM to bypass CORS issue in Observable
  let wasmReq = await fetch(bundle.mainModule);
  return URL.createObjectURL(await wasmReq.blob());
}
);
  main.variable(observer("pThreadURL")).define("pThreadURL", ["bundle"], async function(bundle)
{
  if (!bundle.pthreadWorker) {
    return undefined;
  }
  
  // Manually download Wasm to bypass CORS issue in Observable
  let pthreadReq = await fetch(bundle.pthreadWorker);
  return URL.createObjectURL(await pthreadReq.blob());
}
);
  main.variable(observer("makeDB")).define("makeDB", ["duckdb","workerURL","wasmURL","pThreadURL"], function(duckdb,workerURL,wasmURL,pThreadURL){return(
async function makeDB() {
  const logger = new duckdb.ConsoleLogger();
  const worker = new Worker(workerURL);
  const db = new duckdb.AsyncDuckDB(logger, worker);
  await db.instantiate(wasmURL, pThreadURL);
  return db
}
)});
  main.variable(observer("db")).define("db", ["makeDB"], function(makeDB){return(
makeDB()
)});
  main.variable(observer()).define(["db"], function(db){return(
db.getVersion()
)});
  main.variable(observer("DuckDBClient")).define("DuckDBClient", ["makeDB","Inputs","element","text"], function(makeDB,Inputs,element,text){return(
class DuckDBClient {
  constructor(_db) {
    this._db = _db;
    this._counter = 0;
  }

  async db() {
    if (!this._db) {
      this._db = await makeDB();
    }
    return this._db;
  }

  async connection() {
    if (!this._conn) {
      const db = await this.db();
      this._conn = await db.connect();
    }
    return this._conn;
  }

  async reconnect() {
    if (this._conn) {
      this._conn.close();
    }
    delete this._conn;
  }
  
  async query(query, params) {
    const key = `Query ${this._counter++}: ${query}`;
    console.time(key)
    const conn = await this.connection();
    const result = await conn.runQuery(query);
    console.timeEnd(key)
    return result;
  }

  async table(query, params, opts) {
    const result = await this.query(query, params);
    return Inputs.table(result, {layout: 'auto', ...(opts || {})});
  }

  // get the client after the query ran
  async client(query, params) {
    await this.query(query, params);
    return this;
  }

  // query a single row
  async queryRow(query, params) {
    const key = `Query ${this._counter++}: ${query}`;
    console.time(key)
    const conn = await this.connection();
    // use sendQuery as we can stop iterating after we get the first batch
    const result = await conn.sendQuery(query);
    const batch = (await result.next()).value;
    console.timeEnd(key)
    return batch.get(0);
  }
  
  async explain(query, params) {
    const row = await this.queryRow(`EXPLAIN ${query}`, params);
    return element("pre", {className: "observablehq--inspect"}, [
      text(row["explain_value"])
    ]);
  }

  // describe the database (no arg) or a table
  async describe(object) {
    const result = await (object === undefined
      ? this.query(`PRAGMA show_tables`)
      : this.query(`PRAGMA table_info('${object}')`));
    return Inputs.table(result)
  }

  // summzarize a query result
  async summarize(query) {
    const result = await this.query(`SUMMARIZE ${query}`);
    return Inputs.table(result)
  }

  async insertJSON(name, buffer, options) {
    const db = await this.db();
    await db.registerFileBuffer(name, new Uint8Array(buffer))
    const conn = await db.connect();
    await conn.insertJSONFromPath(name, {name, schema: 'main', ...options});
    await conn.close();
  }

  async insertCSV(name, buffer, options) {
    const db = await this.db();
    await db.registerFileBuffer(name, new Uint8Array(buffer))
    const conn = await db.connect();
    await conn.insertCSVFromPath(name, {name, schema: 'main', ...options});
    await conn.close();
  }
  
  // Create a database from FileArrachments
  static async of(files=[]) {
    const db = await makeDB();

    const toName = (file) => file.name.split('.').slice(0, -1).join('.')

    if (files.constructor.name === 'FileAttachment') {
      files = [[toName(files), files]];
    } else if (!Array.isArray(files)) {
      files = Object.entries(files);
    }

    // Add all files to the database. Import JSON and CSV. Create view for Parquet.
    await Promise.all(files.map(async (entry) => {
      let file, name;
      
      if (Array.isArray(entry)) {
        [name, file] = entry;
      } else {
        [name, file] = [toName(entry), entry];
      }
      
      const buffer = await file.arrayBuffer()
      await db.registerFileBuffer(file.name, new Uint8Array(buffer))

      const conn = await db.connect();
      if (file.name.endsWith('.csv')) {
        await conn.insertCSVFromPath(file.name, {name, schema: 'main'});
      } else if (file.name.endsWith('.json')) {
        await conn.insertJSONFromPath(file.name, {name, schema: 'main'});
      } else if (file.name.endsWith('.parquet')) {
        await conn.runQuery(`CREATE VIEW '${name}' AS SELECT * FROM parquet_scan('${file.name}')`);
      } else {
        console.warn(`Don't know how to handle file type of ${file.name}`)
      }
      await conn.close();
    }));

    return new DuckDBClient(db);
  }
}
)});
  main.variable(observer("element")).define("element", function(){return(
function element(name, props, children) {
  if (arguments.length === 2) children = props, props = undefined;
  const element = document.createElement(name);
  if (props !== undefined) for (const p in props) element[p] = props[p];
  if (children !== undefined) for (const c of children) element.appendChild(c);
  return element;
}
)});
  main.variable(observer("text")).define("text", function(){return(
function text(value) {
  return document.createTextNode(value);
}
)});
  main.variable(observer()).define(["db"], async function(db)
{
  const conn = await db.connect();
  const result = await conn.runQuery(`	SELECT
			v::INTEGER AS x,
			(sin(v/50.0) * 100 + 100)::INTEGER AS y
			FROM generate_series(0, 100) AS t(v)`);
  await conn.close();
  return result;
}
);
  main.variable(observer()).define(["md"], function(md){return(
md`## Test Query

Just to make sure that we can connect to the database. `
)});
  main.variable(observer()).define(["db","Inputs"], async function(db,Inputs)
{
  const conn = await db.connect();
  const result = await conn.runQuery(`SELECT 1 AS 'Result'
UNION SELECT 2
UNION SELECT 3`);
  await conn.close();
  return Inputs.table(result);
}
);
  return main;
}
