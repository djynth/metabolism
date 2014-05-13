<div id="settings" class="header-element">
    <div class="title">
        <p>Settings</p>
        <i class="icon-cog"></i>
    </div>

    <div class="dropdown">
        <p>Color Theme</p>
        <div id="themes" class="btn-group" data-toggle="buttons-radio">
            <?php foreach (glob("css/themes/light/*.css") as $css):
                $theme = basename($css, '.css'); ?>
                <p theme="<?= $theme ?>" type="light" class="btn btn-small theme"><?= ucfirst($theme) ?></p>
            <?php endforeach ?>

            <?php foreach (glob("css/themes/dark/*.css") as $css):
                $theme = basename($css, '.css'); ?>
                <p theme="<?= $theme ?>" type="dark" class="btn btn-small theme"><?= ucfirst($theme) ?></p>
            <?php endforeach ?>
        </div>
    </div>
</div>
