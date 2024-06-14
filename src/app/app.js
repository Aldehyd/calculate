require("dotenv").config({ path: "../../.env" });

const express = require("express");

const app = express();
const port = process.env.PORT || 4000;
const nodemailer = require("nodemailer");

const { MongoClient } = require("mongodb");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// const path = require("path");
// const public_path = path.join(__dirname,'/dist');
// app.use('/',express.static(public_path));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  next();
});

// app.get("*",(req,res)=> {
//     res.sendFile(path.join(public_path,'index.html'));
// });

app.get("/app/check_existing_mail", async (req, res) => {
  const uri = process.env.URI;
  console.log(uri);
  const client = new MongoClient(uri);
  const dbName = "calculate";

  try {
    await client.connect();
    const result = await client.db(dbName).collection("users").findOne({
      email: req.query.mail,
    });
    console.log(result);
    if (result !== null) {
      res.status(200).send("yes");
    } else {
      res.send("no");
    }
  } catch (err) {
    // res.send(err);
  } finally {
    await client.close();
  }
});

app.post("/app/send_mail", async (req, res) => {
  const userKey = generateRandomKey();

  async function createUser(req) {
    const uri = process.env.URI;
    const client = new MongoClient(uri);
    const dbName = "calculate";
    //create inactive user
    try {
      await client.connect();
      await client.db(dbName).collection("users").insertOne({
        email: req.body.email,
        password: req.body.password,
        active: false,
        projects: [],
      });
      //create confirmation key
      await client.db(dbName).collection("confirm-subscriptions").insertOne({
        email: req.body.email,
        key: userKey,
      });
    } catch (err) {
      // res.send(err);
    } finally {
      await client.close();
    }
  }

  createUser(req);

  let config = {
    host: "node197-eu.n0c.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  };

  let transporter = nodemailer.createTransport(config);

  const mailOptions = {
    from: "contact@dyskredy-art.com",
    to: req.body.email,
    subject: `Calculate: terminez votre inscription`,
    html: `Cliquez sur ce lien afin de terminer votre inscription : <a href="http://localhost:4200/subscription-validated?key=${userKey}">lien</a>`,
  };

  transporter
    .sendMail(mailOptions)
    .then((response) => {
      if (response.rejected.length === 0) {
        res.status(200).send("ok");
      } else {
        res.send("non ok");
      }
    })
    .catch((err) => res.send("non ok"));
});

app.get("/app/validate_subscription", async (req, res) => {
  const uri = process.env.URI;
  const client = new MongoClient(uri);
  const dbName = "calculate";
  try {
    await client.connect();
    const userToValidate = await client
      .db(dbName)
      .collection("confirm-subscriptions")
      .findOne({ key: req.query.key });
    await client
      .db(dbName)
      .collection("users")
      .findOneAndUpdate(
        { email: userToValidate.email },
        { $set: { active: true } }
      );
    await client
      .db(dbName)
      .collection("confirm-subscriptions")
      .findOneAndDelete({ email: userToValidate.email });
    res.status(200).send("ok");
  } catch (err) {
    res.send("non ok");
    console.log(err);
  } finally {
    await client.close();
  }
});

app.get("/app/check_account_active", async (req, res) => {
  const uri = process.env.URI;
  const client = new MongoClient(uri);
  const dbName = "calculate";
  try {
    await client.connect();
    const user = await client
      .db(dbName)
      .collection("users")
      .findOne({ email: req.query.mail });
    if (user.active === true) {
      res.status(200).send("ok");
    } else {
      res.send("non ok");
    }
  } catch (err) {
    res.send("non ok");
    console.log(err);
  } finally {
    await client.close();
  }
});

app.get("/app/check_password", async (req, res) => {
  const uri = process.env.URI;
  const client = new MongoClient(uri);
  const dbName = "calculate";
  try {
    await client.connect();
    const user = await client
      .db(dbName)
      .collection("users")
      .findOne({ email: req.query.mail });
    if (user.password === req.query.password) {
      res.status(200).send("ok");
    } else {
      res.send("non ok");
    }
  } catch (err) {
    res.send("non ok");
    console.log(err);
  } finally {
    await client.close();
  }
});

app.get("/app/remove_account", async (req, res) => {
  const uri = process.env.URI;
  const client = new MongoClient(uri);
  const dbName = "calculate";
  try {
    await client.connect();
    const user = await client
      .db(dbName)
      .collection("users")
      .findOneAndDelete({ email: req.query.mail });
  } catch (err) {
    res.send("non ok");
    console.log(err);
  } finally {
    await client.close();
  }
});

app.get("/app/get_projects", async (req, res) => {
  const uri = process.env.URI;
  const client = new MongoClient(uri);
  const dbName = "calculate";
  try {
    await client.connect();
    const currentUser = await client
      .db(dbName)
      .collection("users")
      .findOne({ email: req.query.mail });
    res.status(200).send(currentUser.projects);
  } catch (err) {
    res.send("non ok");
    console.log(err);
  } finally {
    await client.close();
  }
});

app.post("/app/save_project", async (req, res) => {
  const uri = process.env.URI;
  const client = new MongoClient(uri);
  const dbName = "calculate";
  try {
    await client.connect();
    const currentUser = await client
      .db(dbName)
      .collection("users")
      .findOne({ email: req.body.mail });
    console.log(currentUser);
    const currentProject = await currentUser.projects.find(
      (project) => project.name === req.body.project.name
    );
    if (currentProject) {
      console.log(currentProject);
    } else {
      await client
        .db(dbName)
        .collection("users")
        .updateOne(
          { email: req.body.mail },
          {
            $set: {
              projects: [
                ...currentUser.projects,
                {
                  id: currentUser.projects.length,
                  name: req.body.project.name,
                  tool: req.body.project.tool,
                  date: new Date(),
                },
              ],
            },
          }
        );
    }
    res.status(200).send("ok");
  } catch (err) {
    res.send("non ok");
    console.log(err);
  } finally {
    await client.close();
  }
});

app.listen(port, () => {
  console.log("starting server on port : ", port);
});

const generateRandomKey = () => {
  let key = "";

  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789²é~|èçà@$¤ù*µ!:;,.§<>*";

  while (key.length < 128) {
    const newCharacter =
      characters[Math.floor(Math.random() * characters.length)];
    key += newCharacter;
  }
  return key;
};
