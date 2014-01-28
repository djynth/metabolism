<?php

class m131130_152346_move_reverse extends CDbMigration
{
    public function up()
    {
        $this->addColumn('moves', 'reverse', 'int(1) default 0');
    }

    public function down()
    {
        $this->dropColumn('moves', 'reverse');
    }
}