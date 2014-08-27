<?php

class m140817_082908_keybinding_order extends CDbMigration
{
    public function up()
    {
        $this->addColumn('keyboard_shortcuts', 'order', 'int(11) not null');
    }

    public function down()
    {
        $this->dropColumn('keyboard_shortcuts', 'order');
    }
}