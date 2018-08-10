var express = require('express');
var path = require('path');
var JSZip = require('jszip');
var fs = require('fs');
var app = express();
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
        var JSZip = require('jszip');
        var Docxtemplater = require('docxtemplater');
        var content = fs.readFileSync(path.resolve(__dirname, 'documents/input.docx'), 'binary');
        var zip = new JSZip(content);
        var doc = new Docxtemplater();
        doc.attachModule(imageModule)
        doc.loadZip(zip);
        var emptydata = {
            'industry': '-',
            'Company': '-',
            'title': '-'
        }
        if (companydata[0].rival == 'wework') { logo = 'images/WeWork-Logo_copy.jpg' }
        else if (companydata[0].rival == 'cushman & wakefield') { logo: 'images/c&w.png' }
        else if (companydata[0].rival == 'commercial real estate') { logo = 'images/CRE_logo_horizontal_RGB.png' }
        else if (companydata[0].rival == 'jll') { logo = 'images/jll.jpg' }
        else if (companydata[0].rival == 'savills') { logo = 'images/Savills_logo.svg+copy.jpg' }
        else if (companydata[0].rival == 'eastdil secured') { logo = 'images/bgcsf_corp_partner_eastdil.jpg' }
        else if (companydata[0].rival == 'marcus & millichap') { logo = 'images/Marcus-Millichap-Logo-promo.jpg' }
        else if (companydata[0].rival == 'hff') { logo = 'images/HFF-logo.jpg' }
        else if (companydata[0].rival == 'newmark group') { logo = 'images/newmark-group-inc-logo.png' }
        else if (companydata[0].rival == 'colliers') { logo = 'images/colliers.jpeg' }
        if (acquisitions_data.length == 0) { data = emptydata } else { data = acquisitions_data }
        if (investment_data.length == 0) { data1 = emptydata } else { data1 = investment_data }
        if (partnership_data.length == 0) { data2 = emptydata } else { data2 = partnership_data }
        if (lookforward_data.length == 0) { data3 = emptydata } else { data3 = lookforward_data }
        //set the templateVariables
        doc.setData({
            image: logo,
            date: companydata[0].Dated,
            heading: 'Competitor Deal Engagement Overview',
            industry_name: req.params.id,
            over_view_heading: 'Investment Themes Overview',
            no_of_acquisitions: acquisitions_data.length,
            no_of_investments: investment_data.length,
            no_of_partnerships: partnership_data.length,
            no_of_look_forwards: lookforward_data.length,
            acquisition_table: data,
            investment_table: data1,
            partnership_table: data2,
            lookforward_table: data3
        });


        doc.render();
        var buf = doc.getZip().generate({ type: 'nodebuffer' });
        fs.writeFileSync(path.resolve(__dirname, 'documents/' + `${req.params.id}` + '.docx'), buf);
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
})

app.listen(4000, () => {
    console.log("port is listening");
})
