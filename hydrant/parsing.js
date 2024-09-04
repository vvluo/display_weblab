// import data from "./categories.json" assert { type: 'json' };

// const fs = require("fs");
// const result = JSON.parse(fs.readFileSync("./categories.json", "utf8"));

const data = require("../hydrant/categories.json");

// let cList = ["","","","","","",];
// let vList = ["","","","","","",];
// let dtList = ["a","b","c","d","e","f",];
let sample = {
    0 : {
        type : "random",
        category : "co",
    },
    1 : {
        type : "list",
        catvals : [{category : "hh", value : "true"},
        //{category : "hh", value : "false"},
        {category : "ha", value : "true"},
        //{category : "ha", value : "false"},
        {category : "hs", value : "true"},
        //{category : "hs", value : "false"},
        {category : "hass", value : "true"},
        {category : "hass", value : "false"},
        //{category : "ci", value : "false"},
        //{category : "cw", value : "false"},
        {category : "comm", value : "false"},
        {category : "ci", value : "true"},
        {category : "cw", value : "true"},
        {category : "comm", value : "true"},],
    },
    2: {
        type : "blend",
        categories : ["lebuildings", "rcbuildings", "lbbuildings",],
    },
    3 : {
        type : "list",
        catvals : [{category : "t", value : "Spring"},
        {category : "t", value : "IAP"},
        {category : "t", value : "Fall"},
        {category : "t", value : "Summer"},
        {category : "hf", value : "1"},
        {category : "hf", value : "2"},],
    },
    4 : {
        type : "blend",
        categories : ["ledays", "rcdays", "lbdays",],
    },
    5 : {
        type :  "list",
        catvals : [{category : "ledurations", value : "1.5 hours"},
        {category : "ledurations", value : "2.0 hours"},
        {category : "ledurations", value : "1.0 hours"},
        {category : "ledurations", value : "3.0 hours"},
        {category : "ledurations", value : "2.5 hours"},
        {category : "ledurations", value : "4.0 hours"},
        {category : "ledurations", value : "3.5 hours"},
        {category : "rcdurations", value : "1.0 hours"},
        {category : "rcdurations", value : "1.5 hours"},
        {category : "rcdurations", value : "2.0 hours"},
        {category : "lbdurations", value : "1.0 hours"},
        {category : "lbdurations", value : "2.0 hours"},
        {category : "lbdurations", value : "3.0 hours"},
        {category : "lbdurations", value : "4.0 hours"},
        {category : "lbdurations", value : "1.5 hours"},],
    },
    6 : {
        type : "blend",
        categories : ["lestarts", "rcstarts", "lbstarts","lestarts", "rcstarts", "lbstarts","lenums", "rcnums", "lbnums",],
    },
    7 : {
        type : "list",
        catvals : [{category : "re", value : "true"},
        {category : "la", value : "true"},
        {category : "le", value : "G"},
        {category : "le", value : "U"},
        {category : "nx", value : "true"},
        {category : "rp", value : "true"},
        {category : "lm", value : "true"},
        {category : "pl", value : "true"},],
    },
    8 : {
        type : "blend",
        categories : ["s", "totalunits",],
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
  le: { content: "Course Level: ", type: "custom-le" },
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
  totalunits : {content : " Unit Class", type : "bval"},
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

/* groups here */
function produceCategories () {
    
    
    const categories = [];
      const values = [];
      const display_text = [];
      const r = Object.keys(data);
    
    // start
    program = [0,1,2,3,4,5,6,7,8,];
    occupied = [-1,];
    //indented
    for (let ix = 0; ix < 6; ix++){
        // console.log(program);
    
        const charged = Object.keys(program);
        let logged_int = -1;
        while (occupied.includes(logged_int)) {
            logged_int = (charged.length * Math.random()) << 0;
        };
        occupied.push(logged_int);
        const rand = charged[logged_int];
        intermed = sample[rand];
        // console.log(intermed);
        let path = intermed.type;
        // console.log(path);
        let new_cat = "";
        let new_val = "";
        // rand2 = null;
        if (path === "random") {
            new_cat = intermed["category"];
    
            const ir = Object.keys(data[new_cat]);
            const rand2 = (ir.length * Math.random()) << 0;
            new_val = ir[rand2];
        }
        else if (path === "blend") {
            const sampset = Object.keys(intermed["categories"]);
            // console.log(sampset);
            const rand3 = (sampset.length * Math.random()) << 0;
            const intermed_obj = intermed["categories"][rand3];
            new_cat = intermed_obj;
            // console.log(new_cat);
            const ir = Object.keys(data[new_cat]);
            const rand2 = (ir.length * Math.random()) << 0;
            new_val = ir[rand2];
        }
        else if (path === "list") {
            const overset = Object.keys(intermed["catvals"]);
            const rand4 = (overset.length * Math.random()) << 0;
    
            const new_obj = intermed["catvals"][rand4];
            // console.log("New Object: " + new_obj);
            new_cat = new_obj["category"];
            new_val = new_obj["value"];
        }
        // console.log(new_cat);
        let text = wordify[new_cat].content;
        const type = wordify[new_cat].type;
    
        // console.log(new_cat);
        // console.log(new_val);
        const append = new_val;
        
        if (type === "aval") {
            text = text.concat(append);
          } else if (type === "bval") {
            text = append.concat(text);
            if (append === "1") {
              text = text.slice(0, text.length-1);
            }
          } else if (type === "tf") {
            if (append === "false") {
              text = "Not ".concat(text);
            } else if (append === "true") {
              text = text;
            }
          } else if (type === "atf") {
            if (append === "false") {
              text = "No ".concat(text);
            }
            else if (append === "true") {
              text = "Has ".concat(text);
            }
          } else if (type === "custom-nx") {
            if (append === "false") {
              text = "Available Next Term";
            }
          }
            else if (type === "custom-hf") {
              if (append === "false") {
                  text = "Full Semester Course"
              }
              else if (append === "1") {
                  text = "1st ".concat(text);
              }
              else if (append === "2") {
                  text = "2nd ".concat(text);
              }
            }
            else if (type === "custom-le") {
              if (append === "G") {
                  text = text.concat("Graduate");
              }
              else if (append === "U") {
                  text = text.concat("Undergraduate");
              }
            }
      

      categories.push(new_cat);
      values.push(new_val);
      display_text.push(text);
    
      
    //   const rem_index = program.indexOf(rand);
    //   const x = program.splice(rem_index, 1);
    }


    
    return {categories : categories,
        values : values,
        display_text : display_text};

    // console.log(categories);
    // console.log(values);
    // console.log(display_text);
}

function checkNonEmpty (categories, values) {
    for (let row = 0; row < 3; row++) {
        let arr1 = data[categories[row]][values[row]];
        for (let col = 3; col < 6; col++) {
            let arr2 = data[categories[col]][values[col]];
            let intersection = arr1.filter((x) => arr2.includes(x));
            console.log(intersection.length);
            if (intersection.length <10) {
                return false;
            }
        }
    }
    return true;
}

// cList = categories;
// vList = values;
// dtList = display_text;

// let testday = new Date();
// console.log(testday.toString());
// console.log(testday.toString().slice(0,15));

// console.log(data.cl);

// const r = Object.keys(data);
// const rand_int = r.length * Math.random() <<0;
// console.log(rand_int);
// console.log(r[rand_int]);
// const res = data[r[rand_int]]

// const ir = Object.keys(res);
// const rand_int_2 = ir.length * Math.random() <<0;
// console.log(rand_int_2);
// console.log(ir[rand_int_2]);
// console.log(res[ir[rand_int_2]]);
// const cat1 = data.dedays.M
// // console.log(result);
// // console.log(cat1);
// let counter = 0;
// console.log(Object.keys(data));
// console.log(data.rcstarts["7:00 PM"]);
// console.log(data.ci["false"].includes("6.9600"));
// console.log(data.rp["true"].includes("6.9600"));
// console.log(data.u2["4"]);

// const a = "lbstarts";
// const b = "12:00 PM";
// const condr = data[a][b];
// console.log(condr)

// const c = req.body.catc;
// const d = req.body.valc;
// const condc = data[c][d];

// console.log(Object.keys(data.lbstarts));
// for (item of Object.keys(data)) {
//     console.log(Object.keys(item).length);
//     // item.forEach(item1 => {
//     //     console.log(item1);
//     //     });
//     // console.log(Object.keys(item));
//     counter++;
//     console.log("number " + counter);
// }
// const r = Object.keys(data);

// const wordify = {
//     co: { content: "Course ", type: "aval" },
//     tb: { content: "Announced Sections On Class Catalog", type: "atf" }, //to be announced
//     hh: { content: "HASS-H", type: "tf" }, //tf will be Not-space
//     ha: { content: "HASS-A", type: "tf" },
//     hs: { content: "HASS-S", type: "tf" },
//     he: { content: "HASS-E", type: "tf" },
//     ci: { content: "CI-H", type: "tf" },
//     cw: { content: "CI-HW", type: "tf" },
//     re: { content: "REST", type: "tf" },
//     la: { content: "Lab", type: "atf" },
//     pl: { content: "Partial Lab", type: "atf" },
//     u1: { content: " Lec/Rec Units", type: "bval" },
//     u2: { content: " Lab/Design Units", type: "bval" },
//     u3: { content: " Outside Prep Units", type: "bval" },
//     le: { content: "Course Level ", type: "custom-le" },
//     vu: { content: "Variable Units", type: "atf" }, //atf will be No-space
//     v: { content: "Virtual", type: "tf" },
//     nx: { content: "Not Available Next Term", type: "custom-nx" },
//     rp: { content: "Repeatable", type: "tf" },
//     hf: { content: "Half Of Semester", type: "custom-hf" },
//     f: { content: "Final", type: "atf" },
//     lm: { content: "Enrollment Limited", type: "tf" },
//     s: { content: "Class Format: ", type: "aval" },
//     t: { content: " Term", type: "bval" },
//     hass: { content: "HASS", type: "tf" },
//     comm: { content: "CI-H/HW", type: "tf" },
//     lenums: { content: " Lecture Sections", type: "bval" },
//     lerooms: { content: "Lecture In ", type: "aval" },
//     ledays: { content: " Lecture", type: "bval" },
//     lestarts: { content: "Lecture Begins ", type: "aval" },
//     ledurations: { content: "Lecture Lasts ", type: "aval" },
//     rcnums: { content: " Recitation Sections", type: "bval" },
//     rcrooms: { content: "Recitation In ", type: "aval" },
//     rcdays: { content: " Recitation", type: "bval" },
//     rcstarts: { content: "Recitation Begins ", type: "aval" },
//     rcdurations: { content: "Recitation Lasts ", type: "aval" },
//     lbnums: { content: " Lab Sections", type: "bval" },
//     lbrooms: { content: "Lab In ", type: "aval" },
//     lbdays: { content: " Lab", type: "bval" },
//     lbstarts: { content: "Lab Begins ", type: "aval" },
//     lbdurations: { content: "Lab Lasts ", type: "aval" },
//     denums: { content: " Design Sections", type: "bval" },
//     derooms: { content: "Design Section In ", type: "aval" },
//     dedays: { content: " Design Section", type: "bval" },
//     destarts: { content: "Design Section Begins ", type: "aval" },
//     dedurations: { content: "Design Section Lasts ", type: "aval" },
//   };


// // const rand_int = (r.length * Math.random()) << 0;
// // console.log(r[rand_int]);
// // //categories.push();
// // const res = data[r[rand_int]];

// // const ir = Object.keys(res);
// // const rand_int_2 = (ir.length * Math.random()) << 0;
// // console.log(ir[rand_int_2]);
// // //values.push();
// //     // console.log(res[ir[rand_int_2]]);
// // let text = wordify[r[rand_int]].content;
// // let append = ir[rand_int_2];

// // const type = wordify[r[rand_int]].type;
// // console.log(type);
// let type = "nx";
// let append = "true";
// let text = woridfy[type][append];

// if (type === "aval") {
//     text = text.concat(append);
// }
// else if (type === "bval") {
//     text = append.concat(text);
//     if (append === "1") {
//         text = text.slice(0, text.length-1);
//     }
// }
// else if (type === "tf") {
//     if (append === "true") {
//       text = "Not ".concat(text);
//     }
//     else if (append === "false") {
//       text = text;
//     }
// }
// else if (type === "atf") {
//     if (append === "true") {
//       text = "No ".concat(text);
//     }
// }
// else if (type === "custom-nx") {
//     if (append === "false") {
//       text = "Available Next Term";
//     }
// }
// else if (type === "custom-hf") {
//     if (append === "false") {
//         text = "Full Semester Course"
//     }
//     else if (append === "1") {
//         text = "1st ".concat(text);
//     }
//     else if (append === "2") {
//         text = "2nd ".concat(text);
//     }
// }
// else if (type === "custom-le") {
//     if (append === "G") {
//         text = text.concat("Graduate");
//     }
//     else if (append === "U") {
//         text = text.concat("Undergraduate");
//     }
// }

// console.log(text);
//     //display_text.push(text);
let validObj = false;
  let genObj = null;
  while (!validObj) {
    genObj = produceCategories();
    if (checkNonEmpty(genObj.categories, genObj.values)) {
      validObj = true;
    }
  }
console.log(genObj);
// let x = produceCategories();
// console.log(x);
// console.log(checkNonEmpty(x.categories, x.values));
module.exports = {produceCategories,checkNonEmpty};