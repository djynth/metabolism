<?php

class m140929_031351_preferences extends CDbMigration
{
    public function up()
    {
        $this->createTable('preferences', array(
            'id' => 'int(11) primary key auto_increment',
            'name' => 'varchar(80) not null',
            'description' => 'text',
            'default' => 'int(11)',
        ), 'engine InnoDB');

        $this->createTable('preference_options', array(
            'preference_id' => 'int(11) not null',
            'option_id' => 'int(11) not null primary key',
            'name' => 'varchar(80) not null',
        ), 'engine InnoDB');

        $this->createTable('user_preferences', array(
            'user_id' => 'int(11) not null',
            'preference_id' => 'int(11) not null',
            'option_id' => 'int(11) not null',
        ), 'engine InnoDB');

        $this->addForeignKey('fk_user_preferences_users_user_id',                'user_preferences',   'user_id',       'users',              'id',        'cascade', 'cascade');
        $this->addForeignKey('fk_user_preferences_preferences_preference_id',    'user_preferences',   'preference_id', 'preferences',        'id',        'cascade', 'cascade');
        $this->addForeignKey('fk_user_preferences_preference_options_option_id', 'user_preferences',   'option_id',     'preference_options', 'option_id', 'cascade', 'cascade');
        $this->addForeignKey('fk_preference_options_preferences_preference_id',  'preference_options', 'preference_id', 'preferences',        'id',        'cascade', 'cascade');
        $this->addForeignKey('fk_preferences_preference_options_default',        'preferences',        'default',       'preference_options', 'option_id', 'cascade', 'cascade');
    }

    public function down()
    {
        $this->dropTable('preferences');
        $this->dropTable('preference_optionss');
        $this->dropTable('user_preferences');
    }
}