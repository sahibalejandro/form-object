import test from 'ava';
import express from 'express';
import bodyParser from 'body-parser';

test.before(t => {
    let app = express();
    app.use(bodyParser.json());

    app.post('/post', (req, res) => {
        res.json({method: 'post'});
    });

    app.patch('/patch', (req, res) => {
        res.json({method: 'patch'});
    });

    app.put('/put', (req, res) => {
        res.json({method: 'put'});
    });

    app.delete('/delete', (req, res) => {
        res.json({method: 'delete'});
    });

    app.post('/users', (req, res) => {
        res.json(req.body);
    });

    app.patch('/users/:id', (req, res) => {
        res.json({id: req.params.id, name: req.body.name});
    });

    app.post('/error', (req, res) => {
        res.status(422).json({
            field: ['Error message']
        });
    });

    app.post('/error-l55', (req, res) => {
        res.status(422).json({
            errors: {
                field: ['Error message']
            }
        });
    });

    app.listen(3000);
});
