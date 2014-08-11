<h2>Color Themes</h2>

<div class="themes">
    <?php foreach (glob("css/themes/*/*.css") as $css):
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