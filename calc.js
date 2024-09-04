/*
Computes categories and answer validities
*/
const data = require("../hydrant/categories.json");
const Answer = require("./models/answer");
const Parsing = require("../hydrant/parsing.js");
const games = require("./catstorage.json");

/* Warning, these lists should not be updated more than once a day in reality*/
let cList = ["", "", "", "", "", ""];
let vList = ["", "", "", "", "", ""];
let dtList = ["a", "b", "c", "d", "e", "f"];

let intersections = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

function isolateIntersections() {
  return intersections;
}

/* groups here */

let sample = {
  0: {
    type: "random",
    category: "co",
  },
  1: {
    type: "list",
    catvals: [
      { category: "hh", value: "true" },
      { category: "hh", value: "false" },
      { category: "ha", value: "true" },
      { category: "ha", value: "false" },
      { category: "hs", value: "true" },
      { category: "hs", value: "false" },
      { category: "hass", value: "true" },
      { category: "hass", value: "false" },
      { category: "ci", value: "false" },
      { category: "cw", value: "false" },
      { category: "comm", value: "false" },
      { category: "ci", value: "true" },
      { category: "cw", value: "true" },
      { category: "comm", value: "true" },
    ],
  },
  2: {
    type: "blend",
    categories: ["lebuildings", "rcbuildings", "lbbuildings"],
  },
  3: {
    type: "blend",
    categories: ["t", "hf"],
  },
  4: {
    type: "blend",
    categories: ["ledays", "rcdays", "lbdays"],
  },
  5: {
    type: "list",
    catvals: [
      { category: "ledurations", value: "1.5 hours" },
      { category: "ledurations", value: "2.0 hours" },
      { category: "ledurations", value: "1.0 hours" },
      { category: "ledurations", value: "3.0 hours" },
      { category: "rcdurations", value: "1.0 hours" },
      { category: "rcdurations", value: "1.5 hours" },
      { category: "rcdurations", value: "2.0 hours" },
      { category: "lbdurations", value: "1.0 hours" },
      { category: "lbdurations", value: "2.0 hours" },
      { category: "lbdurations", value: "3.0 hours" },
      { category: "lbdurations", value: "4.0 hours" },
      { category: "lbdurations", value: "1.5 hours" },
    ],
  },
  6: {
    type: "blend",
    catvals: ["lestarts", "rcstarts", "lbstarts"],
  },
  7: {
    type: "blend",
    catvals: ["re", "la", "pl", "le", "vu", "nx", "rp", "lm", "lenums", "rcnums", "lbnums"],
  },
  8: {
    type: "blend",
    categories: ["s", "totalunits"],
  },
};

const wordify = {
  co: { content: "Course ", type: "aval" },
  tb: { content: "Announced Sections On Class Catalog", type: "atf" }, //to be announced
  hh: { content: "HASS-H", type: "tf" }, //tf will be Not-space
  ha: { content: "HASS-A", type: "tf" },
  hs: { content: "HASS-S", type: "tf" },
  he: { content: "HASS-E", type: "tf" },
  ci: { content: "CI-H", type: "tf" },
  cw: { content: "CI-HW", type: "tf" },
  re: { content: "REST", type: "tf" },
  la: { content: "Lab", type: "atf" },
  pl: { content: "Partial Lab", type: "atf" },
  u1: { content: " Lec/Rec Units", type: "bval" },
  u2: { content: " Lab/Design Units", type: "bval" },
  u3: { content: " Outside Prep Units", type: "bval" },
  le: { content: "Course Level ", type: "custom-le" },
  vu: { content: "Variable Units", type: "atf" }, //atf will be No-space
  v: { content: "Virtual", type: "tf" },
  nx: { content: "Not Available Next Term", type: "custom-nx" },
  rp: { content: "Repeatable", type: "tf" },
  hf: { content: "Half Of Semester", type: "custom-hf" },
  f: { content: "Final", type: "atf" },
  lm: { content: "Enrollment Limited", type: "tf" },
  s: { content: "Class Format: ", type: "aval" },
  t: { content: " Term", type: "bval" },
  hass: { content: "HASS", type: "tf" },
  comm: { content: "CI-H/HW", type: "tf" },
  totalunits: { content: " Unit Class", type: "bval" },
  lenums: { content: " Lecture Sections", type: "bval" },
  lebuildings: { content: "Lecture In Building ", type: "aval" },
  lerooms: { content: "Lecture In ", type: "aval" },
  ledays: { content: " Lecture", type: "bval" },
  lestarts: { content: "Lecture Begins ", type: "aval" },
  ledurations: { content: "Lecture Lasts ", type: "aval" },
  rcnums: { content: " Recitation Sections", type: "bval" },
  rcbuildings: { content: "Recitation In Building ", type: "aval" },
  rcrooms: { content: "Recitation In ", type: "aval" },
  rcdays: { content: " Recitation", type: "bval" },
  rcstarts: { content: "Recitation Begins ", type: "aval" },
  rcdurations: { content: "Recitation Lasts ", type: "aval" },
  lbnums: { content: " Lab Sections", type: "bval" },
  lbbuildings: { content: "Lab In Building ", type: "aval" },
  lbrooms: { content: "Lab In ", type: "aval" },
  lbdays: { content: " Lab", type: "bval" },
  lbstarts: { content: "Lab Begins ", type: "aval" },
  lbdurations: { content: "Lab Lasts ", type: "aval" },
  denums: { content: " Design Sections", type: "bval" },
  debuildings: { content: "Design Section In Building ", type: "aval" },
  derooms: { content: "Design Section In ", type: "aval" },
  dedays: { content: " Design Section", type: "bval" },
  destarts: { content: "Design Section Begins ", type: "aval" },
  dedurations: { content: "Design Section Lasts ", type: "aval" },
};

