import axios from 'axios';
import { formatTimeToAmPm } from '../../helper/formatTimeToAmPm.js';

// Send a WhatsApp message to a single phone number.
const sendWhatsAppMessageSingle = async (phoneNumber, message) => {
  try {
    const response = await axios.post(`http://localhost:4000/api/send-message-single`, {
      number: phoneNumber,
      message: message,
    });
    console.log('Message sent successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending WhatsApp message:', error.message);
    throw new Error('Failed to send WhatsApp message');
  }
};

// Send a WhatsApp message to a group.
const sendWhatsAppGroupMessage = async (groupName, message) => {
  try {
    const response = await axios.post(`http://localhost:4000/api/send-group-message`, {
      groupName: groupName,
      message: message,
    });
    console.log('Group message sent successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending WhatsApp group message:', error.message);
    throw new Error('Failed to send WhatsApp group message');
  }
};

// Template for Admin Main Owner WhatsApp messages based on action type.
const adminMainOwnerWhatsAppTemplate = (fullName, id, pickupLocation, dropLocation, pickupDate, pickupTime, cabName, rent, status, action, reason = '') => {
  let message = '';

  switch (action) {
    case 'create':
      message = `
Madni Cabs
>> New Booking <<

**Booking ID:** ${id}
**Customer Name:** ${fullName}

**Pickup Location:** ${pickupLocation}
**Drop Location:** ${dropLocation}
**Pickup Date:** ${pickupDate}
**Pickup Time:** ${formatTimeToAmPm(pickupTime)}

**Cab Name:** ${cabName}
**Rent:** ${rent} SAR

**Status:** ${status}

Please review the booking and ensure all arrangements are in place.
      `;
      break;

    case 'update':
      message = `
Madni Cabs
>> Booking Updated <<

**Booking ID:** ${id}
**Customer Name:** ${fullName}

**Pickup Location:** ${pickupLocation}
**Drop Location:** ${dropLocation}
**Updated Pickup Date:** ${pickupDate}
**Updated Pickup Time:** ${formatTimeToAmPm(pickupTime)}

**Cab Name:** ${cabName}

**Status:** ${status}

Please review the updates and adjust arrangements as needed.
      `;
      break;

    case 'complete':
      message = `
Madni Cabs
>> Booking Completed <<

**Booking ID:** ${id}
**Customer Name:** ${fullName}

**Pickup Location:** ${pickupLocation}
**Drop Location:** ${dropLocation}
**Pickup Date:** ${pickupDate}
**Pickup Time:** ${formatTimeToAmPm(pickupTime)}

**Cab Name:** ${cabName}

**Status:** ${status}

Thank you for managing this booking successfully!
      `;
      break;

    case 'cancel':
      message = `
Madni Cabs
>> Booking Cancelled <<

**Booking ID:** ${id}
**Customer Name:** ${fullName}

**Pickup Location:** ${pickupLocation}
**Drop Location:** ${dropLocation}
**Pickup Date:** ${pickupDate}
**Pickup Time:** ${formatTimeToAmPm(pickupTime)}

**Cab Name:** ${cabName}

**Status:** ${status}
**Cancellation Reason:** ${reason || 'Not provided'}

Please ensure all necessary steps are taken regarding this cancellation.
      `;
      break;

    default:
      message = `
Madni Cabs
>> Unknown Action <<

This booking action is not recognized. Please check the booking details and status.
      `;
  }

  return message;
};

// Template for Group WhatsApp messages based on action type.
const groupWhatsAppTemplate = (id, fullName, pickupLocation, dropLocation, pickupDate, pickupTime, cabName, action, status) => {
  let message = '';

  switch (action) {
    case 'create':
      message = `
Madni Cabs
>> New Booking <<

**Booking ID:** ${id}
**Customer Name:** ${fullName}

**Pickup Location:** ${pickupLocation}
**Drop Location:** ${dropLocation}
**Pickup Date:** ${pickupDate}
**Pickup Time:** ${formatTimeToAmPm(pickupTime)}

**Cab Name:** ${cabName}

**Status:** ${status}

Ensure readiness for this new booking.
      `;
      break;

    case 'update':
      message = `
Madni Cabs
>> Booking Updated <<

**Booking ID:** ${id}
**Customer Name:** ${fullName}

**Pickup Location:** ${pickupLocation}
**Drop Location:** ${dropLocation}
**Updated Pickup Date:** ${pickupDate}
**Updated Pickup Time:** ${formatTimeToAmPm(pickupTime)}

**Cab Name:** ${cabName}

**Status:** ${status}

Adjust schedules accordingly for this updated booking.
      `;
      break;

    case 'complete':
      message = `
Madni Cabs
>> Booking Completed <<

**Booking ID:** ${id}
**Customer Name:** ${fullName}

**Pickup Location:** ${pickupLocation}
**Drop Location:** ${dropLocation}
**Pickup Date:** ${pickupDate}
**Pickup Time:** ${formatTimeToAmPm(pickupTime)}

**Cab Name:** ${cabName}

**Status:** ${status}

Thank you for completing this booking successfully!
      `;
      break;

    case 'cancel':
      message = `
Madni Cabs
>> Booking Cancelled <<

**Booking ID:** ${id}
**Customer Name:** ${fullName}

**Pickup Location:** ${pickupLocation}
**Drop Location:** ${dropLocation}
**Pickup Date:** ${pickupDate}
**Pickup Time:** ${formatTimeToAmPm(pickupTime)}

**Cab Name:** ${cabName}

**Status:** ${status}

Ensure all necessary actions are taken for this cancellation.
      `;
      break;

    default:
      message = `
Madni Cabs
>> Unknown Action <<

This booking action is not recognized. Please check the booking details and status.
      `;
  }

  return message;
};

export { sendWhatsAppMessageSingle, sendWhatsAppGroupMessage, adminMainOwnerWhatsAppTemplate, groupWhatsAppTemplate };
