const express = require('express'); 
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const cors = require('cors'); // Import the cors package
const app = express();

///new//////
const bodyParser = require('body-parser');



app.use(express.static('uploads'))

// Middleware to allow CORS
// Middleware to allow CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});


//new//
app.use(bodyParser.json());

// Middleware to allow CORS
app.use(cors()); // Add this line to enable CORS for all routes
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://mukisapaul480:WdWBudse9I10jpEx@cluster0.bx0ptcd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {

}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  

// // Define schema
// const ItemSchema = new mongoose.Schema({
//   itemName: String,
//   description: String,
//   contact: String,
//   imagePath: String,
//   searchNumber: { type: Number, default: 0 } // Initialize searchNumber with a default value of 0
// });


// // Create model
// const Item = mongoose.model('Item', ItemSchema);

// // Multer storage configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   }
// });

// // Multer upload configuration
// const upload = multer({ storage });

// // POST route to handle file upload
// app.post('/api/items', upload.single('image'), (req, res) => {
//   const newItem = new Item({
//     itemName: req.body.itemName,
//     description: req.body.description,
//     contact: req.body.contact,
//     imagePath: req.file.path,
//     searchNumber: 0 
//   });

//   newItem.save()
//     .then(item => res.json(item))
//     .catch(err => console.log(err));
// });

// // GET route to fetch items from MongoDB
// app.get('/api/items', async (req, res) => {
//   try {
//     const items = await Item.find();
 
//     res.json(items);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server Error' });
//   }
// });

///////////////////////////////////////////////////////////////////////////////////////////////

// Define schema
const ItemSchema = new mongoose.Schema({
  itemName: String,
  description: String,
  contact: String,
  location: String,
  itemType: String,
  finderUsername: String,
  imagePath: String,
  searchNumber: { type: Number, default: 0 }, // Initialize searchNumber with a default value of 0
  verified: { type: Boolean, default: false } // New field for verification status
});

// Create model
const Item = mongoose.model('Item', ItemSchema);

///////////////////////////////////////////////////////////////////////////////////////////////////////
// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// Multer upload configuration
const upload = multer({ storage });

app.use(express.json());

// POST route to handle file upload
app.post('/api/items', upload.single('image'), (req, res) => {
  const newItem = new Item({
    itemName: req.body.itemName,
    description: req.body.description,
    contact: req.body.contact,
    location: req.body.location,
    itemType: req.body.itemType,
    finderUsername: req.body.finderUsername,
    imagePath: req.file.path,
    searchNumber: 0 
  });

  newItem.save()
    .then(item => res.json(item))
    .catch(err => console.log(err));
});

