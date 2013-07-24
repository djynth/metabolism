<?php

class m130714_173554_organ_color extends CDbMigration
{
    public function up()
    {
        $this->addColumn('organs', 'color', 'char(6)');
    }

    public function down()
    {
        $this->dropColumn('organs', 'color');
    }
}