// const wordify_day = {
//     "M": "Monday",
//     "T": "Tuesday",
//     "W": "Wednesday",
//     "R": "Thursday",
//     "F": "Friday",
// };

function reloadCategories(req, res) {
  let categories = [];
  let values = [];
  let display_text = [];
  const r = Object.keys(data);

  let validObj = false;
  let genObj = null;
  while (!validObj) {
    genObj = Parsing.produceCategories();
    if (Parsing.checkNonEmpty(genObj.categories, genObj.values)) {
      validObj = true;
    }
  }

  categories = genObj.categories;
  values = genObj.values;
  display_text = genObj.display_text;

  // // start
  // program = [0,1,2,3,4,5,6,7,8,];
  // occupied = [-1,];
  // //indented
  // for (let ix = 0; ix < 6; ix++){
  //     console.log(program);

  //     const charged = Object.keys(program);
  //     let logged_int = -1;
  //     while (occupied.includes(logged_int)) {
  //         logged_int = (charged.length * Math.random()) << 0;
  //     };
  //     occupied.push(logged_int);
  //     const rand = charged[logged_int];
  //     intermed = sample[rand];
  //     // console.log(intermed);
  //     let path = intermed.type;
  //     // console.log(path);
  //     let new_cat = "";
  //     let new_val = "";
  //     // rand2 = null;
  //     if (path === "random") {
  //         new_cat = intermed["category"];

  //         const ir = Object.keys(data[new_cat]);
  //         const rand2 = (ir.length * Math.random()) << 0;
  //         new_val = ir[rand2];
  //     }
  //     else if (path === "blend") {
  //         const sampset = Object.keys(intermed["categories"]);
  //         // console.log(sampset);
  //         const rand3 = (sampset.length * Math.random()) << 0;
  //         const intermed_obj = intermed["categories"][rand3];
  //         new_cat = intermed_obj;
  //         // console.log(new_cat);
  //         const ir = Object.keys(data[new_cat]);
  //         const rand2 = (ir.length * Math.random()) << 0;
  //         new_val = ir[rand2];
  //     }
  //     else if (path === "list") {
  //         const overset = Object.keys(intermed["catvals"]);
  //         const rand4 = (overset.length * Math.random()) << 0;

  //         const new_obj = intermed["catvals"][rand4];
  //         // console.log("New Object: " + new_obj);
  //         new_cat = new_obj["category"];
  //         new_val = new_obj["value"];
  //     }
  //     // console.log(new_cat);
  //     let text = wordify[new_cat].content;
  //     const type = wordify[new_cat].type;

  //     // console.log(new_cat);
  //     // console.log(new_val);
  //     const append = new_val;

  //     if (type === "aval") {
  //         text = text.concat(append);
  //       } else if (type === "bval") {
  //         text = append.concat(text);
  //         if (append === "1") {
  //           text = text.slice(0, text.length-1);
  //         }
  //       } else if (type === "tf") {
  //         if (append === "false") {
  //           text = "Not ".concat(text);
  //         } else if (append === "true") {
  //           text = text;
  //         }
  //       } else if (type === "atf") {
  //         if (append === "false") {
  //           text = "No ".concat(text);
  //         }
  //         else if (append === "true") {
  //           text = "Has ".concat(text);
  //         }
  //       } else if (type === "custom-nx") {
  //         if (append === "false") {
  //           text = "Available Next Term";
  //         }
  //       }
  //         else if (type === "custom-hf") {
  //           if (append === "false") {
  //               text = "Full Semester Course"
  //           }
  //           else if (append === "1") {
  //               text = "1st ".concat(text);
  //           }
  //           else if (append === "2") {
  //               text = "2nd ".concat(text);
  //           }
  //         }
  //         else if (type === "custom-le") {
  //           if (append === "G") {
  //               text = text.concat("Graduate");
  //           }
  //           else if (append === "U") {
  //               text = text.concat("Undergraduate");
  //           }
  //         }

  //   categories.push(new_cat);
  //   values.push(new_val);
  //   display_text.push(text);

  // //   const rem_index = program.indexOf(rand);
  // //   const x = program.splice(rem_index, 1);
  // }

  //end

  // for (let i = 0; i < 6; i++) {
  //   const rand_int = (r.length * Math.random()) << 0;
  //   // console.log(rand_int);
  //   categories.push(r[rand_int]);
  //   const res = data[r[rand_int]];

  //   const ir = Object.keys(res);
  //   const rand_int_2 = (ir.length * Math.random()) << 0;
  //   // console.log(rand_int_2);
  //   values.push(ir[rand_int_2]);
  //   // console.log(res[ir[rand_int_2]]);
  //   let text = wordify[r[rand_int]].content;
  //   let append = ir[rand_int_2];

  //   const type = wordify[r[rand_int]].type;
  //   if (type === "aval") {
  //     text = text.concat(append);
  //   } else if (type === "bval") {
  //     text = append.concat(text);
  //     if (append === "1") {
  //       text = text.slice(0, text.length-1);
  //     }
  //   } else if (type === "tf") {
  //     if (append === "false") {
  //       text = "Not ".concat(text);
  //     } else if (append === "true") {
  //       text = text;
  //     }
  //   } else if (type === "atf") {
  //     if (append === "false") {
  //       text = "No ".concat(text);
  //     }
  //     else if (append === "true") {
  //       text = "Has ".concat(text);
  //     }
  //   } else if (type === "custom-nx") {
  //     if (append === "false") {
  //       text = "Available Next Term";
  //     }
  //   }
  //     else if (type === "custom-hf") {
  //       if (append === "false") {
  //           text = "Full Semester Course"
  //       }
  //       else if (append === "1") {
  //           text = "1st ".concat(text);
  //       }
  //       else if (append === "2") {
  //           text = "2nd ".concat(text);
  //       }
  //     }
  //     else if (type === "custom-le") {
  //       if (append === "G") {
  //           text = text.concat("Graduate");
  //       }
  //       else if (append === "U") {
  //           text = text.concat("Undergraduate");
  //       }
  //     }

  //   display_text.push(text);
  // }
  cList = categories;
  vList = values;
  dtList = display_text;

  for (let rix = 0; rix < 3; rix++) {
    for (let cix = 3; cix < 6; cix++) {
      const condr = data[cList[rix]][vList[rix]];
      //     console.log(cList[rix]);
      //     console.log(vList[rix]);
      //     console.log(condr);
      const condc = data[cList[cix]][vList[cix]];
      intersections[rix][cix - 3] = condr.filter((x) => condc.includes(x));
    }
  }

  // return {cList : cList,
  //   vList : vList,
  //   dtList: dtList};

  res.send({
    rand_cat: categories,
    values: values,
    display_text: display_text,
  });
}

