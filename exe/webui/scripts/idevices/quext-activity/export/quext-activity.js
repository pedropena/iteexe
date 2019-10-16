var $eXeQuExt = {
    idevicePath: "",
    borderColors: {
        black: "#1c1b1b",
        blue: '#5877c6',
        green: '#2a9315',
        red: '#ff0000',
        white: '#ffffff',
        yellow: '#f3d55a'
    },
    colors: {
        black: "#1c1b1b",
        blue: '#d5dcec',
        green: '#cce1c8',
        red: '#f7c4c4',
        white: '#ffffff',
        yellow: '#f5efd6'
    },
    image: '',
    widthImage: 0,
    heightImage: 0,
    options: {},
    videos: [],
    video: {
        player: '',
        duration: 0,
        id: ''
    },
    player: '',
    playerIntro: '',
    userName: '',
    scorm: '',
    previousScore: '',
    initialScore: '',
    msgs: {
        "mgsAllQuestions": "Has completado todas las cuestiones",
        "msgAnswer": "Respuesta",
        "msgAuthor": "Autor",
        "msgClue": "¡Excelente! La pista es:",
        "msgCodeAccess": "Clave de acceso",
        "msgCool": "Cool!",
        "msgCool": "¡Genial!",
        "msgEndGameScore": "Por favor, comienza esta actividad antes de guardar tu calificación",
        "msgEnterCode": "Introduce el código de acceso",
        "msgErrorCode": "El código de acceso no es correcto",
        "msgErrors": "Errores",
        "msgExitFullScreen": "Salir de pantalla completa",
        "msgFailures": "¡No era eso! | ¡Mal! | ¡Incorrecto! | ¡Lo siento! | ¡Error!",
        "msgFullScreen": "Pantalla completa",
        "msgGameOver": "¡E! juego ha terminado",
        "msgHappen": "Pasar",
        "msgHits": "Aciertos",
        "msgImage": "Imagen",
        "msgImage": "Imagen",
        "msgIndicateWord": "Escribe una frase o palabra",
        "msgInformation": "Information",
        "msgInformationLooking": "La información que buscabas: ",
        "msgLive": "Live",
        "msgLoseLive": "Pierdes una vida",
        "msgLoseT": "Pierdes 330 puntos",
        "msgLostLives": "¡Pierdes todas tus vidas!",
        "msgMaximize": "Maximizar",
        "msgMinimize": "Minimizar",
        "msgMoveOne": "Pasar",
        "msgNewGame": "Pulsa aquí para nuevo juego",
        "msgNewWord": "Nueva palabra",
        "msgNoImage": "Sin imagen",
        "msgNotNetwork": "Solo puedes jugar este juego con conexión a internet. Revisa tu conectividad",
        "msgNumQuestions": "Número de preguntas",
        "msgOnlySaveAuto": "La calificación de esta actividad se guardará automáticamante después de cada pregunta. ¡Sólo puedes jugar una vez!",
        "msgOnlySaveScore": "¡Solo puedes guardar la calificación de esta actividad una vez!",
        "msgOnlySave": "Sólo puedes guardar la calificación de esta actividad una vez",
        "msgPass": "Has pasado palabra",
        "msgPlayAgain": "Volver a jugar",
        "msgPlayStart": "Pulsa aquí para jugar",
        "msgQuestion": "Pregunta",
        "msgReady": "¿Preparado?",
        "msgReply": "Responder",
        "msgRequiredAccessKey": "Clave de acceso necesaria",
        "msgSaveAuto": "La calificación  es esta actividad se guardará automáticamante después de cada pregunta.",
        "msgScore": "Puntuación",
        "msgStartGame": "Haz clic aquí para comenzar",
        "msgSubmit": "Enviar",
        "msgSuccesses": "Correcto! | ¡Excelente! | ¡Genial! | ¡Muy bien! | ¡Perfecto!",
        "msgTime": "Tiempo",
        "msgTryAgain": "Debes tener el %s% de las respuestas correctas para obtener la información que necesitas. ¡Inténtalo de nuevo!",
        "msgWrote": "Escribe la palabra o frase correcta y haz clic en responder. Si tienes dudas, haz click en mover.",
        "msgYouHas": "Has obtenido %1 aciertos y %2 errores",
        "msgYouScore": "Tu calificación",
        "msgSeveralScore": "Puedes guardar la calificación de esta actividad todas las veces que desees",
        "msgYouLastScore": "La última calificación guardada de esta actividad es",
        "msgActityComply": "Ya ha realizado esta actividad.",
        "msgPlaySeveralTimes": "Puedes realizar esta actividad las veces que desees",
        "msgSaveScoreButton": "Tu última calificación guardada es",
        "msgLoadInterface": "Cargando interfaz. Por favor, espere unos segundos"
    },
    youtubeLoaded: false,
    hasSCORMbutton: false,
    isInExe: false,
    init: function () {
        this.activities = $('.quext-IDevice');
        if (this.activities.length == 0) return;
        if (typeof ($exeAuthoring) != 'undefined' && $("#exe-submitButton").length > 0) {
            this.activities.hide();
            if (typeof (_) != 'undefined') this.activities.before('<p>' + _('QuExt') + '</p>');
            return;
        }
        if ($(".QuizTestIdevice .iDevice").length > 0) this.hasSCORMbutton = true;
        if (typeof ($exeAuthoring) != 'undefined') this.isInExe = true;
        this.idevicePath = this.isInExe ? "/scripts/idevices/quext-activity/export/" : "";
        if ($("body").hasClass("exe-scorm")) this.loadSCORM_API_wrapper();
        else this.enable();
    },
    loadSCORM_API_wrapper: function () {
        if (typeof (pipwerks) == 'undefined') $exe.loadScript('SCORM_API_wrapper.js', '$eXeQuExt.loadSCOFunctions()');
        else this.loadSCOFunctions();
    },
    loadSCOFunctions: function () {
        if (typeof (exitPageStatus) == 'undefined') $exe.loadScript('SCOFunctions.js', '$eXeQuExt.enable()');
        else this.enable();
        $eXeQuExt.mScorm = scorm;
        var callSucceeded = $eXeQuExt.mScorm.init();
        if (callSucceeded) {
            $eXeQuExt.userName = $eXeQuExt.getUserName();
            $eXeQuExt.previousScore = $eXeQuExt.getPreviousScore();
            $eXeQuExt.mScorm.set("cmi.core.score.max", 10);
            $eXeQuExt.mScorm.set("cmi.core.score.min", 0);
            $eXeQuExt.initialScore = $eXeQuExt.previousScore;
        }
    },
    enable: function () {
        $eXeQuExt.loadGame();
    },
    getUserName: function () {
        var user = $eXeQuExt.mScorm.get("cmi.core.student_name");
        return user
    },
    getPreviousScore: function () {
        var score = $eXeQuExt.mScorm.get("cmi.core.score.raw");
        return score;
    },
    endScorm: function () {
        if ($eXeQuExt.mScorm) {
            $eXeQuExt.mScorm.quit();
        }

    },
    updateScorm: function (prevScore, repeatActivity, instance) {
        var mOptions = $eXeQuExt.options[instance],
            text = '';
        $('#quextSendScore-' + instance).hide();
        if (mOptions.isScorm === 1) {
            if (repeatActivity && prevScore !== '') {
                text = mOptions.msgs.msgYouLastScore + ': ' + prevScore;
            } else if (repeatActivity && prevScore === "") {
                text = mOptions.msgs.msgSaveAuto + ' ' + mOptions.msgs.msgPlaySeveralTimes;
            } else if (!repeatActivity && prevScore === "") {
                text = mOptions.msgs.msgOnlySaveAuto;
            } else if (!repeatActivity && prevScore !== "") {
                text = mOptions.msgs.msgActityComply + ' ' + mOptions.msgs.msgYouLastScore + ': ' + prevScore;
            }
        } else if (mOptions.isScorm === 2) {
            $('#quextSendScore-' + instance).show();
            if (repeatActivity && prevScore !== '') {
                text = mOptions.msgs.msgYouLastScore + ': ' + prevScore;
            } else if (repeatActivity && prevScore === '') {
                text = mOptions.msgs.msgSeveralScore;
            } else if (!repeatActivity && prevScore === '') {
                text = mOptions.msgs.msgOnlySaveScore;
            } else if (!repeatActivity && prevScore !== '') {
                $('#quextSendScore-' + instance).hide();
                text = mOptions.msgs.msgActityComply + ' ' + mOptions.msgs.msgYouScore + ': ' + prevScore;
            }
        }
        $('#quextRepeatActivity-' + instance).text(text);
        $('#quextRepeatActivity-' + instance).fadeIn(1000);
    },
    sendScore: function (auto, instance) {
        var mOptions = $eXeQuExt.options[instance],
            message = '',
            score = ((mOptions.hits * 10) / mOptions.numberQuestions).toFixed(2);
        if (mOptions.gameStarted || mOptions.gameOver) {
            if (typeof $eXeQuExt.mScorm != 'undefined') {
                if (!auto) {
                    $('#quextSendScore-' + instance).show();
                    if (!mOptions.repeatActivity && $eXeQuExt.previousScore !== '') {
                        message = $eXeQuExt.userName !== '' ? $eXeQuExt.userName + ' ' + mOptions.msgs.msgOnlySaveScore : mOptions.msgs.msgOnlySaveScore;
                    } else {
                        $eXeQuExt.previousScore = score;
                        $eXeQuExt.mScorm.set("cmi.core.score.raw", score);
                        message = $eXeQuExt.userName !== '' ? $eXeQuExt.userName + ', tu puntuación es :' + score : 'Tu puntuación es : ' + score;
                        if (!mOptions.repeatActivity) {
                            $('#quextSendScore-' + instance).hide();
                        }
                        $('#quextRepeatActivity-' + instance).text(mOptions.msgs.msgSaveScoreButton + ': ' + score)
                        $('#quextRepeatActivity-' + instance).show();
                    }
                } else {
                    $eXeQuExt.previousScore = score;
                    score = score === "" ? 0 : score;
                    $eXeQuExt.mScorm.set("cmi.core.score.raw", score);
                    $('#quextRepeatActivity-' + instance).text('Tu puntuación es : ' + score)
                    $('#quextRepeatActivity-' + instance).show();
                    message = "";
                }
            } else {
                message = mOptions.msgs.msgScoreScorm;
            }

        } else {
            message = mOptions.msgs.msgEndGameScore;

        }
        if (!auto) alert(message);
    },
    loadGame: function () {
        $eXeQuExt.options = [];
        $eXeQuExt.activities.each(function (i) {
            var dl = $(".quext-DataGame", this),
                imagesLink = $('.quext-LinkImages', this),
                mOption = $eXeQuExt.loadDataGame(dl, imagesLink),
                msg = mOption.msgs.msgPlayStart;

            $eXeQuExt.options.push(mOption);
            var quext = $eXeQuExt.createInterfaceQuExt(i);
            dl.before(quext).remove();
            $('#quextGameMinimize-' + i).hide();
            $('#quextGameContainer-' + i).hide();
            if (mOption.showMinimize) {
                $('#quextGameMinimize-' + i).css({
                    'cursor': 'pointer'
                }).show();
            } else {
                $('#quextGameContainer-' + i).show();
            }
            $('#quextMessageMaximize-' + i).text(msg);
            $eXeQuExt.addEvents(i);
            $eXeQuExt.loadYoutubeApi();
        });

    },
    createInterfaceQuExt: function (instance) {
        var html = '',
            path = $eXeQuExt.idevicePath,
            msgs = $eXeQuExt.options[instance].msgs;
        html += '<div class="quext-MainContainer">\
        <div class="quext-GameMinimize" id="quextGameMinimize-' + instance + '">\
            <a href="#" class="quext-LinkMaximize" id="quextLinkMaximize-' + instance + '" title="Ver actividad"><img src="' + path + 'quextIcon.png" class="quext-Icons quext-IconMinimize" alt="Mostrar actividad">\
                <div class="quext-MessageMaximize" id="quextMessageMaximize-' + instance + '">Haz clic aquí para comenzar </div>\
            </a>\
        </div>\
        <div class="quext-GameContainer" id="quextGameContainer-' + instance + '">\
            <div class="quext-GameScoreBoard">\
                <div class="quext-GameScores">\
                    <a href="#" class="quext-LinkMinimize" id="quextLinkMinimize-' + instance + '" title="Minimizar">\
                        <strong><span class="sr-av">Minimizar:</span></strong>\
                        <div class="exeQuextIcons exeQuextIcons-Minimize"></div>\
                    </a>\
                    <div class="exeQuext-ResultGame">\
                        <strong><span class="sr-av">Aciertos:</span></strong>\
                        <div class="exeQuextIcons exeQuextIcons-Hit"></div>\
                        <p id="quextPHits-' + instance + '">0</p>\
                    </div>\
                    <div class="exeQuext-ResultGame">\
                        <strong><span class="sr-av">Errores:</span></strong>\
                        <div class="exeQuextIcons  exeQuextIcons-Error"></div>\
                        <p id="quextPErrors-' + instance + '">0</p>\
                    </div>\
                    <div class="exeQuext-ResultGame">\
                        <strong><span class="sr-av">Puntuación:</span></strong>\
                        <div class="exeQuextIcons  exeQuextIcons-Score"></div>\
                        <p id="quextPScore-' + instance + '">0</p>\
                    </div>\
                </div>\
                <div class="quext-LifesGame" id="quextLifesGame-' + instance + '">\
                    <strong><span class="sr-av">Vida:</span></strong>\
                    <div class="exeQuextIcons exeQuextIcons-Life"></div>\
                    <strong><span class="sr-av">Vida:</span></strong>\
                    <div class="exeQuextIcons exeQuextIcons-Life"></div>\
                    <strong><span class="sr-av">Vida:</span></strong>\
                    <div class="exeQuextIcons exeQuextIcons-Life"></div>\
                    <strong><span class="sr-av">Vida:</span></strong>\
                    <div class="exeQuextIcons exeQuextIcons-Life"></div>\
                    <strong><span class="sr-av">Vida:</span></strong>\
                    <div class="exeQuextIcons exeQuextIcons-Life"></div>\
                </div>\
                <div class="quext-NumberLifesGame" id="quextNumberLivesGame-' + instance + '">\
                    <strong><span class="sr-av">Vida:</span></strong>\
                    <div class="exeQuextIcons exeQuextIcons-Life"></div>\
                    <p id="quextPLifes-' + instance + '">0</p>\
                </div>\
                <div class="quext-TimeNumber">\
                    <div class="quext-TimeQuestion">\
                        <strong><span class="sr-av">Tiempo:</span></strong>\
                        <div class="exeQuextIcons  exeQuextIcons-Time"></div>\
                        <p id="quextPTime-' + instance + '">00:00</p>\
                    </div>\
                    <div class="exeQuext-ResultGame">\
                        <strong><span class="sr-av">Número de preguntas:</span></strong>\
                        <div class="exeQuextIcons  exeQuextIcons-Number"></div>\
                        <p id="quextPNumber-' + instance + '">0</p>\
                    </div>\
                    	<a href="#" class="quext-LinkFullScreen" id="quextLinkFullScreen-' + instance + '" title="Pantalla completa">\
                        <strong><span class="sr-av">Pantalla completa:</span></strong>\
                        <div class="exeQuextIcons exeQuextIcons-FullScreen" id="quextFullScreen-' + instance + '">\
                        </div>\
                    </a>\
                </div>\
            </div>\
            <div class="quext-ShowClue" id="quextShowClue-' + instance + '">\
                <div class="sr-av">Pista:</div>\
                <p class="quext-PShowClue" id="quextPShowClue-' + instance + '"></p>\
            </div>\
            <div class="quext-Multimedia" id="quextMultimedia-' + instance + '">\
                <img class="quext-Cursor" id="quextCursor-' + instance + '" src="' + path + 'quextCursor.gif" alt="" />\
                <img  src="" class="quext-Images" id="quextImagen-' + instance + '" alt="" />\
                <div class="quext-EText" id="quextEText-' + instance + '"></div>\
                <img src="' + path + 'quextHome.png" class="quext-Images" id="quextCover-' + instance + '" alt="" />\
                <div class="quext-Video" id="quextVideo-' + instance + '"></div>\
                <div class="quext-Protector" id="quextProtector-' + instance + '"></div>\
                <div class="quext-GameOver" id="quextGamerOver-' + instance + '">\
                    <div class="quext-TextClueGGame" id="quextTextClueGGame-' + instance + '"></div>\
                    <div class="quext-DataImageGameOver">\
                        <img src="' + path + 'quextGameWon.png" class="quext-HistGGame" id="quextHistGGame-' + instance + '"                              alt="Has completado todas las preguntas" />\
                        <img src="' + path + 'quextGameLost.png" class="quext-LostGGame" id="quextLostGGame-' + instance + '"                             alt="Has perdido todas las vidas" />\
                        <div class="quext-DataGame" id="quextDataGame-' + instance + '">\
                            <p id="quextOverScore-' + instance + '">Puntuación: 0</p>\
                            <p id="quextOverHits-' + instance + '">Aciertos: 0</p>\
                            <p id="quextOverErrors-' + instance + '">¡Errores: 0</p>\
                        </div>\
                    </div>\
                </div>\
            </div>\
            <div class="quext-AutorLicence" id="quextAutorLicence-' + instance + '">\
                <div class="sr-av">Autor:</div>\
                <p id="quextPAuthor-' + instance + '"></p>\
            </div>\
            <div class="quext-CodeAccessDiv" id="quextCodeAccessDiv-' + instance + '">\
                <div class="quext-MessageCodeAccessE" id="quextMesajeAccesCodeE-' + instance + '"></div>\
                <div class="quext-DataCodeAccessE">\
                    <label>Clave:</label><input type="text" class="quext-CodeAccessE"  id="quextCodeAccessE-' + instance + '">\
                    <input type="button" class="quext-CodeAccessButton" id="quextCodeAccessButton-' + instance + '"   value="Enviar" />\
                </div>\
            </div>\
            <div class="quext-QuestionDiv" id="quextQuestionDiv-' + instance + '">\
                <div class="quext-Question" id="quextQuestion-' + instance + '">\
                </div>\
                <div class="quext-OptionsDiv" id="quextOptionsDiv-' + instance + '">\
                    <div class="quext-Option1 quext-Options" id="quextOption1-' + instance + '"></div>\
                    <div class="quext-Option2 quext-Options" id="quextOption2-' + instance + '"></div>\
                    <div class="quext-Option3 quext-Options" id="quextOption3-' + instance + '"></div>\
                    <div class="quext-Option4 quext-Options" id="quextOption4-' + instance + '"></div>\
                </div>\
            </div>\
            <div class="quext-VideoIntroContainer" id="quextVideoIntroContainer-' + instance + '">\
                <a href="#" class="quext-LinkVideoIntroShow" id="quextLinkVideoIntroShow-' + instance + '" title="Ver vídeo introducción">\
                    <strong><span class="sr-av">Ver vídeo introducción:</span></strong>\
                    <div class="exeQuextIcons exeQuextIcons-Video"></div>\
                </a>\
            </div>\
            <div class="quext-VideoIntroDiv" id="quextVideoIntroDiv-' + instance + '">\
                <div class="quext-VideoIntro" id="quextVideoIntro-' + instance + '"></div>\
                <input type="button" class="quext-VideoIntroClose" id="quextVideoIntroClose-' + instance + '" value="Cerrar" />\
            </div>\
        </div>\
    </div>\
    ' + this.addButtonScore(instance);
        return html;
    },
    addButtonScore: function (instance) {
        var mOptions = $eXeQuExt.options[instance];
        var butonScore = "";
        var fB = '<div class="quext-BottonContainer">';
        if (mOptions.isScorm == 2) {
            var buttonText = mOptions.textButtonScorm;
            if (buttonText != "") {
                if (this.hasSCORMbutton == false && ($("body").hasClass("exe-authoring-page") || $("body").hasClass("exe-scorm"))) {
                    this.hasSCORMbutton = true;
                    fB += '<div class="quext-GetScore">';
                    if (!this.isInExe) fB += '<form action="#" onsubmit="return false">';
                    fB += '<p><input type="button" id="quextSendScore-' + instance + '" value="' + buttonText + '" class="feedbackbutton" /> <span class="quext-RepeatActivity" id="quextRepeatActivity-' + instance + '"></span></p>';
                    if (!this.isInExe) fB += '</form>';
                    fB += '</div>';
                    butonScore = fB;
                }
            }
        } else if (mOptions.isScorm == 1) {
            if (this.hasSCORMbutton == false && ($("body").hasClass("exe-authoring-page") || $("body").hasClass("exe-scorm"))) {
                this.hasSCORMbutton = true;
                fB += '<div class="quext-GetScore">';
                fB += '<p><span class="quext-RepeatActivity" id="quextRepeatActivity-' + instance + '"></span></p>';
                fB += '</div>';
                butonScore = fB;
            }
        }
        fB = +'</div>';
        return butonScore;
    },
    loadDataGame: function (data, imgsLink) {
        var json = data.text(),
            mOptions = $eXeQuExt.isJsonString(json);
        mOptions.gameOver = false;
        imgsLink.each(function (index) {
            mOptions.questionsGame[index].url = $(this).attr('href');
        });
        mOptions.questionsGame = mOptions.optionsRamdon ? $eXeQuExt.shuffleAds(mOptions.questionsGame) : mOptions.questionsGame;
        mOptions.numberQuestions = mOptions.questionsGame.length;
        return mOptions;
    },
    isJsonString: function (str) {
        try {
            var o = JSON.parse(str, null, 2);
            if (o && typeof o === "object") {
                return o;
            }
        } catch (e) {}
        return false;
    },
    shuffleAds: function (arr) {
        for (var j, x, i = arr.length; i; j = parseInt(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
        return arr;
    },
    youTubeReady: function () {
        for (var i = 0; i < $eXeQuExt.options.length; i++) {
            var mOptions = $eXeQuExt.options[i];
            mOptions.player = new YT.Player('quextVideo-' + i, {
                width: '100%',
                height: '100%',
                videoId: '',
                playerVars: {
                    'color': 'white',
                    'autoplay': 0,
                    'controls': 0
                },
                events: {
                    'onReady': $eXeQuExt.onPlayerReady,
                    'onError': $eXeQuExt.onPlayerError
                }
            });

            mOptions.playerIntro = new YT.Player('quextVideoIntro-' + i, {
                width: '100%',
                height: '100%',
                videoId: '',
                playerVars: {
                    'color': 'white',
                    'autoplay': 0,
                    'controls': 1
                }
            });
            $('#quextQuestion-' + i).text($eXeQuExt.msgs.msgStartGame);
            $('#quextQuestion-' + i).css({
                'color': $eXeQuExt.borderColors.blue,
                'text-align': 'center',
                'cursor': 'pointer',
                'font-weight': 'bold',
                'font-size': '16px'
            });
        }


    },
    loadYoutubeApi: function () {
        onYouTubeIframeAPIReady = $eXeQuExt.youTubeReady;
        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    },
    onPlayerReady: function (event) {
        $eXeQuExt.youtubeLoaded = true;
    },
    updateTimerDisplay: function () {},
    updateProgressBar: function () {},
    onPlayerError: function (event) {},
    startVideo: function (id, start, end, instance) {
        var mOptions = $eXeQuExt.options[instance];
        if (mOptions.player) {
            mOptions.player.loadVideoById({
                'videoId': id,
                'startSeconds': start,
                'endSeconds': end
            });
        }
    },
    startVideoIntro: function (id, start, end, instance) {
        var mOptions = $eXeQuExt.options[instance];
        if (mOptions.playerIntro) {
            mOptions.playerIntro.loadVideoById({
                'videoId': id,
                'startSeconds': start,
                'endSeconds': end
            });
        }
    },
    stopVideoIntro: function (instance) {
        var mOptions = $eXeQuExt.options[instance];
        if (mOptions.playerIntro) {
            mOptions.playerIntro.pauseVideo();
        }
    },
    playVideo: function (instance) {
        var mOptions = $eXeQuExt.options[instance];
        if (mOptions.player) {
            mOptions.player.playVideo();
        }
    },
    stopVideo: function (instance) {
        var mOptions = $eXeQuExt.options[instance];
        if (mOptions.player) {
            mOptions.player.pauseVideo();
        }
    },
    muteVideo: function (mute, instance) {
        var mOptions = $eXeQuExt.options[instance];
        if (mOptions.player) {
            if (mute) {
                mOptions.player.mute();
            } else {
                mOptions.player.unMute();
            }
        }
    },
    addEvents: function (instance) {
        var mOptions = $eXeQuExt.options[instance];
        window.addEventListener('unload', function () {
            $eXeQuExt.endScorm();
        });
        $('videoquextGamerOver-' + instance).css('display', 'flex');
        $('#quextLinkMaximize-' + instance).on('click touchstart', function (e) {
            e.preventDefault();
            $("#quextGameContainer-" + instance).show()
            $("#quextGameMinimize-" + instance).hide();
        });
        $("#quextLinkMinimize-" + instance).on('click touchstart', function (e) {
            e.preventDefault();
            $("#quextGameContainer-" + instance).hide();
            $("#quextGameMinimize-" + instance).css('visibility', 'visible').show();
            return true;
        });
        $('#quextSendScore-' + instance).click(function (e) {
            e.preventDefault();
            $eXeQuExt.sendScore(false, instance);
            return true;
        });
        $('#quextGamerOver-' + instance).hide();
        $('#quextCodeAccessDiv-' + instance).hide();
        $('#quextVideo-' + instance).hide();
        $('#quextImagen-' + instance).hide();
        $('#quextCursor-' + instance).hide();
        $('#quextCover-' + instance).show();
        $("#quextCover-" + instance).prop('src', $eXeQuExt.idevicePath + 'quextHome.png')
            .on('load', function () {
                if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth === 0) {
                    console.log('Error al cargar imagen');
                } else {
                    var mData = $eXeQuExt.placeImageWindows(this, this.naturalWidth, this.naturalHeight);
                    $eXeQuExt.drawImage(this, mData);
                }
            });
        $('#quextCodeAccessButton-' + instance).on('click touchstart', function (e) {
            $eXeQuExt.enterCodeAccess(instance);
        });
        $('#quextCodeAccessE-' + instance).on("keydown", function (event) {
            if (event.which === 13 || event.keyCode === 13) {
                $eXeQuExt.enterCodeAccess(instance);
                return false;
            }
            return true;
        });
        mOptions.livesLeft = mOptions.numberLives;
        $(window).on('resize', function (params) {
            if (mOptions.gameStarted) {

            }
        });
        $('#quextQuestion-' + instance).text('Cargardo.. Por favor, espere');
        $('#quextQuestion-' + instance).css({
            'color': $eXeQuExt.borderColors.blue,
            'text-align': 'center',
            'cursor': 'pointer',
            'font-weight': 'bold',
            'font-size': '16px'
        });
        $('#quextQuestion-' + instance).on('click', function () {

            $eXeQuExt.startGame(instance);
        })
        $("#quextOptionsDiv-" + instance).on('click touchstart', function (e) {
            if ($(e.target).hasClass('quext-Options')) {
                var respuesta = $(e.target).text();
                $eXeQuExt.answerQuestion(respuesta, instance);
            }
        });
        $("#quextLinkFullScreen-" + instance).on('click touchstart', function (e) {
            e.preventDefault();
            var element = document.getElementById('quextGameContainer-' + instance);
            $eXeQuExt.toggleFullscreen(element, instance);
        });
        $eXeQuExt.updateLives(instance);
        $('#quextInstructions-' + instance).text(mOptions.instructions);

        $('#quextPNumber-' + instance).text(mOptions.numberQuestions);
        if (mOptions.itinerary.showCodeAccess) {
            $('#quextMesajeAccesCodeE-' + instance).text(mOptions.itinerary.messageCodeAccess);
            $('#quextMesajeAccesCodeE-' + instance).text(mOptions.itinerary.messageCodeAccess);
            $('#quextCodeAccessDiv-' + instance).show();
            $('#quextQuestionDiv-' + instance).hide();

        }
        $(document).on("webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange", function (e) {
            var fullScreenElement =
                document.fullscreenElement ||
                document.msFullscreenElement ||
                document.mozFullScreenElement ||
                document.webkitFullscreenElement;
            $eXeQuExt.maximizeMultimedia(typeof fullScreenElement != "undefined", instance);
        });
        $('#quextInstruction-' + instance).text(mOptions.instructions);
        $('#quextSendScore-' + instance).attr('value', mOptions.textButtonScorm);
        $('#quextSendScore-' + instance).hide();
        if (mOptions.isScorm > 0) {
            $eXeQuExt.updateScorm($eXeQuExt.previousScore, mOptions.repeatActivity, instance);
        }
        document.title = mOptions.title;
        $('meta[name=author]').attr('content', mOptions.author);
        $('#quextShowClue-' + instance).hide();
        mOptions.gameOver = false;
        $('#quextLinkVideoIntroShow-' + instance).hide();
        if ($eXeQuExt.getIDYoutube(mOptions.idVideo) !== '') {
            $('#quextVideoIntroContainer-' + instance).css('display', 'flex');
            $('#quextVideoIntroContainer-' + instance).show();
            $('#quextLinkVideoIntroShow-' + instance).show();
        }

        $('#quextLinkVideoIntroShow-' + instance).on('click touchstart', function (e) {
            e.preventDefault();
            $('#quextVideoIntroDiv-' + instance).show();
            var idVideo = $eXeQuExt.getIDYoutube(mOptions.idVideo);
            mOptions.endVideo = mOptions.endVideo <= mOptions.startVideo ? 36000 : mOptions.endVideo;
            $eXeQuExt.startVideoIntro(idVideo, mOptions.startVideo, mOptions.endVideo, instance);
        });

        $('#quextVideoIntroClose-' + instance).on('click touchstart', function (e) {
            e.preventDefault();
            $('#quextVideoIntroDiv-' + instance).hide();
            $eXeQuExt.startVideoIntro('', 0, 0, instance);
        });
    },
    maximizeMultimedia: function (maximize, instance) {
        var css = {
                "height": "315px",
                "width": "560px",
                "margin": "auto"
            },
            hQ = 45,
            fs = "13px";

        if (maximize) {
            var h = window.innerHeight - 365 > 750 ? 750 : window.innerHeight - 365;
            h = window.innerHeight <= 768 ? window.innerHeight - 345 : h;
            var p = (h / 315),
                w = p * 560;
            css = {
                "height": h + 'px',
                "width": w + 'px',
                "margin": "auto"
            };
            p = p > 1.5 ? 1.5 : p;
            hQ = 45 * p;
            fs = "13px";
        }
        $('#quextQuestion-' + instance).css({
            "height": hQ + "px",
            "font-size": fs,
            "font-weight": "bold"
        });
        $('#quextOptionsDiv-' + instance + '>.quext-Options').css({
            "height": hQ + "px",
            "font-size": fs,
            "font-weight": "bold"
        });
        $('#quextMultimedia-' + instance).css(css);
        $eXeQuExt.refreshImageActive(instance);
    },
    refreshImageActive: function (instance) {
        var mOptions = $eXeQuExt.options[instance],
            mQuextion = mOptions.questionsGame[mOptions.activeQuestion],
            author = '';
        $("#quextCover-" + instance).prop('src', $eXeQuExt.idevicePath + 'quextHome.png')
            .on('load', function () {
                if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth === 0) {
                    console.log('Error al cargar imagen');
                } else {
                    var mData = $eXeQuExt.placeImageWindows(this, this.naturalWidth, this.naturalHeight);
                    $eXeQuExt.drawImage(this, mData);

                }
            });
        if (typeof mQuextion == "undefined") {
            return;
        }
        if (mQuextion.type === 1) {
            $("#quextImagen-" + instance).prop('src', mQuextion.url)
                .on('load', function () {
                    if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth === 0) {
                        alt = $eXeQuExt.msgs.msgNoImage;
                        $('#quextAuthor-' + instance).text('');
                    } else {
                        var mData = $eXeQuExt.placeImageWindows(this, this.naturalWidth, this.naturalHeight);
                        $eXeQuExt.drawImage(this, mData);
                        $('#quextImagen-' + instance).show();
                        $('#quextCover-' + instance).hide();
                        alt = mQuextion.alt;
                        if (mQuextion.x > 0 || mQuextion.y > 0) {
                            var left = mData.x + (mQuextion.x * mData.w);
                            var top = mData.y + (mQuextion.y * mData.h);
                            $('#quextCursor-' + instance).css({
                                'left': left + 'px',
                                'top': top + 'px'
                            });
                            author = mQuextion.author;
                            $('#quextCursor-' + instance).show();
                        }
                    }
                    $eXeQuExt.showMessage(0, author, instance);
                });
            $('#quextImagen-' + instance).attr('alt', mQuextion.alt);
        }
    },
    enterCodeAccess: function (instance) {
        var mOptions = $eXeQuExt.options[instance];
        if (mOptions.itinerary.codeAccess === $('#quextCodeAccessE-' + instance).val()) {
            $('#quextQuestionDiv-' + instance).show();
            $('#quextCodeAccessDiv-' + instance).hide();
            $eXeQuExt.startGame(instance);
        } else {
            $('#quextMesajeAccesCodeE-' + instance).fadeOut(300).fadeIn(200).fadeOut(300).fadeIn(200);
            $('#quextCodeAccessE-' + instance).val('');
        }
    },
    showScoreGame: function (type, instance) {
        var mOptions = $eXeQuExt.options[instance],
            msgs = $eXeQuExt.msgs,
            $quextHistGGame = $('#quextHistGGame-' + instance),
            $quextLostGGame = $('#quextLostGGame-' + instance),
            $quextClueGGame = $('#quextClueGGame-' + instance),
            $quextOverPoint = $('#quextOverScore-' + instance),
            $quextOverHits = $('#quextOverHits-' + instance),
            $quextOverErrors = $('#quextOverErrors-' + instance),
            $quextTextClueGGame = $('#quextTextClueGGame-' + instance),
            $quextGamerOver = $('#quextGamerOver-' + instance),
            message = "";
        $quextHistGGame.hide();
        $quextLostGGame.hide();
        $quextClueGGame.hide();
        $quextOverPoint.show();
        $quextOverHits.show();
        $quextOverErrors.show();
        $quextTextClueGGame.hide();
        switch (parseInt(type)) {
            case 0:
                message = msgs.msgCool + ' ' + msgs.mgsAllQuestions;
                $quextHistGGame.show();
                if (mOptions.itinerary.showClue) {
                    if (mOptions.obtainedClue) {
                        message = msgs.mgsAllQuestions;
                        $quextTextClueGGame.text("Información: " + mOptions.itinerary.clueGame);
                        $quextTextClueGGame.show();
                    } else {
                        $quextTextClueGGame.text(msgs.msgTryAgain.replace('%s', mOptions.itinerary.percentageClue));
                        $quextTextClueGGame.show();
                    }
                }
                break;
            case 1:
                message = 'El juego ha terminado. Has perdido todas tus vidas';
                $quextLostGGame.show();
                if (mOptions.itinerary.showClue) {
                    if (mOptions.obtainedClue) {
                        $quextTextClueGGame.text("Información: " + mOptions.itinerary.clueGame);
                        $quextTextClueGGame.show();
                    } else {
                        $quextTextClueGGame.text(msgs.msgTryAgain.replace('%s', mOptions.itinerary.percentageClue));
                        $quextTextClueGGame.show();
                    }
                }
                break;
            case 2:
                message = msgs.msgInformationLooking
                $quextOverPoint.hide();
                $quextOverHits.hide();
                $quextOverErrors.hide();
                $quextClueGGame.show();
                $quextTextClueGGame.text(mOptions.itinerary.clueGame);
                $quextTextClueGGame.show();
                break;
            default:
                break;
        }
        $('#quextShowClue-' + instance).hide();
        $eXeQuExt.showMessage(1, message, instance);
        $quextOverPoint.text(msgs.msgScore + ': ' + mOptions.score);
        $quextOverHits.text(msgs.msgHits + ': ' + mOptions.hits);
        $quextOverErrors.text(msgs.msgErrors + ': ' + mOptions.errors);
        $quextGamerOver.show();
    },
    startGame: function (instance) {
        var mOptions = $eXeQuExt.options[instance];
        if (!$eXeQuExt.youtubeLoaded) {
            $eXeQuExt.showMessage(1, mOptions.msgs.msgLoadInterface, instance)
            return;
        }
        if (mOptions.gameStarted) {
            return;
        };
        mOptions.obtainedClue = false;
        $('#quextVideoIntroContainer-' + instance).hide();
        $('#quextLinkVideoIntroShow-' + instance).hide();
        $('#quextShowClue-' + instance).hide();
        $('#quextPShowClue-' + instance).text("");
        $('#quextQuestion-' + instance).css({
            'color': $eXeQuExt.colors.black,
            'text-align': 'center',
            'vertical-align': 'middle',
            'cursor': 'default',
            'font-weight': 'bold',
            'font-size': '13px'
        });
        $('#quextQuestion-' + instance).text('');
        mOptions.hits = 0;
        mOptions.errors = 0;
        mOptions.score = 0;
        mOptions.gameActived = false;
        mOptions.activeQuestion = -1;
        mOptions.validQuestions = mOptions.numberQuestions;
        mOptions.counter = 0;
        mOptions.gameStarted = false;
        mOptions.livesLeft = mOptions.numberLives;
        $eXeQuExt.updateLives(instance);
        $('#quextPNumber-' + instance).text(mOptions.numberQuestions);
        mOptions.counterClock = setInterval(function () {
            if (mOptions.gameStarted && mOptions.activeCounter) {
                mOptions.counter--;
                $eXeQuExt.uptateTime(mOptions.counter, instance);
                if (mOptions.counter <= 0) {
                    mOptions.activeCounter = false;
                    var timeShowSolution = 1000;
                    if (mOptions.showSolution) {
                        timeShowSolution = mOptions.timeShowSolution * 1000;
                        $eXeQuExt.drawSolution(instance);
                    }
                    setTimeout(function () {
                        $eXeQuExt.newQuestion(instance)
                    }, timeShowSolution);
                    return;
                }
            }

        }, 1000);
        $eXeQuExt.uptateTime(0, instance);
        $('#quextGamerOver-' + instance).hide();
        $('#quextPHits-' + instance).text(mOptions.hits);
        $('#quextPErrors-' + instance).text(mOptions.errors);
        $('#quextPScore-' + instance).text(mOptions.score);
        $('quextQuestion-' + instance).css('color', $eXeQuExt.colors.black);
        mOptions.gameStarted = true;
        $eXeQuExt.newQuestion(instance);
    },
    uptateTime: function (tiempo, instance) {
        var mOptions = $eXeQuExt.options;
        var mTime = $eXeQuExt.getTimeToString(tiempo);
        $('#quextPTime-' + instance).text(mTime);
        if (mOptions.gameActived) {

        }
    },
    getTimeToString: function (iTime) {
        var mMinutes = parseInt(iTime / 60) % 60;
        var mSeconds = iTime % 60;
        return (mMinutes < 10 ? "0" + mMinutes : mMinutes) + ":" + (mSeconds < 10 ? "0" + mSeconds : mSeconds);
    },
    gameOver: function (type, instance) {
        var mOptions = $eXeQuExt.options[instance];
        mOptions.gameStarted = false;
        mOptions.gameActived = false;

        clearInterval(mOptions.counterClock);
        $('#quextVideo-' + instance).hide();
        $eXeQuExt.startVideo('', 0, 0, instance);
        $eXeQuExt.stopVideo(instance)
        $('#quextImagen-' + instance).hide();
        $('#quextEText-' + instance).hide();
        $('#quextCursor-' + instance).hide();
        $('#quextCover-' + instance).hide();
        var message = type === 0 ? '¡El juego ha finalizado! Has obtenido ' + mOptions.score + ' puntos' : '¡Has perdido todas tus vidas! Has obtenido ' + mOptions.score + ' puntos';
        $eXeQuExt.showMessage(2, message, instance);
        $eXeQuExt.showScoreGame(type, instance);
        $eXeQuExt.clearQuestions(instance);
        $eXeQuExt.uptateTime(0, instance);
        $('#quextPNumber-' + instance).text('0');
        $('#quextQuestion-' + instance).text('Pulsa aquí para nueva partida');
        $('#quextQuestion-' + instance).css({
            'color': $eXeQuExt.borderColors.blue,
            'cursor': 'pointer',
            'font-weight': 'bold',
            'font-size': '16px'
        });
        if ($eXeQuExt.getIDYoutube(mOptions.idVideo) !== '') {
            $('#quextVideoIntroContainer-' + instance).css('display', 'flex');
            $('#quextVideoIntroContainer-' + instance).show();
            $('#quextLinkVideoIntroShow-' + instance).show();
        }
        if (mOptions.isScorm === 1) {
            if (mOptions.repeatActivity || $eXeQuExt.initialScore === '') {
                var score = ((mOptions.hits * 10) / mOptions.numberQuestions).toFixed(2);
                $eXeQuExt.sendScore(true, instance);
                $('#quextRepeatActivity-' + instance).text(mOptions.msgs.msgYouScore + ': ' + score);
                $eXeQuExt.initialScore = score;
            }
        }
        mOptions.gameOver = true;
    },
    drawText: function (texto, color) {},
    showQuestion: function (i, instance) {
        var mOptions = $eXeQuExt.options[instance],
            mQuextion = mOptions.questionsGame[i];
        mOptions.gameActived = true;
        mOptions.question = mQuextion
        if (mOptions.answersRamdon) {
            $eXeQuExt.ramdonOptions(instance);
        }
        var tiempo = $eXeQuExt.getTimeToString($eXeQuExt.getTimeSeconds(mQuextion.time)),
            author = '',
            alt = '';
        $('#quextPTime-' + instance).text(tiempo);
        $('#quextQuestion-' + instance).text(mQuextion.quextion);
        $('#quextImagen-' + instance).hide();
        $('#quextCover-' + instance).show();
        $('#quextEText-' + instance).hide();
        $('#quextVideo-' + instance).hide();
        $eXeQuExt.startVideo('', 0, 0, instance);
        $eXeQuExt.stopVideo(instance)
        $('#quextCursor-' + instance).hide();
        $eXeQuExt.showMessage(0, '', instance);
        if (mOptions.isScorm === 1) {
            if (mOptions.repeatActivity || $eXeQuExt.initialScore === '') {
                var score = ((mOptions.hits * 10) / mOptions.numberQuestions).toFixed(2);
                $eXeQuExt.sendScore(true, instance);
                $('#quextRepeatActivity-' + instance).text(mOptions.msgs.msgYouScore + ': ' + score);

            }
        }
        if (mQuextion.type === 1) {
            $("#quextImagen-" + instance).prop('src', mQuextion.url)
                .on('load', function () {
                    if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
                        alt = $eXeQuExt.msgs.msgNoImage;
                        $('#quextAuthor-' + instance).text('');
                    } else {
                        var mData = $eXeQuExt.placeImageWindows(this, this.naturalWidth, this.naturalHeight);
                        $eXeQuExt.drawImage(this, mData);
                        $('#quextImagen-' + instance).show();
                        $('#quextCover-' + instance).hide();
                        alt = mQuextion.alt;
                        if (mQuextion.x > 0 || mQuextion.y > 0) {
                            var left = mData.x + (mQuextion.x * mData.w);
                            var top = mData.y + (mQuextion.y * mData.h);
                            $('#quextCursor-' + instance).css({
                                'left': left + 'px',
                                'top': top + 'px'
                            });
                            author = mQuextion.author;
                            $('#quextCursor-' + instance).show();
                        }
                    }
                    $eXeQuExt.showMessage(0, author, instance);
                });
            $('#quextImagen-' + instance).attr('alt', alt);
        } else if (mQuextion.type === 3) {
            var text = unescape(mQuextion.eText);
            if (window.innerWidth < 401) {
                text = $eXeQuExt.reduceText(texto);
            }
            $("#quextEText-" + instance).html(text);
            $('#quextEText-' + instance).show();
            $('#quextCover-' + instance).hide();

            $eXeQuExt.showMessage(0, mQuextion.author, instance);

        } else if (mQuextion.type === 2) {
            $('#quextVideo-' + instance).show();
            var idVideo = $eXeQuExt.getIDYoutube(mQuextion.url);
            $eXeQuExt.startVideo(idVideo, mQuextion.iVideo, mQuextion.fVideo, instance);
            $eXeQuExt.showMessage(0, mQuextion.author, instance);
            if (mQuextion.imageVideo === 0) {
                $('#quextVideo-' + instance).hide();
                $('#quextCover-' + instance).show();

            } else {
                $('#quextVideo-' + instance).show();
                $('#quextCover-' + instance).hide();
            }
            if (mQuextion.soundVideo === 0) {
                $eXeQuExt.muteVideo(true, instance);
            } else {
                $eXeQuExt.muteVideo(false, instance);
            }
        }
        $eXeQuExt.drawQuestions(instance);
    },
    getIDYoutube: function (url) {
        var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/,
            match = url.match(regExp);
        if (match && match[2].length === 11) {
            return match[2];
        } else {
            return "";
        }
    },
    updateLives: function (instance) {
        var mOptions = $eXeQuExt.options[instance];
        $('#quextPLifes-' + instance).text(mOptions.livesLeft);
        $('#quextLifesGame-' + instance).find('.exeQuextIcons-Life').each(function (index) {
            $(this).hide();
            if (mOptions.useLives) {
                $(this).show();
                if (index >= mOptions.livesLeft) {
                    $(this).hide();
                }
            }
        });
    },

    newQuestion: function (instance) {
        var mOptions = $eXeQuExt.options[instance];
        if (mOptions.useLives && mOptions.livesLeft <= 0) {
            $eXeQuExt.gameOver(1, instance);
            return;
        }
        var mActiveQuestion = $eXeQuExt.updateNumberQuestion(mOptions.activeQuestion, instance);
        if (mActiveQuestion === -10) {
            $('quextPNumber-' + instance).text('0');
            $eXeQuExt.gameOver(0, instance);
            return;
        } else {
            mOptions.counter = $eXeQuExt.getTimeSeconds(mOptions.questionsGame[mActiveQuestion].time);
            if (mOptions.questionsGame[mActiveQuestion].type === 2) {
                var durationVideo = mOptions.questionsGame[mActiveQuestion].fVideo - mOptions.questionsGame[mActiveQuestion].iVideo;
                mOptions.counter += durationVideo;
            }
            $eXeQuExt.showQuestion(mActiveQuestion, instance)
            mOptions.activeCounter = true;
            var numQ = mOptions.numberQuestions - mActiveQuestion;
            $('#quextPNumber-' + instance).text(numQ);
        };
    },
    getTimeSeconds: function (iT) {
        var times = [15, 30, 60, 180, 300, 600]
        return times[iT];
    },
    updateNumberQuestion: function (numq, instance) {
        var mOptions = $eXeQuExt.options[instance],
            numActiveQuestion = numq;
        numActiveQuestion++;
        if (numActiveQuestion >= mOptions.numberQuestions) {
            return -10
        }
        mOptions.activeQuestion = numActiveQuestion;
        return numActiveQuestion;
    },
    getRetroFeedMessages: function (iHit) {
        var sMessages = iHit ? $eXeQuExt.msgs.msgSuccesses : $eXeQuExt.msgs.msgFailures;
        sMessages = sMessages.split('|');
        return sMessages[Math.floor(Math.random() * sMessages.length)];
    },
    answerQuestion: function (respuesta, instance) {
        var mOptions = $eXeQuExt.options[instance];
        if (!mOptions.gameActived) {
            return;
        }
        mOptions.gameActived = false;
        var message = "";
        var solution = $.trim(mOptions.question.options[mOptions.question.solution]).toUpperCase();
        var answord = $.trim(respuesta.toUpperCase());
        mOptions.activeCounter = false;
        var obtainedPoints = 0;
        var type = 1;
        if (solution === answord) {
            mOptions.hits++
            color = $eXeQuExt.colors.green;
            obtainedPoints = 1000 + mOptions.counter * 10;
            if (mOptions.questionsGame[mOptions.activeQuestion].type === 2) {
                var realTime = $eXeQuExt.getTimeSeconds(mOptions.questionsGame[mOptions.activeQuestion].time);
                realTime = mOptions.counter > realTime ? realTime : mOptions.counter
                obtainedPoints = 1000 + realTime * 10;
            }
            message = $eXeQuExt.getRetroFeedMessages(true) + ' ' + obtainedPoints + ' puntos';
            type = 2;
        } else {
            mOptions.errors++;
            if (mOptions.useLives) {
                mOptions.livesLeft--;
                $eXeQuExt.updateLives(instance);
                message = $eXeQuExt.getRetroFeedMessages(false) + ' Pierdes una vida';
            } else {
                obtainedPoints = -330;
                message = $eXeQuExt.getRetroFeedMessages(false) + ' Pierdes 330 puntos';
            }
        }
        mOptions.score = (mOptions.score + obtainedPoints > 0) ? mOptions.score + obtainedPoints : 0;
        $('#quextPScore-' + instance).text(mOptions.score);
        var timeShowSolution = 1000;
        if (mOptions.showSolution) {
            timeShowSolution = mOptions.timeShowSolution * 1000;
            $eXeQuExt.drawSolution(instance);
        }
        var percentageHits = (mOptions.hits / mOptions.numberQuestions) * 100;
        $('#quextPHits-' + instance).text(mOptions.hits);
        $('#quextPErrors-' + instance).text(mOptions.errors);
        if (mOptions.itinerary.showClue && percentageHits >= mOptions.itinerary.percentageClue) {
            if (!mOptions.obtainedClue) {
                timeShowSolution = 5000;
                message += " y una información que te resultará muy útil.";
                $('#quextShowClue-' + instance).show();
                $('#quextPShowClue-' + instance).text("Información: " + mOptions.itinerary.clueGame);
                mOptions.obtainedClue = true;
            }
        }
        $eXeQuExt.showMessage(type, message, instance);
        setTimeout(function () {
            $eXeQuExt.newQuestion(instance)
        }, timeShowSolution);
    },
    reduceText: function (text) {
        var rText = text;
        for (var i = 8; i < 40; i++) {
            var normal = i + 'pt';
            var re = new RegExp(normal, "gi");
            var reducido = (i - 3) + 'pt';
            rText = rText.replace(re, reducido)
        }
        return rText;
    },
    showMessage: function (type, message, instance) {
        var colors = ['#555555', $eXeQuExt.borderColors.red, $eXeQuExt.borderColors.green, $eXeQuExt.borderColors.blue, $eXeQuExt.borderColors.yellow];
        color = colors[type];
        var weight = type == 0 ? 'normal' : 'bold';
        $("#quextPAuthor-" + instance).text(message);
        $("#quextPAuthor-" + instance).css({
            'color': color,
            'font-weight': weight
        });
    },
    drawImage: function (image, mData) {
        $(image).css({
            'left': mData.x + 'px',
            'top': mData.y + 'px',
            'width': mData.w + 'px',
            'height': mData.h + 'px'
        });
    },
    placeImageWindows: function (image, naturalWidth, naturalHeight) {
        var wDiv = $(image).parent().width() > 0 ? $(image).parent().width() : 1,
            hDiv = $(image).parent().height() > 0 ? $(image).parent().height() : 1,
            varW = naturalWidth / wDiv,
            varH = naturalHeight / hDiv,
            wImage = wDiv,
            hImage = hDiv,
            xImagen = 0,
            yImagen = 0;
        if (varW > varH) {
            wImage = parseInt(wDiv);
            hImage = parseInt(naturalHeight / varW);
            yImagen = parseInt((hDiv - hImage) / 2);
        } else {
            wImage = parseInt(naturalWidth / varH);
            hImage = parseInt(hDiv);
            xImagen = parseInt((wDiv - wImage) / 2);
        }
        return {
            w: wImage,
            h: hImage,
            x: xImagen,
            y: yImagen
        }
    },
    ramdonOptions: function (instance) {
        var mOptions = $eXeQuExt.options[instance],
            arrayRamdon = mOptions.question.options.slice(0, mOptions.question.numberOptions),
            sSolution = mOptions.question.options[mOptions.question.solution];
        arrayRamdon = $eXeQuExt.shuffleAds(arrayRamdon);
        mOptions.question.options = [];
        for (var i = 0; i < 4; i++) {
            if (i < arrayRamdon.length) {
                mOptions.question.options.push(arrayRamdon[i])
            } else {
                mOptions.question.options.push('');
            }
            if (mOptions.question.options[i] == sSolution) {
                mOptions.question.solution = i;
            }
        }
    },
    drawQuestions: function (instance) {
        var mOptions = $eXeQuExt.options[instance],
            colors = [$eXeQuExt.colors.red, $eXeQuExt.colors.blue, $eXeQuExt.colors.green, $eXeQuExt.colors.yellow],
            bordeColors = [$eXeQuExt.borderColors.red, $eXeQuExt.borderColors.blue, $eXeQuExt.borderColors.green, $eXeQuExt.borderColors.yellow];
        $('#quextOptionsDiv-' + instance + '>.quext-Options').each(function (index) {
            var option = mOptions.question.options[index]
            $(this).css({
                'border-color': bordeColors[index],
                'background-color': colors[index],
                'cursor': 'pointer'
            }).text(option);
            if (option) {
                $(this).show();
            } else {
                $(this).hide()
            }
        });
    },
    drawSolution: function (instance) {
        var mOptions = $eXeQuExt.options[instance],
            colors = [$eXeQuExt.colors.red, $eXeQuExt.colors.blue, $eXeQuExt.colors.green, $eXeQuExt.colors.yellow],
            bordeColors = [$eXeQuExt.borderColors.red, $eXeQuExt.borderColors.blue, $eXeQuExt.borderColors.green, $eXeQuExt.borderColors.yellow];
        $('#quextOptionsDiv-' + instance + '>.quext-Options').each(function (index) {
            if (index === mOptions.question.solution) {
                $(this).css({
                    'border-color': bordeColors[index],
                    'background-color': colors[index],
                    'cursor': 'default'
                });
            } else {
                $(this).css({
                    'border-color': '#cccccc',
                    'background-color': '#ffffff',
                    'cursor': 'default'
                });
            }
        });
    },
    clearQuestions: function (instance) {
        var colors = [$eXeQuExt.colors.red, $eXeQuExt.colors.blue, $eXeQuExt.colors.green, $eXeQuExt.colors.yellow];
        var bordeColors = [$eXeQuExt.borderColors.red, $eXeQuExt.borderColors.blue, $eXeQuExt.borderColors.green, $eXeQuExt.borderColors.yellow];
        $('#quextOptionsDiv-' + instance + '>.quext-Options').each(function (index) {
            $(this).css({
                'border-color': bordeColors[index],
                'background-color': colors[index],
                'cursor': 'default'
            }).text('');
        });
    },
    exitFullscreen: function () {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    },
    getFullscreen: function (element) {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    },
    toggleFullscreen: function (element, instance) {
        var mOptions = $eXeQuExt.options[instance],
            alt = mOptions.msgs.msgFullScreen;
        element = element || document.documentElement;
        if (!document.fullscreenElement && !document.mozFullScreenElement &&
            !document.webkitFullscreenElement && !document.msFullscreenElement) {
            $('#quextFullScreen-' + instance).removeClass('exeQuextIcons-FullScreen');
            $('#quextFullScreen-' + instance).addClass('exeQuextIcons-FullScreenExit');
            alt = mOptions.msgs.msgExitFullScreen;
            $eXeQuExt.getFullscreen(element);
        } else {
            $('#quextFullScreen-' + instance).addClass('exeQuextIcons-FullScreen');
            $('#quextFullScreen-' + instance).removeClass('exeQuextIcons-FullScreenExit');
            $eXeQuExt.exitFullscreen(element);
        }
        $('#quextLinkFullScreen-' + instance).find('span').text(alt + ':')
        $('#quextLinkFullScreen-' + instance).attr('title', alt);
    },
}
$(function () {

    $eXeQuExt.init();
});