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
  listingLength,
  addPilot,
  getAllListings,
  getDetails,
  assertOwnsListing,
  updateIncrementListing,
  updateDecrementListing,
  setGoalListing,
  removeListing,
  getTimeValue,
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
    const { email, password, currMonth } = req.body;
    const token = await login(email, password, currMonth);
    const timeV = await getTimeValue(email);
    return res.json({ token, timeV });
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
                       Listing Functions
***************************************************************/
app.post(
  '/listings/new',
  catchErrors(
    authed(async (req, res, email) => {
      const { name, patternNumber, goalTime, monthlyTime, quaterTime, yearlyTime, thumbnail } = req.body;
      return res.status(200).json({
        listingId: await addPilot(name, email, patternNumber, goalTime, monthlyTime, quaterTime, yearlyTime, thumbnail),
        listingLen: await listingLength(),
      });
    }),
  ),
);

app.put(
  '/listings/eddit/:listingid',
  catchErrors(
    authed(async (req, res, email) => {
      const { listingid } = req.params;
      const { time, month, symbol } = req.body;
      await assertOwnsListing(email, listingid);
      if (symbol === '+') {
        await updateIncrementListing(listingid, time, month);
      } else if (symbol === '-') {
        await updateDecrementListing(listingid, time, month);
      } else {
        await setGoalListing(listingid, time, month);
      }
      return res.status(200).send({});
    }),
  ),
);

app.delete(
  '/listings/remove/:listingid',
  catchErrors(
    authed(async (req, res, email) => {
      const { listingid } = req.params;
      await assertOwnsListing(email, listingid);
      await removeListing(listingid);
      return res.status(200).send({});
    }),
  ),
);

app.get(
  '/listings/detail/:listingid',
  catchErrors(
    authed(async (req, res) => {
      const { listingid } = req.params;
      return res.status(200).send({
        listings: await getDetails(listingid)
      });
    }),
  ),
);
/***************************************************************
                       Homepage Functions
***************************************************************/
app.get(
  '/listings',
  catchErrors(async (req, res) => {
    return res.json({ listings: await getAllListings() });
  }),
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
