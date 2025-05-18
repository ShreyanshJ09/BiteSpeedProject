const express = require('express');
const bodyParser = require('body-parser');
const Contact = require('./model/contact');

const { connectToDatabase, sequelize } = require('./connect_db');
const { Op } = require('sequelize');

const app = express();
app.use(bodyParser.json());

(async () => {
    await connectToDatabase();
    await sequelize.sync({ force: true });
})();

app.post('/identify', async (req, res) => {
  const { email, phoneNumber } = req.body;

  if (!email && !phoneNumber) {
    return res.status(400).json({ error: 'Email or phoneNumber required' });
  }

  const matchedContacts = await Contact.findAll({
    where: {
      [Op.or]: [
        { email },
        { phoneNumber }
      ]
    },
    order: [['createdAt', 'ASC']],
  });

  let primaryContact = null;
  const secondaryContacts = [];

  if (matchedContacts.length === 0) {
    primaryContact = await Contact.create({ email, phoneNumber, linkPrecedence: 'primary' });
  } else {
    primaryContact = matchedContacts.find(c => c.linkPrecedence === 'primary') || matchedContacts[0];

    for (const contact of matchedContacts) {
      if (contact.id !== primaryContact.id && contact.linkPrecedence === 'primary') {
        contact.linkPrecedence = 'secondary';
        contact.linkedId = primaryContact.id;
        await contact.save();
      }
    }

    const exists = matchedContacts.some(c => c.email === email && c.phoneNumber === phoneNumber);
    if (!exists) {
      await Contact.create({
        email,
        phoneNumber,
        linkPrecedence: 'secondary',
        linkedId: primaryContact.id
      });
    }
  }

  const allLinkedContacts = await Contact.findAll({
    where: {
      [Op.or]: [
        { id: primaryContact.id },
        { linkedId: primaryContact.id }
      ]
    },
    order: [['createdAt', 'ASC']],
  });

  const emails = [...new Set(allLinkedContacts.map(c => c.email).filter(Boolean))];
  const phoneNumbers = [...new Set(allLinkedContacts.map(c => c.phoneNumber).filter(Boolean))];
  const secondaryContactIds = allLinkedContacts.filter(c => c.linkPrecedence === 'secondary').map(c => c.id);

  res.json({
    contact: {
      primaryContactId: primaryContact.id,
      emails,
      phoneNumbers,
      secondaryContactIds
    }
  });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});