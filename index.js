const axios = require('axios');
const fs = require('fs');
const readline = require('readline');


let geonamesFilePath = '/opt/allCountries.txt';
let corename = 'geonames';
let solrUrl = 'http://localhost:8983/solr';

const args = process.argv.slice(2);
args.forEach((arg, index) => {
    if (arg === '--file' && args[index + 1]) {
        geonamesFilePath = args[index + 1];
    }
    if (arg === '--core' && args[index + 1]) {
        corename = args[index + 1];
    }
    if (arg === '--solrUrl' && args[index + 1]) {
        solrUrl = args[index + 1];
    }
});

console.log(`Running with core=${corename} file=${geonamesFilePath} url=${solrUrl}`);


// Function to define Solr schema
// based on previous schema:
// https://github.com/redbox-mint/solr-geonames/blob/811877c1916fb1c29e4215a2fa7f36b657048074/server/solr/conf/schema.xml#L22
async function defineSchema() {
    const schemaConfig = {
        "add-field": [
            {"name": "id", "type": "string", "stored": true},
            {"name": "utf8_name", "type": "text_general", "stored": true},
            {"name": "basic_name", "type": "text_general", "stored": true},
            {"name": "alternatenames", "type": "text_general", "stored": true}, // new
            {"name": "latitude", "type": "pdouble", "stored": true},
            {"name": "longitude", "type": "pdouble", "stored": true},
            {"name": "feature_class", "type": "string", "stored": true},
            {"name": "feature_code", "type": "string", "stored": true},
            {"name": "country_code", "type": "string", "stored": true},
            {"name": "cc2", "type": "string", "stored": true}, // new
            {"name": "admin1_code", "type": "string", "stored": true}, // new
            {"name": "admin2_code", "type": "string", "stored": true}, // new
            {"name": "admin3_code", "type": "string", "stored": true}, // new
            {"name": "admin4_code", "type": "string", "stored": true}, // new
            {"name": "population", "type": "plong", "stored": true},
            {"name": "elevation", "type": "plong", "stored": true},
            {"name": "gtopo30", "type": "plong", "stored": true},
            {"name": "timezone", "type": "string", "stored": true},
            {"name": "date_modified", "type": "pdate", "stored": true}
        ]
    };

    try {
        const response = await axios.post(`${solrUrl}/${corename}/schema`, schemaConfig);
        console.log('Schema defined successfully:', response.data);
    } catch (error) {
        console.error('Error defining schema:', error);
    }
}

async function indexGeonames(docs) {
    try {
        const response = await axios.post(`${solrUrl}/${corename}/update?commit=true`, docs);
        console.log(`Indexed ${docs.length} documents successfully:`, response.data);
    } catch (error) {
        console.error('Error indexing documents:', error);
    }
}

// Function to parse and index Geonames data
async function parseAndIndexGeonames() {
    console.log('Building and indexing documents');

    const fileStream = fs.createReadStream(geonamesFilePath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    const itemsInGroup = 100;
    let docs = [];
    for await (const line of rl) {
        const parts = line.split('\t');
        const doc = {
            id: parts[0],
            utf8_name: parts[1],
            basic_name: parts[2],
            alternatenames: parts[3],
            latitude: parseFloat(parts[4]),
            longitude: parseFloat(parts[5]),
            feature_class: parts[6],
            feature_code: parts[7],
            country_code: parts[8],
            cc2: parts[9],
            admin1_code: parts[10],
            admin2_code: parts[11],
            admin3_code: parts[12],
            admin4_code: parts[13],
            population: parseInt(parts[14], 10),
            elevation: parseInt(parts[15], 10),
            gtopo30: parseInt(parts[16], 10),
            timezone: parts[17],
            date_modified: parts[18]
        };
        docs.push(doc);

        if (docs.length % itemsInGroup === 0) {
            await indexGeonames(docs);
            docs = [];
        }
    }

    if (docs.length > 0) {
        await indexGeonames(docs);
    }
}

// Main function to orchestrate the workflow
async function main() {
    try {
        console.log('Defining Solr schema...');
        await defineSchema();

        console.log('Parsing and indexing Geonames data...');
        await parseAndIndexGeonames();

        console.log('Process complete.');
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

main();
