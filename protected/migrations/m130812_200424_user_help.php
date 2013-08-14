<?php

class m130812_200424_user_help extends CDbMigration
{
    public function up()
    {
        $this->addColumn('user', 'help', 'tinyint(1) DEFAULT 0');
    }

    public function down()
    {
        $this->dropColumn('user', 'help');
    }
}