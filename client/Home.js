import React, { useState, useEffect, useRef } from "react";
import { GoogleOAuthProvider, GoogleLogin, googleLogout } from "@react-oauth/google";
import { FaXmark } from "react-icons/fa6";
import NavBar from "../modules/NavBar.js";
import Log from "../modules/Log.js";
import Sudoku from "../modules/Sudoku.js";
import { get, post } from "../../utilities.js";

import "../../utilities.css";
import "./Home.css";

//TODO: REPLACE WITH YOUR OWN CLIENT_ID
const GOOGLE_CLIENT_ID =
  "1062432063556-52umh6m8agk62q69pgmdp0e31vn0qpgs.apps.googleusercontent.com";

const Home = (props) => {
  const dialogBoxRef = useRef();
  const [update, setUpdate] = useState(false);
  const [boardStatus, setBoardStatus] = useState({ row: -1, column: -1 });
  const [gameStatus, setGameStatus] = useState({
    guesses: props.guessCount,
    board: [
      [false, false, false],
      [false, false, false],
      [false, false, false],
    ],
    scores: [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ],
    answers: [
      [undefined, undefined, undefined],
      [undefined, undefined, undefined],
      [undefined, undefined, undefined],
    ],
  });
  const [boardCategories, setBoardCategories] = useState({
    dtRows: [0, 0, 0],
    dtColumns: [0, 0, 0],
  });
  const [isGray, setIsGray] = useState(false);
  const [classInput, setClassInput] = useState("");
  const [classInputName, setClassInputName] = useState("Class Not Found");
  const classInputRef = useRef("");
  const closeDialog = () => {
    dialogBoxRef.current.close();
  };
  const submitDialog = (e) => {
    if ((e.key === "Enter") & dialogBoxRef.current.open) {
      let isRepeat = false;
      for (let i = 0; i != 3; i++) {
        for (let j = 0; j != 3; j++) {
          if (gameStatus.answers[i][j] != undefined && classInput === gameStatus.answers[i][j]) {
            isRepeat = true;
          }
        }
      }
      if (isRepeat) {
        alert("Repeat Answer");
        setClassInputName("Class Not Found");
        setClassInput("");
        dialogBoxRef.current.close();
      } else {
        let queryObj = {
          userId: props.userId,
          answerChoice: classInput,
          r: boardStatus.row,
          c: boardStatus.column,
          catr: boardCategories.cRows[boardStatus.row],
          catc: boardCategories.cColumns[boardStatus.column],
          valr: boardCategories.vRows[boardStatus.row],
          valc: boardCategories.vColumns[boardStatus.column],
        };
        post("/api/answer/", queryObj).then((x) => {
          if (x.is_correct) {
            let boardCopy = [...gameStatus.board];
            let scoreCopy = [...gameStatus.scores];
            let answerCopy = [...gameStatus.answers];
            boardCopy[boardStatus.row][boardStatus.column] = true;
            scoreCopy[boardStatus.row][boardStatus.column] = x.score;
            answerCopy[boardStatus.row][boardStatus.column] = classInput;
            setGameStatus({
              guesses: gameStatus.guesses - 1,
              board: boardCopy,
              scores: scoreCopy,
              answers: answerCopy,
            });
          } else {
            setGameStatus({
              guesses: gameStatus.guesses - 1,
              board: gameStatus.board,
              scores: gameStatus.scores,
              answers: gameStatus.answers,
            });
          }
        });
        setClassInput("");
        setClassInputName("Class Not Found");
        dialogBoxRef.current.close();
      }
    }
  };
  useEffect(() => {
    window.addEventListener("keydown", submitDialog);
    get("/api/displaycategories", {}).then((x) => {
      let categoryList = {
        cRows: [],
        cColums: [],
        vRows: [],
        vColumns: [],
        dtRows: [],
        dtColumns: [],
      };
      categoryList.cRows = x.rand_cat.slice(0, 3);
      categoryList.cColumns = x.rand_cat.slice(3, 6);
      categoryList.vRows = x.values.slice(0, 3);
      categoryList.vColumns = x.values.slice(3, 6);
      categoryList.dtRows = x.display_text.slice(0, 3);
      categoryList.dtColumns = x.display_text.slice(3, 6);
      setBoardCategories(categoryList);
    });
    // remove event listener on unmount
    return () => {
      window.removeEventListener("keydown", submitDialog);
    };
  }, [classInput, boardStatus, props.userId]);
  useEffect(() => {
    if (props.userId !== undefined) {
      get("api/reloadanswers", { userId: props.userId }).then((x) => {
        setGameStatus({
          guesses: props.guessCount - x.guesses_used,
          board: x.correct_array,
          scores: x.score_array,
          answers: x.answer_array,
        });
      });
    }
    if (props.userId === undefined) {
      setGameStatus({
        guesses: props.guessCount,
        board: [
          [false, false, false],
          [false, false, false],
          [false, false, false],
        ],
        scores: [
          [0, 0, 0],
          [0, 0, 0],
          [0, 0, 0],
        ],
        answers: [
          [undefined, undefined, undefined],
          [undefined, undefined, undefined],
          [undefined, undefined, undefined],
        ],
      });
    }
  }, [props.userId, props.gameStatus, update]);
  const openDialog = (sRow, sColumn) => {
    dialogBoxRef.current.showModal();
    setBoardStatus({ row: sRow, column: sColumn });
  };
  const alertNotLoggedIn = () => {
    alert("Not logged in!");
  };
  const alertNoMoreGuesses = () => {
    alert("No More Guesses!");
  };
  return (
    <div>
      <NavBar
        userId={props.userId}
        handleLogin={props.handleLogin}
        handleLogout={props.handleLogout}
        mode={props.mode}
        setMode={props.setMode}
        setAttributes={props.setAttributes}
        attributes={props.attributes}
        isAdmin={props.isAdmin}
        answered={props.answered}
      />
      <dialog ref={dialogBoxRef} className="Home-dialog">
        <span className="Home-dialog-x">
          {isGray ? (
            <FaXmark
              onMouseOver={() => {
                setIsGray(true);
              }}
              onMouseOut={() => {
                setIsGray(false);
              }}
              onClick={() => {
                closeDialog();
                setClassInput("");
              }}
              color="#888888"
            ></FaXmark>
          ) : (
            <FaXmark
              onMouseOver={() => {
                setIsGray(true);
              }}
              onMouseOut={() => {
                setIsGray(false);
              }}
              color="#000000"
            ></FaXmark>
          )}
        </span>
        <span className="u-flex">
          Answer for row #{boardStatus.row + 1}, column #{boardStatus.column + 1}
        </span>
        <input
          className="Home-dialog-input"
          value={classInput}
          placeholder="6.1200"
          onChange={(e) => {
            setClassInput(e.target.value);
            classInputRef.current = e.target.value;
            get("/api/namedisplay", { input: e.target.value }).then((x) => {
              if (x.correctness) {
                setClassInputName(x.name);
              } else {
                setClassInputName("Class Not Found");
              }
            });
          }}
        ></input>
        <span className="u-flex">
          Class Name: <i> {classInputName}</i>
        </span>
      </dialog>

      {props.userId ? (
        <>
          {gameStatus.guesses > 0 ? (
            <Sudoku
              userId={props.userId}
              setBoardStatus={(x, y) => {
                openDialog(x, y);
              }}
              gameStatus={gameStatus.board}
              scores={gameStatus.scores}
              answers={gameStatus.answers}
              categories={boardCategories}
              mode={props.mode}
            />
          ) : (
            <Sudoku
              userId={props.userId}
              setBoardStatus={(x, y) => {
                alertNoMoreGuesses();
              }}
              gameStatus={gameStatus.board}
              scores={gameStatus.scores}
              answers={gameStatus.answers}
              categories={boardCategories}
              mode={props.mode}
            />
          )}
        </>
      ) : (
        <Sudoku
          userId={props.userId}
          setBoardStatus={() => {
            alertNotLoggedIn();
          }}
          gameStatus={gameStatus.board}
          scores={gameStatus.scores}
          answers={gameStatus.answers}
          categories={boardCategories}
          mode={props.mode}
        />
      )}
      <div class="padding-bottom: 20px;">"" </div>
      <div className={props.mode === "dark" ? "Home-rem-guess-dark" : "Home-rem-guess-light"}>
        Remaining Guesses: {gameStatus.guesses}
      </div>
      <div className={props.mode === "dark" ? "Home-rem-guess-dark" : "Home-rem-guess-light"}>
        Total Score:{" "}
        {gameStatus.scores[0][0] +
          gameStatus.scores[0][1] +
          gameStatus.scores[0][2] +
          gameStatus.scores[1][0] +
          gameStatus.scores[1][1] +
          gameStatus.scores[1][2] +
          gameStatus.scores[2][0] +
          gameStatus.scores[2][1] +
          gameStatus.scores[2][2]}
      </div>
    </div>
  );
};

export default Home;
/*

  const reloadButton = () => {
    get("/api/reloadcategories", {});
  };


      <div>
        <button onClick={reloadButton}>Reload Categories</button>
      </div>
  */
