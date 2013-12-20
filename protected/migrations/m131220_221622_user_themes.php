<?php

class m131220_221622_user_themes extends CDbMigration
{
    public function up()
    {
        $this->alterColumn('users', 'theme', 'varchar(20)');
        $this->addColumn('users', 'theme_type', 'varchar(20)');
    }

    public function down()
    {
        $this->alterColumn('users', 'theme', 'varchar(8)');
        $this->dropColumn('users', 'theme_type');
    }
}