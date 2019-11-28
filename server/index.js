const express = require('express');
const bodyParser = require('body-parser')
const server = express();
const {
    getOptions,
    writeVote,
    getVotingStatistics,
    getIsOptionKeyAvailable,
} = require('./data.js');

const PORT = 8280;

server.use(bodyParser.json());
server.use(express.static('public'));

server.get('/variants', async (req, res) => {
    const options = await getOptions();
    res.send(options);
});

server.get('/stat', async (req, res) => {
    const stat = await getVotingStatistics();
    res.send(stat);
});

server.post('/vote', async (req, res) => {
    const { vote: optionKey } = req.body;
    const isVoteValid = await getIsOptionKeyAvailable(optionKey);
    if (isVoteValid) {
        await writeVote(optionKey);
        res.send('OK');
    } else {
        res.status(400).send('Invalid voting submission');
    }
});

server.listen(PORT, () => console.log(`Accepting votes on ${PORT} ...`));