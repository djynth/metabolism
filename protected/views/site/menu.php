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
            <h2>Select a Game Mode</h2>

            <div class="modes">
                <div class="mode freeplay" mode="<?= Game::MODE_FREE_PLAY ?>">
                    <i class="fa fa-gamepad"></i>
                    <div class="label">Free Play
                        <ul class="details">
                            <li>Standard game with no restrictions</li>
                            <li>Score as many points as possible in a fixed number of turns</li>
                        </ul>
                    </div>
                </div>

                <div class="mode campaign" mode="<?= Game::MODE_CAMPAIGN ?>">
                    <i class="fa fa-road"></i>
                    <div class="label">Campaign
                        <ul class="details">
                            <li>Score points and survive through a randomly generated adventure</li>
                            <li>Build and store resources for periodic challenges</li>
                        </ul>
                    </div>
                </div>

                <div class="mode challenge" mode="<?= Game::MODE_CHALLENGE ?>">
                    <i class="fa fa-trophy"></i>
                    <div class="label">Challenge
                        <ul class="details">
                            <li>Meet challenge requirements in as few turns as possible</li>
                            <li>Starting resources are changed and some pathways are restricted</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="mode-info" mode="<?= Game::MODE_FREE_PLAY ?>">
                <button class="play btn large">Play</button>
                <h2 class="title">Free Play</h2>

                <h2 class="overview">Overview</h2>
                <ul>
                    <li>Play a standard game in a fixed number of turns, scoring as many points as you can</li>
                    <li>Maximum Turns: <?= Challenge::getFreePlay()->max_turns ?></li>
                </ul>

                <h2 class="pathway-restrictions">Pathway Restrictions</h2>
                <ul>
                    <li>None; play with all the pathways</li>
                </ul>

                <h2 class="resource-restrictions">Resource Restrictions</h2>
                <ul>
                    <li>Standard: keep resources within reasonable limits at the risk of losing points</li>
                </ul>

                <h2 class="goals">Goals</h2>
                <ul>
                    <li>Score as many points as possible in whatever way is most convenient</li>
                </ul>
            </div>

            <div class="mode-info" mode="<?= Game::MODE_CAMPAIGN ?>">
                <button class="play btn large">Play</button>
                <h2 class="title">Campaign</h2>

                <h2 class="overview">Overview</h2>
                <ul>
                    <li>Survive for as long as possible and score as many points as you can</li>
                    <li>As you progress in your journey, random challenges of varying difficulty will be presented, forcing you to meet certain requirements in a given number of turns with the resources you have built up</li>
                </ul>

                <h2 class="pathway-restrictions">Pathway Restrictions</h2>
                <ul>
                    <li>Varying; between challenges all pathways will be available, during challenges some pathways may be limited or disabled</li>
                </ul>

                <h2 class="resource-restrictions">Resource Restrictions</h2>
                <ul>
                    <li>Varying: between challenges, keep resources within reasonable limits at the risk of losing points, during challenges, some resources may be more severely limited</li>
                </ul>

                <h2 class="goals">Goals</h2>
                <ul>
                    <li>End the game with as many points as possible; to this end, survive as long as is viable</li>
                </ul>
            </div>

            <div class="mode-info" mode="<?= Game::MODE_CHALLENGE ?>">
                <button class="play btn large disabled">Play</button>
                <select class="btn large challenges title">
                    <option value="-1">Select Challenge</option>
                    <?php foreach(Challenge::getChallenges() as $challenge): ?>
                        <option value="<?= $challenge->id ?>"><?= $challenge->name ?></option>
                    <?php endforeach ?>
                </select>

                <h2 class="overview">Overview</h2>
                <ul>
                    <li>Playing with certain starting resources and restrictions, meet the challenge goals in as few turns as possible</li>
                    <li>Play as long as necessary with no limit on turns and no score total</li>
                </ul>

                <?php foreach(Challenge::getChallenges() as $challenge): ?>
                    <div class="details" challenge="<?= $challenge->id ?>">
                        <h2 class="pathway-restrictions">Pathway Restrictions</h2>
                        <ul></ul>

                        <h2 class="resource-restrictions">Resource Restrictions</h2>
                        <ul></ul>

                        <h2 class="goals">Goals</h2>
                        <ul></ul>
                    </div>
                <?php endforeach ?>
            </div>
        </div>

        <div class="content tutorial">
            <p>The full tutorial is under construction. Here are some tips to get started:</p>
            <ul>
                <li>The object of the game is to score as many points as possible in as few turns as possible.</li>
                <li>Score points by running certain metabolic pathways that accomplish work (i.e. brain activity).</li>
                <li>All pathways take some inputs (reactants) and convert them to some outputs (products).</li>
                <li>Resources are confined to their specific organ, with the exception of those circulating in the bloodstream, which can be accessed from any organ.</li>
                <li>Make sure to keep your resources within reasonable limits - click on the points in the header to see an overview of all the resources which have limits</li>
                <li>Learn about the reactions in cellular metabolism and have fun!</li>
            </ul>
        </div>

        <div class="content data"></div>

        <div class="content account">
            
            <?php if ($user === null): ?>
                <h2>Log In</h2>

                <div class="form">
                    <form id="login">
                        <input type="text" class="username" placeholder="Username" verify="no" info="">

                        <div class="add-on-holder">
                            <input class="password" type="password" placeholder="Password" verify="no" info="">
                            <div class="forgot-password add-on right">
                                <i class="fa fa-question-circle"></i>
                                <input class="btn mini" type="button" value="Forgot Password">
                            </div>
                        </div>

                        <input class="submit btn small" type="submit" value="Submit">
                    </form>

                    <div class="form-info"></div>
                </div>

                <h2>Create Account</h2>

                <div class="form">
                    <form id="create-account">
                        <input type="text" class="username" placeholder="Username" info="Your username identifies you and is used to log in.<br>Requirements:<ul><li>3-16 alphanumeric characters, including - and _</li><li>not taken by another player</li></ul>">
                        <input type="text" class="email" placeholder="Email Address" info="Your email address can be used to recover your account if you forget your password.<br>Requirements:<ul><li>valid email address, i.e. me@example.com</li><li>not used by another player</li></ul>">
                        <input type="password" class="new-password" placeholder="Password" info="A password is used to verify yourself when logging in. Use a strong password and keep it secret.<br>Requirements:<ul><li>3-32 alphanumeric or punctuation characters</li></ul>">
                        <input type="password" class="confirm" placeholder="Confirm Password" info="Repeat the password given above to make sure it's correct.">
                        <input type="submit" class="submit btn small" value="Submit">
                    </form>

                    <div class="form-info"></div>
                </div>

                <p class="footer">Logging in or creating an account will restart your game.<br><br>You don't need an account to play the game, but it will allow you to access your saved games and settings from anywhere. Read about our policies on your data in the <a class="interior" href="about">About Us</a> section.</p>
                
            <?php else: ?>
                <h2>Account</h2>

                <div id="account-info">
                    <p>Welcome, <?= $user->username ?></p>
                    <button class="btn small" id="logout">Log Out</button>
                </div>

                <h2>Change Password</h2>

                <div class="form">
                    <form id="change-password">
                        <input type="password" class="password" placeholder="Current Password" verify="no" info="Enter your current password for authentication.">
                        <input type="password" class="new-password" placeholder="New Password" info="Enter your new password.<br>Requirements:<ul><li>3-32 alphanumeric or punctuation characters</li></ul>">
                        <input type="password" class="confirm" placeholder="Confirm New Password" info="Repeat the new password above to make sure it's correct.">
                        <input type="submit" class="submit btn small" value="Submit">
                    </form>

                    <div class="form-info"></div>
                </div>

                <h2>Edit Email</h2>

                <div class="form">
                    <form id="email-info" class="add-on-holder">
                        <div class="add-on-holder">
                            <input class="email" type="text" placeholder="Email" value="<?= $user->email ?>" disabled>

                            <?php if ($user->email_verification->verified): ?>
                                <div class="verified add-on right" verified>
                                    <i class="fa fa-check"></i>
                                    <p>Email Verified</p>
                                </div>
                            <?php else: ?>
                                <div class="verified add-on right">
                                    <i class="fa fa-exclamation"></i>
                                    <input type="button" class="resend-email btn mini" value="Resend Verification Email">
                                </div>
                            <?php endif ?>

                            <div class="edit-email add-on right">
                                <i class="fa fa-edit"> </i>
                                <input type="button" class="btn mini" value="Edit">
                            </div>
                        </div>

                        <div id="edit-email">
                            <input class="password" type="password" placeholder="Current Password" verify="no" info="Enter your current password for authentication.">
                            <input class="email" type="text" placeholder="New Email" info="Enter your new email address.<br>Requirements:<ul><li>valid email address, i.e. me@example.com</li><li>not used by another player</li></ul>">
                            <input class="submit btn small" type="submit" value="Submit">
                        </div>
                    </form>

                    <div class="form-info"></div>
                </div>
            <?php endif ?>

        </div>

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

            <h2>Your Data</h2>
            <p>We are dedicated to keeping your data secure and private, and are a part of the movement toward a more open and user-friendly internet. We will never sell your personal data and you can retrieve or permanently delete it from our servers at any time. We ask for an email address so that we can (1) use it to verify your identity if you forget your password or your account is stolen and (2) notify you of any vulnerabilities or issues with the site, especially if a vulnerability would put players at risk. We will never email you for other reasons without your explicit consent. The website is currently hosted on <a href="https://www.nearlyfreespeech.net/">NearlyFreeSpeech.NET</a>, a web host with similar motivation. This <a href="http://idlewords.com/bt14.htm">presentation</a> gives a good insight into our motivations and ideals in giving you the best experience possible.

            <h2>The Team</h3>
            <p><?= Yii::app()->name ?> was envisioned by Professor Neocles Leontis of Bowling Green State University for use in his biochemistry class. Having created a simple card game that allowed students to view metabolism as a whole, he partnered with Dominic Zirbel to develop an online version to allow for interactability and useability.</p>

            <h2>Contact Us</h3>
            <p>We would appreciate any feedback, comments, or questions. Email us at <a href="mailto:<?= Yii::app()->params['email'] ?>"><?= Yii::app()->params['email'] ?></a>.</p>

            <p class="copyright">Copyright 2014 Neocles B. Leontis</p>
        </div>
    </div>
</div>