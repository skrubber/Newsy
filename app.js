var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');
var LinkModule = require('docxtemplater-link-module');
var linkModule = new LinkModule();
var ImageModule = require('docxtemplater-image-module')
var opts = {}
opts.centered = false;
opts.getImage = function (tagValue, tagName) {
    return fs.readFileSync(tagValue);
}
opts.getSize = function (img, tagValue, tagName) {
    return [300, 150];
}

var imageModule = new ImageModule(opts);
app.use(function (req, res, next) {
    //Enabling CORS 
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept");
    next();
});
//   app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json());
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/jsfiles'));
app.use(express.static(__dirname + '/csvfiles'));
app.use(express.static(__dirname + '/css'));
app.use(express.static(__dirname + '/images'));
app.use(express.static(__dirname + '/documents'));
app.get('/doc/:id', (req, res) => {

    try {
        var csvjson = require('csvjson');
        var options = {
            delimiter: ',', // optional
            quote: '"' // optional
        };
        var file_data = fs.readFileSync(path.resolve(__dirname, 'csvfiles/rivals.csv'), { encoding: 'utf8' });
        var result = csvjson.toObject(file_data, options);
        var companydata = result.filter((data) => data.rival === req.params.id.toLowerCase());
        var acquisitions_data = (companydata.filter((data) => data.ranked === '5'));
        var investment_data = (companydata.filter((data) => data.ranked === '4'));
        var partnership_data = (companydata.filter((data) => data.ranked === '3'));
        var lookforward_data = (companydata.filter((data) => data.ranked === '2'));
        var emptydata = {
            'industry': '-',
            'Company': '-',
            'link': '-',
            'title': '-'
        }
    //     var example = [{'link':''}];
    //     for(var i=0; i < acquisitions_data.length; i++){
    // example.push({'link':acquisitions_data[i].link})         }
    // console.log(example)
    //     var final = [];
    //     for (var i = 0; i < acquisitions_data.length; i++) {
    //          final[i] = (acquisitions_data[i].title).slice(0, 30);
    //          acquisitions_data[i].newlink = final[i];
    //     }
    //     var final1 = [];
    //     for (var i = 0; i < investment_data.length; i++) {
    //          final1[i] = (investment_data[i].title).slice(0, 30);
    //          investment_data[i].newlink = final1[i];
    //     }
    //     var final2 = [];
    //     for (var i = 0; i < partnership_data.length; i++) {
    //          final2[i] = (partnership_data[i].title).slice(0, 30);
    //          partnership_data[i].newlink = final2[i];
    //     }
    //     var final3 = [];
    //     for (var i = 0; i < lookforward_data.length; i++) {
    //          final3[i] = (lookforward_data[i].title).slice(0, 30);
    //          lookforward_data[i].newlink = final3[i];
    //     }
        
        function sortOn(property){
            return function(a, b){
                if(a[property] < b[property]){
                    return -1;
                }else if(a[property] > b[property]){
                    return 1;
                }else{
                    return 0;   
                }
            }
        }
        function mergeEquallyLabeledTypes(collector, type) {
            var key = (type.industry); // identity key.
            var store = collector.store;
            var storedType = store[key];
            if (storedType) {
              storedType.Company = storedType.Company.concat("\n ",type.Company);
              storedType.link = storedType.link.concat(", \n ",type.link);
              storedType.title = storedType.title.concat(", \n ",type.title);
            } else {
              store[key] = type;
              collector.list.push(type);
            }
            return collector;
          }
        acquisitions_data.sort(sortOn("industry")); // because `this.name = data.DepartmentName;`
        if (acquisitions_data.length == 0) { data = emptydata } else { data = acquisitions_data.sort(sortOn("industry")); var datafor1 = data.reduce(mergeEquallyLabeledTypes, {  store:  {}, list:   [] }).list;}      
        if (investment_data.length == 0) { data1 = emptydata } else { data1 = investment_data.sort(sortOn("industry")); var datafor2 = data1.reduce(mergeEquallyLabeledTypes, {  store:  {}, list:   [] }).list;}
        if (partnership_data.length == 0) { data2 = emptydata } else { data2 = partnership_data.sort(sortOn("industry"));var datafor3 = data2.reduce(mergeEquallyLabeledTypes, {  store:  {}, list:   [] }).list;}
        if (lookforward_data.length == 0) { data3 = emptydata } else { data3 = lookforward_data.sort(sortOn("industry"));   var datafor4 = data3.reduce(mergeEquallyLabeledTypes, {  store:  {}, list:   [] }).list;}
        var DocxGen = require('docxtemplater');
        var content = fs.readFileSync(__dirname + "/documents/input.docx", "binary");
        var docx = new DocxGen()
            .attachModule(linkModule)
            .load(content)
            .setData({
                date: companydata[0].Dated,
                heading: 'Competitor Deal Engagement Overview',
                industry_name: req.params.id,
                over_view_heading: 'Investment Themes Overview',
                no_of_acquisitions: acquisitions_data.length,
                no_of_investments: investment_data.length,
                no_of_partnerships: partnership_data.length,
                no_of_look_forwards: lookforward_data.length,
                acquisition_table: datafor1,
                investment_table: datafor2,
                partnership_table: datafor3,
                lookforward_table: datafor4,
                 
            }).
            render();
        var buffer = docx
            .getZip()
            .generate({ type: "nodebuffer" });
        fs.writeFile(path.resolve(__dirname, 'documents/' + `${req.params.id}` + '.docx'), buffer);
    }
    catch (error) {
        var e = {
            message: error.message,
            name: error.name,
            stack: error.stack,
            properties: error.properties,
        }
        console.log(JSON.stringify({ error: e }));
        // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
        throw error;
    }
    res.send({ 'CompanyID': req.params.id });
});
app.listen(8082, () => {
    console.log("port is listening");
})
