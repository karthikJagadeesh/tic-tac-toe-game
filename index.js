(function() {

  var pawn = "";
  var stage = new createjs.Stage("canvas");
  stage.enableMouseOver(10)
  var preload = new createjs.LoadQueue(false);

  preload.loadManifest([{
    id: "board",
    src: "https://i.imgsafe.org/6536c14.png"
  }, {
    id: "o",
    src: "https://i.imgsafe.org/ae54235.png"
  }, {
    id: "x",
    src: "https://i.imgsafe.org/afb8c58.png"
  }]);
  preload.on("complete", handleComplete)

  //after asset load completion
  function handleComplete() {
    //var pawn = "";
    var dialogBox = new createjs.Container();
    dialogBox.x = 140, dialogBox.y = 135, dialogBox.regX = 140, dialogBox.regY = 90;
    dialogBox.scaleX = dialogBox.scaleY = 3, dialogBox.alpha = 0;

    var shape = new createjs.Shape();
    shape.graphics.beginFill("#ea6052").drawRect(10, 15, 280, 180);

    var headingBackground = new createjs.Shape();
    headingBackground.graphics.beginFill("#7E332B").drawRect(10, 15, 280, 70);

    var headingText = new createjs.Text("TIC TAC TOE", "40px Work Sans", "#FFF");
    headingText.x = 34, headingText.y = 25

    var xButton = new createjs.Container();
    var xText = new createjs.Text("x", "40px Work Sans", "#7E332B");
    xText.x = -11, xText.y = -25;

    xButton.x = 80;
    xButton.y = 140;
    var xShape = new createjs.Shape();
    xShape.graphics.beginFill("white").drawCircle(0, 0, 40);
    xButton.addChild(xShape, xText);

    var orText = new createjs.Text("or", "30px Work Sans", "#FFF");
    orText.x = 135, orText.y = 120;

    var yButton = new createjs.Container();
    yButton.x = 220;
    yButton.y = 140;

    var yText = new createjs.Text("o", "40px Work Sans", "#7E332B");
    yText.x = -11, yText.y = -25;
    var yShape = new createjs.Shape();
    yShape.graphics.beginFill("white").drawCircle(0, 0, 40);
    yButton.addChild(yShape, yText);

    dialogBox.addChild(shape, headingBackground, headingText, xButton, orText, yButton);
    stage.addChild(dialogBox);

    createjs.Tween.get(dialogBox).to({
      alpha: 1,
      scaleX: 1,
      scaleY: 1
    }, 2000, createjs.Ease.bounceInOut)
    createjs.Ticker.setFPS(60)
    createjs.Ticker.addEventListener("tick", stage)

    //buttons hover and click
    xButton.on("mouseover", function() {
      xShape.graphics.beginFill("#006064").drawCircle(0, 0, 40);
      xText.color = "white"
      createjs.Tween.get(xButton).to({
        rotation: 45
      }, 100, createjs.Ease.cubeIn)
    });
    xButton.on("mouseout", function() {
      xShape.graphics.beginFill("white").drawCircle(0, 0, 40);
      xText.color = "#7E332B"
      createjs.Tween.get(xButton).to({
        rotation: 0
      }, 100, createjs.Ease.cubeIn)
    });

    yButton.on("mouseover", function() {
      yShape.graphics.beginFill("#006064").drawCircle(0, 0, 40);
      yText.color = "white"
      createjs.Tween.get(yButton).to({
        rotation: -45
      }, 100, createjs.Ease.cubeIn)
    });
    yButton.on("mouseout", function() {
      yShape.graphics.beginFill("white").drawCircle(0, 0, 40);
      yText.color = "#7E332B"
      createjs.Tween.get(yButton).to({
        rotation: 0
      }, 100, createjs.Ease.cubeIn)
    });

    xButton.on("click", function() {
      pawn = "x"
      createjs.Tween.get(dialogBox).to({
        alpha: 0,
        scaleX: 3,
        scaleY: 3
      }, 2000, createjs.Ease.bounceInOut).call(function() {
        dialogBox.removeAllChildren();
        stage.removeAllEventListeners();
        startGame(pawn)
      })
    });
    yButton.on("click", function() {
      pawn = "y"
      createjs.Tween.get(dialogBox).to({
        alpha: 0,
        scaleX: 3,
        scaleY: 3
      }, 2000, createjs.Ease.bounceInOut).call(function() {
        dialogBox.removeAllChildren();
        stage.removeAllEventListeners();
        startGame(pawn)
      })
    });

  }

  //START THE GAME
  function startGame(pawn) {

    startGame.playerTurn = false;
    startGame.botMoves = 1;
    startGame.winner = "";

    var boardPic = new createjs.Bitmap(preload.getResult("board"));
    var oPic = new createjs.Bitmap(preload.getResult("o"));
    var xPic = new createjs.Bitmap(preload.getResult("x"));
    var board = { //pawn positions on the board
      "0": {
        x: 28,
        y: 32,
        hitTarget: new createjs.Shape(),
        present: false,
        content: ""
      },
      "1": {
        x: 130,
        y: 32,
        hitTarget: new createjs.Shape(),
        present: false,
        content: ""
      },
      "2": {
        x: 232,
        y: 32,
        hitTarget: new createjs.Shape(),
        present: false,
        content: ""
      },
      "3": {
        x: 28,
        y: 132,
        hitTarget: new createjs.Shape(),
        present: false,
        content: ""
      },
      "4": {
        x: 130,
        y: 132,
        hitTarget: new createjs.Shape(),
        present: false,
        content: ""
      },
      "5": {
        x: 232,
        y: 132,
        hitTarget: new createjs.Shape(),
        present: false,
        content: ""
      },
      "6": {
        x: 28,
        y: 232,
        hitTarget: new createjs.Shape(),
        present: false,
        content: ""
      },
      "7": {
        x: 130,
        y: 232,
        hitTarget: new createjs.Shape(),
        present: false,
        content: ""
      },
      "8": {
        x: 232,
        y: 232,
        hitTarget: new createjs.Shape(),
        present: false,
        content: ""
      },
    }

    var targetOne = new createjs.Shape()
    targetOne.graphics.beginFill("white").drawRect(2, 2, 94, 94)
    board[0].hitTarget = targetOne

    var targetOne = new createjs.Shape()
    targetOne.graphics.beginFill("white").drawRect(102, 2, 94, 94)
    board[1].hitTarget = targetOne

    var targetOne = new createjs.Shape()
    targetOne.graphics.beginFill("white").drawRect(202, 2, 94, 94)
    board[2].hitTarget = targetOne

    var targetOne = new createjs.Shape()
    targetOne.graphics.beginFill("white").drawRect(2, 103, 94, 94)
    board[3].hitTarget = targetOne

    var targetOne = new createjs.Shape()
    targetOne.graphics.beginFill("white").drawRect(102, 103, 94, 94)
    board[4].hitTarget = targetOne

    var targetOne = new createjs.Shape()
    targetOne.graphics.beginFill("white").drawRect(202, 103, 94, 94)
    board[5].hitTarget = targetOne

    var targetOne = new createjs.Shape()
    targetOne.graphics.beginFill("white").drawRect(2, 203, 94, 94)
    board[6].hitTarget = targetOne

    var targetOne = new createjs.Shape()
    targetOne.graphics.beginFill("white").drawRect(102, 203, 94, 94)
    board[7].hitTarget = targetOne

    var targetOne = new createjs.Shape()
    targetOne.graphics.beginFill("white").drawRect(202, 203, 94, 94)
    board[8].hitTarget = targetOne

    var bot, player;
    if (pawn == "x")
      bot = oPic, player = xPic;
    else
      bot = xPic, player = oPic;

    var r = parseInt(Math.random() * 100);
    if (r <= 15) {
      bot.x = board[0].x
      bot.y = board[0].y
      board[0].present = true
      board[0].content = "bot"
    } else if (r <= 30 && r > 15) {
      bot.x = board[2].x
      bot.y = board[2].y
      board[2].present = true
      board[2].content = "bot"
    } else if (r <= 45 && r > 30) {
      bot.x = board[6].x
      bot.y = board[6].y
      board[6].present = true
      board[6].content = "bot"
    } else if (r <= 60 && r > 45) {
      bot.x = board[8].x
      bot.y = board[8].y
      board[8].present = true
      board[8].content = "bot"
    } else if (r <= 100 && r > 60) {
      bot.x = board[4].x
      bot.y = board[4].y
      board[4].present = true
      board[4].content = "bot"
    }
    createjs.Ticker.setFPS(60) //remove ticker afterwards
    createjs.Ticker.addEventListener("tick", stage)
    createjs.Tween.get(bot).to({
      scaleX: 1.2,
      scaleY: 1.2
    }, 200, createjs.Ease.circIn).to({
      scaleX: 1,
      scaleY: 1
    }, 200, createjs.Ease.bounceOut);

    stage.addChild(boardPic, board[0].hitTarget, board[1].hitTarget, board[2].hitTarget, board[3].hitTarget, board[4].hitTarget, board[5].hitTarget, board[6].hitTarget, board[7].hitTarget, board[8].hitTarget, bot);

    startGame.playerTurn = true;

    board[0].hitTarget.on("click", function() {
      if (!board[0].present && startGame.playerTurn) {
        startGame.playerTurn = false;
        var p0 = Object.create(player);
        p0.x = board[0].x, p0.y = board[0].y;
        createjs.Tween.get(p0).call(function() {
          stage.addChild(p0);
        }).to({
          scaleX: 1.2,
          scaleY: 1.2
        }, 200, createjs.Ease.circIn).to({
          scaleX: 1,
          scaleY: 1
        }, 200, createjs.Ease.bounceOut).call(function() {
          board[0].present = true;
          board[0].content = "player";
          if (checkForResult())
            endGame()
          else {
            spawnBot()
          }
        });
      }
    })
    board[1].hitTarget.on("click", function() {
      if (!board[1].present && startGame.playerTurn) {
        startGame.playerTurn = false;
        var p1 = Object.create(player);
        p1.x = board[1].x, p1.y = board[1].y;
        createjs.Tween.get(p1).call(function() {
          stage.addChild(p1);
        }).to({
          scaleX: 1.2,
          scaleY: 1.2
        }, 200, createjs.Ease.circIn).to({
          scaleX: 1,
          scaleY: 1
        }, 200, createjs.Ease.bounceOut).call(function() {
          board[1].present = true;
          board[1].content = "player";
          if (checkForResult())
            endGame()
          else {
            spawnBot()
          }
        });
      }
    })
    board[2].hitTarget.on("click", function() {
      if (!board[2].present && startGame.playerTurn) {
        startGame.playerTurn = false;
        var p2 = Object.create(player);
        p2.x = board[2].x, p2.y = board[2].y;
        createjs.Tween.get(p2).call(function() {
          stage.addChild(p2);
        }).to({
          scaleX: 1.2,
          scaleY: 1.2
        }, 200, createjs.Ease.circIn).to({
          scaleX: 1,
          scaleY: 1
        }, 200, createjs.Ease.bounceOut).call(function() {
          board[2].present = true;
          board[2].content = "player";
          if (checkForResult())
            endGame()
          else {
            spawnBot()
          }
        });
      }
    })
    board[3].hitTarget.on("click", function() {
      if (!board[3].present && startGame.playerTurn) {
        startGame.playerTurn = false;
        var p3 = Object.create(player);
        p3.x = board[3].x, p3.y = board[3].y;
        createjs.Tween.get(p3).call(function() {
          stage.addChild(p3);
        }).to({
          scaleX: 1.2,
          scaleY: 1.2
        }, 200, createjs.Ease.circIn).to({
          scaleX: 1,
          scaleY: 1
        }, 200, createjs.Ease.bounceOut).call(function() {
          board[3].present = true;
          board[3].content = "player";
          if (checkForResult())
            endGame()
          else {
            spawnBot()
          }
        });
      }
    })
    board[4].hitTarget.on("click", function() {
      if (!board[4].present && startGame.playerTurn) {
        startGame.playerTurn = false;
        var p4 = Object.create(player);
        p4.x = board[4].x, p4.y = board[4].y;
        createjs.Tween.get(p4).call(function() {
          stage.addChild(p4);
        }).to({
          scaleX: 1.2,
          scaleY: 1.2
        }, 200, createjs.Ease.circIn).to({
          scaleX: 1,
          scaleY: 1
        }, 200, createjs.Ease.bounceOut).call(function() {
          board[4].present = true;
          board[4].content = "player";
          if (checkForResult())
            endGame()
          else {
            spawnBot()
          }
        });
      }
    })
    board[5].hitTarget.on("click", function() {
      if (!board[5].present && startGame.playerTurn) {
        startGame.playerTurn = false;
        var p5 = Object.create(player);
        p5.x = board[5].x, p5.y = board[5].y;
        createjs.Tween.get(p5).call(function() {
          stage.addChild(p5);
        }).to({
          scaleX: 1.2,
          scaleY: 1.2
        }, 200, createjs.Ease.circIn).to({
          scaleX: 1,
          scaleY: 1
        }, 200, createjs.Ease.bounceOut).call(function() {
          board[5].present = true;
          board[5].content = "player";
          if (checkForResult())
            endGame()
          else {
            spawnBot()
          }
        });
      }
    })
    board[6].hitTarget.on("click", function() {
      if (!board[6].present && startGame.playerTurn) {
        startGame.playerTurn = false;
        var p6 = Object.create(player);
        p6.x = board[6].x, p6.y = board[6].y;
        createjs.Tween.get(p6).call(function() {
          stage.addChild(p6);
        }).to({
          scaleX: 1.2,
          scaleY: 1.2
        }, 200, createjs.Ease.circIn).to({
          scaleX: 1,
          scaleY: 1
        }, 200, createjs.Ease.bounceOut).call(function() {
          board[6].present = true;
          board[6].content = "player";
          if (checkForResult())
            endGame()
          else {
            spawnBot()
          }
        });
      }
    })
    board[7].hitTarget.on("click", function() {
      if (!board[7].present && startGame.playerTurn) {
        console.log("clicked")
        startGame.playerTurn = false;
        var p7 = Object.create(player);
        p7.x = board[7].x, p7.y = board[7].y;
        createjs.Tween.get(p7).call(function() {
          stage.addChild(p7);
        }).to({
          scaleX: 1.2,
          scaleY: 1.2
        }, 200, createjs.Ease.circIn).to({
          scaleX: 1,
          scaleY: 1
        }, 200, createjs.Ease.bounceOut).call(function() {
          board[7].present = true;
          board[7].content = "player";
          if (checkForResult())
            endGame()
          else {
            spawnBot()
          }
        });
      }
    })
    board[8].hitTarget.on("click", function() {
      if (!board[8].present && startGame.playerTurn) {
        startGame.playerTurn = false;
        var p8 = Object.create(player);
        p8.x = board[8].x, p8.y = board[8].y;
        createjs.Tween.get(p8).call(function() {
          stage.addChild(p8);
        }).to({
          scaleX: 1.2,
          scaleY: 1.2
        }, 200, createjs.Ease.circIn).to({
          scaleX: 1,
          scaleY: 1
        }, 200, createjs.Ease.bounceOut).call(function() {
          board[8].present = true;
          board[8].content = "player";
          if (checkForResult())
            endGame()
          else {
            spawnBot()
          }
        });
      }
    })

    //BOT SPAWNING
    function spawnBot() {
      startGame.botMoves++;
      var b = Object.create(bot);
      var keys = Object.keys(board);
      var available = keys.filter(function(item) {
        return !board[item].present
      });

      if (startGame.botMoves == 2) { //2nd Move of Bot
        if (!board[0].present && board[4].content !== "player") {
          b.x = board[0].x, b.y = board[0].y;
          board[0].present = true;
          board[0].content = "bot";
        } else if (!board[2].present) {
          b.x = board[2].x, b.y = board[2].y;
          board[2].present = true;
          board[2].content = "bot";
        } else if (!board[6].present) {
          b.x = board[6].x, b.y = board[6].y;
          board[6].present = true;
          board[6].content = "bot";
        } else if (!board[8].present) {
          b.x = board[8].x, b.y = board[8].y;
          board[8].present = true;
          board[8].content = "bot";
        }

        createjs.Tween.get(b).wait(600).call(function() {
          stage.addChild(b);
        }).to({
          scaleX: 1.2,
          scaleY: 1.2
        }, 200, createjs.Ease.circIn).to({
          scaleX: 1,
          scaleY: 1
        }, 200, createjs.Ease.bounceOut).call(function() {
          startGame.playerTurn = true;
        })
        startGame.botMoves++;
      } //2nd Move
      else if (startGame.botMoves > 2) { //after bot's 2nd Move
        var nextPos = botNextMove();
        b.x = nextPos.x, b.y = nextPos.y;
        createjs.Tween.get(b).wait(600).call(function() {
          stage.addChild(b);
        }).to({
          scaleX: 1.2,
          scaleY: 1.2
        }, 200, createjs.Ease.circIn).to({
          scaleX: 1,
          scaleY: 1
        }, 200, createjs.Ease.bounceOut).call(function() {
          if(checkForResult())
            endGame()
          else
            startGame.playerTurn = true;
        })
      }

    }

    function botNextMove() {
      var keys = Object.keys(board);
      var pawnPresent = keys.filter(function(item) {
        return !board[item].present;
      });

      //BOT
      //Now check if bot is winning the same way as above
      if (board[0].content == "bot" && board[2].content == "bot" && !board[1].present) {
        board[1].present = true;
        board[1].content = "bot";
        return {
          x: board[1].x,
          y: board[1].y
        }
      } else if (board[2].content == "bot" && board[8].content == "bot" && !board[5].present) {
        board[5].present = true;
        board[5].content = "bot";
        return {
          x: board[5].x,
          y: board[5].y
        }
      } else if (board[6].content == "bot" && board[8].content == "bot" && !board[7].present) {
        board[7].present = true;
        board[7].content = "bot";
        return {
          x: board[7].x,
          y: board[7].y
        }
      } else if (board[0].content == "bot" && board[6].content == "bot" && !board[3].present) {
        board[3].present = true;
        board[3].content = "bot";
        return {
          x: board[3].x,
          y: board[3].y
        }
      } else if (board[1].content == "bot" && board[7].content == "bot" && !board[4].present) {
        board[4].present = true;
        board[4].content = "bot";
        return {
          x: board[4].x,
          y: board[4].y
        }
      } else if (board[3].content == "bot" && board[5].content == "bot" && !board[4].present) {
        board[4].present = true;
        board[4].content = "bot";
        return {
          x: board[4].x,
          y: board[4].y
        }
      } else if (board[0].content == "bot" && board[8].content == "bot" && !board[4].present) {
        board[4].present = true;
        board[4].content = "bot";
        return {
          x: board[4].x,
          y: board[4].y
        }
      } else if (board[2].content == "bot" && board[6].content == "bot" && !board[4].present) {
        board[4].present = true;
        board[4].content = "bot";
        return {
          x: board[4].x,
          y: board[4].y
        }
      }

      //check for adjacent BOTS the same way

      if (board[0].content == "bot" && board[1].content == "bot" && !board[2].present) {
        board[2].present = true;
        board[2].content = "bot";
        return {
          x: board[2].x,
          y: board[2].y
        }
      } else if (board[1].content == "bot" && board[2].content == "bot" && !board[0].present) {
        board[0].present = true;
        board[0].content = "bot";
        return {
          x: board[0].x,
          y: board[0].y
        }
      } else if (board[2].content == "bot" && board[5].content == "bot" && !board[8].present) {
        board[8].present = true;
        board[8].content = "bot";
        return {
          x: board[8].x,
          y: board[8].y
        }
      } else if (board[5].content == "bot" && board[8].content == "bot" && !board[2].present) {
        board[2].present = true;
        board[2].content = "bot";
        return {
          x: board[2].x,
          y: board[2].y
        }
      } else if (board[6].content == "bot" && board[7].content == "bot" && !board[8].present) {
        board[8].present = true;
        board[8].content = "bot";
        return {
          x: board[8].x,
          y: board[8].y
        }
      } else if (board[7].content == "bot" && board[8].content == "bot" && !board[6].present) {
        board[6].present = true;
        board[6].content = "bot";
        return {
          x: board[6].x,
          y: board[6].y
        }
      } else if (board[0].content == "bot" && board[3].content == "bot" && !board[6].present) {
        board[6].present = true;
        board[6].content = "bot";
        return {
          x: board[6].x,
          y: board[6].y
        }
      } else if (board[3].content == "bot" && board[6].content == "bot" && !board[0].present) {
        board[0].present = true;
        board[0].content = "bot";
        return {
          x: board[0].x,
          y: board[0].y
        }
      } else if (board[1].content == "bot" && board[4].content == "bot" && !board[7].present) {
        board[7].present = true;
        board[7].content = "bot";
        return {
          x: board[7].x,
          y: board[7].y
        }
      } else if (board[7].content == "bot" && board[4].content == "bot" && !board[1].present) {
        board[1].present = true;
        board[1].content = "bot";
        return {
          x: board[1].x,
          y: board[1].y
        }
      } else if (board[3].content == "bot" && board[4].content == "bot" && !board[5].present) {
        board[5].present = true;
        board[5].content = "bot";
        return {
          x: board[5].x,
          y: board[5].y
        }
      } else if (board[4].content == "bot" && board[5].content == "bot" && !board[3].present) {
        board[3].present = true;
        board[3].content = "bot";
        return {
          x: board[3].x,
          y: board[3].y
        }
      } else if (board[0].content == "bot" && board[4].content == "bot" && !board[8].present) {
        board[8].present = true;
        board[8].content = "bot";
        return {
          x: board[8].x,
          y: board[8].y
        }
      } else if (board[4].content == "bot" && board[8].content == "bot" && !board[0].present) {
        board[0].present = true;
        board[0].content = "bot";
        return {
          x: board[0].x,
          y: board[0].y
        }
      } else if (board[6].content == "bot" && board[4].content == "bot" && !board[2].present) {
        board[2].present = true;
        board[2].content = "bot";
        return {
          x: board[2].x,
          y: board[2].y
        }
      } else if (board[2].content == "bot" && board[4].content == "bot" && !board[6].present) {
        board[6].present = true;
        board[6].content = "bot";
        return {
          x: board[6].x,
          y: board[6].y
        }
      }

      //test if player is Winning by checking if there is player pawns in corners and nothing inbetween
      if (board[0].content == "player" && board[2].content == "player" && !board[1].present) {
        board[1].present = true;
        board[1].content = "bot";
        return {
          x: board[1].x,
          y: board[1].y
        }
      } else if (board[2].content == "player" && board[8].content == "player" && !board[5].present) {
        board[5].present = true;
        board[5].content = "bot";
        return {
          x: board[5].x,
          y: board[5].y
        }
      } else if (board[6].content == "player" && board[8].content == "player" && !board[7].present) {
        board[7].present = true;
        board[7].content = "bot";
        return {
          x: board[7].x,
          y: board[7].y
        }
      } else if (board[0].content == "player" && board[6].content == "player" && !board[3].present) {
        board[3].present = true;
        board[3].content = "bot";
        return {
          x: board[3].x,
          y: board[3].y
        }
      } else if (board[1].content == "player" && board[7].content == "player" && !board[4].present) {
        board[4].present = true;
        board[4].content = "bot";
        return {
          x: board[4].x,
          y: board[4].y
        }
      } else if (board[3].content == "player" && board[5].content == "player" && !board[4].present) {
        board[4].present = true;
        board[4].content = "bot";
        return {
          x: board[4].x,
          y: board[4].y
        }
      } else if (board[0].content == "player" && board[8].content == "player" && !board[4].present) {
        board[4].present = true;
        board[4].content = "bot";
        return {
          x: board[4].x,
          y: board[4].y
        }
      } else if (board[2].content == "player" && board[6].content == "player" && !board[4].present) {
        board[4].present = true;
        board[4].content = "bot";
        return {
          x: board[4].x,
          y: board[4].y
        }
      }

      //now check if player has adjacent pawns
      if (board[0].content == "player" && board[1].content == "player" && !board[2].present) {
        board[2].present = true;
        board[2].content = "bot";
        return {
          x: board[2].x,
          y: board[2].y
        }
      } else if (board[1].content == "player" && board[2].content == "player" && !board[0].present) {
        board[0].present = true;
        board[0].content = "bot";
        return {
          x: board[0].x,
          y: board[0].y
        }
      } else if (board[2].content == "player" && board[5].content == "player" && !board[8].present) {
        board[8].present = true;
        board[8].content = "bot";
        return {
          x: board[8].x,
          y: board[8].y
        }
      } else if (board[5].content == "player" && board[8].content == "player" && !board[2].present) {
        board[2].present = true;
        board[2].content = "bot";
        return {
          x: board[2].x,
          y: board[2].y
        }
      } else if (board[6].content == "player" && board[7].content == "player" && !board[8].present) {
        board[8].present = true;
        board[8].content = "bot";
        return {
          x: board[8].x,
          y: board[8].y
        }
      } else if (board[7].content == "player" && board[8].content == "player" && !board[6].present) {
        board[6].present = true;
        board[6].content = "bot";
        return {
          x: board[6].x,
          y: board[6].y
        }
      } else if (board[0].content == "player" && board[3].content == "player" && !board[6].present) {
        board[6].present = true;
        board[6].content = "bot";
        return {
          x: board[6].x,
          y: board[6].y
        }
      } else if (board[3].content == "player" && board[6].content == "player" && !board[0].present) {
        board[0].present = true;
        board[0].content = "bot";
        return {
          x: board[0].x,
          y: board[0].y
        }
      } else if (board[1].content == "player" && board[4].content == "player" && !board[7].present) {
        board[7].present = true;
        board[7].content = "bot";
        return {
          x: board[7].x,
          y: board[7].y
        }
      } else if (board[7].content == "player" && board[4].content == "player" && !board[1].present) {
        board[1].present = true;
        board[1].content = "bot";
        return {
          x: board[1].x,
          y: board[1].y
        }
      } else if (board[3].content == "player" && board[4].content == "player" && !board[5].present) {
        board[5].present = true;
        board[5].content = "bot";
        return {
          x: board[5].x,
          y: board[5].y
        }
      } else if (board[4].content == "player" && board[5].content == "player" && !board[3].present) {
        board[3].present = true;
        board[3].content = "bot";
        return {
          x: board[3].x,
          y: board[3].y
        }
      } else if (board[0].content == "player" && board[4].content == "player" && !board[8].present) {
        board[8].present = true;
        board[8].content = "bot";
        return {
          x: board[8].x,
          y: board[8].y
        }
      } else if (board[4].content == "player" && board[8].content == "player" && !board[0].present) {
        board[0].present = true;
        board[0].content = "bot";
        return {
          x: board[0].x,
          y: board[0].y
        }
      } else if (board[6].content == "player" && board[4].content == "player" && !board[2].present) {
        board[2].present = true;
        board[2].content = "bot";
        return {
          x: board[2].x,
          y: board[2].y
        }
      } else if (board[2].content == "player" && board[4].content == "player" && !board[6].present) {
        board[6].present = true;
        board[6].content = "bot";
        return {
          x: board[6].x,
          y: board[6].y
        }
      }

      //if there are no matching patterns then spawn the BOT in a random empty tile

      var randPosition = Math.round(Math.random() * (pawnPresent.length - 1))
      board[pawnPresent[randPosition]].present = true;
      board[pawnPresent[randPosition]].content = "bot";
      return {
        x: board[pawnPresent[randPosition]].x,
        y: board[pawnPresent[randPosition]].y
      }
    }

    function checkForResult() {

      //draw strike line
      var line = new createjs.Shape();
      //
      //Checking if Bot Won
      if(board[0].content == "bot" && board[1].content == "bot" && board[2].content == "bot") {
        //alert("BOT WINS!")
        line.graphics.setStrokeStyle(3).beginStroke("#FF3D00").moveTo(47, 47).lineTo(255, 47);
        line.alpha = 0;
        return createjs.Tween.get(line).call(function() {
          stage.addChild(line);
        }).to({alpha: 1}, 300).to({alpha: 0}, 200).to({alpha: 1}, 300).call(function() {
          //alert("called");
          startGame.winner = "bot";
          return true;
        });
      }
      else if(board[3].content == "bot" && board[4].content == "bot" && board[5].content == "bot") {
        //alert("BOT WINS!")
        line.graphics.setStrokeStyle(3).beginStroke("#FF3D00").moveTo(47, 145).lineTo(255, 145);
        line.alpha = 0;
        return createjs.Tween.get(line).call(function() {
          stage.addChild(line);
        }).to({alpha: 1}, 300).to({alpha: 0}, 200).to({alpha: 1}, 300).call(function() {
          //alert("called");
          startGame.winner = "bot";
          return true;
        });
      }
      else if(board[6].content == "bot" && board[7].content == "bot" && board[8].content == "bot") {
        //alert("BOT WINS!")
        line.graphics.setStrokeStyle(3).beginStroke("#FF3D00").moveTo(47, 246).lineTo(255, 246);
        line.alpha = 0;
        return createjs.Tween.get(line).call(function() {
          stage.addChild(line);
        }).to({alpha: 1}, 300).to({alpha: 0}, 200).to({alpha: 1}, 300).call(function() {
          //alert("called");
          startGame.winner = "bot";
          return true;
        });
      }
      else if(board[0].content == "bot" && board[3].content == "bot" && board[6].content == "bot") {
        //alert("BOT WINS!")
        line.graphics.setStrokeStyle(3).beginStroke("#FF3D00").moveTo(47, 47).lineTo(47, 246);
        line.alpha = 0;
        return createjs.Tween.get(line).call(function() {
          stage.addChild(line);
        }).to({alpha: 1}, 300).to({alpha: 0}, 200).to({alpha: 1}, 300).call(function() {
          //alert("called");
          startGame.winner = "bot";
          return true;
        });
      }
      else if(board[1].content == "bot" && board[4].content == "bot" && board[7].content == "bot") {
        //alert("BOT WINS!")
        line.graphics.setStrokeStyle(3).beginStroke("#FF3D00").moveTo(150, 47).lineTo(150, 246);
        line.alpha = 0;
        return createjs.Tween.get(line).call(function() {
          stage.addChild(line);
        }).to({alpha: 1}, 300).to({alpha: 0}, 200).to({alpha: 1}, 300).call(function() {
          //alert("called");
          startGame.winner = "bot";
          return true;
        });
      }
      if(board[2].content == "bot" && board[5].content == "bot" && board[8].content == "bot") {
        //alert("BOT WINS!")
        line.graphics.setStrokeStyle(3).beginStroke("#FF3D00").moveTo(252, 47).lineTo(252, 246);
        line.alpha = 0;
        return createjs.Tween.get(line).call(function() {
          stage.addChild(line);
        }).to({alpha: 1}, 300).to({alpha: 0}, 200).to({alpha: 1}, 300).call(function() {
          //alert("called");
          startGame.winner = "bot";
          return true;
        });
      }
      else if(board[0].content == "bot" && board[4].content == "bot" && board[8].content == "bot") {
        //alert("BOT WINS!")
        line.graphics.setStrokeStyle(3).beginStroke("#FF3D00").moveTo(47, 47).lineTo(252, 246);
        line.alpha = 0;
        return createjs.Tween.get(line).call(function() {
          stage.addChild(line);
        }).to({alpha: 1}, 300).to({alpha: 0}, 200).to({alpha: 1}, 300).call(function() {
          //alert("called");
          startGame.winner = "bot";
          return true;
        });
      }
      else if(board[2].content == "bot" && board[4].content == "bot" && board[6].content == "bot") {
        //alert("BOT WINS!")
        line.graphics.setStrokeStyle(3).beginStroke("#FF3D00").moveTo(252, 47).lineTo(47, 246);
        line.alpha = 0;
        return createjs.Tween.get(line).call(function() {
          stage.addChild(line);
        }).to({alpha: 1}, 300).to({alpha: 0}, 200).to({alpha: 1}, 300).call(function() {
          //alert("called");
          startGame.winner = "bot";
          return true;
        });
      }
      //
      //
      //Now check if player Won!
      else if(board[0].content == "player" && board[1].content == "player" && board[2].content == "player") {
        //alert("YOU WIN!")
        line.graphics.setStrokeStyle(3).beginStroke("#FF3D00").moveTo(47, 47).lineTo(255, 47);
        line.alpha = 0;
        return createjs.Tween.get(line).call(function() {
          stage.addChild(line);
        }).to({alpha: 1}, 300).to({alpha: 0}, 200).to({alpha: 1}, 300).call(function() {
          //alert("called");
          startGame.winner = "player";
          return true;
        });
      }
      else if(board[3].content == "player" && board[4].content == "player" && board[5].content == "player") {
        //alert("YOU WIN!")
        line.graphics.setStrokeStyle(3).beginStroke("#FF3D00").moveTo(47, 145).lineTo(255, 145);
        line.alpha = 0;
        return createjs.Tween.get(line).call(function() {
          stage.addChild(line);
        }).to({alpha: 1}, 300).to({alpha: 0}, 200).to({alpha: 1}, 300).call(function() {
          //alert("called");
          startGame.winner = "player";
          return true;
        });
      }
      else if(board[6].content == "player" && board[7].content == "player" && board[8].content == "player") {
        //alert("YOU WIN!")
        line.graphics.setStrokeStyle(3).beginStroke("#FF3D00").moveTo(47, 246).lineTo(255, 246);
        line.alpha = 0;
        return createjs.Tween.get(line).call(function() {
          stage.addChild(line);
        }).to({alpha: 1}, 300).to({alpha: 0}, 200).to({alpha: 1}, 300).call(function() {
          //alert("called");
          startGame.winner = "player";
          return true;
        });
      }
      else if(board[0].content == "player" && board[3].content == "player" && board[6].content == "player") {
        //alert("YOU WIN!")
        line.graphics.setStrokeStyle(3).beginStroke("#FF3D00").moveTo(47, 47).lineTo(47, 246);
        line.alpha = 0;
        return createjs.Tween.get(line).call(function() {
          stage.addChild(line);
        }).to({alpha: 1}, 300).to({alpha: 0}, 200).to({alpha: 1}, 300).call(function() {
          //alert("called");
          startGame.winner = "player";
          return true;
        });
      }
      else if(board[1].content == "player" && board[4].content == "player" && board[7].content == "player") {
        //alert("YOU WIN!")
        line.graphics.setStrokeStyle(3).beginStroke("#FF3D00").moveTo(150, 47).lineTo(150, 246);
        line.alpha = 0;
        return createjs.Tween.get(line).call(function() {
          stage.addChild(line);
        }).to({alpha: 1}, 300).to({alpha: 0}, 200).to({alpha: 1}, 300).call(function() {
          //alert("called");
          startGame.winner = "player";
          return true;
        });
      }
      if(board[2].content == "player" && board[5].content == "player" && board[8].content == "player") {
        //alert("YOU WIN!")
        line.graphics.setStrokeStyle(3).beginStroke("#FF3D00").moveTo(252, 47).lineTo(252, 246);
        line.alpha = 0;
        return createjs.Tween.get(line).call(function() {
          stage.addChild(line);
        }).to({alpha: 1}, 300).to({alpha: 0}, 200).to({alpha: 1}, 300).call(function() {
          //alert("called");
          startGame.winner = "player";
          return true;
        });
      }
      else if(board[0].content == "player" && board[4].content == "player" && board[8].content == "player") {
        //alert("YOU WIN!")
        line.graphics.setStrokeStyle(3).beginStroke("#FF3D00").moveTo(47, 47).lineTo(252, 246);
        line.alpha = 0;
        return createjs.Tween.get(line).call(function() {
          stage.addChild(line);
        }).to({alpha: 1}, 300).to({alpha: 0}, 200).to({alpha: 1}, 300).call(function() {
          //alert("called");
          startGame.winner = "player";
          return true;
        });
      }
      else if(board[2].content == "player" && board[4].content == "player" && board[6].content == "player") {
        //alert("YOU WIN!")
        line.graphics.setStrokeStyle(3).beginStroke("#FF3D00").moveTo(252, 47).lineTo(47, 246);
        line.alpha = 0;
        return createjs.Tween.get(line).call(function() {
          stage.addChild(line);
        }).to({alpha: 1}, 300).to({alpha: 0}, 200).to({alpha: 1}, 300).call(function() {
          //alert("called");
          startGame.winner = "player";
          return true;
        });
      }

      //Check for TIE
      var keys = Object.keys(board);
      if (keys.every(function(item) {
        return board[item].present;
      })) {
        //alert("IT's a TIE!");
        startGame.winner = "tie";
        return true;
      }
    }

    function endGame() {
        setTimeout(function() {
          stage.removeAllChildren();
          stage.removeAllEventListeners();

          var container = new createjs.Container();
          var shape = new createjs.Shape();
          shape.graphics.beginFill("#FF3D00").drawRect(0, 0, 250, 100);

          var text = new createjs.Text("", "bold 40px Work Sans", "#FFB196");
          if(startGame.winner == "tie")
            text.text = "IT'S A TIE!";
          else if(startGame.winner == "bot")
            text.text = "BOT WINS!"
          else if(startGame.winner == "player")
            text.text = "YOU WIN!"

          text.x = 25, text.y = 25;
          container.x = -250, container.y = 100;
          container.addChild(shape, text)

          createjs.Tween.get(container).call(function() {
            stage.addChild(container);
          }).to({x: 25}, 1000, createjs.Ease.backInOut).wait(1000).to({x: 400}, 1000, createjs.Ease.backInOut).call(function() {
            startGame(pawn);
          });
        }, 1000)
    }

  }
}());
