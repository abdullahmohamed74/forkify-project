import { TIMEOUT_SEC } from './config.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    // getting recipe data
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const response = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await response.json();

    // throwing error in case of error with the request
    if (!response.ok) throw new Error(`${data.message} (${response.status})`);

    return data;
  } catch (err) {
    // rethrowing the error to handle it in the main function in model.js
    throw err;
  }
};

/*
export const getJSON = async function (url) {
  try {
    // getting recipe data
    const fetchPro = fetch(url);
    const response = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await response.json();

    // throwing error in case of error with the request
    if (!response.ok) throw new Error(`${data.message} (${response.status})`);

    return data;
  } catch (err) {
    // rethrowing the error to handle it in the main function in model.js
    throw err;
  }
};

export const sendJSON = async function (url, uploadData) {
  try {
    // getting recipe data
    const fetchPro = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadData),
    });
    const response = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await response.json();

    // throwing error in case of error with the request
    if (!response.ok) throw new Error(`${data.message} (${response.status})`);

    return data;
  } catch (err) {
    // rethrowing the error to handle it in the main function in model.js
    throw err;
  }
};
*/