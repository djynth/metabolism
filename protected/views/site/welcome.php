<?php
/**
 * @param user
 */
?>

<div class="overlay">
    <div id="welcome" class="window">
        <div class="header">
            <p class="title">Welcome to Metabolism Fun ™</p>
            <i class="fa fa-times"></i>
        </div>

        <div class="content">
            <div class="options">
                <div class="option">
                    <label>New Game</label>
                    <img alt="New Game">
                </div>

                <div class="option">
                    <label>Resume Game</label>
                    <img alt="Resume Game">
                </div>

                <div class="option">
                    <label>Tutorial</label>
                    <img alt="Tutorial">
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