import test from 'ava';
import express from 'express';
import Form from '../src/form';

test.before(t => {
    let app = express();

    app.post('/foobar', (req, res) => {
        res.status(200).json({foo: 'bar'});
    });

    app.listen(3000);
});

test('Resolve promise passing response.data from axios', async t => {
    let form = new Form();
    let data = await form.submit('POST', 'http://localhost:3000/foobar', {});

    t.deepEqual({foo: 'bar'}, data);
});

test('Create a new instance', t => {
    let form = new Form();

    t.is(0, form.progress);
    t.is(false, form.isPending);
    t.is('object', typeof form.errors);
});

test('Check data does not contains instances of File', t => {
    let form = new Form();
    let data = {
        field: 'value'
    };

    t.is(false, form.hasFiles(data));
});

test('Check data contains instances of File', t => {
    let form = new Form();
    let data = {
        file: new File([], null)
    };

    t.is(true, form.hasFiles(data));
});

test('Generates form data as a plain object when it does not contains instances of File', t => {
    let form = new Form();
    let data = {
        field: 'value'
    };

    t.is(data, form.formData(data));
});

test('Generates form data as an instance of FormData when it contains instances of File', t => {
    let form = new Form();
    let data = {
        phone: null,
        email: undefined,
        name: 'Test User',
        file: new File([], null),
    };

    let formData = form.formData(data);

    t.is('', formData.get('email'));
    t.is('', formData.get('phone'));
    t.is('Test User', formData.get('name'));
    t.is('FormData', formData.constructor.name);
});

test('Sanitize empty values', t => {
    let form = new Form();

    t.is('', form.sanitize(null));
    t.is('', form.sanitize(undefined));
    t.is('foo', form.sanitize('foo'));
});

test('Do not handle error response without a 422 status code', t => {
    let form = new Form();
    let response = {
        response: {status: 500}
    }

    form.handleError(response);

    t.deepEqual({}, form.errors.errors);
});

test('Handle error response with a 422 status code', t => {
    let form = new Form();
    let response = {
        response: {
            status: 422,
            data: {field: ['error message']}
        }
    };

    form.handleError(response);

    t.is(response.response.data, form.errors.errors);
});

test('Set errors from Laravel <= 5.4', t => {
    let form = new Form();
    let response = {
        response: {
            status: 422,
            data: {field: ['error message']}
        }
    };

    form.handleError(response);

    t.is(response.response.data, form.errors.errors);
});

test('Set errors from Laravel >= 5.5', t => {
    let form = new Form();
    let response = {
        response: {
            status: 422,
            data: {
                errors: {field: ['error message']}
            }
        }
    };

    form.handleError(response);

    t.is(response.response.data.errors, form.errors.errors);
});