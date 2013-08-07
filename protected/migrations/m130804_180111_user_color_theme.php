<?php

class m130804_180111_user_color_theme extends CDbMigration
{
    public function up()
    {
        $this->addColumn('user', 'theme', 'varchar(8)');
    }

    public function down()
    {
        $this->dropColumn('user', 'theme');
    }
}