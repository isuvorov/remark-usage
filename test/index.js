/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module remark:usage:test
 * @fileoverview Test suite for remark-usage.
 */

'use strict';

/* eslint-env node */

/*
 * Dependencies.
 */

var fs = require('fs');
var path = require('path');
var test = require('tape');
var remark = require('remark');
var usage = require('..');

/*
 * Methods.
 */

var read = fs.readFileSync;
var exists = fs.existsSync;

/*
 * Tests.
 */

test('remark-usage()', function (t) {
    t.equal(typeof usage, 'function', 'should be a function');

    t.doesNotThrow(function () {
        usage(remark);
    }, 'should not throw if not passed options');

    t.end();
});

/*
 * Constants..
 */

var ROOT = path.join(__dirname, 'fixtures');

/*
 * Gather fixtures.
 */

var fixtures = fs.readdirSync(ROOT);

fixtures = fixtures.filter(function (filepath) {
    return filepath.indexOf('.') !== 0;
});

test('Fixtures', function (t) {
    fixtures.forEach(function (fixture) {
        var filepath = ROOT + '/' + fixture;
        var config = filepath + '/config.json';
        var output = filepath + '/output.md';
        var input;
        var result;
        var fail;

        config = exists(config) ? require(config) : {};
        output = exists(output) ? read(output, 'utf-8') : '';

        input = read(filepath + '/readme.md', 'utf-8');

        config.cwd = filepath;

        fail = fixture.indexOf('fail-') === 0 ? fixture.slice(5) : '';

        try {
            result = remark.use(usage, config).process(input);

            t.equal(result, output, 'should work on `' + fixture + '`');
        } catch (exception) {
            if (!fail) {
                throw exception;
            }

            fail = new RegExp(fail.replace(/-/, ' '), 'i');

            t.equal(
                fail.test(exception),
                true,
                'should fail on `' + fixture + '`'
            );
        }
    });

    t.end();
});
