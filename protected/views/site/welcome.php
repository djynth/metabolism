<?php
/**
 * @param user
 */
?>

<div class="overlay">
    <div id="welcome" class="window">
        <div class="header">
            <p class="title">Welcome to Metabolism Fun ™</p>
        </div>

        <div class="content">
            <div class="options">
                <div class="option">
                    <label>New Game</label>
                    <div class="icon-holder">
                        <i class="fa fa-certificate"></i>
                    </div>
                </div>

                <div class="option">
                    <label>Resume Game</label>
                    <div class="icon-holder">
                        <i class="fa fa-share"></i>
                    </div>
                </div>

                <div class="option">
                    <label>Tutorial</label>
                    <div class="icon-holder">
                        <i class="fa fa-graduation-cap"></i>
                    </div>
                </div>

                <?php if ($user === null): ?>
                    <div class="option">
                        <label>Log In</label>
                        <!-- TODO -->
                    </div>
                <?php else: ?>
                    <div class="option">
                        <label>Load Game</label>
                        <!-- TODO -->
                    </div>
                <?php endif ?>
            </div>
        </div>
    </div>
</div>