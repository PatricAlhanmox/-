import fs from 'fs';
import jwt from 'jsonwebtoken';
import AsyncLock from 'async-lock';
import { InputError, AccessError } from './error';

const lock = new AsyncLock();

const JWT_SECRET = 'giraffegiraffebeetroot';
const DATABASE_FILE = './database.json';

/***************************************************************
                       State Management
***************************************************************/

let users = {};
let listings = {};

const update = (users, listings) =>
  new Promise((resolve, reject) => {
    lock.acquire('saveData', () => {
      try {
        fs.writeFileSync(
          DATABASE_FILE,
          JSON.stringify(
            {
              users,
              listings,
            },
            null,
            2,
          ),
        );
        resolve();
      } catch {
        reject(new Error('Writing to database failed'));
      }
    });
  });

export const save = () => update(users, listings);
export const reset = () => {
  update({}, {}, {});
  users = {};
  listings = {};
};

try {
  const data = JSON.parse(fs.readFileSync(DATABASE_FILE));
  users = data.users;
  listings = data.listings;
} catch {
  console.log('WARNING: No database found, create a new one');
  save();
}

/***************************************************************
                       Helper Functions
***************************************************************/

const newListingId = (_) => generateId(Object.keys(listings));

export const resourceLock = (callback) =>
  new Promise((resolve, reject) => {
    lock.acquire('resourceLock', callback(resolve, reject));
  });

const randNum = (max) => Math.round(Math.random() * (max - Math.floor(max / 10)) + Math.floor(max / 10));
const generateId = (currentList, max = 999999999) => {
  let R = randNum(max);
  while (currentList.includes(R)) {
    R = randNum(max);
  }
  return R.toString();
};

/***************************************************************
                       Auth Functions
***************************************************************/

export const getEmailFromAuthorization = (authorization) => {
  try {
    const token = authorization.replace('Bearer ', '');
    const { email } = jwt.verify(token, JWT_SECRET);
    if (!(email in users)) {
      throw new AccessError('Invalid Token');
    }
    return email;
  } catch {
    throw new AccessError('Invalid Token');
  }
};

export const login = (email, password) =>
  resourceLock((resolve, reject) => {
    if (email in users) {
      if (users[email].password === password) {
        users[email].sessionActive = true;
        resolve(jwt.sign({ email }, JWT_SECRET, { algorithm: 'HS256' }));
      }
    }
    reject(new InputError('Invalid username or password'));
  });

export const logout = (email) =>
  resourceLock((resolve, reject) => {
    users[email].sessionActive = false;
    resolve();
  });

export const register = (email, password, name, time, date) =>
  resourceLock((resolve, reject) => {
    if (email in users) {
      reject(new InputError('Email address already registered'));
    }
    users[email] = {
      name,
      password,
      time,
      date,
      sessionActive: true,
    };
    const token = jwt.sign({ email }, JWT_SECRET, { algorithm: 'HS256' });
    resolve(token);
  });

/***************************************************************
                       Listing Functions
***************************************************************/

const newListingPayload = (time, owner) => ({
  time,
  owner,
});

export const addTime = (time, email) => 
resourceLock((resolve, reject) => {
  if (time === undefined) {
    reject(new InputError('Must provide a time for new listing'));
  } else if (Object.keys(listings).find((key) => listings[key].time === time) !== undefined) {
    reject(new InputError('A listing with this time already exists'));
  } else {
    const id = newListingId();
    listings[id] = newListingPayload(time, email);
    resolve(id);
  }
});

export const getTimeValue = (email) => 
resourceLock((resolve, reject) => {
  resolve(users[email].time);
});

export const getAllListings = () =>
  resourceLock((resolve, reject) => {
    resolve(
      Object.keys(listings).map((key) => ({
        id: parseInt(key, 10),
        time: listings[key].time,
        thumbnail: listings[key].thumbnail,
        reviews: listings[key].reviews,
      })),
    );
  });

export const updateListing = (email, time, date) =>
  resourceLock((resolve, reject) => {
    if (email in users) {
      users[email].time = parseInt(time) + parseInt(users[email].time);
      users[email].date = date;
    } else {
      reject(new AccessError('no such user'));
    }
    const timeValue = users[email].time;
    resolve(timeValue);
  });

export const removeListing = (listingId) =>
  resourceLock((resolve, reject) => {
    delete listings[listingId];
    resolve();
  });

