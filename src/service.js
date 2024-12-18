var Service = require('node-windows').Service;


var svc = new Service({
  name:'APILogiDados',
  description: 'API para acesso serviços sistemas LogiDados',
  script: 'D:\\SISTEMAS\\Logidados\\WebService\\build\\server.js'
});


svc.on('install',function(){
  svc.start();
});

svc.install();