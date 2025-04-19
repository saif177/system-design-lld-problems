class InMemeorySearchEngine {
    constructor() {
        this.dataset = {};
    }

    createDataSet(dataSetName) {
        if(!this.dataset[dataSetName]) {
            this.dataset[dataSetName] = [];
        }
    }

    insertDocument(dataSetName, doc) {
        if(!this.dataset[dataSetName]) {
            throw new Error(`Dataset ${dataSetName} does not exists.`);
        }
        this.dataset[dataSetName].push(doc);
    }

    searchDoc(dataSetName, searchTerm) {
        if(!this.dataset[dataSetName]) {
            throw new Error(`Dataset ${dataSetName} does not exists.`);
        }

        const results = [];

        this.dataset[dataSetName].forEach((doc, index) => {
            const regex = new RegExp(`\\b${searchTerm}\\b`, 'gi');
            const matches = doc.match(regex);
            if(matches) {
                results.push({
                    docId: `Doc${index + 1}`,
                    text: doc,
                    count: matches.length
                })
            }
        });

        results.sort((a, b) => b.count - a.count);
        return results.map(result => result.docId);
    }
}


// Example usage
const engine = new InMemeorySearchEngine();

engine.createDataSet('techBlog');
engine.insertDocument('techBlog', 'apple is a fruit');
engine.insertDocument('techBlog', 'apple apple come on');
engine.insertDocument('techBlog', 'oranges are sour');
engine.insertDocument('techBlog', 'apple is sweet, apple is apple');
engine.insertDocument('techBlog', 'veggies are healthy');

const result = engine.searchDoc('techBlog', 'apple');
console.log(result)