/*
|--------------------------------------------------------------------------
| api.js -- server routes
|--------------------------------------------------------------------------
|
| This file defines the routes for your server.
|
*/

const express = require("express");

// import models so we can interact with the database
const User = require("./models/user");
// const Box = require("./models/box");
const Question = require("./models/question");
const Answer = require("./models/answer");
const Setting = require("./models/setting");
const Response = require("./models/response");

// import authentication library
const auth = require("./auth");
const calc = require("./calc");

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

//initialize socket
const socketManager = require("./server-socket");

//connect to JSON data file
const data = require("../hydrant/categories.json");
const names = require("../hydrant/names.json");
const { reset } = require("nodemon");
const cats = Object.keys(data);

router.post("/login", auth.login);
router.post("/logout", auth.logout);

router.get("/whoami", (req, res) => {
  if (!req.user) {
    // not logged in
    return res.send({});
  }

  res.send(req.user);
});

router.post("/initsocket", (req, res) => {
  // do nothing if user not logged in
  if (req.user)
    socketManager.addUser(req.user, socketManager.getSocketFromSocketID(req.body.socketid));
  res.send({});
});

// |------------------------------|
// | write your API methods below!|
// |------------------------------|

router.get("/displaycategories", calc.generateCategories);
// (req, res) => {
//   const rand_cat = cats.slice(0,6);
//   res.send({rand_cat});
// });

router.get("/reloadcategories", calc.reloadCategories);

router.post("/answer", calc.checkValidityandScore);

router.post("/accountreset", (req, res) => {
  Answer.deleteMany({ userId: req.body.userId }).then(console.log("request done"));
});

router.get("/stats", (req, res) => {
  let num_days_played = 0;
  let streak = 0;
  let continues = true;
  let high_score = 0;
  let score_total = 0;
  let start_date = new Date("January 20, 2024 00:00:00");
  let today_date = new Date();
  let accu_dates = [];
  let accu_dictionary = new Object();
  console.log("trying to load stats...");
  Answer.find({ userId: req.query.userId }).then((answers) => {
    console.log(answers);
    // console.log(req.query.userId);
    for (let answer of answers) {
      curdate = answer.day;
      if (!accu_dates.includes(curdate)) {
        accu_dates.push(curdate);
        accu_dictionary[curdate] = answer.score;
      } else {
        accu_dictionary[curdate] += answer.score;
      }
    }
    // console.log(accu_dates);
    // console.log(accu_dictionary);
    while (today_date >= start_date) {
      date_exp = today_date.toString().slice(0, 15);
      if (accu_dates.includes(date_exp)) {
        num_days_played++;
        // streak = 0;
        score_total += accu_dictionary[date_exp];
        if (accu_dictionary[date_exp] > high_score) {
          high_score = accu_dictionary[date_exp];
        }
        if (continues) {
          streak++;
        }
      } else {
        continues = false;
      }
      today_date.setDate(today_date.getDate() - 1);
    }
    let avg_score = "N/A";
    if (num_days_played !== 0) {
      avg_score = score_total / num_days_played;
      avg_score = Math.round(avg_score*1000)/1000;
      score_total = Math.round(score_total*1000)/1000;
    }
    res.send({ num_days_played, streak, high_score, score_total, avg_score });
  });
});

router.get("/reloadanswers", (req, res) => {
  //req.query.day
  Answer.find({ day: new Date().toString().slice(0, 15), userId: req.query.userId }).then(
    (answers) => {
      let guesses_used = answers.length;
      let num_correct = 0;
      let correct_array = [
        [false, false, false],
        [false, false, false],
        [false, false, false],
      ];
      let score_array = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ];
      let answer_array = [
        [undefined, undefined, undefined],
        [undefined, undefined, undefined],
        [undefined, undefined, undefined],
      ];
      let total_score = 0;
      for (let answer of answers) {
        if (answer.correctness) {
          num_correct++;

          let bonus = calc.calculateBonus(answer.position_x, answer.position_y, answer.answer);

          // let countChosen = 0;
          // let countTotal = 0;
          // Answer.find({day : new Date().toString().slice(0, 15), position_x : answer.position_x, position_y :  answer.position_y}).then(
          //   (finds) => {
          //     console.log(finds);
          //     for (let answer1 of finds) {
          //         let intersections = calc.isolateIntersections();
          //         let pocket = intersections[answer.position_x][answer.position_y];
          //         if (pocket === null) {
          //             console.log("not ready");
          //             bonus = 0;
          //           }
          //         else if (pocket.includes(answer1)) {
          //             countTotal++;
          //             if (answer1 === answer.answer) {
          //                 countChosen++;
          //               }
          //             }
          //           }
          //     bonus = (100*countTotal/(countChosen+1));
          //   }
          //   );

          // console.log(bonus);
          // let bonus = 0;
          total_score += answer.score;
          correct_array[answer.position_x][answer.position_y] = true;
          score_array[answer.position_x][answer.position_y] = answer.score;
          answer_array[answer.position_x][answer.position_y] = answer.answer;
        }
      }
      // total_score = Math.round(1000*total_score)/1000;
      // can do something with the answers
      res.send({
        answers,
        guesses_used,
        num_correct,
        total_score,
        correct_array,
        score_array,
        answer_array,
      });
    }
  );
});

