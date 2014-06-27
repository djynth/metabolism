<?php
/**
 * @param user
 */
?>

<div id="menu">
    <div class="tabs">
        <div class="tab new-game active">
            <i class="fa fa-certificate"></i>
            <p class="title">New Game</p>
            <p class="subheading">start a new game</p>
        </div>

        <div class="tab data">
            <i class="fa fa-database"></i>
            <p class="title">Data</p>
            <p class="subheading">load or save a game</p>
        </div>

        <div class="tab tutorial">
            <i class="fa fa-graduation-cap"></i>
            <p class="title">Tutorial</p>
            <p class="subheading">learn how to play</p>
        </div>

        <div class="tab settings">
            <i class="fa fa-wrench"></i>
            <p class="title">Settings</p>
            <p class="subheading">adjust settings</p>
        </div>

        <div class="tab account">
            <i class="fa fa-user"></i>
            <p class="title">Account</p>
            <?php if ($user === null): ?>
                <p class="subheading">log in</p>
            <?php else: ?>
                <p class="subheading">logged in as <?= $user->username ?></p>
            <?php endif ?>
        </div>

        <div class="space"></div>
    </div>

    <div class="contents">
        <div class="content new-game active">

        </div>

        <div class="content data">

        </div>

        <div class="content tutorial">

        </div>

        <div class="content settings">

        </div>

        <div class="content account">

        </div>
    </div>
</div>