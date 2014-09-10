<?php

class m140910_091832_keyboard_shortcuts_grouping extends CDbMigration
{
    public function up()
    {
        $this->addColumn('keyboard_shortcuts', 'grouping', 'varchar(20)');
    }

    public function down()
    {
        $this->dropColumn('keyboard_shortcuts', 'grouping');
    }
}