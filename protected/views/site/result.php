<?php

$this->pageTitle = Yii::app()->name;
Yii::app()->getClientScript()->registerScriptFile(Yii::app()->baseUrl . '/js/result.js');
Yii::app()->getClientScript()->registerCssFile(Yii::app()->baseUrl . '/css/result.css');

$game = Game::model()->findByPk($game_id);
$user = User::getCurrentUser();
?>

<div class="result-cover"></div>

<div class="result-top">
    <div id="classroom-holder" class="result-holder">
        <h3 id="classroom-title">Report Your Score</h3>
        <p id="classroom-info">Associate your game with a virtual classroom by entering the class code below:</p>
        <input type="text" placeholder="Classroom Code" class="input-themed" id="classroom-code">
        <input type="button" value="Submit" class="btn" id="classroom-code-submit">
    </div>
    <div id="score-holder" class="result-holder">
        <h1 id="score-title">Score: <?= $game->score ?></h1>

        <button id="play-again" class="btn">Play Again</button>
    </div>
    <div id="user-holder" class="result-holder">
        <?php if ($user === null): ?>
            <p id="login-status">Not logged in</p>
        <?php else: ?>
            <p id="login-status">Logged in as <?= $user->username ?></p>
        <?php endif ?>
    </div>
</div>

<div class="result-bottom">
    <div id="statistics-holder" class="result-holder">
        <h3 id="statistics-header">Game Statistics</h3>
    </div>
    <div id="highscore-holder" class="result-holder">
        <h3 id="highscore-header">Top Scores</h3>
    </div>
</div>

<!--

score display
login status
associate game with teacher/class
track resource levels
track point levels
track which pathways were run
track scores over time if logged in
share on social networks
play again button

-->