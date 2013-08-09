<?php

class m130808_173734_user_email extends CDbMigration
{
    public function up()
    {
        $this->addColumn('user', 'email', 'varchar(80)');
        $this->addColumn('user', 'email_verified', 'tinyint(1)');
        $this->addColumn('user', 'email_verification', 'varchar(16)');
    }

    public function down()
    {
        $this->dropColumn('user', 'email');
        $this->dropColumn('user', 'email_verified');
        $this->dropColumn('user', 'email_verification');
    }
}