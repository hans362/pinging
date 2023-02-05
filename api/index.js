const app = require('express')();
const { registerAgent } = require('./lib/registerAgent');
const { registerNode } = require('./lib/registerNode');
const { getNodeList } = require('./lib/getNodeList');
const { registerRecord } = require('./lib/registerRecord');
const { drawGraph } = require('./lib/drawGraph');

const agentSecret = process.env.AGENT_SECRET;

app.get('/api/registerAgent', async (req, res) => {
  if (req.query.secret === agentSecret) {
    try {
      const agentId = await registerAgent(req.query.name);
      res.status(200).json({ status: 'success', agentId });
    } catch (e) {
      res.status(500).json({ status: 'error', msg: 'Error registering agent, ' + e });
      return;
    }
  } else {
    res.status(403).json({ status: 'error', msg: 'Invalid secret' });
  }
});

app.get('/api/registerNode', async (req, res) => {
  if (req.query.secret === agentSecret) {
    try {
      await registerNode(req.query.name, req.query.hostname);
      res.status(200).json({ status: 'success', msg: 'Node registered' });
    } catch (e) {
      res.status(500).json({ status: 'error', msg: 'Error registering node, ' + e });
      return;
    }
  } else {
    res.status(403).json({ status: 'error', msg: 'Invalid secret' });
  }
});

app.get('/api/getNodeList', async (req, res) => {
  if (req.query.secret === agentSecret) {
    try {
      const nodes = await getNodeList();
      res.status(200).json({ status: 'success', nodes });
    } catch (e) {
      res.status(500).json({ status: 'error', msg: 'Error getting node list, ' + e });
      return;
    }
  } else {
    res.status(403).json({ status: 'error', msg: 'Invalid secret' });
  }
});

app.get('/api/registerRecord', async (req, res) => {
  if (req.query.secret === agentSecret) {
    try {
      await registerRecord(req.query.agentId, req.query.nodeId, req.query.latency);
      res.status(200).json({ status: 'success', msg: 'Record registered' });
    } catch (e) {
      res.status(500).json({ status: 'error', msg: 'Error registering record, ' + e });
    }
  } else {
    res.status(403).json({ status: 'error', msg: 'Invalid secret' });
  }
});

app.get('/api/drawGraph', async (req, res) => {
  if (!req.query.nodeId) {
    res.status(400).json({ status: 'error', msg: 'nodeId is required' });
    return;
  }
  try {
    const svg = await drawGraph(req.query.nodeId);
    res.writeHead(200, {
      'Content-Type': 'application/xml'
    });
    res.write(svg);
    res.end();
  } catch (e) {
    res.status(500).json({ status: 'error', msg: 'Error drawing graph, ' + e });
  }
});

module.exports = app;