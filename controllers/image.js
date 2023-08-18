const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

const returnClarifaiJSONRequest = (imageUrl) => {
  const PAT = process.env.API_CLARIFAI;
  const USER_ID = 'monica_lin';
  const APP_ID = 'test';
  const IMAGE_URL = imageUrl;

  const raw = JSON.stringify({
    user_app_id: {
      user_id: USER_ID,
      app_id: APP_ID,
    },
    inputs: [
      {
        data: {
          image: {
            url: IMAGE_URL,
          },
        },
      },
    ],
  });
  return {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: 'Key ' + PAT,
    },
    body: raw,
  };
};
const handleApiCall = (req, res) => {
  fetch(
    'https://api.clarifai.com/v2/models/face-detection/outputs',
    returnClarifaiJSONRequest(req.body.input)
  )
    .then((response) => response.json())
    .then((data) => {
      res.json(data);
    })
    .catch((err) => res.status(400).json('unable to work with API'));
};
const handleImage = (req, res, db) => {
  const { id } = req.body;
  db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then((entries) => {
      res.json(entries[0].entries);
    })
    .catch((err) => res.status(400).json('unable to get entries'));
};

module.exports = {
  handleImage,
  handleApiCall,
};
