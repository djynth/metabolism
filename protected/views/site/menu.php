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
            <p class="subheading">team info and contact</p>
        </div>

        <div class="space"></div>
    </div>

    <div class="contents">
        <div class="content new-game active">
            <?php $this->renderPartial('menu/new-game'); ?>
        </div>

        <div class="content tutorial">
            <?php $this->renderPartial('menu/tutorial'); ?>
        </div>

        <div class="content data">
            <?php $this->renderPartial('menu/data'); ?>
        </div>

        <div class="content account">
            <?php $this->renderPartial('menu/account', array(
                'user' => $user
            )); ?>
        </div>

        <div class="content settings">
            <?php $this->renderPartial('menu/settings'); ?>
        </div>

        <div class="content about">
            <?php $this->renderPartial('menu/about'); ?>
        </div>
    </div>
</div>