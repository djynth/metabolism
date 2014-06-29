<?php
/**
 * @param user
 */
?>

<div id="menu">
    <div class="tabs">
        <div class="tab active" for="new-game">
            <i class="fa fa-certificate"></i>
            <p class="title">New Game</p>
            <p class="subheading">start a new game</p>
        </div>

        <div class="tab" for="tutorial">
            <i class="fa fa-graduation-cap"></i>
            <p class="title">Tutorial</p>
            <p class="subheading">learn how to play</p>
        </div>

        <div class="tab" for="data">
            <i class="fa fa-database"></i>
            <p class="title">Data</p>
            <p class="subheading">load or save a game</p>
        </div>
        
        <div class="tab" for="account">
            <i class="fa fa-user"></i>
            <p class="title">Account</p>
            <?php if ($user === null): ?>
                <p class="subheading">log in</p>
            <?php else: ?>
                <p class="subheading">logged in as <?= $user->username ?></p>
            <?php endif ?>
        </div>

        <div class="tab" for="settings">
            <i class="fa fa-wrench"></i>
            <p class="title">Settings</p>
            <p class="subheading">adjust settings</p>
        </div>

        <div class="tab" for="about">
            <i class="fa fa-building"></i>
            <p class="title">About Us</p>
            <p class="subheading">info and contact for the team</p>
        </div>

        <div class="space"></div>
    </div>

    <div class="contents">
        <div class="content new-game active"></div>

        <div class="content tutorial"></div>

        <div class="content data"></div>

        <div class="content account"></div>

        <div class="content settings">
            <h2>Color Themes</h2>

            <div class="themes">
                <?php foreach (glob("{css/themes/light/*.css,css/themes/dark/*.css}", GLOB_BRACE) as $css):
                    $theme = basename($css, '.css');
                    $type = basename(dirname($css)); ?>

                    <div class="theme" theme="<?= $theme ?>" type="<?= $type ?>">
                        <p class="name"><?= ucfirst($theme) ?> [<?= ucfirst($type) ?>]</p>

                        <div class="add-on-holder">
                            <input type="text" placeholder="Text Field">
                            <div class="verified add-on right" verified>
                                <i class="fa fa-check"></i>
                            </div>
                        </div>

                        <button class="btn select">Select</button>
                    </div>
                <?php endforeach ?>
            </div>
        </div>

        <div class="content about">
            <h2>About <?= Yii::app()->name ?></h3>
            <p><?= Yii::app()->name ?> is an educational game created to teach students about cellular metabolism. Most appropriate for college-level purposes, the game is designed to be integrated into a classroom and provide players with an enjoyable and wholistic view of the metabolic process.</p>

            <h2>The Team</h3>
            <p><?= Yii::app()->name ?> was envisioned by Professor Neocles Leontis of Bowling Green State University for use in his biochemistry class. Having created a simple card game that allowed students to view metabolism as a whole, he partnered with Dominic Zirbel to develop an online version to allow for interactability and useability.</p>

            <h2>Contact Us</h3>
            <p>We would appreciate any feedback, comments, or questions. Email us at <a href="mailto:<?= Yii::app()->params['email'] ?>"><?= Yii::app()->params['email'] ?></a>.</p>

            <p class="copyright">Copyright 2014 Neocles B. Leontis</p>
        </div>
    </div>
</div>