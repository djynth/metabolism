<?php 

class UserIdentity extends CUserIdentity
{
    public function authenticate()
    {
        $record = User::model()->findByAttributes(array('username' => $this->username));
        if ($record === null) {
            $this->errorCode = self::ERROR_USERNAME_INVALID;
        } elseif (!$record->authenticate($this->password)) {
            $this->errorCode = self::ERROR_PASSWORD_INVALID;
        } else {
            $this->errorCode = self::ERROR_NONE;
        }
        return !$this->errorCode;
    }
}