function generateCategories(req, res) {
  let catObj = games[new Date().toString().slice(0, 15)];
  res.send({
    rand_cat: catObj.categories,
    values: catObj.values,
    display_text: catObj.display_text,
  });
}

function calculateBonus(x, y, ans) {
  console.log(x + " " + y + " " + ans);
  console.log("intersection: " + intersections[x][y]);
  let countChosen = 0;
  let countTotal = 0;
  Answer.find({ day: new Date().toString().slice(0, 15), position_x: x, position_y: y }).then(
    (answers) => {
      console.log(answers);
      for (let answer of answers) {
        if (intersections[x][y] === null) {
          console.log("not ready");
          return 0;
        }
        if (intersections[x][y].includes(answer)) {
          countTotal++;
          if (answer === ans) {
            countChosen++;
          }
        }
      }
      return (100 * countTotal) / (countChosen + 1) + 1;
    }
  );
}

function checkValidityandScore(req, res) {
  const userId = req.body.userId;
  const guess = req.body.answerChoice;
  const x_c = req.body.r;
  const y_c = req.body.c;

  const a = req.body.catr;
  const b = req.body.valr;
  const condr = data[a][b];

  const c = req.body.catc;
  const d = req.body.valc;
  const condc = data[c][d];
  for (let a of condr) {
    if (condc.includes(a)) {
      console.log(a);
    }
  }

  let is_correct = false;
  let score = 0;
  let intersection = condr.filter((x) => condc.includes(x));

  // Answer.find({}).then(

  // );

  //if (condr.includes(guess) && condc.includes(guess)) {
  if (intersection.includes(guess)) {
    is_correct = true;
    score = 900 / intersection.length;
    score = Math.round(1000 * score) / 1000 + 10;
  }

  const newAnswer = new Answer({
    userId: userId,
    answer: guess,
    position_x: x_c,
    position_y: y_c,
    correctness: is_correct,
    score: score,
  });
  newAnswer.save();

  res.send({
    is_correct: is_correct,
    score: score,
  });
}

module.exports = {
  reloadCategories,
  generateCategories,
  checkValidityandScore,
  calculateBonus,
  isolateIntersections,
};
