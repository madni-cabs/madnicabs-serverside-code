// // middleware/validateCabListFields.js
// export const validateCabListFields = (req, res, next) => {
//   const {
//     name,
//     fair,
//     passengers,
//     luggageCarry,
//     airCondition,
//   } = req.body;

//   // Check for required fields
//   const fields = {
//     name,
//     fair,
//     passengers,
//     luggageCarry,
//     airCondition,
//   };

//   for (const [key, value] of Object.entries(fields)) {
//     if (!value && value !== 0) { // Check for empty string, undefined, null, or missing value
//       return res.status(400).send(`${key} is required.`);
//     }
//   }

//   // Check for carImage file if it exists
//   if (!req.file && !req.body.carImage) {
//     return res.status(400).send('carImage is required.');
//   }

//   next(); // Proceed to the next middleware or route handler
// };

// middleware/validateCabListFields.js
export const validateCabListFields = (req, res, next) => {
  const {
    name,
    passengers,
    luggageCarry,
    airCondition,
  } = req.body;

  // Check for required fields
  const fields = {
    name,
    passengers,
    luggageCarry,
    airCondition,
  };

  for (const [key, value] of Object.entries(fields)) {
    if (value === undefined || value === null || value === '') {
      return res.status(400).send(`${key} is required.`);
    }
  }

  // Validate passengers and luggageCarry as numbers
  if (isNaN(passengers) || isNaN(luggageCarry)) {
    return res.status(400).send('Passengers and Luggage Capacity must be numbers.');
  }

  // Check for carImage file if it exists
  if (!req.file) {
    return res.status(400).send('carImage is required.');
  }

  // Ensure airCondition is a boolean
  if (airCondition !== 'true' && airCondition !== 'false') {
    return res.status(400).send('Air Conditioning must be either "true" or "false".');
  }

  // Convert airCondition to boolean
  req.body.airCondition = airCondition === 'true';

  next(); // Proceed to the next middleware or route handler
};







// middleware/validateCabBookFields.js
export const validateCabBookFields = (req, res, next) => {
  const {
    pickup_location,
    drop_location,
    pickup_time,
    drop_time,
    full_name,
    email,
    phone_number,
    country,
    passengers,
    luggage,
    cab_model,
    total_rent,
    message
  } = req.body;

  const fields = {
    pickup_location,
    drop_location,
    pickup_time,
    drop_time,
    full_name,
    email,
    phone_number,
    country,
    passengers,
    luggage,
    cab_model,
    total_rent,
    message
  };

  for (const [key, value] of Object.entries(fields)) {
    if (!value && value !== 0) { // Check for empty string, undefined, null, or missing value
      return res.status(400).send(`${key} is required.`);
    }
  }

  next(); // Proceed to the next middleware or route handler
};
