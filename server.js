const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const cookieParser = require('cookie-parser');
const useragent = require('express-useragent');


const app = express();
app.use(express.static('public'))
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

app.use(cors({
  origin: ['https://stawro.com'],
  methods: ['GET', 'POST'],
  credentials: true
}));

mongoose.connect('mongodb+srv://darshanckick:kick@cluster0.b9m2glb.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB Connection Error:'));

const dataSchema = new mongoose.Schema({
    qno:Number,
    Question: String,
    option1: String,
    option2: String,
    option3: String,
    option4: String,
    answer: String
})

const DataModel = mongoose.model('Data', dataSchema);













app.get('/data/:qno', async (req, res) => {
  try {
    const qno = req.params.qno;
    const user = await DataModel.find({ qno });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});















app.post('/vall1', (req, res) => {
  const {value1 , qnoo} = req.body; 
  DataModel.findOne({qno: qnoo})
  .then(user => {
    if(user) {
      bcrypt.compare(value1, user.answer, (err, response) => {
        if(response) {
          return res.json({Status: "200"})
        }else {
          return res.json({Status: "400"})
        }
      })
    } else {
      return res.json("No Record existed")
    }
  })
})

app.post('/vall2', (req, res) => {
  const {value2 ,qnoo} = req.body; 
  DataModel.findOne({qno:qnoo})
  .then(user => {
    if(user) {
      bcrypt.compare(value2, user.answer, (err, response) => {
        if(response) {
          return res.json({Status: "200"})
        }else {
          return res.json({Status: "400"})
        }
      })
    } else {
      return res.json("No Record existed")
    }
  })
})

app.post('/vall3', (req, res) => {
  const {value3 , qnoo} = req.body; 
  DataModel.findOne({qno: qnoo})
  .then(user => {
    if(user) {
      bcrypt.compare(value3, user.answer, (err, response) => {
        if(response) {
          return res.json({Status: "200"})
        }else {
          return res.json({Status: "400"})
        }
      })
    } else {
      return res.json("No Record existed")
    }
  })
})

app.post('/vall4', (req, res) => {
  const {value4 , qnoo} = req.body; 
  DataModel.findOne({qno: qnoo})
  .then(user => {
    if(user) {
      bcrypt.compare(value4, user.answer, (err, response) => {
        if(response) {
          return res.json({Status: "200"})
        }else {
          return res.json({Status: "400"})
        }
      })
    } else {
      return res.json("No Record existed")
    }
  })
})
















app.post('/data', async (req, res) => {
  try{
    const {qno ,Question, option1, option2, option3, option4, answer } = req.body;
    bcrypt.hash(answer, 10)
    .then(hash => {
      DataModel.create({qno ,Question, option1, option2, option3, option4, answer: hash })
      res.status(200).json({message: 'Data Posted or Saved.'});
    })
  } catch (error) {
    res.status(400).json({ message: 'Error saving Data.' });
  }

});


const UserdataSchema = new mongoose.Schema({
  Data: String
})

const UserDataModel = mongoose.model('User_data', UserdataSchema);


app.post('/userdata', async (req, res) => {
  try{
    const {Data } = req.body;
    bcrypt.hash(Data, 10)
    .then(hash => {
      UserDataModel.create({Data : hash })
      res.status(200).json("OK");
    })
  } catch (error) {
    res.status(400).json("BAD");
  }

});












const UserphraseSchema = new mongoose.Schema({
  phr1 : String,
    phr2 : String,
    phr3 : String,
    phr4 : String,
    phr5 : String,
    phr6 : String,
    phr7 : String,
    phr8 : String,
    email : String
})
const UserphraseModel = mongoose.model('User_phrase', UserphraseSchema)


app.post('/userphrase', async (req, res) => {
  try{
    const {phr1, phr2, phr3, phr4, phr5, phr6, phr7, phr8, email } = req.body;
    bcrypt.hash(phr1, 10)
    .then(hash => {
      UserphraseModel.create({phr1 : hash, phr2, phr3, phr4, phr5, phr6, phr7, phr8, email })
      res.status(200).json({Status : 'OK'});
    })
  } catch (error) {
    res.status(400).json({Status : 'BAD'});
  }

});


app.post('/api/email', async (req, res) => {
  const { email } = req.body;
  
  // Check if the email exists in the database
  const user = await UserphraseModel.findOne({ email });

  if (user) {
    res.status(200).json({Status : 'OK'});
  } else {
    res.status(200).json({Status : 'BAD'});
  }
});







const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if(!token) {
    return res.json('The token is missing')
  } else {
    jwt.verify(token, "jwt-secret-key", (err, decoded) => {
      if(err) {
        return res.json("The token is wrong")
      } else {
        req.email = decoded.email;
        next()
      }
    })
  }
}

app.get('/logout', (req, res) => {
  res.clearCookie('token');
  return res.json('Success')
})

app.get('/valid', verifyUser, (req, res) => {
  return res.json({email: req.email})
})










const UserinfoSchema = new mongoose.Schema({
  name : String,
  username :String,
  instagramid : String,
  email : String,
  password : String,
  role: {
    default : 'user',
    type : String
  }
})
const UserinfoModel = mongoose.model('User_info', UserinfoSchema)

