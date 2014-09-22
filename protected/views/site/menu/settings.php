<div class="header btn-group">
    <div class="btn inactive title">Preferences</div>
    <div class="btn collapse">Collapse</div>
</div>

<div class="prefs">
    <div class="pref res-orientation">
        <div class="title">
            <p class="name">Resource Orientation</p>
        </div>
        <div class="setting btn-group radio">
            <button class="btn default" setting="vertical">Vertical</button>
            <button class="btn" setting="horizontal">Horizontal</button>
        </div>
    </div>

    <div class="pref res-level-style">
        <div class="title">
            <p class="name">Resource Level Style</p>
            <p class="description">
                absolute: resource levels are bars from the bottom (0)<br>
                relative: resource levels are bars from the center indicating variance from the ideal zone
            </p>
        </div>
        <div class="setting btn-group radio">
            <button class="btn default" setting="absolute">Absolute</button>
            <button class="btn" setting="relative">Relative</button>
        </div>
    </div>
</div>

<div class="header btn-group">
    <div class="btn title inactive">Color Themes</div>
    <div class="btn collapse">Collapse</div>
</div>

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

<div class="header btn-group">
    <div class="btn title inactive">Key Bindings</div>
    <div class="btn collapse">Collapse</div>
    <div class="btn revert-all">Revert All to Defaults</div>
</div>

<div class="keybinds">
    <?php foreach (KeyboardShortcut::model()->findAll(array('order' => '`order`')) as $shortcut): ?>

        <?php if ($shortcut->grouping !== null): ?>
            <div class="grouping">
                <p class="name"><?= $shortcut->grouping ?></p>
                <button class="btn collapse"><i class="fa fa-minus"></i></button>
            </div>
        <?php endif ?>

        <div class="keybind" action="<?= $shortcut->action ?>">
            <div class="title">
                <p class="name"><?= $shortcut->name ?></p>
                <p class="description"><?= $shortcut->description ?></p>
            </div>
            <button class="current binding btn" key="">
                <div class="focus">
                    <i class="fa fa-chevron-right left"></i>
                    <i class="fa fa-chevron-left right"></i>
                </div>
                <div class="no-focus">
                    <p class="key">&nbsp;</p>
                    <p class="description">assign binding</p>
                </div>
            </button>
            <button class="default binding btn" key="">
                <div class="no-focus">
                    <p class="key">&nbsp;</p>
                    <p class="description">revert to default</p>
                </div>
            </button>
        </div>
    <?php endforeach ?>
</div>