<?php

/**
 * @db user_id int(11)     the ID of the user to whom this shortcut belongs
 * @db action  varchar(32) the action to be performed when the key is pressed
 * @db key     char(1)     the key which activates the action when pressed
 * @fk user     User
 * @fk shortcut KeyboardShortcut
 */
class UserKeyboardShortcut extends CActiveRecord
{
    public static function model($className = __CLASS__)
    {
        return parent::model($className);
    }

    public function tableName()
    {
        return 'user_keyboard_shortcuts';
    }

    public function primaryKey()
    {
        return array('user_id', 'key');
    }

    public function relations()
    {
        return array(
            'user' => array(
                self::BELONGS_TO,
                'User',
                array('user_id' => 'id'),
            ),
            'shortcut' => array(
                self::BELONGS_TO,
                'KeyboardShortcut',
                array('action' => 'action')
            ),
        );
    }
}