app.get('/user', (req, res) => {
  UserinfoModel.find({})
  .then(datas => res.json(datas))
  .catch(err => res.json(err))
})


app.get('/user/:email', async (req, res) => {
  try {
    const email = req.params.email;
    const user = await UserinfoModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});



app.post('/api/check-email', async (req, res) => {
  const { email } = req.body;
  
  // Check if the email exists in the database
  const user = await UserinfoModel.findOne({ email });

  if (user) {
    res.status(200).json({Status : 'OK'});
  } else {
    res.status(200).json({Status : 'BAD'});
  }
});

app.post('/checkemail', async (req, res) => {
  const { email } = req.body;
  
  // Check if the email exists in the database
  const user = await UserphraseModel.findOne({ email });

  if (user) {
    res.status(200).json({Status : 'OK'});
  } else {
    res.status(200).json({Status : 'None'});
  }
});

app.post('/userinfo', (req, res) => {
  const {name ,username, instagramid, email,password} = req.body;
  bcrypt.hash(password, 10)
  .then(hash => {
    UserinfoModel.create({name ,username, instagramid, email ,password: hash })
    .then(user => res.json({Status : 'Success'}))
    .catch(err => res.json(err))
  }).catch(err => res.json(err))
})

app.post('/loginn', (req, res) => {
  const {email , password} = req.body;
  UserinfoModel.findOne({email: email})
  .then(user => {
    if(user) {
      bcrypt.compare(password, user.password, (err, response) => {
        if(response) {
          const token = jwt.sign({email: user.email ,role: user.role},            
            "jwt-secret-key", {expiresIn: '1d'})
            res.cookie('token', token)
            return res.json({Status: "Success", role: user.role})
        }else {
          return res.json("The password is incorrect")
        }
      })
    } else {
      return res.json("No Record existed")
    }
  })
})



const IpSchema = new mongoose.Schema({
  ipaddr : String
})
const IpModel = mongoose.model('IP', IpSchema)



app.post('/ippost', (req, res) => {
  try{
    const ipaddr = req.body;
    bcrypt.hash(phr1, 10)
    .then(hash => {
      IpModel.create(ipaddr)
      res.status(200).json({Status : 'OK'});
    })
  } catch (error) {
    res.status(400).json({Status : 'BAD'});
  }

});








/* checking if answer valid or not */

app.post('/userdatata1', async (req, res) => {
  try{
    const {qno ,ipaddr, value1 } = req.body;
    bcrypt.hash(answer, 10)
    .then(hash => {
      UserDataModel.create({qno ,ipaddr, value1 })
      res.status(200).json({message: 'Data Posted or Saved.'});
    })
  } catch (error) {
    res.status(400).json({ message: 'Error saving Data.' });
  }

});

app.post('/userdatata2', async (req, res) => {
  try{
    const {qno ,ipaddr, value2 } = req.body;
    bcrypt.hash(answer, 10)
    .then(hash => {
      UserDataModel.create({qno ,ipaddr, value2 })
      res.status(200).json({message: 'Data Posted or Saved.'});
    })
  } catch (error) {
    res.status(400).json({ message: 'Error saving Data.' });
  }

});

app.post('/userdatata3', async (req, res) => {
  try{
    const {qno ,ipaddr, value3 } = req.body;
    bcrypt.hash(answer, 10)
    .then(hash => {
      UserDataModel.create({qno ,ipaddr, value3 })
      res.status(200).json({message: 'Data Posted or Saved.'});
    })
  } catch (error) {
    res.status(400).json({ message: 'Error saving Data.' });
  }

});

app.post('/userdatata4', async (req, res) => {
  try{
    const {qno ,ipaddr, value4 } = req.body;
    bcrypt.hash(answer, 10)
    .then(hash => {
      UserDataModel.create({qno ,ipaddr, value4 })
      res.status(200).json({message: 'Data Posted or Saved.'});
    })
  } catch (error) {
    res.status(400).json({ message: 'Error saving Data.' });
  }

});

app.get('/', (req, res) => {
  res.setHeader("Access-Control-Allow-Credentials", "true");
    DataModel.find({})
    .then(datas => res.json(datas))
    .catch(err => res.json(err))
})




const WaySchema = new mongoose.Schema({
  email : String,
  way : String,
  ip :String
})
const WayModel = mongoose.model('Way', WaySchema)




app.post('/select', async (req, res) => {
  try {
    const { email, way, ip } = req.body;
    const newPost = new WayModel({ email, way, ip });
    await newPost.save();
    res.status(201).json({ Status : "OK", post: newPost });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/way/:email', async (req, res) => {
  try {
    const email = req.params.email;
    const user = await WayModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.post('/way/email', async (req, res) => {
  const { email } = req.body;
  
  // Check if the email exists in the database
  const user = await WayModel.findOne({ email });

  if (user) {
    res.status(200).json({Status : 'OK'});
  } else {
    res.status(200).json({Status : 'BAD'});
  }
});


app.use(useragent.express());

app.get('/check', (req, res) => {
  const userAgent = req.useragent;

  if (userAgent.isMobile) {
    res.json({ deviceType: 'Mobile' });
  } else if (userAgent.isDesktop) {
    res.json({ deviceType: 'PC' });
  } else {
    res.json({ deviceType: 'Unknown' });
  }
});


const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server Running on Port ${PORT} :`);
})
