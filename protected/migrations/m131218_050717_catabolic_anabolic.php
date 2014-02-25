<?php

class m131218_050717_catabolic_anabolic extends CDbMigration
{
    public function up()
    {
        $this->addColumn('pathways', 'anabolic', 'tinyint(1)');
    }

    public function down()
    {
        $this->dropColumn('pathways', 'anabolic');
    }
}