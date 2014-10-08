<?php
/**
 * @param user
 */
?>

<h2>Save Game</h2>
<?php if ($user === null): ?>
    <p>Since you are not logged in, your game will be saved locally and can only be loaded again from this computer.</p>
<?php else: ?>
    <p>Welcome back, <?= $user->name ?>. Your game will be available to be loaded whenever you are logged in.</p>
<?php endif ?>

<div class="form">
    <form id="save-game">
        <input type="text" class="game-name" placeholder="Game Name" info="The name of your game. May be 3-20 characters of any type.">
        <input class="submit btn" type="submit" value="Save">
    </form>

    <div class="form-info"></div>
</div>

<h2>Load Game</h2>

<?php
if ($user === null) {
    $games = array();

    $cookies = Yii::app()->request->cookies;
    foreach ($cookies as $cookie) {
        if (substr($cookie->name, 0, 4) === 'game') {
            $game = Game::model()->findByAttributes(array(
                'id' => $cookie->value,
            ));
            array_push($games, $game);
        }
    }
} else {
    $games = $user->games;
}
?>

<?php if (count($games) === 0): ?>
    <p>No available saved games. If you have games saved to your account, log in to access them.</p>
<?php else: ?>
    <div class="load-games">
        <?php foreach ($games as $game): ?>
            <div class="game" game="<?= $game->id ?>">
                <div class="title">
                    <p class="name"><?= $game->name ?></p>
                    <p class="description"><?= Game::getModeName($game->mode, $game->challenge) ?> / <?= $game->turn ?> turns</p>
                </div>

                <input type="button" class="btn load" value="Load">
            </div>
        <?php endforeach ?>
    </div>
<?php endif ?>
