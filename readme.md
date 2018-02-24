# Form Object

[![Build Status](https://travis-ci.org/sahibalejandro/form-object.svg?branch=master)](https://travis-ci.org/sahibalejandro/form-object)
[![Downloads](https://img.shields.io/npm/dt/form-object.svg)](https://www.npmjs.com/package/form-object)

### Important:
__This project still active, feel free to clone, open issues or ask for help__

Form Object is a simple layer on top of axios, it understands the Laravel validation error
responses and handles it for you, now you can focus on the feedback you want to give to
the users.

## Installation

NOTE: version *>=1.4.3+* requires Vue *>=1.0*

```bash
# Using the legendary NPM
npm install form-object --save

# Or using Yarn
yarn add form-object
```

## Usage

```vue
<template>
    <form @submit.prevent="submit">

        <!-- Display a global message if there is any errors -->
        <div class="alert alert-danger" v-if="form.errors.any()" v-cloak>
            Please check the form and try again!
        </div>

        <!-- Apply custom classes when a field has an error -->
        <div :class="{ 'has-error': form.errors.has('name') }">

            <!-- No need to attach your component data to the form object -->
            <input type="text" v-model="user.name">

            <!-- Display the error message for a specific field -->
            <div class="error" v-show="form.errors.has('name')" v-text="form.errors.get('name')"></div>

            <!-- Or display all error messages for specific field -->
            <div v-for="(error, key) in form.errors.getAll('name')" :key="key" v-text="error"></div>
            
            <!-- Pass an instance of File to your model to support file uploads -->
            <input type="file" @change="user.photo = $event.target.files[0]" accept="image/jpeg">

            <!-- Disable buttons using form.isPending -->
            <button type="submit" :disabled="form.isPending">Submit</button>

            <!-- Get upload progress percentage using form.progress -->
            <div class="progress-bar">
                <div :style="{width: form.progress + '%'}"></div>
            </div>
        </div>
    </form>
</template>

<script>
import Form from 'form-object';

export default {
    data() {
        return: {
            user: {name: 'Sahib', photo: null},
            form: new Form()
        }
    },

    methods: {
        submit() {
            this.form.submit('post', '/users', this.user).then(data => {
                // This is the data returned from your server.
                console.log(data);
            }).catch(error => {
                // Handle request errors.
            });
        }
    }
}
</script>
```

### Clear messages
You can get rid of all error messages calling the `clear` method that belongs to the `Errors` object, like this:

```javascript
this.form.errors.clear();
```

Take note that all messages are removed automatically before sending the request, and in case you need to clear
an specific error message just pass the field's name to the `clear` method, like this:

```javascript
this.form.errors.clear('email');
```

In this way only that one will be removed from the error messages list.

### Shortcut methods

Write `this.form.submit('POST', ...)` can be too verbose for you, if it is the case you can use the
shortcut methods:

#### form.post(url, data)
Send `data` via POST request to the given `url`, same as `form.submit('POST', url, data)`.

#### form.patch(url, data)
Send `data` via PATCH request to the given `url`, same as `form.submit('PATCH', url, data)`.

#### form.put(url, data)
Send `data` via PUT request to the given `url`, same as `form.submit('PUT', url, data)`.

#### form.delete(url, data)
Send `data` via DELETE request to the given `url`, same as `form.submit('DELETE', url, data)`.

#### form.save(url, <resource>)
This method will send `resource` via POST or PATCH request to the given `url`, depending on whether
the resource has a property called `id`, for example:

```javascript
const resource = {name: 'John Doe'};

// This call...
form.save('/users', resource);

// Is the same as this call.
form.submit('POST', '/users', resource);
```

And if the `resource` has an `id` property:

```javascript
const resource = {id: 123, name: 'John Doe'};

// Now that resource has an "id" property, this call...
form.save('/users', resource);

// Is the same as this call.
form.submit('PATCH', '/users/123', resource);
```

As you can see, the `save` method will append the `id` to the original `url` automatically.

## Promises
Please read the Axios documentation at https://github.com/mzabriskie/axios#promises
