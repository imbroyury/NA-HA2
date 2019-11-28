const path = require('path');
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const PATH_TO_OPTIONS = path.join(__dirname, 'options.json');
const PATH_TO_SUBMISSIONS = path.join(__dirname, 'submissions.json');

const readJSON = async (path) => {
    const contents = await readFile(path, { encoding: 'utf8' });
    return JSON.parse(contents);
};

const writeJSON = async (path, contents) => {
    return writeFile(path, contents, { encoding: 'utf8'});
}

const getOptions = async () => {
    const options = await readJSON(PATH_TO_OPTIONS);
    return options;
};

const getItemCountMap = (array, keysToInclude) => {
    const seedMap = keysToInclude.reduce((map, key) => {
        map[key] = 0;
        return map;
    }, {});

    return array.reduce((map, item) => {
        if (keysToInclude.includes(item)) {
            map[item] = map[item] + 1;
        }
        return map;
    }, seedMap);
};

const getAvailableOptionKeys = async () => {
    const options = await getOptions();
    const keys = options.map(option => option.id);
    return keys;
}

const getIsOptionKeyAvailable = async (key) => {
    const availableKeys = await getAvailableOptionKeys();
    return availableKeys.includes(key);
}

const getVotingStatistics = async () => {
    const availableKeys = await getAvailableOptionKeys();
    const existing = await readJSON(PATH_TO_SUBMISSIONS);
    const map = getItemCountMap(existing, availableKeys);
    return map;
};

// very naive implementation
const writeVote = async (vote) => {
    const existing = await readJSON(PATH_TO_SUBMISSIONS);
    const modified = [...existing, vote];
    const json = JSON.stringify(modified, null, 2);
    return writeJSON(PATH_TO_SUBMISSIONS, json);
};

module.exports = {
    getOptions,
    writeVote,
    getVotingStatistics,
    getIsOptionKeyAvailable,
};
