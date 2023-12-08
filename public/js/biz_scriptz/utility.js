function w(title,str){
    if(!title){
        title='';
    }
    console.log(title+'------------------_start');
    console.log(str);
    console.log(title+'------------------_end');
}
function flush(){
    Lockr.flush();
}
var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
    return false;
};
function validate_email(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
function get_money(n) {
    n = parseFloat(n);
    if(!n || isNaN(n)){
        n = 0;
    }
    return "$" + n.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
}
function get_id(){
    return Math.floor((Math.random() * 100000) + 1);
}
function getRandomString(text){
    return text + Math.floor((Math.random() * 100000) + 1);
}
function getRandomAmount(){
    return ((Math.random() * 1000) + 1).toFixed(2);
}
function getDate(){
    return (new Date()).toISOString().substring(0, 10) ;
}
function generateValidCard(bin, length) {
    var cardNumber = generate(bin, length),
        luhnValid  = luhnChk(cardNumber),
        limit      = 20,
        counter   = 0;

    while (!luhnValid) {
        cardNumber = generate(bin, length);
        luhnValid  = luhnChk(cardNumber);
        counter++;

        if (counter === limit) {
            cardNumber = (luhnValid) ? cardNumber : 'cannot make valid card with given params'
            break;
        }
    }

    return cardNumber;
}
/**
 *  * Luhn algorithm in JavaScript: validate credit card number supplied as string of numbers
 *   * @author ShirtlessKirk. Copyright (c) 2012.
 *    * @license WTFPL (http://www.wtfpl.net/txt/copying)
 *     */
var luhnChk = (function (arr) {
    return function (ccNum) {
        var
        len = ccNum.length,
            bit = 1,
            sum = 0,
            val;

        while (len) {
            val = parseInt(ccNum.charAt(--len), 10);
            sum += (bit ^= 1) ? arr[val] : val;
        }

        return sum && sum % 10 === 0;
    };
}([0, 2, 4, 6, 8, 1, 3, 5, 7, 9]));
function capatilzeFirstLetter(str){
    const arr = str.split(" ");
    for (var i = 0; i < arr.length; i++) {
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    }
    return arr.join(" ");
}
