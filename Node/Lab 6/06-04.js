//npm whoami - информация о юзере в npmjs
//npm init - инициализация хранилища пакета. Создается package.json
//npm publish - публикуем наш модуль
//npm install karsend - установка в локальный репозиторий
//npm uninstall karsend - удаление из локального репозитория
//npm link karsend - ссылочная связь с глобальным пакетом

var letter = "Letter";
var send = require("karsend");

send(letter);