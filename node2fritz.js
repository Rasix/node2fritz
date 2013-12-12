/**
 * Node2Fritz
 * Created by steffen.timm on 05.12.13.
 * For Fritz!OS > 05.50
 */
var http = require('http');

module.exports.getSessionID = function(username, password, callback, options)
{
    if (typeof username != 'string') throw new Error('Invalid username');
    if (typeof password != 'string') throw new Error('Invalid password');

    options || (options = {});
    options.url || (options.url = 'fritz.box');

    var sessionID = "";
    try {

        http.request({host:options.url, path:'/login_sid.lua'}, function(response) {
            var str = '';
            response.on('data', function (chunk) {
                str += chunk;
            });

            response.on('end', function () {

                var challenge = str.match("<Challenge>(.*?)</Challenge>")[1];
                http.request({host:options.url, path:"/login_sid.lua?username=" + username + "&response="+challenge+"-" + require('crypto').createHash('md5').update(Buffer(challenge+'-'+password, 'UTF-16LE')).digest('hex')},function(response){
                    var str = '';
                    response.on('data', function (chunk) {
                        str += chunk;
                    });
                    response.on('end', function () {
                        sessionID = str.match("<SID>(.*?)</SID>")[1];
                        callback(sessionID);
                    })
                }).end();
            });
        }).end();
    } catch (e) {
        throw new Error('Error getting sid from FritzBox. Please check login and url');
    }
}

module.exports.getPhoneList = function(sid, callback, options)
{

    options || (options = {});
    options.url || (options.url = 'fritz.box');
    try {
        http.request({host:options.url, path:'/fon_num/foncalls_list.lua?sid='+sid+'&csv='},function(response){
            var csv = '';

            response.on('data', function (chunk) {
                csv += chunk;
            });
            response.on('end', function () {
                var correctedCsv = csv.replace(/.*/, "").substr(1);
                correctedCsv = correctedCsv.replace(/.*/, "").substr(1);
                correctedCsv = "direction,date,time,remotename,remotenumber,localdevice,localnumber,duration\n" + correctedCsv;
                correctedCsv  = correctedCsv.replace(/(\n.{10}) /g,"$1;");
                correctedCsv  = correctedCsv.replace(/\n1;/g,"\ninbound;");
                correctedCsv  = correctedCsv.replace(/\n2;/g,"\nmissed;");
                correctedCsv  = correctedCsv.replace(/\n3;/g,"\ndeclined;");
                correctedCsv  = correctedCsv.replace(/\n4;/g,"\noutbound;");
                correctedCsv  = correctedCsv.replace(/Internet: /g,"");
                correctedCsv  = correctedCsv.replace(/;/g,",");

                var csvConverter=new (require("csvtojson").core.Converter)();

                csvConverter.on("end_parsed",function(jsonObj){
                    var jsonString = JSON.stringify(jsonObj).replace("\"csvRows\":","");
                    callback(eval(jsonString));
                });

                csvConverter.from(correctedCsv);
            });
        }).end();
    } catch (e) {
        throw new Error('Error getting phone list from FritzBox. Please check session');
    }
}