// GET route to fetch items from MongoDB
app.get('/api/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});



///////////////////////////////////////////////////////////////////////////////////////////////

// Update the searchNumber field for searched items
app.post('/api/search', async (req, res) => {
  try {
    const searchQuery = req.body.searchQuery.toLowerCase();
    const results = await Item.find({
      $or: [
        { description: { $regex: searchQuery, $options: 'i' } },
        { itemName: { $regex: searchQuery, $options: 'i' } }
      ]
    });

    // Increment searchNumber for each item in the results
    await Promise.all(results.map(async (item) => {
      item.searchNumber += 1;
      await item.save();
    }));

    res.json(results);
  } catch (error) {
    console.error('Error handling search:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});


// GET route to fetch lost items from MongoDB
app.get('/api/Lost', async (req, res) => {
  try {
    const items = await Lost.find();
    const totalLost = Lost.length;
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});



//lost insert

// const LostSchema = new mongoose.Schema({
//   itemName: String,
//   description: String,
//   reward: String,
//   location: String,
//   imagePath: String, // Add profilePicture field to store image path
//   searchNumber: { type: Number, default: 0 } // Initialize searchNumber with a default value of 0
// });

const LostSchema = new mongoose.Schema({
  itemName: String,
  description: String,
  reward: String,
  location: String,
  imagePath: String,
  searchNumber: { type: Number, default: 0 },
  username: String, // Add username field to store the username of the poster
});

const Lost = mongoose.model('Lost', LostSchema);




// Create model for accounts collection
// const Lost = mongoose.model('Lost', LostSchema);

// Multer storage configuration for profile pictures
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// Multer upload configuration for profile pictures
const imageUploaded = multer({ storage: imageStorage });

// // POST route to handle file upload for profile pictures
// app.post('/api/lost', imageUploaded.single('imagePath'), (req, res) => {
//   try {
//     const { itemName, description, reward, location, searchNumber } = req.body;
//     const profilePicturePath = req.file ? req.file.path : null; // Check if profile picture uploaded

//     // Create a new account document with profile picture path
//     const newAccount = new Lost({ itemName, description, reward, location, searchNumber, imagePath: profilePicturePath });

//     // Save the new account document to the database
//     newAccount.save()
//       .then(account => res.status(201).json({ message: 'Account created successfully', account }))
//       .catch(err => res.status(500).json({ message: 'Failed to create account', error: err }));
//   } catch (error) {
//     console.error('Error creating account:', error);
//     res.status(500).json({ message: 'Server Error' });
//   }
// });

// POST route to handle file upload for lost items
app.post('/api/lost', imageUploaded.single('imagePath'), (req, res) => {
  try {
    const { itemName, description, reward, location, searchNumber, username } = req.body;
    const profilePicturePath = req.file ? req.file.path : null; // Check if profile picture uploaded

    // Create a new lost item document with username
    const newLostItem = new Lost({ itemName, description, reward, location, searchNumber, imagePath: profilePicturePath, username });

    // Save the new lost item document to the database
    newLostItem.save()
      .then(item => res.status(201).json({ message: 'Item posted successfully', item }))
      .catch(err => res.status(500).json({ message: 'Failed to post item', error: err }));
  } catch (error) {
    console.error('Error posting item:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});



// Update the searchNumber field for searched Lost
app.post('/api/searchlost', async (req, res) => {
  try {
    const searchQuery = req.body.searchQuery.toLowerCase();
    const results = await Lost.find({
      $or: [
        { description: { $regex: searchQuery, $options: 'i' } },
        { itemName: { $regex: searchQuery, $options: 'i' } }
      ]
    });

    // Increment searchNumber for each item in the results
    await Promise.all(results.map(async (item) => {
      item.searchNumber += 1;
      await item.save();
    }));

    res.json(results);
  } catch (error) {
    console.error('Error handling search:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});
///////////////////////////////////////////////////////////////////////////////////////////

// Define the Information schema
const informationSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true,
  },
  information: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
}, {
  timestamps: true // Automatically add createdAt and updatedAt fields
});

// Create the Information model
const Information = mongoose.model('Information', informationSchema);



// Route to submit information
app.post('/information', async (req, res) => {
  try {
    const { itemName, information } = req.body;
    const username = req.session.user?.username; 

    // Check if the user is authenticated
    if (!username) {
      return res.status(401).send({ message: 'Unauthorized' });
    }

    // Validate input data
    if (!itemName || !information) {
      return res.status(400).send({ message: 'Please provide itemName and information' });
    }

    // Create a new Information instance
    const newInformation = new Information({
      itemName,
      information,
      username,
    });

    // Save the information to the database
    await newInformation.save();

    res.status(201).send({ message: 'Information submitted successfully!' });
  } catch (error) {
    console.error('Error submitting information:', error);
    if (error.name === 'ValidationError') {
      res.status(400).send({ message: 'Invalid data provided. Please check your inputs.' }); 
    } else {
      res.status(500).send({ message: 'Error submitting information' });
    }
  }
});

// Route to retrieve information for a specific user
app.get('/information', async (req, res) => {
  try {
    const username = req.session.user?.username; 
    if (!username) {
      console.warn('Unauthorized access attempt');
      return res.status(401).send({ message: 'Unauthorized' });
    }

    console.log("Username:", username); // Log the username for verification

    // Retrieve information from the database based on the username
    const informationList = await Information.find({ username });

    console.log('Information list:', informationList);

    // If no information is found, return a 200 with an empty array
    if (informationList.length === 0) {
      return res.status(200).send([]);
    } 

    res.status(200).send(informationList);
  } catch (error) {
    console.error('Error retrieving information:', error);
    // Handle specific errors more gracefully
    if (error.name === 'MongoNetworkError') {
      res.status(500).send({ message: 'Database connection error' });
    } else {
      res.status(500).send({ message: 'Error retrieving information' });
    }
  }
});




///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// sign up

// Define schema for accounts collection
// Define schema for accounts collection
const AccountSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  phone: String,
  profilePicture: String,
  type: { type: String, enum: ['admin', 'user'], default: 'user' } // Add type field with default value 'user' and enum constraint
});

// Create model for accounts collection
const Account = mongoose.model('Account', AccountSchema);

// Multer storage configuration for profile pictures
const profilePictureStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// Multer upload configuration for profile pictures
const profilePictureUpload = multer({ storage: profilePictureStorage });

// POST route to handle file upload for profile pictures
app.post('/api/accounts', profilePictureUpload.single('profilePicture'), (req, res) => {
  try {
    const { username, password, email, phone, type} = req.body;
    const profilePicturePath = req.file ? req.file.path : null; // Check if profile picture uploaded



    // Create a new account document with profile picture path
    const newAccount = new Account({ username, password, email, phone,type, profilePicture: profilePicturePath });

    // Save the new account document to the database
    newAccount.save()
      .then(account => res.status(201).json({ message: 'Account created successfully', account }))
      .catch(err => res.status(500).json({ message: 'Failed to create account', error: err }));
  } catch (error) {
    console.error('Error creating account:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});
//////////////////////////////////////////////////////////////////////////////////




//////////////////////////////////////////////////////////////////////



app.put('/api/items/:id', async (req, res) => {
  const { id } = req.params;
  const { itemName, description, contact } = req.body;
  
  try {
    const updatedItem = await Item.findByIdAndUpdate(id, { itemName, description, contact }, { new: true });
    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to handle deleting an item
app.delete('/api/items/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    await Item.findByIdAndDelete(id);
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////////////

// admin edit lost

app.put('/api/Lost/:id', async (req, res) => {
  const { id } = req.params;
  const { itemName, description } = req.body;
  
  try {
    const updatedItem = await Lost.findByIdAndUpdate(id, { itemName, description }, { new: true });
    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to handle deleting an item
app.delete('/api/Lost/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    await Lost.findByIdAndDelete(id);
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Define route handler for fetching all user accounts
app.get('/api/accountsfetch', async (req, res) => {
  try {
    // Fetch all user accounts from the Accounts collection
    const accounts = await Account.find();
    res.status(200).json(accounts);
  } catch (error) {
    console.error('Error fetching user accounts:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});


// Handle edit account
app.put('/api/update/:id', async (req, res) => {
  const accountId = req.params.id;
  console.log(accountId)
  const { username, email, phone, password, type } = req.body;

  try {
    const updatedAccount = await Account.findByIdAndUpdate(accountId, { username, email, phone, password, type }, { new: true });
    res.json(updatedAccount);
  } catch (error) {
    console.error('Error updating account:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Handle delete account
app.delete('/api/accounts/:id', async (req, res) => {
  const accountId = req.params.id;

  try {
    await Account.findByIdAndDelete(accountId);
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});
// Update the account schema to include email and phone
const accountSchema1 = new mongoose.Schema({
  username: String,
  password: String,
  email: String, // Add email field
  phone: String, // Add phone field
  profilePicture: String ,// Add profilePicture field to store image path
  type: String
});

const Accounts = mongoose.model('Accounts', accountSchema1);

// POST route to handle login
// POST route to handle login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user in the Accounts collection based on the provided username
    const user = await Accounts.findOne({ username });

    // If user not found, return error
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Compare passwords
    const isPasswordValid = user.password === password;

    // If passwords don't match, return error
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Log the entire user object to ensure it contains the 'type' field
    console.log('User:', user);

    // Extract userType from the user object
    const userType = user.type;

    // Log the extracted userType to ensure it's not undefined
    console.log('User type:', userType);

    // Return user details including email, phone, profile picture, and user type
    res.status(200).json({
      username: user.username,
      email: user.email,
      phone: user.phone,
      profilePicture: user.profilePicture,
      userType: userType // Include userType in the response
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

///////////////////////////////////////////////////////////////////////
app.put('/api/blacklist/:id', async (req, res) => {
  try {
    const accountId = req.params.id;
    // Logic to update blacklist status based on accountId
    // Example: Update database or data store
    res.status(200).json({ message: 'Blacklist status updated successfully' });
  } catch (error) {
    console.error('Error updating blacklist status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


//////////////////////////////////////////////////////////////////////



// Chat Schema
// const ChatSchema = new mongoose.Schema({
//   message: String,
//   username: String,
//   date: { type: Date, default: Date.now }
// });

// // Create model
// const Chat = mongoose.model('Chat', ChatSchema);

// // POST route to handle chat messages
// app.post('/api/chats', async (req, res) => {
//   try {
//     const { message, username } = req.body;
//     const newChat = new Chat({ message, username });
//     await newChat.save();
//     res.status(201).json({ message: 'Message inserted successfully' });
//   } catch (error) {
//     console.error('Error inserting message:', error);
//     res.status(500).json({ message: 'Server Error' });
//   }
// });



// // Route to fetch chats
// app.get('/api/chats', async (req, res) => {
//   try {
//     const chats = await Chat.find().sort({ createdAt: -1 }) // Fetch last 10 chats
//     res.status(200).json(chats);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server Error' });
//   }
// });

/////////////////////////////////////////////////////////////////////////////////////
// const userSchema = new mongoose.Schema({
//   username: String,
//   profilePicture: String,
//   isActive: Boolean,
// });

// const User = mongoose.model('User', userSchema);

const chatSchema = new mongoose.Schema({
  username: String,
  partner: String,
  message: String,
  date: { type: Date, default: Date.now },
  image: String, // Field for storing image filename
});

const Chat = mongoose.model('Chat', chatSchema);


const store = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const uploaded = multer({ storage: store });

app.use('/uploads', express.static('uploads'));

app.get('/api/chats', async (req, res) => {
  const { username, partner } = req.query;
  try {
    const chats = await Chat.find({
      $or: [
        { username, partner },
        { username: partner, partner: username },
      ],
    }).sort({ date: 1 });
    res.json(chats);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/api/chats', uploaded.single('image'), async (req, res) => {
  const { message, username, partner } = req.body;
  const image = req.file ? req.file.filename : null;

  try {
    const newChat = new Chat({
      message,
      username,
      partner,
      date: new Date(),
      image,
    });

    await newChat.save();

    res.status(201).json(newChat);
  } catch (error) {
    console.error('Error saving chat message:', error);
    res.status(500).send('Error saving chat message');
  }
});
///////////////////////////////////////////////////////////////////////////////////////////
// app.get('/api/unreadCounts', async (req, res) => {
//   const { username } = req.query;
//   const unreadCounts = await Chat.aggregate([
//     { $match: { partner: username, read: false } },
//     { $group: { _id: "$username", count: { $sum: 1 } } }
//   ]);
//   res.send(unreadCounts);
// });

// app.post('/api/markAsRead', async (req, res) => {
//   const { username, partner } = req.body;
//   await Chat.updateMany(
//     { partner: username, username: partner, read: false },
//     { $set: { read: true } }
//   );
//   res.send({ success: true });
// });
////////////////////////////////////////////////////////////////////////////////////////////////////////


//  `/api/unreadCounts`
app.get('/api/unreadCounts', async (req, res) => {
  try {
    const { username } = req.query;
    const unreadCounts = await Chat.aggregate([
      {
        $match: {
          partner: username,
          read: false
        }
      },
      {
        $group: {
          _id: '$username',
          count: { $sum: 1 }
        }
      }
    ]);
    // Convert the array to an object where keys are usernames
    const formattedCounts = unreadCounts.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});
    res.json(formattedCounts); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching unread counts' });
  }
});

//  `/api/markAsRead`
app.post('/api/markAsRead', async (req, res) => {
  try {
    const { username, partner } = req.body;
    await Chat.updateMany(
      {
        $or: [
          { username, partner },
          { username: partner, partner: username }
        ]
      },
      { $set: { read: true } }
    );
    res.json({ message: 'Messages marked as read' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error marking messages as read' });
  }
});


/////////////////////////////////////////////////////////////////////////////////////


// const chatSchema = new mongoose.Schema({
//   username: String,
//   partner: String,
//   message: String,
//   date: { type: Date, default: Date.now },
// });

// const Chat = mongoose.model('Chat', chatSchema);

// app.get('/api/chats', async (req, res) => {
//   const { username, partner } = req.query;
//   try {
//     const chats = await Chat.find({
//       $or: [
//         { username, partner },
//         { username: partner, partner: username },
//       ],
//     }).sort({ date: 1 });
//     res.json(chats);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });


// // API endpoint to handle POST requests for adding messages
// app.post('/api/chats', async (req, res) => {
//   const { message, username, partner } = req.body;

//   try {
//     // Create a new chat message
//     const newChat = new Chat({
//       message,
//       username,
//       partner,
//       date: new Date(), // You can also set the date on the server side
//     });

//     // Save the message to the database
//     await newChat.save();

//     // Optionally, you can respond with the saved chat message
//     res.status(201).json(newChat);
//   } catch (error) {
//     console.error('Error saving chat message:', error);
//     res.status(500).send('Error saving chat message');
//   }
// });


// app.get('/api/unreadCounts', async (req, res) => {
//   const { username } = req.query;
//   const unreadCounts = await Chat.aggregate([
//     { $match: { receiver: username, read: false } },
//     { $group: { _id: "$sender", count: { $sum: 1 } } }
//   ]);
//   res.send(unreadCounts);
// });

// app.post('/api/markAsRead', async (req, res) => {
//   const { username, partner } = req.body;
//   await Chat.updateMany(
//     { receiver: username, sender: partner, read: false },
//     { $set: { read: true } }
//   );
//   res.send({ success: true });
// });




//////////////////////////////////////////////////////////////




// Define schema for the Claim collection
// const ClaimSchema = new mongoose.Schema({
//   itemName: String,
//   description: String,
//   username: String,
//   contact: String,
//   phone:String
// });

// // Create model for the Claim collection
// const Claim = mongoose.model('Claim', ClaimSchema);

// // POST route to handle claiming items
// app.post('/claim', (req, res) => {
//   // Extract data from request body
//   const { itemName, description, username, contact, phone } = req.body;

//   // Create a new claim document
//   const newClaim = new Claim({ itemName, description, username, contact, phone });

//   // Save the new claim document to the database
//   newClaim.save()
//     .then(() => {
//       res.json({ success: true, message: 'Item claimed successfully.' });
//     })
//     .catch(err => {
//       console.error('Error claiming item:', err);
//       res.status(500).json({ success: false, message: 'Failed to claim item.' });
//     });
// });


// // GET route to fetch all claimed items from the Claim collection
// app.get('/claim', async (req, res) => {
//   try {
//     // Fetch all claimed items from the Claim collection
//     const claimedItems = await Claim.find();
//     res.status(200).json(claimedItems);
//   } catch (error) {
//     console.error('Error fetching claimed items:', error);
//     res.status(500).json({ message: 'Server Error' });
//   }
// });


/////////////////////////////////////////////////////////////




// // Define schema for the Claim collection
// const ClaimSchema = new mongoose.Schema({
//   itemName: String,
//   description: String,
//   username: String,
//   contact: String,
//   phone: String,
// });

// // Create model for the Claim collection
// const Claim = mongoose.model('Claim', ClaimSchema);

// // POST route to handle claiming items
// app.post('/claim', (req, res) => {
//   const { itemName, description, username, contact, phone } = req.body;
//   const newClaim = new Claim({ itemName, description, username, contact, phone });

//   newClaim.save()
//     .then(() => {
//       res.json({ success: true, message: 'Item claimed successfully.' });
//     })
//     .catch(err => {
//       console.error('Error claiming item:', err);
//       res.status(500).json({ success: false, message: 'Failed to claim item.' });
//     });
// });

// // GET route to fetch all claimed items from the Claim collection
// app.get('/claim', async (req, res) => {
//   try {
//     const claimedItems = await Claim.find();
//     res.status(200).json(claimedItems);
//   } catch (error) {
//     console.error('Error fetching claimed items:', error);
//     res.status(500).json({ message: 'Server Error' });
//   }
// });

// // DELETE route to delete a claimed item by ID
// app.delete('/claim/:id', async (req, res) => {
//   const { id } = req.params;
//   console.log(`Received request to delete claim with id: ${id}`); // Log the received ID
//   try {
//     const result = await Claim.findByIdAndDelete(id);
//     if (!result) {
//       console.log(`Claim with id: ${id} not found`); // Log if the claim is not found
//       return res.status(404).json({ message: 'Claim not found' });
//     }
//     console.log(`Claim with id: ${id} deleted successfully`); // Log successful deletion
//     res.status(200).json({ message: 'Claim deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting claim:', error);
//     res.status(500).json({ message: 'Failed to delete claim' });
//   }
// });

//////////////////////////////////////////////////////////////////////////////////

// app.delete('/claim/:username', async (req, res) => {
//   const { username } = req.params;
//   console.log(`Received request to delete claim with username: ${username}`);
//   try {
//     // Find and delete the claim based on username:
//     const result = await Claim.findOneAndDelete({ username }); 

//     if (!result) {
//       console.log(`Claim with username: ${username} not found`);
//       return res.status(404).json({ message: 'Claim not found' });
//     }

//     console.log(`Claim with username: ${username} deleted successfully`);
//     res.status(200).json({ message: 'Claim deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting claim:', error);
//     res.status(500).json({ message: 'Failed to delete claim' });
//   }
// });

////////////////////////////////////////////////////////////////////



// // Define schema for verify collection
// const VerifySchema = new mongoose.Schema({
//   username: String,
//   message: String,
// });

// // Create model for verify collection
// const Verify = mongoose.model('Verify', VerifySchema);

// // Route to handle POST request to /verify endpoint
// app.post('/verify', async (req, res) => {
//   try {
//     const { username, message } = req.body;

//     // Insert data into the verify collection
//     const newVerification = new Verify({
//       username,
//       message,
//     });
//     await newVerification.save();

//     res.json({ success: true, message: 'Verification inserted successfully.' });
//   } catch (error) {
//     console.error('Error inserting verification:', error);
//     res.status(500).json({ success: false, message: 'Failed to insert verification.' });
//   }
// });


// // Route to handle verification data
// // Route to handle verification data
// app.get('/verify', async (req, res) => {
//   try {
//     const { username } = req.query;
    
//     let verificationData;

//     if (username) {
//       // Fetch verification data for the specified username
//       verificationData = await Verify.find({ username });
//     } else {
//       // Fetch all verification data
//       verificationData = await Verify.find();
//     }

//     res.json(verificationData);
//   } catch (error) {
//     console.error('Error fetching verification data:', error);
//     res.status(500).json({ message: 'Server Error' });
//   }
// });


//////////////////////////////////////////////////////////////////////////////


// Define schema for the Claim collection
const ClaimSchema = new mongoose.Schema({
  itemName: String,
  description: String,
  username: String,
  contact: String,
  phone: String,
  founderUsername: { type: String }, // New field
  verified: { type: Boolean, default: false }, // Add verified field
  verification: { type: mongoose.Schema.Types.ObjectId, ref: 'Verify' }, // Reference to Verify document
  // _id: { type: mongoose.Schema.Types.ObjectId, auto: true }, // Add this line
});

// Create model for the Claim collection
const Claim = mongoose.model('Claim', ClaimSchema);



// Define schema for the Verify collection
const VerifySchema = new mongoose.Schema({
  username: String,
  message: String,
});

// Create model for the Verify collection
const Verify = mongoose.model('Verify', VerifySchema);

// POST route to handle claiming items
app.post('/claim', (req, res) => {
  const { username, itemName, description, phone, contact, founderUsername } = req.body;
  const newClaim = new Claim({ itemName, description, username, contact, phone, founderUsername });

  newClaim.save()
    .then(() => {
      res.json({ success: true, message: 'Item claimed successfully.' });
    })
    .catch(err => {
      console.error('Error claiming item:', err);
      res.status(500).json({ success: false, message: 'Failed to claim item.' });
    });
});

// GET route to fetch all claimed items from the Claim collection
// app.get('/claim', async (req, res) => {
//   try {
//     const claimedItems = await Claim.find().populate('verification'); // Populate verification data
//     //////////////
//     const populatedClaims = [];
//     for (const claim of claimedItems) {
//       try {
//         const item = await Item.findOne({ itemName: claim.itemName });
//         if (item) {
//           populatedClaims.push({ 
//             ...claim.toObject(), // Convert the claim to a plain object
//             founderUsername: item.finderUsername
//           });
//         } else {
//           populatedClaims.push({ 
//             ...claim.toObject(), // Convert the claim to a plain object
//             founderUsername: 'Unknown' 
//           });
//         }
//       } catch (itemError) {
//         console.error(`Error fetching item for claim ID ${claim._id}:`, itemError);
//         populatedClaims.push({ 
//           ...claim.toObject(), // Convert the claim to a plain object
//           founderUsername: 'Error fetching founder'
//         });
//       }
//     }

//     ///////////////
//     res.status(200).json(claimedItems);
//   } catch (error) {
//     console.error('Error fetching claimed items:', error);
//     res.status(500).json({ message: 'Server Error' });
//   }
// });
app.get('/claim', async (req, res) => {
  try {
    const claimedItems = await Claim.find().populate('verification'); // Populate verification data

    const populatedClaims = [];
    for (const claim of claimedItems) {
      try {
        const item = await Item.findOne({ itemName: claim.itemName });
        if (item) {
          populatedClaims.push({ 
            ...claim.toObject(), 
            founderUsername: item.finderUsername 
          });
        } else {
          populatedClaims.push({ 
            ...claim.toObject(), 
            founderUsername: 'Unknown' 
          });
        }
      } catch (itemError) {
        console.error(`Error fetching item for claim ID ${claim._id}:`, itemError);
        populatedClaims.push({ 
          ...claim.toObject(), 
          founderUsername: 'Error fetching founder' 
        });
      }
    }

    res.status(200).json(populatedClaims); // Send the populatedClaims array
  } catch (error) {
    console.error('Error fetching claimed items:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});
/////////////////////////////////////////////////////////////////////


// GET route to fetch all claimed items from the Claim collection
// router.get('/claim', async (req, res) => {
//   try {
//     const claimedItems = await Claim.find().populate('verification'); // Populate verification data
//     res.status(200).json(populatedClaims);
//   } catch (error) {
//     console.error('Error fetching claimed items:', error);
//     res.status(500).json({ message: 'Server Error' });
//   }
// });



/////////////////////////////////////////////////////////////////////

// DELETE route to delete a claimed item by ID
app.delete('/claim/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`Received request to delete claim with id: ${id}`);
  try {
    const result = await Claim.findByIdAndDelete(id);
    if (!result) {
      console.log(`Claim with id: ${id} not found`);
      return res.status(404).json({ message: 'Claim not found' });
    }
    console.log(`Claim with id: ${id} deleted successfully`);
    res.status(200).json({ message: 'Claim deleted successfully' });
  } catch (error) {
    console.error('Error deleting claim:', error);
    res.status(500).json({ message: 'Failed to delete claim' });
  }
});

// POST route to handle verification requests
app.post('/verify', async (req, res) => {
  try {
    const { claimId, username, message } = req.body;

    // Find the claim
    const claim = await Claim.findById(claimId);

    // If the claim doesn't exist, handle it appropriately
    if (!claim) {
      return res.status(404).json({ success: false, message: 'Claim not found.' });
    }

    // Create a new verification object
    const newVerification = new Verify({
      username,
      message,
    });
    await newVerification.save();

    // Associate the verification with the claim
    claim.verification = newVerification._id;
    claim.verified = true; // Update the verified field
    await claim.save();

    res.json({ success: true, message: 'Verification inserted successfully.' });
  } catch (error) {
    console.error('Error inserting verification:', error);
    res.status(500).json({ success: false, message: 'Failed to insert verification.' });
  }
});
//////////////////////////////////////////////////////////////////////////////////////

// GET route to handle verification data
app.get('/verify', async (req, res) => {
  try {
    const { username } = req.query;
    
    let verificationData;

    if (username) {
      // Fetch verification data for the specified username
      verificationData = await Verify.find({ username });
    } else {
      // Fetch all verification data
      verificationData = await Verify.find();
    }

    res.json(verificationData);
  } catch (error) {
    console.error('Error fetching verification data:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// In your backend (Express.js):
// app.delete('/claim/:id', async (req, res) => {
//   const { id } = req.params;
//   try {
//     const result = await Claim.findByIdAndDelete(id);
//     if (result) {
//       res.status(200).json({ message: 'Claim deleted successfully' });
//     } else {
//       res.status(404).json({ message: 'Claim not found' });
//     }
//   } catch (error) {
//     console.error('Error deleting claim:', error);
//     res.status(500).json({ message: 'Failed to delete claim' });
//   }
// });
///////////////////////////////////////////////////////////////////////////////////////////
// Define a Feedback model
const feedbackSchema = new mongoose.Schema({
  rating: Number,
  feedback: String,
  
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

// API endpoints
app.post('/api/feedback', async (req, res) => {
  try {
    const feedback = new Feedback(req.body);
    await feedback.save();
    res.status(201).send(feedback);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/api/feedback', async (req, res) => {
  try {
    const feedbacks = await Feedback.find();
    res.status(200).send(feedbacks);
  } catch (error) {
    res.status(500).send(error);
  }
});

//////////////////////////////////////////////////////////////////////////////////////


// Define mongoose schema for replies
const replySchema = new mongoose.Schema({
  username: String,
  message: String,
});

// Define mongoose model for replies
const Reply = mongoose.model('Reply', replySchema);

// Route to handle storing replies
app.post('/api/replies', async (req, res) => {
  try {
    const { username, message } = req.body;

    // Create a new reply document
    const newReply = new Reply({
      username,
      message,
    });

    // Save the reply to the database
    await newReply.save();

    // Respond with success message
    res.status(201).json({ message: 'Reply stored successfully.' });
  } catch (error) {
    // Respond with error message if something went wrong
    console.error('Error storing reply:', error);
    res.status(500).json({ error: 'An error occurred while storing the reply.' });
  }
});

////////////// modifications ////////////////////////////////////////////////////////
// Example backend route for handling replies and deleting notifications
app.post('/api/replies', async (req, res) => {
  const { username, message } = req.body;

  try {
    // Process the reply (save it, send notifications, etc.)
    // Implement your logic here

    // Example: Delete the corresponding notification from notifications data store
    // Assuming notifications are stored in an array or database
    const deletedNotification = await Notification.findOneAndDelete({ username, message });

    // Example response
    res.status(200).send({ message: 'Reply sent successfully', deletedNotification });
  } catch (error) {
    console.error('Error processing reply:', error);
    res.status(500).send({ error: 'Error processing reply' });
  }
});




////////////////////////////////////////////////////////////////////////////////////////////

// Route to handle verification data
app.get('/api/replies', async (req, res) => {
  try {
    // Fetch verification data from MongoDB
    const replyData = await Reply.find();
    res.json(replyData);
  } catch (error) {
    console.error('Error fetching reply data:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});


// Example backend route for handling replies and deleting notifications
app.post('/api/replies/delete', async (req, res) => {
  const { username, message } = req.body;

  try {
    // Process the reply (save it, send notifications, etc.)
    // Implement your logic here

    // Example: Delete the corresponding notification from notifications data store
    // Assuming notifications are stored in an array or database
    const deletedNotification = await Notification.findOneAndDelete({ username, message });

    // Example response
    res.status(200).send({ message: 'Reply sent successfully', deletedNotification });
  } catch (error) {
    console.error('Error processing reply:', error);
    res.status(500).send({ error: 'Error processing reply' });
  }
});
///////////////////////////////////////////////////////////////////////////////////////////////

// Notification Schema
// const notificationSchema = new mongoose.Schema({
//   username: {
//     type: String,
//     required: true,
//   },
//   message: {
//     type: String,
//     required: true,
//   },
//   isRead: {
//     type: Boolean,
//     default: false,
//   },
// });

// const Notification = mongoose.model('Notification', notificationSchema);


// // Get all notifications
// app.get('/verify', async (req, res) => {
//   try {
//     const { username } = req.query;
//     const notifications = await Notification.find({ username });
//     res.json(notifications);
//   } catch (error) {
//     console.error('Error fetching notifications:', error);
//     res.status(500).json({ error: 'Error fetching notifications' });
//   }
// });


/////////////////////////////////////decision works/////////////////////////////////////////
// Get all decisions **********************************************************************
// app.get('/decisions', async (req, res) => {
//   try {
//     const { username } = req.query;
//     const decisions = await Decision.find({ username });
//     res.json(decisions);
//   } catch (error) {
//     console.error('Error fetching notifications:', error);
//     res.status(500).json({ error: 'Error fetching notifications' });
//   }
// });
/// **********************************************************************************************
///////////////////////////////////////////////////////////////////////////////////////////////////

// Edit user profile
// app.put('/api/edit', async (req, res) => {
//   try {
//     const { username, email, phone } = req.body;
//     const updatedUser = await User.findOneAndUpdate(
//       { username },
//       { email, phone },
//       { new: true }
//     );
//     res.json(updatedUser);
//   } catch (error) {
//     console.error('Error updating user:', error);
//     res.status(500).json({ error: 'Error updating user' });
//   }
// });

// // Upload profile picture
// app.post('/api/profile-picture', upload.single('image'), async (req, res) => {
//   try {
//     const { username } = req.body;
//     const profilePicture = req.file.filename;
//     const updatedUser = await User.findOneAndUpdate(
//       { username },
//       { profilePicture },
//       { new: true }
//     );
//     res.json(updatedUser);
//   } catch (error) {
//     console.error('Error uploading profile picture:', error);
//     res.status(500).json({ error: 'Error uploading profile picture' });
//   }
// });

// // Handle replies
// app.post('/api/replies', async (req, res) => {
//   try {
//     const { username, message, notificationId } = req.body;
//     // Find and update the notification
//     const updatedNotification = await Notification.findOneAndUpdate(
//       { _id: notificationId },
//       { isRead: true },
//       { new: true }
//     );
//     // If the notification was found and updated, delete it
//     if (updatedNotification) {
//       await Notification.deleteOne({ _id: notificationId });
//       // Send the deleted notification in the response
//       res.json({ deletedNotification: updatedNotification });
//     } else {
//       res.status(404).json({ error: 'Notification not found' });
//     }
//   } catch (error) {
//     console.error('Error sending reply:', error);
//     res.status(500).json({ error: 'Error sending reply' });
//   }
// });

///////////////////////////////////////////////////////////////////////////////////////

// SSE route for real-time updates
// SSE route for real-time updates
app.get('/api/chats/stream', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const sendUpdate = async () => {
    try {
      const chats = await Chat.find().sort({ createdAt: -1 }).limit(10); // Fetch last 10 chats
      res.write(`data: ${JSON.stringify(chats)}\n\n`);
    } catch (err) {
      console.error(err);
      res.status(500).end(); // End the response in case of an error
    }
  };

  const intervalId = setInterval(sendUpdate, 3000); // Send updates every 3 seconds

  // Send initial data
  sendUpdate();

  req.on('close', () => {
    clearInterval(intervalId);
    res.end(); // End the response when the client connection closes
  });
});
///////////////////////////////////////////////////////////////////////

// Define the `decisions` array
// Define schema for decisions collection
const DecisionSchema = new mongoose.Schema({
  username: String,
  message: String,
  date: { type: Date, default: Date.now }
});

// Create model for decisions collection
const Decision = mongoose.model('Decision', DecisionSchema);
app.post('/decision', async (req, res) => {
  try {
    const { username, message } = req.body;

    // Create a new decision document
    const newDecision = new Decision({ username, message });

    // Save the decision to the database
    await newDecision.save();

    console.log(`Decision recorded: ${username} - ${message}`);
    res.status(200).send('Decision recorded');
  } catch (error) {
    console.error('Error recording decision:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});
// GET route to fetch all decisions from MongoDB
app.get('/decisions', async (req, res) => {
  try {
    const { username } = req.query;
    
    let verificationData;

    if (username) {
      // Fetch decision data for the specified username
      verificationData = await Decision.find({ username });
    } else {
      // Fetch all decision data
      verificationData = await Decision.find();
    }

    res.json(verificationData);
  } catch (error) {
    console.error('Error fetching verification data:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});
/////////////////////////////////////////////////////

///////////////////////////////////////////////////////

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
console.log('Server is on!');











