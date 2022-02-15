import fs from 'fs';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import bodyParser from 'body-parser';
import cors from 'cors';

import { InputError, AccessError } from './error';
import swaggerDocument from '../swagger.json';
import {
  getEmailFromAuthorization,
  login,
  logout,
  register,
  save,
  updateListing,
  removeListing,
  getTimeValue,
  getMonthValue
} from './service';

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));

const catchErrors = (fn) => async (req, res) => {
  try {
    await fn(req, res);
    save();
  } catch (err) {
    if (err instanceof InputError) {
      res.status(400).send({ error: err.message });
    } else if (err instanceof AccessError) {
      res.status(403).send({ error: err.message });
    } else {
      res.status(500).send({ error: 'A system error ocurred' });
    }
  }
};

/***************************************************************
                       User Auth Functions
***************************************************************/

const authed = (fn) => async (req, res) => {
  const email = getEmailFromAuthorization(req.header('Authorization'));
  await fn(req, res, email);
};

app.post(
  '/user/auth/login',
  catchErrors(async (req, res) => {
    const { email, password } = req.body;
    const token = await login(email, password);
    const timeV = await getTimeValue(email);
    const month = await getMonthValue(email);
    return res.json({ token, timeV, month });
  }),
);

app.post(
  '/user/auth/register',
  catchErrors(async (req, res) => {
    const { email, password, name, time, date } = req.body;
    const token = await register(email, password, name, time, date);
    return res.json({ token });
  }),
);

app.post(
  '/user/auth/logout',
  catchErrors(
    authed(async (req, res, email) => {
      await logout(email);
      return res.json({});
    }),
  ),
);

/***************************************************************
                       Homepage Functions
***************************************************************/

app.put(
  '/listings',
  catchErrors(
    authed(async (req, res, email) => {
      const { time, date } = req.body;
      return res.status(200).send({
        timeValue: await updateListing(email, time, date),
      });
    }),
  ),
);

app.get(
  '/listings',
  catchErrors(
    authed(async (req, res, email) => {
      return res.status(200).json({ 
        listing: await getTimeValue(email),
      });
    }),
  ),
);

app.put(
  '/listings/:listingid',
  catchErrors(
    authed(async (req, res, email) => {
      const { listingid } = req.params;
      const { title, address, thumbnail, price, metadata } = req.body;
      await assertOwnsListing(email, listingid);
      await updateListing(listingid, title, address, thumbnail, price, metadata);
      return res.status(200).send({});
    }),
  ),
);

app.delete(
  '/listings/:listingid',
  catchErrors(
    authed(async (req, res, email) => {
      const { listingid } = req.params;
      await assertOwnsListing(email, listingid);
      await removeListing(listingid);
      return res.status(200).send({});
    }),
  ),
);


/***************************************************************
                       Running Server
***************************************************************/

app.get('/', (req, res) => res.redirect('/docs'));

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const configData = JSON.parse(fs.readFileSync('../frontend/src/config.json'));
const port = 'BACKEND_PORT' in configData ? configData.BACKEND_PORT : 5033;

const server = app.listen(port, () => {
  console.log(`Backend is now listening on port ${port}!`);
  console.log(`For API docs, navigate to http://localhost:${port}`);
});

export default server;
