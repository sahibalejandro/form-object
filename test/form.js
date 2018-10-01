import test from 'ava';
import axios from 'axios';
import Form from '../src/form';
import './helpers/express';

test('Set custom axios instance', async t => {
    Form.defaults.axios = axios.create({
        baseURL: 'http://localhost:3000/custom/',
    });

    const form = new Form();
    const data = await form.post('axios', {});

    t.is(true, data.customAxios);

    // Make sure to not break subsequent test cases.
    Form.defaults.axios = axios;
});

test('Create a new instance', t => {
    let form = new Form();

    t.is(0, form.progress);
    t.is(false, form.isPending);
    t.is('object', typeof form.errors);
    t.is('function', typeof form.post);
    t.is('function', typeof form.patch);
    t.is('function', typeof form.put);
    t.is('function', typeof form.delete);
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

test('Make URL to patch a resource', t => {
    let form = new Form();

    t.is('foo/bar/123', form.urlToPatchResource('foo/bar', {id: 123}));
    t.is('foo/bar/123', form.urlToPatchResource('foo/bar/', {id: 123}));
    t.is('foo/bar/123', form.urlToPatchResource('foo/bar//', {id: 123}));
});

test('Resolve promise passing response.data from axios', async t => {
    let form = new Form();
    let data = await form.submit('POST', 'http://localhost:3000/post');

    t.deepEqual({method: 'post'}, data);
});

test('Make a POST request using shortcut', async t => {
    let form = new Form();
    let data = await form.post('http://localhost:3000/post');

    t.deepEqual({method: 'post'}, data);
});

test('Make a PATCH request using shortcut', async t => {
    let form = new Form();
    let data = await form.patch('http://localhost:3000/patch');

    t.deepEqual({method: 'patch'}, data);
});

test('Make a PUT request using shortcut', async t => {
    let form = new Form();
    let data = await form.put('http://localhost:3000/put');

    t.deepEqual({method: 'put'}, data);
});

test('Make a DELETE request using shortcut', async t => {
    let form = new Form();
    let data = await form.delete('http://localhost:3000/delete');

    t.deepEqual({method: 'delete'}, data);
});

test('Make a POST request using save shortcut', async t => {
    let form = new Form();
    let data = await form.save('http://localhost:3000/users', {name: 'John Doe'});

    t.deepEqual({name: 'John Doe'}, data);
});

test('Make a PATCH request using save shortcut', async t => {
    let form = new Form();
    let data = await form.save('http://localhost:3000/users', {id: '123', name: 'John Doe'});

    t.deepEqual({id: '123', name: 'John Doe'}, data);
});

test('Set errors from a failed request', async t => {
    const form = new Form();

    try {
        await form.post('http://localhost:3000/error');
    } catch (error) {
        t.truthy(form.errors.has('field'));
        t.is('Error message', form.errors.get('field'));
    }
});

test('Set errors from a failed request to Laravel >= 5.5', async t => {
    const form = new Form();

    try {
        await form.post('http://localhost:3000/error-l55');
    } catch (error) {
        t.truthy(form.errors.has('field'));
        t.is('Error message', form.errors.get('field'));
    }
});
