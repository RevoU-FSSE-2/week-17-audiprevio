const cors = require('cors');
const helmet = require('helmet');
const uuid = require('uuid');

const whitelist = ['https://savethepenguins.netlify.app/', 'https://southtrackreact.netlify.app/'];

const corsOptionsDelegate = function (req, callback) {
  let corsOptions;
  let isClientX = req.header('Origin') === 'https://savethepenguins.netlify.app/';
  let isClientY = req.header('Origin') === 'https://sapphireteam.netlify.app/';

  if (isClientX) {
    corsOptions = { methods: 'POST' };
  } else if (isClientY) {
    corsOptions = { methods: 'GET'};
  } else {
    corsOptions = { origin: false };
  }

  callback(null, corsOptions);
};

const securityMiddleware = (req, res, next) => {
  // Helmet
  helmet.frameguard({ action: 'deny' })(req, res, () => {});

  // CORS
  cors(corsOptionsDelegate)(req, res, () => {});

  // x-request-id
  res.set('x-request-id', req.get('x-request-id') || uuid.v4());

  res.set('Cache-Control', 'no-store');

  next();
};

module.exports = securityMiddleware;