router.get("/namedisplay", (req, res) => {
  let claimed_class = req.query.input;
  if (claimed_class in names) {
    res.send({ correctness: true, name: names[claimed_class] });
  } else {
    res.send({ correctness: false });
  }
});

// (req, res) => {
//   const userId = req.body.userId;
//   const guess = req.body.answerChoice;
//   const x_c = req.body.r;
//   const y_c = req.body.c;
//   const cond1 = data.hass.true;
//   const cond2 = data.t.JA;
//   const intersection = (cond1).filter(x => (cond2).includes(x));
//   const is_correct = intersection.includes(guess);

//   // console.log(x_c + " " + y_c);
//   // write new answer to mongo db
//   const newAnswer = new Answer({
//     userId : userId,
//     answer : guess,
//     position_x : x_c,
//     position_y : y_c,
//   });
//   newAnswer.save();

//   res.send(is_correct);
// });

router.post("/newanswer", (req, res) => {
  const client_user = req.user;
  const newAnswer = new Answer({
    userId: client_user._id,
    answer: req.query.answer,
    correctness: false,
    position: {
      x: 1,
      y: 2,
    },
  });
  newAnswer.save().then(() => {
    const filter = { userId: client_user._id };
    const update = { $push: { answers: newAnswer._id } };
    Player.findOneAndUpdate(filter, update).then(() => {
      res.send({});
    });
  });
});

router.get("/questions", (req, res) => {
  Question.findOne({ index: req.query.index }).then((question) => {
    res.send(question);
  });
});

router.get("/allquestions", (req, res) => {
  Question.find({}).then((questions) => {
    res.send(questions);
  });
});

router.get("/settings", (req, res) => {
  Setting.find({ googleid: req.query.googleid }).then((settings) => {
    res.send(settings);
  });
});

router.get("/responses", (req, res) => {
  Response.find({ userId: req.query.userId, date: req.query.date }).then((responses) => {
    res.send(responses);
  });
});

router.post("/settingschange", (req, res) => {
  Setting.findOne({ googleid: req.body.googleid, type: "toggle" }).then((setting) => {
    setting.state = req.body.state;
    setting.save();
    res.send({});
  });
});

router.post("/settings", (req, res) => {
  const newSetting = new Setting({
    googleid: req.body.googleid,
    attri: req.body.attri,
    state: req.body.state,
    type: req.body.type,
  });
  newSetting.save().then((setting) => res.send(setting));
});

// router.put("/settings", (req, res) => {});

const DEFAULT_TEXT = "Name a class ";
const DEFAULT_DAY = "01182024";

router.post("/questions", (req, res) => {
  const newQuestion = new Question({
    //_id: req.body._id,
    text: req.body.text,
    day: req.body.day,
    index: req.body.index,
  });
  newQuestion.save().then((question) => res.send(question));
});

//
router.post("/responses", (req, res) => {
  const newResponse = new Response({
    // _id: req._id,
    userId: req.body.userId,
    content: req.body.content,
    date: req.body.date,
  });
  newResponse.save().then((response) => res.send(response));
});

// router.post("/answers", (req, res) => {
//   const newAnswer = new Answer({
//     userId: req.body.userId,
//     content: req.body.content,
//   });
//   newAnswer.save().then((answer) => {
//     res.send(answer);
//   });
// });

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
