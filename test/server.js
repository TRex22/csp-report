'use strict';

var request = require('request');
var sequelize = require('../lib/sequelize');
require('../server');

var fixture = {
    'csp-report': {
        'document-uri': 'http://example.org/page.html',
        'referrer': 'http://evil.example.com/',
        'blocked-uri': 'http://evil.example.com/evil.js',
        'violated-directive': 'script-src \'self\' https://apis.google.com',
        'original-policy': 'script-src \'self\' https://apis.google.com; report-uri http://example.org/my_amazing_csp_report_parser'
    }
};


describe('server', function () {
    it('store report', function (done) {
        request({
            url: 'http://localhost:8000',
            method: 'post',
            json: fixture
        }, function (error) {
            if (error) {
                done(error);
                return;
            }

            sequelize.Report.all().success(function (reports) {
                reports.should.have.length(1);

                var values = reports[0].values;
                delete values.id;
                delete values.createdAt;
                delete values.updatedAt;
                values.should.eql(fixture['csp-report']);

                done();
            }).error(function (error) {
                done(error);
            });
        });
    });
});
